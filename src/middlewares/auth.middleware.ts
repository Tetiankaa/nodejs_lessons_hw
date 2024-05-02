import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api-error";
import { ITokenPair } from "../interfaces/token.interface";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";
import { ETokenType } from "../enums/token-type.enum";

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const access = req.get("Authorization");
      if (!access) {
        throw new ApiError(401, "No token provided");
      }
      const payload = tokenService.verifyToken(access, ETokenType.ACCESS);
      const tokenPair = await tokenRepository.findByParams({
        accessToken: access,
      });
      console.log(tokenPair);
      if (!tokenPair) {
        throw new ApiError(401, "Invalid token");
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
        throw new ApiError(401, "No token provided");
      }
      tokenService.verifyToken(token.refreshToken, ETokenType.REFRESH);

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
