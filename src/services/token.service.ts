import * as jsonwebtoken from "jsonwebtoken";

import { config } from "../configs/config";
import { ETokenType } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { ITokenResponse } from "../interfaces/token.interface";

class TokenService {
  public generateTokenPair(payload: IJwtPayload): ITokenResponse {
    const accessToken = jsonwebtoken.sign(payload, config.JWT_ACCESS_SECRET, {
      expiresIn: config.JWT_ACCESS_EXPIRES_IN,
    });
    const refreshToken = jsonwebtoken.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    });

    return {
      accessToken,
      refreshToken,
      refreshExpiresIn: config.JWT_REFRESH_EXPIRES_IN,
      accessExpiresIn: config.JWT_ACCESS_EXPIRES_IN,
    };
  }

  public verifyToken(token: string, type: ETokenType): IJwtPayload {
    try {
      let secret: string;
      switch (type) {
        case ETokenType.ACCESS:
          secret = config.JWT_ACCESS_SECRET;
          break;
        case ETokenType.REFRESH:
          secret = config.JWT_REFRESH_SECRET;
          break;
        default:
          throw new ApiError(401, "Invalid token type");
      }
      return jsonwebtoken.verify(token, secret) as IJwtPayload;
    } catch (e) {
      throw new ApiError(401, "Token is not valid");
    }
  }
}

export const tokenService = new TokenService();
