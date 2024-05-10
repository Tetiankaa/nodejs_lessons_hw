import { RoleEnum } from "../enums/role.enum";

export interface IJwtPayload {
  _id: string;
  role: RoleEnum;
}
