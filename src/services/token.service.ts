import * as jsonwebtoken from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

import { config } from "../configs/config";
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

  public verifyAccessToken(token: string): IJwtPayload {
    try {
      return jsonwebtoken.verify(
        token,
        config.JWT_ACCESS_SECRET,
      ) as IJwtPayload;
    } catch (e) {
      throw new ApiError(401, "Token is not valid");
    }
  }

  public verifyRefreshToken(token: string): JwtPayload {
    try {
      return jsonwebtoken.verify(
        token,
        config.JWT_REFRESH_SECRET,
      ) as IJwtPayload;
    } catch (e) {
      throw new ApiError(401, "Token is not valid");
    }
  }
}

export const tokenService = new TokenService();
