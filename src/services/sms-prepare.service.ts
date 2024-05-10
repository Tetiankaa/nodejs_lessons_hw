import { smsTemplateConstants } from "../constants/sms-template.constants";
import { SmsTypeEnum } from "../enums/sms-type.enum";
import { smsService } from "./sms.service";

class SmsPrepareService {
  public async register(phone: string, data: { name: string }): Promise<void> {
    const message = smsTemplateConstants[SmsTypeEnum.WELCOME](data.name);
    await smsService.sendSms(phone, message);
  }

  public async deleteAccount(
    phone: string,
    data: { name: string },
  ): Promise<void> {
    const message = smsTemplateConstants[SmsTypeEnum.DELETE_ACCOUNT](data.name);

    await smsService.sendSms(phone, message);
  }
}

export const smsPrepareService = new SmsPrepareService();
