import { SmsTypeEnum } from "../enums/sms-type.enum";

export const smsTemplateConstants = {
  [SmsTypeEnum.WELCOME]: (name: string) => `Welcome to our platform ${name}`,
  [SmsTypeEnum.DELETE_ACCOUNT]: (name: string) =>
    `Hello, ${name}! Your account was deleted`,
};
