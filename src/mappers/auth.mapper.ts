import { ITokenResponse } from "../interfaces/token.interface";
import { IPrivateUser, IUser } from "../interfaces/user.interface";
import { UserMapper } from "./user.mapper";

export class AuthMapper {
  public static toResponseDto(data: { user: IUser; tokens: ITokenResponse }): {
    user: IPrivateUser;
    tokens: ITokenResponse;
  } {
    return {
      user: UserMapper.toPrivateResponse(data.user),
      tokens: data.tokens,
    };
  }
}
