import { config } from "../configs/config";
import {
  IPrivateUser,
  IPublicUser,
  IPublicUserListResponse,
  IUser,
} from "../interfaces/user.interface";

export class UserMapper {
  public static toPublicResponse(user: IUser): IPublicUser {
    return {
      _id: user._id,
      age: user.age,
      email: user.email,
      isDeleted: user.isDeleted,
      isVerified: user.isVerified,
      name: user.name,
      role: user.role,
      avatar: user.avatar ? `${config.AWS_S3_ENDPOINT}/${user.avatar}` : null,
    };
  }

  public static toPublicResponseList(
    response: IPublicUserListResponse,
  ): IPublicUserListResponse {
    return {
      data: response.data.map(this.toPublicResponse),
      page: response.page,
      limit: response.limit,
      search: response.search,
      total: response.total,
      orderBy: response.orderBy,
      order: response.order,
    };
  }

  public static toPrivateResponse(user: IUser): IPrivateUser {
    return {
      _id: user._id,
      age: user.age,
      email: user.email,
      isDeleted: user.isDeleted,
      isVerified: user.isVerified,
      name: user.name,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar ? `${config.AWS_S3_ENDPOINT}/${user.avatar}` : null,
    };
  }
}
