import * as jsonwebtoken from "jsonwebtoken";

import { config } from "../configs/config";
import { ErrorMessages } from "../constants/error-messages.constants";
import { statusCode } from "../constants/status-code.constants";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
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
          throw new ApiError(
            statusCode.UNAUTHORIZED,
            ErrorMessages.INVALID_TOKEN_TYPE,
          );
      }
      return jsonwebtoken.verify(token, secret) as IJwtPayload;
    } catch (e) {
      throw new ApiError(statusCode.UNAUTHORIZED, ErrorMessages.INVALID_TOKEN);
    }
  }
  public generateActionToken(
    payload: IJwtPayload,
    type: ActionTokenTypeEnum,
  ): string {
    try {
      let secret: string;
      let expiresIn: string;

      switch (type) {
        case ActionTokenTypeEnum.FORGOT:
          secret = config.JWT_ACTION_FORGOT_PASSWORD_SECRET;
          expiresIn = config.JWT_ACTION_FORGOT_PASSWORD_EXPIRES_IN;
          break;
        case ActionTokenTypeEnum.VERIFY:
          secret = config.JWT_ACTION_VERIFY_SECRET;
          expiresIn = config.JWT_ACTION_VERIFY_EXPIRES_IN;
          break;
        default:
          throw new ApiError(
            statusCode.UNAUTHORIZED,
            ErrorMessages.INVALID_TOKEN_TYPE,
          );
      }
      return jsonwebtoken.sign(payload, secret, { expiresIn });
    } catch (e) {
      throw new ApiError(statusCode.UNAUTHORIZED, ErrorMessages.INVALID_TOKEN);
    }
  }

  public verifyActionToken(
    actionToken: string,
    type: ActionTokenTypeEnum,
  ): IJwtPayload {
    try {
      let secret: string;
      switch (type) {
        case ActionTokenTypeEnum.FORGOT:
          secret = config.JWT_ACTION_FORGOT_PASSWORD_SECRET;
          break;
        case ActionTokenTypeEnum.VERIFY:
          secret = config.JWT_ACTION_VERIFY_SECRET;
          break;
        default:
          throw new ApiError(
            statusCode.BAD_REQUEST,
            ErrorMessages.INVALID_TOKEN_TYPE,
          );
      }
      return jsonwebtoken.verify(actionToken, secret) as IJwtPayload;
    } catch (e) {
      throw new ApiError(statusCode.BAD_REQUEST, ErrorMessages.INVALID_TOKEN);
    }
  }
}

export const tokenService = new TokenService();
