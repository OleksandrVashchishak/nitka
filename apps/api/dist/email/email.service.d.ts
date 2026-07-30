export type SendEmailInput = {
    to: string;
    subject: string;
    text: string;
    html?: string;
};
export declare class EmailService {
    private readonly logger;
    private transporter;
    constructor();
    get enabled(): boolean;
    get webUrl(): string;
    get from(): string;
    send(input: SendEmailInput): Promise<{
        sent: boolean;
        dryRun: true;
    } | {
        sent: true;
        dryRun: false;
    } | {
        sent: false;
        dryRun: false;
    }>;
    renderSimple(opts: {
        title: string;
        body: string;
        ctaLabel?: string;
        ctaUrl?: string;
    }): {
        text: string;
        html: string;
    };
}
