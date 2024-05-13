import { FilterQuery } from "mongoose";

import { IUser } from "../interfaces/user.interface";
import { Token } from "../models/token.model";
import { User } from "../models/user.models";

class UserRepository {
  public async getAll(): Promise<IUser[]> {
    return await User.find({ isDeleted: false });
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
  public async findByParams(params: FilterQuery<IUser>): Promise<IUser> {
    return await User.findOne(params);
  }
  public async findWithOutActivityAfter(date: Date): Promise<IUser[]> {
    return await User.aggregate([
      {
        $lookup: {
          from: Token.collection.name,
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_userId", "$$userId"] } } },
            { $match: { createdAt: { $gt: date } } },
          ],
          as: "tokens",
        },
      },
      {
        $match: { tokens: { $size: 0 } },
      },
      {
        $project: {
          _id: 1,
          email: 1,
          name: 1,
        },
      },
    ]);
  }
}

export const userRepository = new UserRepository();
