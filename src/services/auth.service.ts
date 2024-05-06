import { ErrorMessages } from "../constants/error-messages.constants";
import { statusCode } from "../constants/status-code.constants";
import { ApiError } from "../errors/api-error";
import { IAuth } from "../interfaces/auth.interface";
import { ITokenPair, ITokenResponse } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
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

    // await sendGridService.sendByEmailType(dto.email, EEmailType.WELCOME, {
    //   name: dto.name,
    //   frontUrl: config.FRONT_URL,
    //   actionToken: "actionToken",
    // });
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
    const tokenPair = await tokenRepository.findByParams({ _userId: user._id });

    if (tokenPair) {
      await tokenRepository.findAndUpdate(
        { _userId: user._id },
        { refreshToken: tokens.refreshToken, accessToken: tokens.accessToken },
      );
    } else {
      await tokenRepository.create({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        _userId: user._id,
      });
    }

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
  private async isEmailExist(email: string): Promise<void> {
    const user = await userRepository.findByEmail(email);
    if (user) {
      throw new ApiError(
        statusCode.BAD_REQUEST,
        ErrorMessages.EMAIL_ALREADY_EXISTS,
      );
    }
  }
}

export const authService = new AuthService();
