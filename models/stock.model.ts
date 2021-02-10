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
import { Wholesaler } from "./wholesaler.model";
import { Product } from "./product.model";
import { Employee } from "./employee.model";
import { Order } from "./order.model";
import { Helpers } from "../util/helpers.util";
import { PaymentStatus } from "../enums/payment-status.enum";
import { StockStatus } from "../enums/stock-status.enum";

@Table({
  timestamps: true,
  paranoid  : false,
  tableName : "stocks"
})
export class Stock extends Model<Stock> {
  @Unique
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => Product)
  @Column(DataType.BIGINT)
  product_id: number;

  @Column(DataType.INTEGER)
  no_of_units: number;

  @BelongsTo(() => Product)
  product: Product;
}
