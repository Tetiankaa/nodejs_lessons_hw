import { FilterQuery, UpdateQuery } from "mongoose";

import { ITokenDB } from "../interfaces/token.interface";
import { Token } from "../models/token.model";

class TokenRepository {
  public async create(dto: ITokenDB): Promise<ITokenDB> {
    return await Token.create(dto);
  }

  public async findByParams(params: FilterQuery<ITokenDB>): Promise<ITokenDB> {
    return await Token.findOne(params);
  }

  public async findAndUpdate(
    params: FilterQuery<ITokenDB>,
    updateValue: UpdateQuery<ITokenDB>,
  ): Promise<ITokenDB> {
    return await Token.findOneAndUpdate(params, updateValue, {
      returnDocument: "after",
    });
  }

  public async deleteOne(filter: FilterQuery<ITokenDB>): Promise<void> {
    await Token.deleteOne(filter);
  }
}

export const tokenRepository = new TokenRepository();
