import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { resolveWeddingForUser } from '../weddings/wedding-access';

type ExpoPushMessage = {
  to: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  sound?: 'default';
};

export type NotifyPayload = {
  title: string;
  body: string;
  data?: Record<string, string>;
  /** Додаткові поля для email (якщо немає — візьмемо title/body). */
  email?: {
    subject?: string;
    body?: string;
    ctaLabel?: string;
    ctaPath?: string;
  };
};

export type NotificationSummaryItem = {
  key: string;
  label: string;
  count: number;
  href: string;
};

export type NotificationFeedItem = {
  id: string;
  body: string;
  href: string;
  createdAt: string;
  isNew: boolean;
  actionLabel?: string;
  actionHref?: string;
};

function guestsWord(n: number) {
  const abs = Math.abs(n) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) return 'гостей';
  if (d === 1) return 'гість';
  if (d >= 2 && d <= 4) return 'гості';
  return 'гостей';
}

function daysWord(n: number) {
  const abs = Math.abs(n) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) return 'днів';
  if (d === 1) return 'день';
  if (d >= 2 && d <= 4) return 'дні';
  return 'днів';
}

function formatUaDate(date: Date) {
  return date.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
  });
}

function rsvpLabel(status: string) {
  if (status === 'YES') return 'підтвердив(ла) участь';
  if (status === 'NO') return 'відхилив(ла) запрошення';
  if (status === 'MAYBE') return 'відповів(ла): можливо';
  return 'відповів(ла) на запрошення';
}

@Injectable()
export class NotificationsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationsService.name);
  private dueTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  onModuleInit() {
    const hour = 60 * 60 * 1000;
    this.dueTimer = setInterval(() => {
      void this.sendDueTaskReminders().catch((err) =>
        this.logger.warn(
          `due reminders failed: ${err instanceof Error ? err.message : String(err)}`,
        ),
      );
    }, hour);
    setTimeout(() => {
      void this.sendDueTaskReminders().catch(() => undefined);
    }, 45_000);
  }

  onModuleDestroy() {
    if (this.dueTimer) clearInterval(this.dueTimer);
  }

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

  async getSummary(user: { id: string; role: string }) {
    if (user.role === 'VENDOR') {
      return this.getVendorSummary(user.id);
    }
    return this.getCoupleSummary(user.id, user.role);
  }

  private async getVendorSummary(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });
    if (!vendor) {
      return {
        role: 'VENDOR' as const,
        newRequests: 0,
        total: 0,
        newCount: 0,
        items: [] as NotificationSummaryItem[],
        feed: [] as NotificationFeedItem[],
        moreHref: '/vendor/requests',
      };
    }

    const newRequestsList = await this.prisma.request.findMany({
      where: { vendorId: vendor.id, status: 'NEW' },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: {
        user: { select: { name: true } },
      },
    });

    const newRequests = newRequestsList.length;
    const items: NotificationSummaryItem[] = [
      {
        key: 'newRequests',
        label: 'Нові заявки',
        count: newRequests,
        href: '/vendor/requests',
      },
    ].filter((i) => i.count > 0);

    const feed: NotificationFeedItem[] = newRequestsList.map((req) => ({
      id: `request-${req.id}`,
      body: `Нова заявка від ${req.user.name || 'пари'} · ${req.city}, ${req.guests} гостей`,
      href: '/vendor/requests',
      createdAt: req.createdAt.toISOString(),
      isNew: true,
    }));

    return {
      role: 'VENDOR' as const,
      newRequests,
      total: newRequests,
      newCount: feed.length,
      items,
      feed,
      moreHref: '/vendor/requests',
    };
  }

  private async getCoupleSummary(userId: string, role: string) {
    const access = await resolveWeddingForUser(this.prisma, userId);
    const wedding = access?.wedding ?? null;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const [pendingRsvp, newRsvp, waitingRequests, vendorReplied] =
      await Promise.all([
        wedding
          ? this.prisma.guest.count({
              where: { weddingId: wedding.id, rsvpStatus: 'PENDING' },
            })
          : Promise.resolve(0),
        wedding
          ? this.prisma.guest.count({
              where: {
                weddingId: wedding.id,
                rsvpStatus: { in: ['YES', 'NO', 'MAYBE'] },
                respondedAt: { gte: weekAgo },
              },
            })
          : Promise.resolve(0),
        this.prisma.request.count({
          where: { userId, status: 'NEW' },
        }),
        this.prisma.request.count({
          where: {
            userId,
            messages: {
              some: {
                authorRole: 'VENDOR',
                createdAt: { gte: twoWeeksAgo },
              },
            },
          },
        }),
      ]);

    const items: NotificationSummaryItem[] = [
      {
        key: 'newRsvp',
        label: 'Нові відповіді на запрошення',
        count: newRsvp,
        href: '/guests',
      },
      {
        key: 'pendingRsvp',
        label: 'Чекають відповіді на запрошення',
        count: pendingRsvp,
        href: '/guests',
      },
      {
        key: 'waitingRequests',
        label: 'Заявки в очікуванні',
        count: waitingRequests,
        href: '/requests',
      },
      {
        key: 'vendorReplied',
        label: 'Вендор відповів',
        count: vendorReplied,
        href: '/requests',
      },
    ].filter((i) => i.count > 0);

    const feed = await this.buildCoupleFeed(userId, wedding, pendingRsvp);
    const newCount = feed.filter((item) => item.isNew).length;

    return {
      role,
      pendingRsvp,
      newRsvp,
      waitingRequests,
      vendorReplied,
      total: items.reduce((sum, i) => sum + i.count, 0),
      newCount,
      items,
      feed,
      moreHref: pendingRsvp || newRsvp ? '/guests' : '/requests',
    };
  }

  private async buildCoupleFeed(
    userId: string,
    wedding: {
      id: string;
      date: Date;
      partnerOneName: string;
      partnerTwoName: string;
    } | null,
    pendingRsvp: number,
  ): Promise<NotificationFeedItem[]> {
    const feed: NotificationFeedItem[] = [];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const now = new Date();

    if (wedding) {
      const recentRsvps = await this.prisma.guest.findMany({
        where: {
          weddingId: wedding.id,
          rsvpStatus: { in: ['YES', 'NO', 'MAYBE'] },
          respondedAt: { gte: twoWeeksAgo },
        },
        orderBy: { respondedAt: 'desc' },
        take: 4,
        select: {
          id: true,
          name: true,
          rsvpStatus: true,
          respondedAt: true,
        },
      });

      for (const guest of recentRsvps) {
        const at = guest.respondedAt ?? now;
        feed.push({
          id: `rsvp-${guest.id}`,
          body: `${guest.name} ${rsvpLabel(guest.rsvpStatus)}`,
          href: '/guests',
          createdAt: at.toISOString(),
          isNew: at >= weekAgo,
        });
      }

      if (pendingRsvp > 0) {
        const oldestPending = await this.prisma.guest.findFirst({
          where: { weddingId: wedding.id, rsvpStatus: 'PENDING' },
          orderBy: { createdAt: 'asc' },
          select: { createdAt: true },
        });
        feed.push({
          id: 'pending-rsvp',
          body: `${pendingRsvp} ${guestsWord(pendingRsvp)} ще не відповіли на запрошення`,
          href: '/guests',
          createdAt: (oldestPending?.createdAt ?? now).toISOString(),
          isNew: true,
          actionLabel: 'Нагадати',
          actionHref: '/guests',
        });
      }

      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const dueEnd = new Date(start);
      dueEnd.setDate(dueEnd.getDate() + 7);

      const dueTasks = await this.prisma.task.findMany({
        where: {
          weddingId: wedding.id,
          status: { not: 'DONE' },
          dueDate: { gte: start, lt: dueEnd },
        },
        orderBy: { dueDate: 'asc' },
        take: 3,
        select: { id: true, title: true, dueDate: true },
      });

      for (const task of dueTasks) {
        if (!task.dueDate) continue;
        const daysLeft = Math.max(
          0,
          Math.ceil(
            (task.dueDate.getTime() - start.getTime()) / (24 * 60 * 60 * 1000),
          ),
        );
        feed.push({
          id: `task-due-${task.id}`,
          body:
            daysLeft === 0
              ? `Сьогодні дедлайн: ${task.title}`
              : `Залишилось ${daysLeft} ${daysWord(daysLeft)} до дедлайну: ${task.title}`,
          href: '/checklist',
          createdAt: task.dueDate.toISOString(),
          isNew: daysLeft <= 2,
        });
      }

      const weddingDaysLeft = Math.ceil(
        (wedding.date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000),
      );
      if (pendingRsvp > 0 && weddingDaysLeft > 0 && weddingDaysLeft <= 14) {
        feed.push({
          id: 'invite-deadline',
          body: `Залишилось ${weddingDaysLeft} ${daysWord(weddingDaysLeft)} щоб підтвердити запрошення`,
          href: '/guests',
          createdAt: now.toISOString(),
          isNew: weddingDaysLeft <= 7,
        });
      }
    }

    const vendorMessages = await this.prisma.requestMessage.findMany({
      where: {
        authorRole: 'VENDOR',
        createdAt: { gte: twoWeeksAgo },
        request: { userId },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        request: {
          include: {
            vendor: {
              include: { category: { select: { name: true } } },
            },
          },
        },
      },
    });

    const seenRequests = new Set<string>();
    for (const msg of vendorMessages) {
      if (seenRequests.has(msg.requestId)) continue;
      seenRequests.add(msg.requestId);
      const vendor = msg.request.vendor;
      const category = vendor.category?.name || 'Підрядник';
      const eventLabel = formatUaDate(msg.request.eventDate);
      const confirmed =
        msg.request.status === 'CONTACTED' || msg.request.status === 'DONE';
      feed.push({
        id: `vendor-msg-${msg.id}`,
        body: confirmed
          ? `${category} ${vendor.name} підтвердив(ла) бронювання на ${eventLabel}`
          : `${category} ${vendor.name} відповів(ла) на заявку`,
        href: '/requests',
        createdAt: msg.createdAt.toISOString(),
        isNew: msg.createdAt >= weekAgo,
      });
    }

    const waiting = await this.prisma.request.findMany({
      where: { userId, status: 'NEW' },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        vendor: { select: { name: true } },
      },
    });
    for (const req of waiting) {
      feed.push({
        id: `waiting-${req.id}`,
        body: `Заявка до ${req.vendor.name} очікує відповіді`,
        href: '/requests',
        createdAt: req.createdAt.toISOString(),
        isNew: req.createdAt >= weekAgo,
      });
    }

    feed.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return feed.slice(0, 12);
  }

  async notifyUser(userId: string, payload: NotifyPayload) {
    const [pushResult, emailResult] = await Promise.all([
      this.sendPush(userId, payload),
      this.sendEmail(userId, payload),
    ]);
    return { sent: pushResult.sent, emailed: emailResult.emailed };
  }

  async notifyWeddingMembers(
    weddingId: string,
    payload: NotifyPayload,
    excludeUserId?: string,
  ) {
    const wedding = await this.prisma.wedding.findUnique({
      where: { id: weddingId },
      select: {
        userId: true,
        members: { select: { userId: true } },
      },
    });
    if (!wedding) return { sent: 0, emailed: 0 };

    const ids = new Set<string>([
      wedding.userId,
      ...wedding.members.map((m) => m.userId),
    ]);
    if (excludeUserId) ids.delete(excludeUserId);

    let sent = 0;
    let emailed = 0;
    for (const id of ids) {
      const res = await this.notifyUser(id, payload);
      sent += res.sent;
      emailed += res.emailed;
    }
    return { sent, emailed };
  }

  async sendDueTaskReminders() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 2);

    type Row = {
      id: string;
      title: string;
      due_date: Date;
      wedding_id: string;
    };

    const tasks = await this.prisma.$queryRaw<Row[]>`
      SELECT id, title, due_date, wedding_id
      FROM tasks
      WHERE status <> 'DONE'
        AND due_date IS NOT NULL
        AND due_date >= ${start}
        AND due_date < ${end}
        AND (due_reminded_at IS NULL OR due_reminded_at < ${start})
      LIMIT 200
    `;

    let sent = 0;
    const dayMs = 24 * 60 * 60 * 1000;
    for (const task of tasks) {
      const due = new Date(task.due_date);
      const dueDay = due.toLocaleDateString('uk-UA');
      const isToday = due >= start && due < new Date(start.getTime() + dayMs);
      const res = await this.notifyWeddingMembers(task.wedding_id, {
        title: isToday ? 'Дедлайн сьогодні' : 'Дедлайн завтра',
        body: `${task.title} · до ${dueDay}`,
        data: { type: 'task_due', taskId: task.id },
        email: {
          ctaLabel: 'Відкрити чекліст',
          ctaPath: '/checklist',
        },
      });
      sent += res.sent;
      await this.prisma.$executeRaw`
        UPDATE tasks SET due_reminded_at = ${new Date()} WHERE id = ${task.id}
      `;
    }

    if (tasks.length) {
      this.logger.log(`Due reminders: ${tasks.length} tasks, ${sent} pushes`);
    }
    return { tasks: tasks.length, sent };
  }

  private async sendPush(userId: string, payload: NotifyPayload) {
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

  private async sendEmail(userId: string, payload: NotifyPayload) {
    const shouldSend =
      Boolean(process.env.SMTP_HOST?.trim()) || process.env.EMAIL_LOG === '1';
    if (!shouldSend) return { emailed: 0 };

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });
    if (!user?.email) return { emailed: 0 };

    const subject = payload.email?.subject || payload.title;
    const body = payload.email?.body || payload.body;
    const ctaPath = payload.email?.ctaPath;
    const ctaUrl = ctaPath
      ? `${this.email.webUrl}${ctaPath.startsWith('/') ? '' : '/'}${ctaPath}`
      : undefined;
    const rendered = this.email.renderSimple({
      title: subject,
      body,
      ctaLabel: payload.email?.ctaLabel,
      ctaUrl,
    });

    const result = await this.email.send({
      to: user.email,
      subject,
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
