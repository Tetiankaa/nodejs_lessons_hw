import { NextFunction, Request, Response } from "express";

import { userService } from "../services/user.service";

class UserController {
  public async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getList();

      res.json(users);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const foundedUser = await userService.getById(userId);

      res.status(200).send(foundedUser);
    } catch (e) {
      next(e);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await userService.create(req.body);

      res.status(201).json(newUser);
    } catch (e) {
      next(e);
    }
  }

  public async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await userService.deleteById(id);
      res.status(204).json("User was successfully deleted");
    } catch (e) {
      next(e);
    }
  }

  public async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const updatedUser = await userService.updateById(id, req.body);

      res.status(201).json(updatedUser);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
