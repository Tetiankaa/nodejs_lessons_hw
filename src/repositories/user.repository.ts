import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.models";

class UserRepository {
  public async getAll(): Promise<IUser[]> {
    return await User.find({});
  }

  public async getById(id: string): Promise<IUser> {
    return await User.findById(id);
  }

  public async create(dto: Partial<IUser>): Promise<IUser> {
    return await User.create(dto);
  }

  public async deleteById(id: string): Promise<void> {
    await User.deleteOne({ _id: id });
  }
  public async updateById(id: string, user: Partial<IUser>): Promise<IUser> {
    return await User.findByIdAndUpdate({ _id: id }, user, {
      returnDocument: "after",
    });
  }
  public async findByEmail(email: string): Promise<IUser> {
    return await User.findOne({ email });
  }
}

export const userRepository = new UserRepository();
