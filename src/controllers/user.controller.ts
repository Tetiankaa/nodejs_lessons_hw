import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

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

  public async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = req.res.locals.jwtPayload;
      await userService.deleteMe(_id);
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

  public async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = req.res.locals.jwtPayload as IJwtPayload;
      const avatar = req.files?.avatar as UploadedFile;
      const user = await userService.uploadAvatar(_id, avatar);
      const response = UserMapper.toPrivateResponse(user);
      res.status(statusCode.CREATED).json(response);
      next();
    } catch (e) {
      next(e);
    }
  }

  public async deleteAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = req.res.locals.jwtPayload as IJwtPayload;
      await userService.deleteAvatar(_id);
      res.status(statusCode.OK).json("Avatar deleted successfully");
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
