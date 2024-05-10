import { config } from "../configs/config";
import { ErrorMessages } from "../constants/error-messages.constants";
import { statusCode } from "../constants/status-code.constants";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EEmailType } from "../enums/email-type.enum";
import { ApiError } from "../errors/api-error";
import { IForgot, ISetForgot } from "../interfaces/action-token.interface";
import { IAuth } from "../interfaces/auth.interface";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { ITokenPair, ITokenResponse } from "../interfaces/token.interface";
import { IChangePassword, IUser } from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { sendGridService } from "./send-grid.service";
import { tokenService } from "./token.service";

class AuthService {
  public async signUp(
    dto: Partial<IUser>,
  ): Promise<{ tokens: ITokenResponse; user: IUser }> {
    await this.isEmailExist(dto.email);
    const hashedPassword = await passwordService.hashPassword(dto.password);
    const newUser = await userRepository.create({
      ...dto,
      password: hashedPassword,
    });
    const tokens = tokenService.generateTokenPair({
      _id: newUser._id,
      role: newUser.role,
    });
    await tokenRepository.create({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _userId: newUser._id,
    });
    const actionToken = tokenService.generateActionToken(
      { _id: newUser._id, role: newUser.role },
      ActionTokenTypeEnum.VERIFY,
    );
    await actionTokenRepository.create({
      actionToken,
      _userId: newUser._id,
      tokenType: ActionTokenTypeEnum.VERIFY,
    });
    await sendGridService.sendByEmailType(dto.email, EEmailType.WELCOME, {
      name: dto.name,
      frontUrl: config.FRONT_URL,
      actionToken,
    });
    // await smsPrepareService.register(dto.phone, { name: dto.name });
    return {
      tokens,
      user: newUser,
    };
  }
  public async signIn(
    dto: Partial<IAuth>,
  ): Promise<{ tokens: ITokenResponse; user: IUser }> {
    const user = await userRepository.findByEmail(dto.email);
    if (!user) {
      throw new ApiError(
        statusCode.UNAUTHORIZED,
        ErrorMessages.WRONG_EMAIL_OR_PASSWORD,
      );
    }
    const isEqual = await passwordService.comparePasswords(
      dto.password,
      user.password,
    );
    if (!isEqual) {
      throw new ApiError(
        statusCode.UNAUTHORIZED,
        ErrorMessages.WRONG_EMAIL_OR_PASSWORD,
      );
    }
    const tokens = tokenService.generateTokenPair({
      _id: user._id,
      role: user.role,
    });

    await tokenRepository.create({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _userId: user._id,
    });
    return {
      tokens,
      user,
    };
  }

  public async refresh(refresh: Partial<ITokenPair>): Promise<ITokenResponse> {
    const tokenPair = await tokenRepository.findByParams({
      refreshToken: refresh.refreshToken,
    });
    if (!tokenPair) {
      throw new ApiError(
        statusCode.FORBIDDEN,
        ErrorMessages.INVALID_REFRESH_TOKEN,
      );
    }
    const user = await userRepository.getById(tokenPair._userId);

    const tokens = tokenService.generateTokenPair({
      _id: user._id,
      role: user.role,
    });

    await tokenRepository.findAndUpdate(
      { refreshToken: refresh.refreshToken },
      { refreshToken: tokens.refreshToken, accessToken: tokens.accessToken },
    );
    return tokens;
  }
  public async forgotPassword(dto: IForgot): Promise<void> {
    const user = await userRepository.findByEmail(dto.email);
    if (!user) return;
    const actionToken = tokenService.generateActionToken(
      { _id: user._id, role: user.role },
      ActionTokenTypeEnum.FORGOT,
    );
    await actionTokenRepository.create({
      actionToken,
      _userId: user._id,
      tokenType: ActionTokenTypeEnum.FORGOT,
    });
    await sendGridService.sendByEmailType(
      dto.email,
      EEmailType.FORGOT_PASSWORD,
      {
        email: dto.email,
        actionToken,
        name: user.name,
        frontUrl: config.FRONT_URL,
      },
    );
  }
  public async setForgotPassword(
    newPassword: ISetForgot,
    userId: string,
  ): Promise<void> {
    const user = await userRepository.getById(userId);
    const hashedPassword = await passwordService.hashPassword(
      newPassword.password,
    );
    await userRepository.updateById(user._id, { password: hashedPassword });
    await actionTokenRepository.deleteByParams({
      _userId: userId,
      tokenType: ActionTokenTypeEnum.FORGOT,
    });
    await tokenRepository.deleteManyByParams({ _userId: userId });
  }

  public async verify(userId: string): Promise<void> {
    const user = await userRepository.getById(userId);
    await userRepository.updateById(user._id, { isVerified: true });
    await actionTokenRepository.deleteByParams({
      tokenType: ActionTokenTypeEnum.VERIFY,
    });
  }

  public async changePassword(
    jwtPayload: IJwtPayload,
    dto: IChangePassword,
  ): Promise<void> {
    const user = await userRepository.getById(jwtPayload._id);
    const isMatched = passwordService.comparePasswords(
      dto.oldPassword,
      user.password,
    );
    if (!isMatched) {
      throw new ApiError(
        statusCode.BAD_REQUEST,
        ErrorMessages.WRONG_OLD_PASSWORD,
      );
    }
    const hashedNewPassword = await passwordService.hashPassword(
      dto.newPassword,
    );
    await userRepository.updateById(user._id, { password: hashedNewPassword });
    await tokenRepository.deleteManyByParams({ _userId: user._id });
  }
  private async isEmailExist(email: string): Promise<void> {
    const user = await userRepository.findByParams({ email, isDeleted: false });
    if (user) {
      throw new ApiError(
        statusCode.BAD_REQUEST,
        ErrorMessages.EMAIL_ALREADY_EXISTS,
      );
    }
  }
}

export const authService = new AuthService();
