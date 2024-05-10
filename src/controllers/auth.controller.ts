import { NextFunction, Request, Response } from "express";

import { statusCode } from "../constants/status-code.constants";
import { IForgot, ISetForgot } from "../interfaces/action-token.interface";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { AuthMapper } from "../mappers/auth.mapper";
import { authService } from "../services/auth.service";
import {IChangePassword} from "../interfaces/user.interface";

class AuthController {
  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await authService.signUp(req.body);
      const response = AuthMapper.toResponseDto({
        user: newUser.user,
        tokens: newUser.tokens,
      });
      res.status(statusCode.CREATED).json(response);
    } catch (e) {
      next(e);
    }
  }
  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.signIn(req.body);
      const response = AuthMapper.toResponseDto({
        user: user.user,
        tokens: user.tokens,
      });
      res.status(statusCode.CREATED).json(response);
    } catch (e) {
      next(e);
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = await authService.refresh(req.body);

      res.status(statusCode.CREATED).json(token);
    } catch (e) {
      next(e);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as IForgot;
      await authService.forgotPassword(body);
      res.sendStatus(statusCode.NO_CONTENT);
    } catch (e) {
      next(e);
    }
  }

  public async setForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const body = req.body as ISetForgot;
      const { _id } = req.res.locals.actionTokenPayload as IJwtPayload;
      await authService.setForgotPassword(body, _id);
      res.sendStatus(statusCode.CREATED);
    } catch (e) {
      next(e);
    }
  }

  public async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = req.res.locals.actionTokenPayload as IJwtPayload;
      await authService.verify(_id);
      res.sendStatus(statusCode.NO_CONTENT);
    } catch (e) {
      next(e);
    }
  }
  public async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJwtPayload;
      const body = req.body as IChangePassword;
      await authService.changePassword(jwtPayload, body);
      res.sendStatus(statusCode.NO_CONTENT);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
