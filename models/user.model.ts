import {
  AutoIncrement, BelongsTo, BelongsToMany,
  Column,
  DataType, Default, ForeignKey, HasMany, HasOne,
  Model,
  PrimaryKey,
  Table,
  Unique
} from "sequelize-typescript";
import { genSaltSync, hashSync } from "bcrypt";
import { CompactProduct } from "./compact-product.model";
import { isNullOrUndefined } from "util";
import { Helpers } from "../util/helpers.util";
import { DaysEnum } from "../enums/days.enum";

@Table({
  timestamps: true,
  paranoid  : true,
  tableName : "users"
})
export class User extends Model<User> {
  @Unique
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @Column(DataType.STRING)
  name?: string;

  @Column(DataType.STRING)
  store_name?: string;

  @Unique
  @Column(DataType.STRING)
  email?: string;

  @Unique
  @Column(DataType.STRING)
  mobile_no: string;

  @Unique
  @Column(DataType.STRING)
  alternate_no?: string;

  @Column(DataType.ENUM({values: Helpers.iterateEnum<DaysEnum>(DaysEnum)}))
  delivery_day: DaysEnum;

  @Column({
    type: DataType.STRING,
    set : function (this: User, value: string) {
      this.setDataValue("password", hashSync(value, genSaltSync(2)));
    }
  })
  password: string;

  @Column(DataType.STRING)
  address?: string;

  @Column(DataType.STRING)
  permanent_address?: string;

  @Column(DataType.STRING)
  landmark?: string;

  @Column(DataType.STRING)
  state?: string;

  @Column(DataType.STRING)
  pincode?: string;

  @Column(DataType.FLOAT)
  delivery_charge: number;

  @Column(DataType.STRING)
  latitude?: string;

  @Column(DataType.STRING)
  longitude?: string;

  @Column({
    type: DataType.JSON,
    set : function (this: User, value: number[]) {
      this.setDataValue("favorites", value ? value : []);
    },
    get : function (this: User) {
      const value = this.getDataValue("favorites");
      return value ? value : [];
    }
  })
  favorites: number[];


  @Default(true)
  @Column(DataType.BOOLEAN)
  is_active: boolean;

}
