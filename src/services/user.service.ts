import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getAll();
  }
  public async getById(id: string): Promise<IUser> {
    return await this.getUserById(id);
  }

  public async create(dto: Partial<IUser>): Promise<IUser> {
    await this.getUserByEmail(dto.email);
    return await userRepository.create(dto);
  }
  public async deleteById(id: string): Promise<void> {
    await this.getUserById(id);
    return await userRepository.deleteById(id);
  }
  public async updateById(id: string, dto: Partial<IUser>): Promise<IUser> {
    await this.getUserById(id);
    await this.getUserByEmail(dto.email);
    return await userRepository.updateById(id, dto);
  }
  private async getUserById(id: string): Promise<IUser> {
    const user = await userRepository.getById(id);
    if (!user) {
      throw new ApiError(404, `User was not found`);
    }
    return user;
  }

  private async getUserByEmail(email: string): Promise<IUser> {
    const user = await userRepository.findByEmail(email);
    if (user) {
      throw new ApiError(400, "User with provided email already exists.");
    }
    return user;
  }
}

export const userService = new UserService();
