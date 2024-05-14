import { RoleEnum } from "../enums/role.enum";

export interface IUser {
  _id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  phone: string;
  isDeleted?: boolean;
  isVerified?: boolean;
  role?: RoleEnum;
  avatar: string;
}

export interface IPublicUser {
  _id: string;
  name: string;
  age: number;
  email: string;
  isDeleted?: boolean;
  isVerified?: boolean;
  role?: RoleEnum;
  avatar: string;
}

export interface IPrivateUser {
  _id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  isDeleted?: boolean;
  isVerified?: boolean;
  role?: RoleEnum;
  avatar: string;
}
export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}
