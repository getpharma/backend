import {
  AfterDelete,
  AutoIncrement, BeforeCreate, BelongsTo, BelongsToMany,
  Column,
  DataType, Default, ForeignKey, HasMany, HasOne,
  Model,
  PrimaryKey,
  Table,
  Unique
} from "sequelize-typescript";
import { User } from "./user.model";
import { isNullOrUndefined } from "util";
import { CompactProduct } from "./compact-product.model";

@Table({
  timestamps: true,
  paranoid  : false,
  tableName : "carts"
})
export class Cart extends Model<Cart> {
  @Unique
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => User)
  @Column(DataType.BIGINT)
  user_id: number;

  @Column({
    type: DataType.JSON,
    set : function (this: Cart, value: CompactProduct[]) {
      this.setDataValue("products", JSON.stringify(value || []));
    },
    get : function (this: Cart) {
      const value = this.getDataValue("products");
      if (isNullOrUndefined(value)) {
        return [];
      }
      return JSON.parse(value);
    }
  })
  products: CompactProduct[];

  @Column(DataType.FLOAT)
  amount: number;

  @Column(DataType.FLOAT)
  delivery_charge: number;

  @BelongsTo(() => User)
  user: User;

}
