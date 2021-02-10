import logger from "../../util/logger.util";
import { UserCreateDto } from "../../dtos/user/user-create.dto";
import { UserUpdateDto } from "../../dtos/user/user-update.dto";
import { User } from "../../models/user.model";
import { Transaction } from "sequelize";

class UserService {
  private readonly LIMIT = 20;

  private constructor() {
    logger.silly("[N-FT] UserService");
  }

  static getInstance(): UserService {
    return new UserService();
  }

  async create(data: UserCreateDto, transaction?: Transaction): Promise<User> {
    return User.create(data, {transaction});
  }

  async show(userId: number, withIncludes?: boolean): Promise<User> {
    return User.findOne({
      where  : {
        id: userId
      },
      include: withIncludes ? [
        {all: true}
      ] : []
    });
  }

  async showUserByEmail(email: string, withIncludes?: boolean): Promise<User> {
    return User.findOne({
      where  : {
        email: email
      },
      include: withIncludes ? [
        {all: true}
      ] : []
    });
  }

  async showUserByMobile(mobile: string, withIncludes?: boolean): Promise<User> {
    return User.findOne({
      where  : {
        mobile_no: mobile
      },
      include: withIncludes ? [
        {all: true}
      ] : []
    });
  }

  async update(user: User, data: UserUpdateDto): Promise<User> {
    return user.update(data);
  }

  async delete(user: User): Promise<any> {
    await user.destroy();
  }
}

export const userService = UserService.getInstance();
