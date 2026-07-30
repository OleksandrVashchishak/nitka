declare module 'nodemailer' {
  export type Transporter = {
    sendMail: (mail: {
      from: string;
      to: string;
      subject: string;
      text?: string;
      html?: string;
    }) => Promise<unknown>;
  };

  export function createTransport(options: {
    host: string;
    port: number;
    secure?: boolean;
    auth?: { user: string; pass: string };
  }): Transporter;

  const nodemailer: {
    createTransport: typeof createTransport;
  };

  export default nodemailer;
}
