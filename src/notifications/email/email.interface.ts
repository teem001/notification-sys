export interface EmailProvider {
  sendEmail(
    to: string,
    message: string,
    subject:string,
    isHtml?: boolean,
    attachments?: any[],
  ): Promise<void>;
}
