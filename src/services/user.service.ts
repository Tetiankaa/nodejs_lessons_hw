import { UploadedFile } from "express-fileupload";

import { config } from "../configs/config";
import { ErrorMessages } from "../constants/error-messages.constants";
import { statusCode } from "../constants/status-code.constants";
import { EEmailType } from "../enums/email-type.enum";
import { EFileItemType } from "../enums/file-item-type.enum";
import { ApiError } from "../errors/api-error";
import {
  IPublicUserListResponse,
  IUser,
  IUserQuery,
} from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { s3Service } from "./s3.service";
import { sendGridService } from "./send-grid.service";

class UserService {
  public async getList(query: IUserQuery): Promise<IPublicUserListResponse> {
    return await userRepository.getAll(query);
  }
  public async getById(id: string): Promise<IUser> {
    return await this.getUserById(id);
  }
  public async getMe(id: string): Promise<IUser> {
    return await this.getUserById(id);
  }
  public async deleteMe(id: string): Promise<void> {
    const user = await this.getUserById(id);
    await tokenRepository.deleteOne({ _userId: id });
    await userRepository.updateById(id, { isDeleted: true });
    await sendGridService.sendByEmailType(
      user.email,
      EEmailType.DELETE_ACCOUNT,
      {
        frontUrl: config.FRONT_URL,
        actionToken: "actionToken",
      },
    );
    // await smsPrepareService.deleteAccount(user.phone, { name: user.name });
    return;
  }
  public async updateMe(id: string, dto: Partial<IUser>): Promise<IUser> {
    await this.getUserById(id);
    return await userRepository.updateById(id, dto);
  }
  public async uploadAvatar(
    userId: string,
    avatar: UploadedFile,
  ): Promise<IUser> {
    const user = await this.getUserById(userId);
    const filePath = await s3Service.uploadFile(
      avatar,
      EFileItemType.USER,
      user._id,
    );
    return await userRepository.updateById(user._id, { avatar: filePath });
  }
  private async getUserById(id: string): Promise<IUser> {
    const user = await userRepository.getById(id);
    if (!user) {
      throw new ApiError(statusCode.NOT_FOUND, ErrorMessages.USER_NOT_FOUND);
    }
    return user;
  }
}

export const userService = new UserService();
