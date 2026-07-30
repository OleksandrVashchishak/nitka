import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';

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
