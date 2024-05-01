import { RoleEnum } from "../enums/role.enum";

export interface IUser {
  _id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  isDeleted?: boolean;
  isVerified?: boolean;
  role?: RoleEnum;
}
