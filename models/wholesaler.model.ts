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

@Table({
  timestamps: true,
  paranoid  : true,
  tableName : "wholesalers"
})
export class Wholesaler extends Model<Wholesaler> {
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

  @Column({
    type: DataType.STRING,
    set : function (this: Wholesaler, value: string) {
      this.setDataValue("password", hashSync(value, genSaltSync(2)));
    }
  })
  password: string;

  @Column(DataType.STRING)
  address?: string;

  @Column(DataType.STRING)
  landmark?: string;

  @Column(DataType.STRING)
  state?: string;

  @Column(DataType.STRING)
  pincode?: string;

  @Column(DataType.FLOAT)
  pending_amount: number;

  @Column(DataType.STRING)
  latitude?: string;

  @Column(DataType.STRING)
  longitude?: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  is_active: boolean;

}
