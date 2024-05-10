import { Schema } from "mongoose";
import * as mongoose from "mongoose";

import { RoleEnum } from "../enums/role.enum";
import { IUser } from "../interfaces/user.interface";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    age: { type: Number, min: 0, max: 150 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: RoleEnum, default: RoleEnum.USER },
  },
  { timestamps: true, versionKey: false },
);

export const User = mongoose.model<IUser>("User", userSchema);
