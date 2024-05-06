import { NextFunction, Request, Response } from "express";

import { statusCode } from "../constants/status-code.constants";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { UserMapper } from "../mappers/user.mapper";
import { userService } from "../services/user.service";

class UserController {
  public async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getList();
      const usersResponse = UserMapper.toPublicResponseList(users);
      res.json(usersResponse);
    } catch (e) {
      next(e);
    }
  }

  public async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJwtPayload;
      const user = await userService.getMe(jwtPayload._id);
      const dto = UserMapper.toPrivateResponse(user);
      res.json(dto);
    } catch (e) {
      next(e);
    }
  }
  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const foundedUser = await userService.getById(userId);
      const dto = UserMapper.toPublicResponse(foundedUser);
      res.status(statusCode.OK).send(dto);
    } catch (e) {
      next(e);
    }
  }

  public async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const accessToken = req.res.locals.accessToken;
      await userService.deleteById(id, accessToken);
      res.status(statusCode.NO_CONTENT).json("User was successfully deleted");
    } catch (e) {
      next(e);
    }
  }

  public async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJwtPayload;
      const updatedUser = await userService.updateMe(jwtPayload._id, req.body);
      const dto = UserMapper.toPrivateResponse(updatedUser);
      res.status(statusCode.CREATED).json(dto);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
