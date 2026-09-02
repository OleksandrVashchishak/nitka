import { Injectable, Logger } from '@nestjs/common';
import nodemailer, { type Transporter } from 'nodemailer';

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;

  constructor() {
    const host = process.env.SMTP_HOST?.trim();
    if (!host) return;

    this.transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === '1' || process.env.SMTP_SECURE === 'true',
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          : undefined,
    });
  }

  get enabled() {
    return Boolean(this.transporter) || process.env.EMAIL_LOG === '1';
  }

  get webUrl() {
    return (
      process.env.WEB_APP_URL?.replace(/\/$/, '') ||
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
      'http://localhost:3000'
    );
  }

  get from() {
    return (
      process.env.EMAIL_FROM?.trim() ||
      process.env.SMTP_FROM?.trim() ||
      'fata.studio <noreply@fata.studio.local>'
    );
  }

  async send(input: SendEmailInput) {
    const payload = {
      from: this.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html || undefined,
    };

    if (!this.transporter) {
      this.logger.log(
        `[email:dry-run] to=${input.to} subject=${input.subject}\n${input.text}`,
      );
      return { sent: false, dryRun: true as const };
    }

    try {
      await this.transporter.sendMail(payload);
      return { sent: true as const, dryRun: false as const };
    } catch (err) {
      this.logger.warn(
        `Email failed: ${err instanceof Error ? err.message : String(err)}`,
      );
      return { sent: false as const, dryRun: false as const };
    }
  }

  renderSimple(opts: {
    title: string;
    body: string;
    ctaLabel?: string;
    ctaUrl?: string;
  }) {
    const lines = [opts.title, '', opts.body];
    if (opts.ctaUrl) {
      lines.push('', opts.ctaLabel || 'Відкрити', opts.ctaUrl);
    }
    lines.push('', '— fata.studio');

    const text = lines.join('\n');
    const html = `
<!DOCTYPE html>
<html lang="uk">
<body style="margin:0;padding:24px;background:#f6f4ef;font-family:Georgia,serif;color:#1f1f1f;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e6e1d8;padding:28px 24px;">
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#6f8f7c;">fata.studio</p>
    <h1 style="margin:0 0 16px;font-size:28px;font-weight:400;line-height:1.2;">${escapeHtml(opts.title)}</h1>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#4a4a4a;white-space:pre-wrap;">${escapeHtml(opts.body)}</p>
    ${
      opts.ctaUrl
        ? `<p style="margin:0 0 8px;"><a href="${escapeAttr(opts.ctaUrl)}" style="display:inline-block;background:#6f8f7c;color:#fff;text-decoration:none;padding:12px 18px;font-size:14px;">${escapeHtml(opts.ctaLabel || 'Відкрити')}</a></p>`
        : ''
    }
    <p style="margin:28px 0 0;font-size:12px;color:#9a9a9a;">Лист надіслано автоматично з fata.studio.</p>
  </div>
</body>
</html>`.trim();

    return { text, html };
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(value: string) {
  return escapeHtml(value).replace(/'/g, '&#39;');
}
