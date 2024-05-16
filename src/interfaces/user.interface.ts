import { RoleEnum } from "../enums/role.enum";
import {EOrder} from "../enums/order.enum";
import {EUserListOrderBy} from "../enums/UserListOrderEnum";

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
export interface IUserQuery {
  page?: string;
  limit?: string;
  search?: string;
  order?: EOrder;
  orderBy?: EUserListOrderBy;
  [key: string]: string | number;
}
export interface IPublicUserListResponse {
  data: IPublicUser[];
  total: number;
  page: string | number;
  limit: string | number;
  search: string;
  order: EOrder;
  orderBy: EUserListOrderBy;
}
