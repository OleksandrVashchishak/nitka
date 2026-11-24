import type { Guest, RsvpStatus } from "@/lib/guests-api";
import {
  isChildGuest,
  orderByParty,
  parseChildNeed,
  parseCompanions,
  type ChildNeed,
} from "@/lib/guest-party";

/**
 * Єдине джерело списку гостей для розсадки (wizard, модалка груп, план).
 * Не дублювати цю логіку в компонентах — саме через копії діти й ланцюжки
 * роз'їжджалися між екранами.
 */
export type SeatingFlatGuest = {
  key: string;
  guestId: string;
  name: string;
  /** Не голова ланцюжка (супутник або член родини). */
  isPlusOne: boolean;
  /** Ключ голови ланцюжка; null — сам голова або без ланцюжка. */
  linkedTo: string | null;
  isChild: boolean;
  /** Де сидить дитина (лише для дітей). */
  childNeed: ChildNeed | null;
  /** Автоматично за дитячий стіл (якщо він увімкнений). */
  toKidsTable: boolean;
  side: Guest["side"];
  rsvpStatus: RsvpStatus;
};

export type ClusterFlags = {
  linked: boolean;
  start: boolean;
  mid: boolean;
  end: boolean;
};

/**
 * Смуга зліва для пов'язаних гостей у списку: з'єднує лише сусідні рядки
 * одного кластера. `rootOf` повертає ключ кластера (або null — рядок поза кластером).
 */
export function clusterFlags<T>(
  rows: T[],
  index: number,
  rootOf: (row: T) => string | null,
): ClusterFlags {
  const root = rootOf(rows[index]);
  const prev = index > 0 ? rows[index - 1] : undefined;
  const next = rows[index + 1];
  const withPrev = Boolean(root && prev && rootOf(prev) === root);
  const withNext = Boolean(root && next && rootOf(next) === root);
  const linked = withPrev || withNext;
  return {
    linked,
    start: linked && !withPrev,
    mid: withPrev,
    end: linked && !withNext,
  };
}

/** Дитина йде за дитячий стіл, крім тих, хто сидить з батьками (дитяче крісло або «з батьками»). */
export function childGoesToKidsTable(isChild: boolean, need: ChildNeed | null) {
  return isChild && need !== "high_chair" && need !== "with_parents";
}

/**
 * Дитина в дитячому кріслі не займає місця за столом — крісельце ставлять
 * біля дорослого. Повертає `ключ дитини → ключ дорослого`: спершу той, у чиїй
 * картці дитина (супутник), інакше голова ланцюжка. Без дорослого — дитина
 * сідає як звичайний гість.
 */
export function highChairHosts<
  T extends {
    key: string;
    guestId: string;
    isChild: boolean;
    childNeed: ChildNeed | null;
  },
>(
  rows: T[],
  rootOf: (row: T) => string | null,
  detachedKeys: Set<string> = new Set(),
): Map<string, string> {
  const byKey = new Map(rows.map((r) => [r.key, r]));
  const out = new Map<string, string>();
  for (const kid of rows) {
    if (!kid.isChild || kid.childNeed !== "high_chair") continue;
    if (detachedKeys.has(kid.key)) continue;
    const isAdult = (k: string | null) => {
      const r = k ? byKey.get(k) : undefined;
      return r && r.key !== kid.key && !r.isChild ? r : undefined;
    };
    const root = rootOf(kid);
    const host =
      isAdult(kid.guestId) ??
      (root && !detachedKeys.has(root) ? isAdult(root) : undefined);
    if (host) out.set(kid.key, host.key);
  }
  return out;
}

export function companionKey(guestId: string, index: number) {
  return index === 0 ? `${guestId}:plus` : `${guestId}:plus:${index}`;
}

/**
 * Родина (`party:` / прізвище) + «+1» кожного гостя = один ланцюжок.
 * Голова ланцюжка — перший дорослий; дитина головою не буває.
 * Якщо дорослих немає — ланцюжка немає, кожен рядок окремо.
 */
export function flattenSeatingGuests(guests: Guest[]): SeatingFlatGuest[] {
  const { ordered, leaderOf } = orderByParty(guests);

  const clusters = new Map<string, SeatingFlatGuest[]>();
  const clusterOrder: string[] = [];
  const push = (clusterId: string, row: SeatingFlatGuest) => {
    if (!clusters.has(clusterId)) {
      clusters.set(clusterId, []);
      clusterOrder.push(clusterId);
    }
    clusters.get(clusterId)!.push(row);
  };

  for (const g of ordered) {
    const clusterId = leaderOf.get(g.id) ?? g.id;
    if (g.rsvpStatus !== "NO") {
      const isChild = isChildGuest(g.notes);
      const childNeed = isChild ? parseChildNeed(g.notes) : null;
      push(clusterId, {
        key: g.id,
        guestId: g.id,
        name: g.name,
        isPlusOne: false,
        linkedTo: null,
        isChild,
        childNeed,
        toKidsTable: childGoesToKidsTable(isChild, childNeed),
        side: g.side,
        rsvpStatus: g.rsvpStatus,
      });
    }
    parseCompanions(g.notes, g).forEach((c, index) => {
      if (!c.name.trim() || c.rsvpStatus === "NO") return;
      push(clusterId, {
        key: companionKey(g.id, index),
        guestId: g.id,
        name: c.name.trim(),
        isPlusOne: false,
        linkedTo: null,
        isChild: c.isChild,
        childNeed: c.isChild ? c.childNeed : null,
        toKidsTable: childGoesToKidsTable(c.isChild, c.childNeed),
        side: g.side,
        rsvpStatus: c.rsvpStatus,
      });
    });
  }

  const rows: SeatingFlatGuest[] = [];
  for (const id of clusterOrder) {
    const members = clusters.get(id)!;
    const root = members.find((m) => !m.isChild);
    if (!root || members.length === 1) {
      rows.push(...members);
      continue;
    }
    rows.push(root);
    for (const m of members) {
      if (m === root) continue;
      rows.push({ ...m, isPlusOne: true, linkedTo: root.key });
    }
  }
  return rows;
}

/**
 * Дефолти дитячого столу для збереженої розсадки:
 * дитина без групи → «kids» (якщо стіл є); стола немає → «kids» знімається.
 * Ручний вибір групи/президіуму не чіпаємо.
 */
export function syncKidsAssignments<T extends string | null>(
  assignments: Record<string, T>,
  rows: SeatingFlatGuest[],
  hasKidsTable: boolean,
): Record<string, T | "kids" | null> {
  const next: Record<string, T | "kids" | null> = { ...assignments };
  for (const row of rows) {
    const current = next[row.key] ?? null;
    if (!hasKidsTable) {
      if (current === "kids") next[row.key] = null;
    } else if (row.toKidsTable && current === null) {
      next[row.key] = "kids";
    }
  }
  return next;
}

/**
 * Для відображення: відʼєднаний гість іде в кінець свого блоку, щоб смуга
 * решти ланцюжка (напр. діти з мамою) не розривалась посередині.
 */
export function orderDetachedLast<T extends { key: string }>(
  rows: T[],
  detachedKeys: Set<string>,
  /** Ключ ланцюжка рядка (без урахування відʼєднання). */
  rootOf: (row: T) => string = (row) =>
    (row as unknown as SeatingFlatGuest).linkedTo ?? row.key,
): T[] {
  if (detachedKeys.size === 0) return rows;
  const out: T[] = [];
  let i = 0;
  while (i < rows.length) {
    const root = rootOf(rows[i]);
    let j = i + 1;
    while (j < rows.length && rootOf(rows[j]) === root) j++;
    const block = rows.slice(i, j);
    out.push(
      ...block.filter((r) => !detachedKeys.has(r.key)),
      ...block.filter((r) => detachedKeys.has(r.key)),
    );
    i = j;
  }
  return out;
}

/**
 * Призначення гостя + підтягування його ланцюжка.
 * «kids» — лише для самої дитини; діти за дитячим столом за родиною не йдуть.
 */
export function applyLinkedAssign<T extends string | null>(
  prev: Record<string, T>,
  rows: SeatingFlatGuest[],
  detachedKeys: Set<string>,
  key: string,
  value: T,
): Record<string, T> {
  const next = { ...prev, [key]: value };
  const row = rows.find((g) => g.key === key);
  if (!row || value === "kids" || detachedKeys.has(row.key)) return next;
  const root = row.linkedTo ?? row.key;
  for (const mate of rows) {
    if (mate.key === key) continue;
    if (mate.key !== root && mate.linkedTo !== root) continue;
    if (detachedKeys.has(mate.key)) continue;
    if (mate.toKidsTable || prev[mate.key] === "kids") continue;
    next[mate.key] = value;
  }
  return next;
}

/** Єдина палітра груп гостей: бейджі у візарді/модалці та легенда плану. */
export const SEATING_GROUP_COLORS = ["#8B7CC8", "#5B8DEF", "#4CAF7A", "#C47A3A", "#E07A9A"];
