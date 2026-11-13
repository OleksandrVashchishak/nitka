"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer_1 = __importDefault(require("nodemailer"));
let EmailService = EmailService_1 = class EmailService {
    constructor() {
        this.logger = new common_1.Logger(EmailService_1.name);
        this.transporter = null;
        const host = process.env.SMTP_HOST?.trim();
        if (!host)
            return;
        this.transporter = nodemailer_1.default.createTransport({
            host,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === '1' || process.env.SMTP_SECURE === 'true',
            auth: process.env.SMTP_USER && process.env.SMTP_PASS
                ? {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                }
                : undefined,
        });
    }
    get canSend() {
        return Boolean(this.transporter);
    }
    get enabled() {
        return Boolean(this.transporter) || process.env.EMAIL_LOG === '1';
    }
    get webUrl() {
        return (process.env.WEB_APP_URL?.replace(/\/$/, '') ||
            process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
            'http://localhost:3000');
    }
    get from() {
        return (process.env.EMAIL_FROM?.trim() ||
            process.env.SMTP_FROM?.trim() ||
            'fata.studio <noreply@fata.studio.local>');
    }
    async send(input) {
        const payload = {
            from: this.from,
            to: input.to,
            subject: input.subject,
            text: input.text,
            html: input.html || undefined,
        };
        if (!this.transporter) {
            this.logger.log(`[email:dry-run] to=${input.to} subject=${input.subject}\n${input.text}`);
            return { sent: false, dryRun: true };
        }
        try {
            await this.transporter.sendMail(payload);
            return { sent: true, dryRun: false };
        }
        catch (err) {
            this.logger.warn(`Email failed: ${err instanceof Error ? err.message : String(err)}`);
            return { sent: false, dryRun: false };
        }
    }
    renderSimple(opts) {
        const lines = [opts.title, '', opts.body];
        if (opts.ctaUrl) {
            lines.push('', opts.ctaLabel || 'Відкрити', opts.ctaUrl);
        }
        lines.push('', '— fata.studio');
        const text = lines.join('\n');
        const sans = "Montserrat,'Helvetica Neue',Helvetica,Arial,sans-serif";
        const site = escapeAttr(this.webUrl);
        const cta = opts.ctaUrl
            ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px;">
          <tr><td style="border-radius:40px;background:#61040f;">
            <a href="${escapeAttr(opts.ctaUrl)}" style="display:inline-block;padding:15px 32px;border-radius:40px;font-family:${sans};font-size:15px;font-weight:600;font-style:italic;line-height:1;color:#ffffff;text-decoration:none;">${escapeHtml(opts.ctaLabel || 'Відкрити')}</a>
          </td></tr>
        </table>
        <p style="margin:16px 0 0;font-family:${sans};font-size:12px;line-height:1.5;color:#7f7e7c;">Якщо кнопка не працює, скопіюйте посилання:<br><a href="${escapeAttr(opts.ctaUrl)}" style="color:#61040f;word-break:break-all;">${escapeHtml(opts.ctaUrl)}</a></p>`
            : '';
        const html = `
<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:#f3f3f3;-webkit-text-size-adjust:100%;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f3f3;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
      <tr><td style="background:#1a1a1a;border-radius:16px 16px 0 0;padding:20px 32px;">
        <a href="${site}" style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-style:italic;line-height:1;color:#f0febb;text-decoration:none;">fata</a>
      </td></tr>
      <tr><td style="background:#ffffff;border-radius:0 0 16px 16px;padding:36px 32px 32px;box-shadow:0 2px 28px rgba(0,0,0,0.06);">
        <h1 style="margin:0 0 16px;font-family:${sans};font-size:24px;font-weight:700;line-height:1.25;color:#1a1a1a;">${escapeHtml(opts.title)}</h1>
        <p style="margin:0 0 28px;font-family:${sans};font-size:15px;font-weight:400;line-height:1.6;color:#333333;white-space:pre-wrap;">${escapeHtml(opts.body)}</p>
        ${cta}
      </td></tr>
      <tr><td style="padding:20px 32px 0;text-align:center;font-family:${sans};font-size:12px;line-height:1.5;color:#7f7e7c;">
        Лист надіслано автоматично з <a href="${site}" style="color:#7f7e7c;text-decoration:underline;">fata.studio</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`.trim();
        return { text, html };
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, '&#39;');
}
//# sourceMappingURL=email.service.js.map