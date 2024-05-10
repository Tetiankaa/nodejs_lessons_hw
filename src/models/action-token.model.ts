import { Schema, Types } from "mongoose";
import * as mongoose from "mongoose";

import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { IActionToken } from "../interfaces/action-token.interface";

const actionTokenSchema = new Schema(
  {
    _userId: { type: Types.ObjectId, required: true },
    actionToken: { required: true, type: String },
    tokenType: { required: true, type: String, enum: ActionTokenTypeEnum },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const ActionToken = mongoose.model<IActionToken>(
  "action_tokens",
  actionTokenSchema,
);
