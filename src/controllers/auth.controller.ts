import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";

class AuthController {
  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await authService.signUp(req.body);

      res.status(201).json(newUser);
    } catch (e) {
      next(e);
    }
  }
  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.signIn(req.body);

      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = await authService.refresh(req.body);

      res.status(201).json(token);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
