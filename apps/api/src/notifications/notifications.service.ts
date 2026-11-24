import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { resolveWeddingForUser } from '../weddings/wedding-access';
import {
  DEFAULT_SETTINGS,
  isTypeEnabled,
  NOTIFICATION_TYPES,
  plainText,
  renderNotification,
  type Gender,
  type NotificationPayload,
  type NotificationSettings,
  type NotificationType,
  type RenderedNotification,
} from './notification-catalog';
import {
  canMergeInto,
  HISTORY_DAYS,
  mergeEntityIds,
  smartPlanningDateTipAllowed,
} from './notification-logic';

type ExpoPushMessage = {
  to: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  sound?: 'default';
};

type NotificationRow = {
  id: string;
  wedding_id: string;
  recipient_id: string;
  type: string;
  dedup_key: string;
  count: number;
  payload: NotificationPayload | null;
  created_at: Date;
  updated_at: Date;
  read_at: Date | null;
  resolved_at: Date | null;
  reminder_no: number | null;
};

export type NotificationFeedItem = RenderedNotification & {
  id: string;
  type: NotificationType;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  taskId?: string;
};

export type NotificationsPage = {
  items: NotificationFeedItem[];
  unreadCount: number;
  hasMore: boolean;
};

/** Публічна форма налаштувань (розділ 8) + контекст для екрана. */
export type NotificationPrefsView = NotificationSettings & {
  partnerName: string | null;
  hasPartner: boolean;
};

export type NotificationPrefsPatch = Partial<
  Omit<NotificationSettings, 'channels'> & { push: boolean; email: boolean }
>;

export type CreateNotificationInput = {
  weddingId: string;
  recipientId: string;
  type: NotificationType;
  dedupKey: string;
  count?: number;
  payload?: NotificationPayload;
  reminderNo?: number | null;
  /** Записати як уже неактуальне (придушене лімітом / вимкненою категорією). */
  suppressed?: boolean;
};

export type PartnerEventInput = {
  n?: number;
  entityIds?: string[];
  amount?: number;
  vendorId?: string;
  vendorLabel?: string;
  siteUrl?: string;
};

const SETTINGS_KEYS = [
  'tasks',
  'guests',
  'partnerActivity',
  'invitationAndDayPlan',
  'milestones',
  'tips',
] as const;

function isNotificationType(v: string): v is NotificationType {
  return (NOTIFICATION_TYPES as readonly string[]).includes(v);
}

/**
 * Колонки TIMESTAMP(3) без часової зони зберігають UTC (як пише Prisma).
 * У сирому SQL передаємо UTC-рядок явно, бо `NOW()` / параметр Date
 * перетворюються в часову зону сесії Postgres.
 */
export function utcTs(d: Date = new Date()): string {
  return d.toISOString().replace('Z', '');
}

function firstName(name: string | null | undefined) {
  return (name ?? '').trim().split(/\s+/)[0] || '';
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  // ───────────────────────── Push-пристрої

  async registerDevice(userId: string, token: string, platform?: string) {
    const clean = token.trim();
    if (!clean) return { ok: false };

    await this.prisma.pushDevice.upsert({
      where: { token: clean },
      create: {
        userId,
        token: clean,
        platform: platform?.trim() || 'unknown',
      },
      update: {
        userId,
        platform: platform?.trim() || 'unknown',
      },
    });

    return { ok: true };
  }

  async unregisterDevice(userId: string, token: string) {
    await this.prisma.pushDevice.deleteMany({
      where: { userId, token: token.trim() },
    });
    return { ok: true };
  }

  // ───────────────────────── Учасники весілля

  /** Власник + партнер (якщо приєднався). */
  async getMembers(weddingId: string) {
    const wedding = await this.prisma.wedding.findUnique({
      where: { id: weddingId },
      select: {
        userId: true,
        partnerOneName: true,
        partnerTwoName: true,
        members: { select: { userId: true, role: true } },
      },
    });
    if (!wedding) return null;
    const partner = wedding.members.find(
      (m) => m.role === 'PARTNER' && m.userId !== wedding.userId,
    );
    return {
      ownerId: wedding.userId,
      partnerId: partner?.userId ?? null,
      partnerOneName: wedding.partnerOneName,
      partnerTwoName: wedding.partnerTwoName,
    };
  }

  /** Ім'я й рід учасника для текстів («Роман додав»). */
  async getActors(
    weddingId: string,
    userIds: string[],
  ): Promise<Map<string, { name: string; gender: Gender }>> {
    const out = new Map<string, { name: string; gender: Gender }>();
    const ids = [...new Set(userIds.filter(Boolean))];
    if (!ids.length) return out;
    const [members, users] = await Promise.all([
      this.getMembers(weddingId),
      this.prisma.$queryRaw<Array<{ id: string; name: string; gender: string | null }>>`
        SELECT id, name, gender FROM users WHERE id = ANY(${ids})
      `.catch(() =>
        this.prisma.user
          .findMany({ where: { id: { in: ids } }, select: { id: true, name: true } })
          .then((rows) => rows.map((r) => ({ ...r, gender: null }))),
      ),
    ]);
    for (const u of users) {
      let name = u.name;
      if (members?.ownerId === u.id) name = members.partnerOneName || u.name;
      else if (members?.partnerId === u.id) name = members.partnerTwoName || u.name;
      const gender: Gender = u.gender === 'female' || u.gender === 'male' ? u.gender : null;
      out.set(u.id, { name: firstName(name) || firstName(u.name) || 'Партнер', gender });
    }
    return out;
  }

  // ───────────────────────── Налаштування (розділ 8)

  async getSettings(userId: string): Promise<NotificationSettings> {
    const rows = await this.prisma.$queryRaw<
      Array<{ notif_settings: unknown; notif_push: boolean; notif_email: boolean }>
    >`
      SELECT notif_settings, notif_push, notif_email FROM users WHERE id = ${userId}
    `.catch(() => [] as Array<{ notif_settings: unknown; notif_push: boolean; notif_email: boolean }>);
    const row = rows[0];
    const raw =
      row?.notif_settings && typeof row.notif_settings === 'object'
        ? (row.notif_settings as Record<string, unknown>)
        : {};
    const settings: NotificationSettings = {
      ...DEFAULT_SETTINGS,
      channels: {
        push: row?.notif_push ?? DEFAULT_SETTINGS.channels.push,
        email: row?.notif_email ?? DEFAULT_SETTINGS.channels.email,
      },
    };
    for (const key of SETTINGS_KEYS) {
      if (typeof raw[key] === 'boolean') settings[key] = raw[key] as boolean;
    }
    if (raw.taskFrequency === 'less' || raw.taskFrequency === 'normal') {
      settings.taskFrequency = raw.taskFrequency;
    }
    return settings;
  }

  async getPrefs(userId: string): Promise<NotificationPrefsView> {
    const settings = await this.getSettings(userId);
    const access = await resolveWeddingForUser(this.prisma, userId);
    let partnerName: string | null = null;
    let hasPartner = false;
    if (access) {
      const members = await this.getMembers(access.wedding.id);
      const otherId =
        members?.ownerId === userId ? members.partnerId : members?.ownerId ?? null;
      hasPartner = Boolean(members?.partnerId);
      if (otherId && hasPartner) {
        const actors = await this.getActors(access.wedding.id, [otherId]);
        partnerName = actors.get(otherId)?.name ?? null;
      }
    }
    return { ...settings, partnerName, hasPartner };
  }

  async updatePrefs(userId: string, patch: NotificationPrefsPatch) {
    const current = await this.getSettings(userId);
    const next: Record<string, unknown> = {
      tasks: current.tasks,
      taskFrequency: current.taskFrequency,
      guests: current.guests,
      partnerActivity: current.partnerActivity,
      invitationAndDayPlan: current.invitationAndDayPlan,
      milestones: current.milestones,
      tips: current.tips,
    };
    for (const key of SETTINGS_KEYS) {
      if (typeof patch[key] === 'boolean') next[key] = patch[key];
    }
    if (patch.taskFrequency === 'less' || patch.taskFrequency === 'normal') {
      next.taskFrequency = patch.taskFrequency;
    }
    const push = patch.push ?? current.channels.push;
    const email = patch.email ?? current.channels.email;
    await this.prisma.$executeRaw`
      UPDATE users
      SET notif_settings = ${JSON.stringify(next)}::jsonb,
          notif_push = ${push},
          notif_email = ${email}
      WHERE id = ${userId}
    `;
    return this.getPrefs(userId);
  }

  // ───────────────────────── Створення

  /** Створює запис і доставляє в push / email (якщо не придушене). */
  async create(input: CreateNotificationInput) {
    const id = randomUUID();
    const now = new Date();
    const payload = input.payload ?? {};
    await this.prisma.$executeRaw`
      INSERT INTO notifications
        (id, wedding_id, recipient_id, type, dedup_key, count, payload,
         created_at, updated_at, read_at, resolved_at, reminder_no)
      VALUES
        (${id}, ${input.weddingId}, ${input.recipientId}, ${input.type}, ${input.dedupKey},
         ${input.count ?? 1}, ${JSON.stringify(payload)}::jsonb, ${utcTs(now)}::timestamp,
         ${utcTs(now)}::timestamp,
         ${input.suppressed ? utcTs(now) : null}::timestamp,
         ${input.suppressed ? utcTs(now) : null}::timestamp,
         ${input.reminderNo ?? null})
    `;
    if (!input.suppressed) {
      void this.deliver(input.recipientId, input.weddingId, {
        type: input.type,
        count: input.count ?? 1,
        payload,
      }).catch((err) =>
        this.logger.warn(
          `deliver failed: ${err instanceof Error ? err.message : String(err)}`,
        ),
      );
    }
    return id;
  }

  /**
   * Дія партнера (розділ 4.1): усім іншим учасникам, з групуванням за 24 год.
   * Не кидає помилок — сповіщення не має ламати основну дію.
   */
  async partnerEvent(
    weddingId: string,
    actorId: string,
    type: Extract<NotificationType, `partner_${string}`>,
    event: PartnerEventInput = {},
  ) {
    try {
      const members = await this.getMembers(weddingId);
      if (!members) return;
      const recipients = [members.ownerId, members.partnerId].filter(
        (id): id is string => Boolean(id) && id !== actorId,
      );
      const n = Math.max(1, event.n ?? 1);
      const dedupKey = `partner:${actorId}:${type}`;
      for (const recipientId of recipients) {
        const settings = await this.getSettings(recipientId);
        if (!isTypeEnabled(settings, type)) continue;

        const rows = await this.prisma.$queryRaw<NotificationRow[]>`
          SELECT * FROM notifications
          WHERE recipient_id = ${recipientId} AND dedup_key = ${dedupKey}
          ORDER BY created_at DESC
          LIMIT 1
        `;
        const prev = rows[0] ?? null;
        const now = new Date();
        if (
          prev &&
          canMergeInto(
            { createdAt: prev.created_at, readAt: prev.read_at, resolvedAt: prev.resolved_at },
            now,
          )
        ) {
          const p = prev.payload ?? {};
          const payload: NotificationPayload = {
            ...p,
            actorId,
            entityIds: mergeEntityIds(p.entityIds, event.entityIds),
            ...(event.amount !== undefined
              ? { amount: (Number(p.amount) || 0) + event.amount }
              : {}),
            ...(event.vendorId ? { vendorId: event.vendorId } : {}),
            ...(event.vendorLabel ? { vendorLabel: event.vendorLabel } : {}),
            ...(event.siteUrl ? { siteUrl: event.siteUrl } : {}),
          };
          // Однакові «стани» (розсадка, сайт) не накопичують лічильник.
          const add = type === 'partner_seating_updated' || type === 'partner_site_published' ? 0 : n;
          await this.prisma.$executeRaw`
            UPDATE notifications
            SET count = count + ${add},
                payload = ${JSON.stringify(payload)}::jsonb,
                updated_at = ${utcTs(now)}::timestamp
            WHERE id = ${prev.id}
          `;
          continue;
        }

        await this.create({
          weddingId,
          recipientId,
          type,
          dedupKey,
          count: n,
          payload: {
            actorId,
            entityIds: event.entityIds?.slice(-200),
            amount: event.amount,
            vendorId: event.vendorId,
            vendorLabel: event.vendorLabel,
            siteUrl: event.siteUrl,
          },
        });
      }
    } catch (err) {
      this.logger.warn(
        `partnerEvent ${type} failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  /** Окреме (не групуєме) сповіщення одному учаснику: task_assigned, partner_joined. */
  async direct(
    weddingId: string,
    recipientId: string,
    type: NotificationType,
    dedupKey: string,
    payload: NotificationPayload,
  ) {
    try {
      const settings = await this.getSettings(recipientId);
      if (!isTypeEnabled(settings, type)) return;
      await this.create({ weddingId, recipientId, type, dedupKey, payload });
    } catch (err) {
      this.logger.warn(
        `direct ${type} failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  /** setup_smart_planning_date — одразу після вказання дати (розділ 7.1, п. 2). */
  async smartPlanningDateTip(weddingId: string) {
    try {
      const [smart] = await this.prisma.$queryRaw<Array<{ n: number }>>`
        SELECT COUNT(*)::int AS n FROM tasks
        WHERE wedding_id = ${weddingId} AND source = 'smart_planning'
      `;
      const hasSmartPlan = Number(smart?.n ?? 0) > 0;
      const members = await this.getMembers(weddingId);
      if (!members || hasSmartPlan) return;
      for (const recipientId of [members.ownerId, members.partnerId]) {
        if (!recipientId) continue;
        const rows = await this.prisma.$queryRaw<Array<{ type: string; created_at: Date }>>`
          SELECT type, created_at FROM notifications
          WHERE wedding_id = ${weddingId} AND recipient_id = ${recipientId}
            AND type IN ('setup_smart_planning', 'setup_smart_planning_date')
        `;
        const history = rows.map((r) => ({
          type: r.type as NotificationType,
          day: r.created_at.toISOString().slice(0, 10),
        }));
        if (!smartPlanningDateTipAllowed({ hasSmartPlan, history })) continue;
        await this.direct(
          weddingId,
          recipientId,
          'setup_smart_planning_date',
          'tip:smart:date',
          {},
        );
      }
    } catch (err) {
      this.logger.warn(
        `smartPlanningDateTip failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  // ───────────────────────── «Стало неактуальним» (розділ 2.3)

  async resolveTypes(weddingId: string, types: NotificationType[], recipientId?: string) {
    if (!types.length) return;
    try {
      if (recipientId) {
        await this.prisma.$executeRaw`
          UPDATE notifications SET resolved_at = ${utcTs()}::timestamp
          WHERE wedding_id = ${weddingId} AND recipient_id = ${recipientId}
            AND type = ANY(${types}) AND read_at IS NULL AND resolved_at IS NULL
        `;
      } else {
        await this.prisma.$executeRaw`
          UPDATE notifications SET resolved_at = ${utcTs()}::timestamp
          WHERE wedding_id = ${weddingId}
            AND type = ANY(${types}) AND read_at IS NULL AND resolved_at IS NULL
        `;
      }
    } catch (err) {
      this.logger.warn(
        `resolveTypes failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  /** Завдання виконали / видалили — нагадування про нього зникають. */
  async resolveTask(weddingId: string, taskId: string) {
    try {
      await this.prisma.$executeRaw`
        UPDATE notifications SET resolved_at = ${utcTs()}::timestamp
        WHERE wedding_id = ${weddingId}
          AND payload->>'taskId' = ${taskId}
          AND type IN ('deadline_early', 'deadline_late', 'deadline_today', 'task_overdue')
          AND read_at IS NULL AND resolved_at IS NULL
      `;
    } catch (err) {
      this.logger.warn(
        `resolveTask failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  // ───────────────────────── Фід (розділ 10)

  async list(userId: string, offset = 0, limit = 5): Promise<NotificationsPage> {
    const since = new Date(Date.now() - HISTORY_DAYS * 24 * 60 * 60 * 1000);
    const take = Math.min(Math.max(limit, 1), 50);
    const skip = Math.max(offset, 0);
    const rows = await this.prisma.$queryRaw<NotificationRow[]>`
      SELECT * FROM notifications
      WHERE recipient_id = ${userId} AND resolved_at IS NULL AND updated_at >= ${utcTs(since)}::timestamp
      ORDER BY updated_at DESC, id DESC
      OFFSET ${skip} LIMIT ${take + 1}
    `.catch(() => [] as NotificationRow[]);
    const unreadCount = await this.unreadCount(userId);
    const page = rows.slice(0, take);
    return {
      items: await this.renderRows(page),
      unreadCount,
      hasMore: rows.length > take,
    };
  }

  async unreadCount(userId: string) {
    const since = new Date(Date.now() - HISTORY_DAYS * 24 * 60 * 60 * 1000);
    const rows = await this.prisma.$queryRaw<Array<{ n: bigint | number }>>`
      SELECT COUNT(*)::int AS n FROM notifications
      WHERE recipient_id = ${userId} AND resolved_at IS NULL AND read_at IS NULL
        AND updated_at >= ${utcTs(since)}::timestamp
    `.catch(() => [{ n: 0 }]);
    return Number(rows[0]?.n ?? 0);
  }

  async markRead(userId: string, id: string) {
    const changed = await this.prisma.$executeRaw`
      UPDATE notifications SET read_at = COALESCE(read_at, ${utcTs()}::timestamp)
      WHERE id = ${id} AND recipient_id = ${userId}
    `;
    if (!changed) throw new NotFoundException('Сповіщення не знайдено');
    return { ok: true, unreadCount: await this.unreadCount(userId) };
  }

  async markAllRead(userId: string) {
    await this.prisma.$executeRaw`
      UPDATE notifications SET read_at = ${utcTs()}::timestamp
      WHERE recipient_id = ${userId} AND read_at IS NULL AND resolved_at IS NULL
    `;
    return { ok: true, unreadCount: 0 };
  }

  private async renderRows(rows: NotificationRow[]): Promise<NotificationFeedItem[]> {
    const byWedding = new Map<string, string[]>();
    for (const row of rows) {
      const actorId = row.payload?.actorId;
      if (!actorId) continue;
      const list = byWedding.get(row.wedding_id) ?? [];
      list.push(actorId);
      byWedding.set(row.wedding_id, list);
    }
    const actors = new Map<string, { name: string; gender: Gender }>();
    for (const [weddingId, ids] of byWedding) {
      for (const [id, actor] of await this.getActors(weddingId, ids)) actors.set(id, actor);
    }

    const out: NotificationFeedItem[] = [];
    for (const row of rows) {
      if (!isNotificationType(row.type)) continue;
      const payload = row.payload ?? {};
      const rendered = renderNotification({
        type: row.type,
        count: row.count,
        payload,
        actor: payload.actorId ? actors.get(payload.actorId) ?? null : null,
      });
      out.push({
        ...rendered,
        id: row.id,
        type: row.type,
        createdAt: row.created_at.toISOString(),
        updatedAt: row.updated_at.toISOString(),
        isRead: Boolean(row.read_at),
        ...(payload.taskId ? { taskId: payload.taskId } : {}),
      });
    }
    return out;
  }

  // ───────────────────────── Доставка (розділ 2.7)

  private async deliver(
    userId: string,
    weddingId: string,
    input: { type: NotificationType; count: number; payload: NotificationPayload },
  ) {
    const settings = await this.getSettings(userId);
    if (!settings.channels.push && !settings.channels.email) return;
    const actors = input.payload.actorId
      ? await this.getActors(weddingId, [input.payload.actorId])
      : new Map();
    const rendered = renderNotification({
      ...input,
      actor: input.payload.actorId ? actors.get(input.payload.actorId) ?? null : null,
    });
    const body = plainText(rendered.segments);
    const primary = rendered.actions.find((a) => a.href) ?? null;
    await Promise.all([
      settings.channels.push
        ? this.sendPush(userId, {
            title: 'fata.studio',
            body,
            data: { type: input.type, href: rendered.href },
          })
        : Promise.resolve(),
      settings.channels.email
        ? this.sendEmail(userId, {
            subject: body.length > 90 ? `${body.slice(0, 87)}…` : body,
            body,
            ctaLabel: primary?.label ?? 'Відкрити fata.studio',
            ctaPath: primary?.href ?? rendered.href,
          })
        : Promise.resolve(),
    ]);
  }

  private async sendPush(
    userId: string,
    payload: { title: string; body: string; data?: Record<string, string> },
  ) {
    const devices = await this.prisma.pushDevice.findMany({
      where: { userId },
    });
    if (!devices.length) return { sent: 0 };

    const messages: ExpoPushMessage[] = devices.map((d: { token: string }) => ({
      to: d.token,
      title: payload.title,
      body: payload.body,
      data: payload.data,
      sound: 'default',
    }));

    return this.sendExpo(messages);
  }

  private async sendEmail(
    userId: string,
    payload: { subject: string; body: string; ctaLabel?: string; ctaPath?: string },
  ) {
    const shouldSend =
      Boolean(process.env.SMTP_HOST?.trim()) || process.env.EMAIL_LOG === '1';
    if (!shouldSend) return { emailed: 0 };

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });
    if (!user?.email) return { emailed: 0 };

    const ctaPath = payload.ctaPath;
    const ctaUrl = ctaPath
      ? ctaPath.startsWith('http')
        ? ctaPath
        : `${this.email.webUrl}${ctaPath.startsWith('/') ? '' : '/'}${ctaPath}`
      : undefined;
    const rendered = this.email.renderSimple({
      title: payload.subject,
      body: payload.body,
      ctaLabel: payload.ctaLabel,
      ctaUrl,
    });

    const result = await this.email.send({
      to: user.email,
      subject: payload.subject,
      text: rendered.text,
      html: rendered.html,
    });

    return { emailed: result.sent || result.dryRun ? 1 : 0 };
  }

  private async sendExpo(messages: ExpoPushMessage[]) {
    if (!messages.length) return { sent: 0 };
    try {
      const res = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      });
      if (!res.ok) {
        this.logger.warn(`Expo push failed: ${res.status}`);
        return { sent: 0 };
      }
      return { sent: messages.length };
    } catch (err) {
      this.logger.warn(
        `Expo push error: ${err instanceof Error ? err.message : String(err)}`,
      );
      return { sent: 0 };
    }
  }
}
