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

@Table({
  timestamps: true,
  paranoid  : true,
  tableName : "wholesalers_products"
})
export class WholesalerProduct extends Model<WholesalerProduct> {
  @Unique
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => Wholesaler)
  @Column(DataType.BIGINT)
  wholesaler_id: number;

  @ForeignKey(() => Product)
  @Column(DataType.BIGINT)
  product_id: number;

  @Column(DataType.STRING)
  product_name: string;

  @Column(DataType.STRING)
  manufacturer: string;

  @Column(DataType.FLOAT)
  mrp: number;

  @Column(DataType.FLOAT)
  off_percentage?: number;

  @Column(DataType.FLOAT)
  off_amount?: number;

  @Default(0)
  @Column(DataType.FLOAT)
  previous_price?: number;

  @Column(DataType.FLOAT)
  deal_price?: number;

  @Column(DataType.STRING)
  composition: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  is_assigned: boolean;

  @BelongsTo(() => Wholesaler)
  wholesaler: Wholesaler;

  @BelongsTo(() => Product)
  product: Product;
}
