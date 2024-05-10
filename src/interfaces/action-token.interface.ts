import { IUser } from "./user.interface";

export interface IForgot extends Pick<IUser, "email"> {}
export interface ISetForgot extends Pick<IUser, "password"> {}
export interface IActionToken {
  _id: string;
  _userId: string;
  actionToken: string;
  tokenType: string;
}
