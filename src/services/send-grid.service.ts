import { MailDataRequired } from "@sendgrid/helpers/classes/mail";
import SendGrid from "@sendgrid/mail";

import { config } from "../configs/config";
import { emailTemplateConstants } from "../constants/email-template.constants";
import { EEmailType } from "../enums/email-type.enum";
import { EmailTypeToPayloadType } from "../types/email-type-to-payload.type";

class SendGridService {
  constructor() {
    SendGrid.setApiKey(config.SENDGRID_API_KEY);
  }
  public async sendByEmailType<T extends EEmailType>(
    recipient: string,
    emailType: T,
    dynamicTemplateData: EmailTypeToPayloadType[T],
  ): Promise<void> {
    try {
      const templateId = emailTemplateConstants[emailType].templateId;

      await this.send({
        templateId,
        to: recipient,
        dynamicTemplateData,
        from: config.SENDGRID_FROM_EMAIL,
      });
    } catch (e) {
      console.error(e);
    }
  }

  private async send(email: MailDataRequired): Promise<void> {
    try {
      await SendGrid.send(email);
    } catch (e) {
      console.error(e);
    }
  }
}

export const sendGridService = new SendGridService();
