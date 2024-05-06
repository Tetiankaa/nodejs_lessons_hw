import { config } from "../configs/config";
import { ErrorMessages } from "../constants/error-messages.constants";
import { statusCode } from "../constants/status-code.constants";
import { EEmailType } from "../enums/email-type.enum";
import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { sendGridService } from "./send-grid.service";
import { smsPrepareService } from "./sms-prepare.service";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getAll();
  }
  public async getById(id: string): Promise<IUser> {
    return await this.getUserById(id);
  }
  public async getMe(id: string): Promise<IUser> {
    return await this.getUserById(id);
  }
  public async deleteById(id: string, accessToken: string): Promise<void> {
    const user = await this.getUserById(id);
    await tokenRepository.deleteOne({ accessToken });
    await userRepository.deleteById(id);
    await sendGridService.sendByEmailType(
      user.email,
      EEmailType.DELETE_ACCOUNT,
      {
        frontUrl: config.FRONT_URL,
        actionToken: "actionToken",
      },
    );
    await smsPrepareService.deleteAccount(user.phone, { name: user.name });
    return;
  }
  public async updateMe(id: string, dto: Partial<IUser>): Promise<IUser> {
    await this.getUserById(id);
    await this.getUserByEmail(dto.email);
    return await userRepository.updateById(id, dto);
  }
  private async getUserById(id: string): Promise<IUser> {
    const user = await userRepository.getById(id);
    if (!user) {
      throw new ApiError(statusCode.NOT_FOUND, ErrorMessages.USER_NOT_FOUND);
    }
    return user;
  }

  private async getUserByEmail(email: string): Promise<IUser> {
    const user = await userRepository.findByEmail(email);
    if (user) {
      throw new ApiError(
        statusCode.BAD_REQUEST,
        ErrorMessages.EMAIL_ALREADY_EXISTS,
      );
    }
    return user;
  }
}

export const userService = new UserService();
