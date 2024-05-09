import { NextFunction, Request, Response } from "express";

import { ErrorMessages } from "../constants/error-messages.constants";
import { statusCode } from "../constants/status-code.constants";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { ETokenType } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { ITokenPair } from "../interfaces/token.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const access = req.get("Authorization");
      if (!access) {
        throw new ApiError(
          statusCode.UNAUTHORIZED,
          ErrorMessages.NO_TOKEN_PROVIDED,
        );
      }
      const payload = tokenService.verifyToken(access, ETokenType.ACCESS);
      const tokenPair = await tokenRepository.findByParams({
        accessToken: access,
      });
      if (!tokenPair) {
        throw new ApiError(
          statusCode.UNAUTHORIZED,
          ErrorMessages.INVALID_TOKEN,
        );
      }
      req.res.locals.jwtPayload = payload;
      next();
    } catch (e) {
      next(e);
    }
  }
  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const token = req.body as ITokenPair;
      if (!token) {
        throw new ApiError(
          statusCode.UNAUTHORIZED,
          ErrorMessages.NO_TOKEN_PROVIDED,
        );
      }
      tokenService.verifyToken(token.refreshToken, ETokenType.REFRESH);

      next();
    } catch (e) {
      next(e);
    }
  }
  public async checkActionToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const actionToken = req.query.actionToken as string;

      if (!actionToken) {
        throw new ApiError(
          statusCode.BAD_REQUEST,
          ErrorMessages.NO_TOKEN_PROVIDED,
        );
      }
      const entity = await actionTokenRepository.findByParams({ actionToken });
      if (!entity) {
        throw new ApiError(
          statusCode.UNAUTHORIZED,
          ErrorMessages.INVALID_TOKEN,
        );
      }
      let type: ActionTokenTypeEnum;

      switch (entity.tokenType) {
        case ActionTokenTypeEnum.FORGOT:
          type = ActionTokenTypeEnum.FORGOT;
          break;
        case ActionTokenTypeEnum.VERIFY:
          type = ActionTokenTypeEnum.VERIFY;
          break;
      }
      req.res.locals.actionTokenPayload = tokenService.verifyActionToken(
        actionToken,
        type,
      );

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
