import { EEmailType } from "../enums/email-type.enum";
import { EmailCombinedPayloadType } from "./email-combined-payload.type";
import { PickRequiredType } from "./pick-required.type";

export type EmailTypeToPayloadType = {
  [EEmailType.WELCOME]: PickRequiredType<
    EmailCombinedPayloadType,
    "frontUrl" | "name" | "actionToken"
  >;
  [EEmailType.DELETE_ACCOUNT]: PickRequiredType<
    EmailCombinedPayloadType,
    "frontUrl" | "actionToken"
  >;
  [EEmailType.FORGOT_PASSWORD]: PickRequiredType<
    EmailCombinedPayloadType,
    "frontUrl" | "name" | "actionToken" | "email"
  >;
  [EEmailType.INACTIVE_USER]: PickRequiredType<EmailCombinedPayloadType, "name">
};
