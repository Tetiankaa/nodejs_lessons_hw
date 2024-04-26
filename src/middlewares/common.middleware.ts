import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/api-error";
class CommonMiddleware {
  public isValidId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!isObjectIdOrHexString(id)) {
        throw new ApiError(404, "Invalid id");
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  public isBodyValid(validator: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const { error } = validator.validate(req.body);
        if (error) {
          throw new ApiError(400, error.details[0].message);
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();
