import { EEmailType } from "../enums/email-type.enum";

export const emailTemplateConstants = {
  [EEmailType.WELCOME]: {
    templateId: "d-8aa646a131d94f68bd8e6d5250725564",
  },
  [EEmailType.FORGOT_PASSWORD]: {
    templateId: "d-1f11723ac6df45ef80633478867574a9",
  },
  [EEmailType.DELETE_ACCOUNT]: {
    templateId: "d-43e35d4704134fbf9fa9ce03e75b80cc",
  },
};
