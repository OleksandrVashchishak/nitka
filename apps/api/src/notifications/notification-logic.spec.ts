/**
 * Сценарії з notifications-spec.md, розділ 11.
 * Запуск: `npm test` в apps/api (node:test + ts-node).
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  countWord,
  DEFAULT_SETTINGS,
  isTypeEnabled,
  plainText,
  renderNotification,
  WORDS,
} from './notification-catalog';
import {
  addDays,
  applyDailyLimit,
  canMergeInto,
  countdownThreshold,
  guestsNoResponseDue,
  kyivDay,
  nudgeFor,
  planTaskReminder,
  progressThreshold,
  reminderLevel,
  setupDateDue,
  smartPlanningDateTipAllowed,
  smartPlanningTipDue,
  taskRecipients,
  type ReminderHistory,
  type ReminderTask,
  type TipHistory,
} from './notification-logic';

const TODAY = '2027-03-01';
const NOW = new Date('2027-03-01T08:00:00Z'); // 10:00 Київ

function task(over: Partial<ReminderTask> = {}): ReminderTask {
  return {
    id: 't1',
    title: 'Замовити коровай',
    status: 'TODO',
    dueDay: addDays(TODAY, 14),
    createdAt: new Date('2026-06-01T10:00:00Z'),
    templateId: null,
    source: null,
    isUrgent: false,
    assignee: null,
    ...over,
  };
}

function history(sent: string[] = [], overdue = { count: 0, lastDay: null as string | null }): ReminderHistory {
  const set = new Set(sent);
  return { sent: (k) => set.has(k), overdue };
}

function text(type: Parameters<typeof renderNotification>[0]['type'], count: number, payload = {}, actor?: { name: string; gender: 'female' | 'male' | null }) {
  return plainText(renderNotification({ type, count, payload, actor }).segments);
}

describe('групування (сценарії 1–2)', () => {
  it('непрочитане за 24 год — дописуємо', () => {
    const created = new Date(NOW.getTime() - 10 * 60_000);
    assert.equal(canMergeInto({ createdAt: created, readAt: null, resolvedAt: null }, NOW), true);
  });
  it('прочитане — нове сповіщення', () => {
    const created = new Date(NOW.getTime() - 10 * 60_000);
    assert.equal(canMergeInto({ createdAt: created, readAt: NOW, resolvedAt: null }, NOW), false);
  });
  it('старше 24 год — нове сповіщення', () => {
    const created = new Date(NOW.getTime() - 25 * 3600_000);
    assert.equal(canMergeInto({ createdAt: created, readAt: null, resolvedAt: null }, NOW), false);
  });
  it('текст «Роман додав 40 гостей» / «Оля додала 10 гостей»', () => {
    assert.equal(text('partner_guests_added', 40, {}, { name: 'Роман', gender: 'male' }), 'Роман додав 40 гостей');
    assert.equal(text('partner_guests_added', 10, {}, { name: 'Оля Петренко', gender: 'female' }), 'Оля додала 10 гостей');
    assert.equal(text('partner_guests_added', 1, {}, { name: 'Сашко', gender: null }), 'Сашко додав(ла) 1 гостя');
  });
});

describe('кому (сценарій 3, 9)', () => {
  const members = { ownerId: 'olya', partnerId: 'roman' };
  it('призначене на одного — тільки йому', () => {
    assert.deepEqual(taskRecipients('partner', members).recipients, ['roman']);
    assert.deepEqual(taskRecipients('owner', members).recipients, ['olya']);
  });
  it('спільні / нічиї — обом', () => {
    assert.deepEqual(taskRecipients('both', members).recipients, ['olya', 'roman']);
    assert.deepEqual(taskRecipients(null, members).recipients, ['olya', 'roman']);
  });
  it('«Не наші» — обом, з позначкою', () => {
    const r = taskRecipients('other:Мама', members);
    assert.deepEqual(r.recipients, ['olya', 'roman']);
    assert.equal(r.isOther, true);
  });
});

describe('нагадування про дедлайни', () => {
  const photographer = task({
    id: 'p1',
    title: 'Забронювати фотографа',
    templateId: 'photographer',
    source: 'smart_planning',
  });

  it('сценарій 4: фотограф (9 міс) за 14 днів → deadline_early з nudge', () => {
    assert.equal(reminderLevel(photographer), 'long');
    const r = planTaskReminder(photographer, { today: TODAY, now: NOW, frequency: 'normal', isOther: false, history: history() });
    assert.equal(r?.type, 'deadline_early');
    const s = text('deadline_early', 1, { days: r!.days, ...nudgeFor(photographer, 1) });
    assert.equal(s, 'Ви вже забронювали фотографа? До дедлайну 14 днів.');
  });

  it('сценарій 5: «Рідше» — за 14 днів нічого, за 3 дні deadline_late, прострочка один раз', () => {
    const opts = { now: NOW, frequency: 'less' as const, isOther: false };
    assert.equal(planTaskReminder(photographer, { ...opts, today: TODAY, history: history() }), null);
    const late = planTaskReminder(photographer, { ...opts, today: addDays(TODAY, 11), history: history() });
    assert.equal(late?.type, 'deadline_late');
    assert.equal(late?.days, 3);
    const over1 = planTaskReminder(photographer, { ...opts, today: addDays(TODAY, 15), history: history() });
    assert.equal(over1?.type, 'task_overdue');
    const over2 = planTaskReminder(photographer, {
      ...opts,
      today: addDays(TODAY, 30),
      history: history([], { count: 1, lastDay: addDays(TODAY, 15) }),
    });
    assert.equal(over2, null);
  });

  it('прострочка: наступного дня, далі раз на тиждень, максимум 3', () => {
    const t = task({ dueDay: addDays(TODAY, -1) });
    const opts = { now: NOW, frequency: 'normal' as const, isOther: false };
    assert.equal(planTaskReminder(t, { ...opts, today: TODAY, history: history() })?.reminderNo, 1);
    assert.equal(
      planTaskReminder(t, { ...opts, today: addDays(TODAY, 3), history: history([], { count: 1, lastDay: TODAY }) }),
      null,
    );
    assert.equal(
      planTaskReminder(t, { ...opts, today: addDays(TODAY, 7), history: history([], { count: 1, lastDay: TODAY }) })?.reminderNo,
      2,
    );
    assert.equal(
      planTaskReminder(t, { ...opts, today: addDays(TODAY, 30), history: history([], { count: 3, lastDay: addDays(TODAY, 14) }) }),
      null,
    );
  });

  it('сценарій 6: ручне, створене сьогодні з дедлайном через 2 дні → лише deadline_today', () => {
    const t = task({ createdAt: NOW, dueDay: addDays(TODAY, 2) });
    assert.equal(reminderLevel(t), 'short');
    const opts = { frequency: 'normal' as const, isOther: false, history: history() };
    assert.equal(planTaskReminder(t, { ...opts, today: TODAY, now: NOW }), null);
    const day1 = new Date(NOW.getTime() + 24 * 3600_000);
    assert.equal(planTaskReminder(t, { ...opts, today: addDays(TODAY, 1), now: day1 }), null);
    const day2 = new Date(NOW.getTime() + 48 * 3600_000);
    assert.equal(planTaskReminder(t, { ...opts, today: addDays(TODAY, 2), now: day2 })?.type, 'deadline_today');
  });

  it('сценарій 8: термінові не нагадуються поштучно до дедлайну', () => {
    const t = task({ isUrgent: true, source: 'smart_planning', dueDay: addDays(TODAY, 3) });
    assert.equal(planTaskReminder(t, { today: TODAY, now: NOW, frequency: 'normal', isOther: false, history: history() }), null);
  });

  it('сценарій 9: «Не наші» — тільки перше нагадування', () => {
    const t = task({ assignee: 'other:Мама', dueDay: addDays(TODAY, 7), createdAt: new Date('2027-01-01T00:00:00Z') });
    const opts = { now: NOW, frequency: 'normal' as const, isOther: true };
    const first = planTaskReminder(t, { ...opts, today: TODAY, history: history() });
    assert.equal(first?.type, 'deadline_early');
    const sent = history([first!.dedupKey]);
    assert.equal(planTaskReminder(t, { ...opts, today: addDays(TODAY, 5), history: sent }), null);
    assert.equal(planTaskReminder(t, { ...opts, today: addDays(TODAY, 9), history: sent }), null);
  });

  it('виконане завдання та завдання без дати — без нагадувань', () => {
    const opts = { today: TODAY, now: NOW, frequency: 'normal' as const, isOther: false, history: history() };
    assert.equal(planTaskReminder(task({ status: 'DONE' }), opts), null);
    assert.equal(planTaskReminder(task({ dueDay: null }), opts), null);
  });

  it('ручні рівні за проміжком створення → дедлайн', () => {
    const created = new Date('2027-01-01T00:00:00Z');
    assert.equal(reminderLevel(task({ createdAt: created, dueDay: '2027-04-01' })), 'long');
    assert.equal(reminderLevel(task({ createdAt: created, dueDay: '2027-02-01' })), 'mid');
    assert.equal(reminderLevel(task({ createdAt: created, dueDay: '2027-01-10' })), 'short');
  });
});

describe('ліміт 3 на день (сценарій 7)', () => {
  it('5 дедлайнів → одне зведення на 5 завдань', () => {
    const c = [1, 2, 3, 4, 5].map((i) => ({ type: 'deadline_early' as const, dedupKey: `k${i}` }));
    const plan = applyDailyLimit(c);
    assert.equal(plan.send.length, 0);
    assert.equal(plan.digestCount, 5);
    assert.equal(text('deadline_digest', plan.digestCount), 'Цього тижня дедлайн у 5 завдань');
  });
  it('3 і менше — без змін', () => {
    const c = [1, 2, 3].map((i) => ({ type: 'deadline_late' as const, dedupKey: `k${i}` }));
    assert.equal(applyDailyLimit(c).send.length, 3);
  });
  it('дедлайни + інше: зведення + найважливіші, решта переноситься', () => {
    const plan = applyDailyLimit([
      { type: 'deadline_early', dedupKey: 'a' },
      { type: 'deadline_late', dedupKey: 'b' },
      { type: 'setup_partner', dedupKey: 'c' },
      { type: 'guests_no_response', dedupKey: 'd' },
      { type: 'countdown', dedupKey: 'e' },
    ]);
    assert.equal(plan.digestCount, 2);
    assert.deepEqual(plan.send.map((s) => s.type), ['guests_no_response', 'countdown']);
    assert.deepEqual(plan.deferred.map((s) => s.type), ['setup_partner']);
  });
});

describe('гості без відповіді (сценарії 11–12)', () => {
  const weddingDay = addDays(TODAY, 90);
  it('перше — через 14 днів після старту, далі раз на 2 тижні (> 2 міс)', () => {
    const start = addDays(TODAY, -14);
    assert.equal(guestsNoResponseDue({ today: addDays(TODAY, -1), startDay: start, weddingDay, pending: 8, history: [] }), false);
    assert.equal(guestsNoResponseDue({ today: TODAY, startDay: start, weddingDay, pending: 8, history: [] }), true);
    const h = [{ day: TODAY, count: 8 }];
    assert.equal(guestsNoResponseDue({ today: addDays(TODAY, 13), startDay: start, weddingDay, pending: 8, history: h }), false);
    assert.equal(guestsNoResponseDue({ today: addDays(TODAY, 14), startDay: start, weddingDay, pending: 8, history: h }), true);
    assert.equal(text('guests_no_response', 8), '8 гостей ще не повідомили, чи прийдуть');
  });
  it('число не змінилось 3 рази поспіль → інтервал подвоюється', () => {
    const h = [
      { day: addDays(TODAY, -42), count: 8 },
      { day: addDays(TODAY, -28), count: 8 },
      { day: addDays(TODAY, -14), count: 8 },
    ];
    const base = { startDay: addDays(TODAY, -60), weddingDay, pending: 8, history: h };
    assert.equal(guestsNoResponseDue({ ...base, today: TODAY }), false);
    assert.equal(guestsNoResponseDue({ ...base, today: addDays(TODAY, 14) }), true);
  });
  it('стоп: 0 гостей, день весілля', () => {
    const start = addDays(TODAY, -30);
    assert.equal(guestsNoResponseDue({ today: TODAY, startDay: start, weddingDay, pending: 0, history: [] }), false);
    assert.equal(guestsNoResponseDue({ today: weddingDay, startDay: start, weddingDay, pending: 3, history: [] }), false);
  });
});

describe('підказки розумного планування (сценарій 13)', () => {
  const reg = '2027-01-01';
  it('день 2 → дата → день 9 → далі нічого', () => {
    const h: TipHistory = [];
    assert.equal(smartPlanningTipDue({ today: addDays(reg, 1), registeredDay: reg, hasSmartPlan: false, history: h }), false);
    assert.equal(smartPlanningTipDue({ today: addDays(reg, 2), registeredDay: reg, hasSmartPlan: false, history: h }), true);
    h.push({ type: 'setup_smart_planning', day: addDays(reg, 2) });
    assert.equal(smartPlanningDateTipAllowed({ hasSmartPlan: false, history: h }), true);
    h.push({ type: 'setup_smart_planning_date', day: addDays(reg, 4) });
    assert.equal(smartPlanningTipDue({ today: addDays(reg, 8), registeredDay: reg, hasSmartPlan: false, history: h }), false);
    assert.equal(smartPlanningTipDue({ today: addDays(reg, 9), registeredDay: reg, hasSmartPlan: false, history: h }), true);
    h.push({ type: 'setup_smart_planning', day: addDays(reg, 9) });
    assert.equal(smartPlanningTipDue({ today: addDays(reg, 40), registeredDay: reg, hasSmartPlan: false, history: h }), false);
    assert.equal(smartPlanningDateTipAllowed({ hasSmartPlan: false, history: h }), false);
  });
  it('пройшли степер — нічого', () => {
    assert.equal(smartPlanningTipDue({ today: addDays(reg, 5), registeredDay: reg, hasSmartPlan: true, history: [] }), false);
  });
  it('setup_date: день 1, далі щотижня, максимум 3', () => {
    const base = { registeredDay: reg, dateUndecided: true };
    assert.equal(setupDateDue({ ...base, today: addDays(reg, 1), history: [] }), true);
    assert.equal(setupDateDue({ ...base, today: addDays(reg, 5), history: [addDays(reg, 1)] }), false);
    assert.equal(setupDateDue({ ...base, today: addDays(reg, 8), history: [addDays(reg, 1)] }), true);
    assert.equal(setupDateDue({ ...base, today: addDays(reg, 30), history: ['a', 'b', 'c'] }), false);
    assert.equal(setupDateDue({ ...base, dateUndecided: false, today: addDays(reg, 3), history: [] }), false);
  });
});

describe('налаштування (сценарії 15–16)', () => {
  it('вимкнені «Дії партнера» не блокують task_assigned і системні', () => {
    const s = { ...DEFAULT_SETTINGS, partnerActivity: false };
    assert.equal(isTypeEnabled(s, 'partner_guests_added'), false);
    assert.equal(isTypeEnabled(s, 'task_assigned'), true);
    assert.equal(isTypeEnabled(s, 'partner_joined'), true);
  });
});

describe('відлік і прогрес', () => {
  it('пороги 100/30/7 з запасом 2 дні', () => {
    assert.equal(countdownThreshold(100), 100);
    assert.equal(countdownThreshold(98), 100);
    assert.equal(countdownThreshold(97), null);
    assert.equal(countdownThreshold(7), 7);
    assert.equal(text('countdown', 1, { days: 100 }), 'До весілля 100 днів!');
  });
  it('прогрес — найвищий новий поріг', () => {
    assert.equal(progressThreshold(30, 60, () => false), 50);
    assert.equal(progressThreshold(30, 60, (th) => th === 50), null);
    assert.equal(progressThreshold(2, 3, () => false), null);
    assert.equal(
      text('progress', 1, { threshold: 50, done: 30, total: 60 }),
      'Половина плану виконана — 30 з 60 завдань',
    );
  });
});

describe('відмінювання (сценарій 20)', () => {
  it('1 / 3 / 5 / 11 / 21 / 22 гості', () => {
    assert.deepEqual(
      [1, 3, 5, 11, 21, 22].map((n) => countWord(n, WORDS.guestGen)),
      ['1 гостя', '3 гостей', '5 гостей', '11 гостей', '21 гостя', '22 гостей'],
    );
  });
  it('дні та завдання', () => {
    assert.equal(countWord(3, WORDS.day), '3 дні');
    assert.equal(countWord(5, WORDS.task), '5 завдань');
    assert.equal(countWord(2, WORDS.vendor), '2 підрядників');
  });
});

describe('дати за Києвом', () => {
  it('23:30 UTC взимку — вже наступний день у Києві', () => {
    assert.equal(kyivDay(new Date('2027-01-10T23:30:00Z')), '2027-01-11');
  });
});
