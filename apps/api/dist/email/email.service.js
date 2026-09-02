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
        const html = `
<!DOCTYPE html>
<html lang="uk">
<body style="margin:0;padding:24px;background:#f6f4ef;font-family:Georgia,serif;color:#1f1f1f;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e6e1d8;padding:28px 24px;">
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#6f8f7c;">fata.studio</p>
    <h1 style="margin:0 0 16px;font-size:28px;font-weight:400;line-height:1.2;">${escapeHtml(opts.title)}</h1>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#4a4a4a;white-space:pre-wrap;">${escapeHtml(opts.body)}</p>
    ${opts.ctaUrl
            ? `<p style="margin:0 0 8px;"><a href="${escapeAttr(opts.ctaUrl)}" style="display:inline-block;background:#6f8f7c;color:#fff;text-decoration:none;padding:12px 18px;font-size:14px;">${escapeHtml(opts.ctaLabel || 'Відкрити')}</a></p>`
            : ''}
    <p style="margin:28px 0 0;font-size:12px;color:#9a9a9a;">Лист надіслано автоматично з fata.studio.</p>
  </div>
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