import { NextFunction, Request, Response } from "express";

import { ErrorMessages } from "../constants/error-messages.constants";
import { statusCode } from "../constants/status-code.constants";
import { ETokenType } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { ITokenPair } from "../interfaces/token.interface";
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
      req.res.locals.accessToken = tokenPair.accessToken;
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
}

export const authMiddleware = new AuthMiddleware();
