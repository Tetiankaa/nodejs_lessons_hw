import { IPrivateUser, IPublicUser, IUser } from "../interfaces/user.interface";
import {config} from "../configs/config";

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

  public static toPublicResponseList(users: IUser[]): IPublicUser[] {
    return users.map(this.toPublicResponse);
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
