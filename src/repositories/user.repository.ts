import { FilterQuery, SortOrder, UpdateQuery } from "mongoose";

import { statusCode } from "../constants/status-code.constants";
import { EOrder } from "../enums/order.enum";
import { EUserListOrderBy } from "../enums/UserListOrderEnum";
import { ApiError } from "../errors/api-error";
import {
  IPublicUserListResponse,
  IUser,
  IUserQuery,
} from "../interfaces/user.interface";
import { User } from "../models/user.models";

class UserRepository {
  public async getAll(query: IUserQuery): Promise<IPublicUserListResponse> {
    const {
      page = 1,
      limit = 3,
      search,
      order = EOrder.ASC,
      orderBy = EUserListOrderBy.NAME,
    } = query;
    const filterObj: FilterQuery<IUser> = { isDeleted: false };
    const sortObj: { [key: string]: SortOrder } = {};

    if (orderBy) {
      switch (orderBy) {
        case EUserListOrderBy.NAME:
          sortObj.name = order;
          break;
        case EUserListOrderBy.AGE:
          sortObj.age = order;
          break;
        default:
          throw new ApiError(statusCode.BAD_REQUEST, " Invalid orderBy");
      }
    }
    if (search) {
      filterObj.name = { $regex: search, $options: "i" };
    }

    const skip = (+page - 1) * +limit;
    const data = await User.find(filterObj)
      .sort(sortObj)
      .limit(+limit)
      .skip(skip);
    const total = await User.countDocuments(filterObj);
    return {
      data,
      total,
      search,
      limit,
      page,
      order,
      orderBy,
    };
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
  public async updateById(
    id: string,
    user: UpdateQuery<IUser>,
  ): Promise<IUser> {
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
}

export const userRepository = new UserRepository();
