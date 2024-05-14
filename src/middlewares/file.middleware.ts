import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { avatarConfig } from "../configs/file.config";
import { ErrorMessages } from "../constants/error-messages.constants";
import { statusCode } from "../constants/status-code.constants";
import { ApiError } from "../errors/api-error";

class FileMiddleware {
  public async isAvatarValid(req: Request, res: Response, next: NextFunction) {
    try {
      const avatar = req.files?.avatar as UploadedFile;
      if (!avatar) {
        throw new ApiError(
          statusCode.BAD_REQUEST,
          ErrorMessages.AVATAR_NOT_PROVIDED,
        );
      }

      if (Array.isArray(avatar)) {
        throw new ApiError(
          statusCode.BAD_REQUEST,
          ErrorMessages.UPLOAD_SINGLE_FILE,
        );
      }

      if (!avatarConfig.MIMETYPES.includes(avatar.mimetype)) {
        throw new ApiError(
          statusCode.BAD_REQUEST,
          ErrorMessages.INVALID_FILE_FORMAT,
        );
      }
      if (avatar.size > avatarConfig.MAX_SIZE) {
        throw new ApiError(
          statusCode.BAD_REQUEST,
          ErrorMessages.FILE_TOO_LARGE,
        );
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const fileMiddleware = new FileMiddleware();
