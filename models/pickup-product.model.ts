import {
  AutoIncrement, BeforeCreate, BelongsTo, BelongsToMany,
  Column,
  DataType, Default, ForeignKey, HasMany, HasOne,
  Model,
  PrimaryKey,
  Table,
  Unique
} from "sequelize-typescript";
import { Helpers } from "../util/helpers.util";
import { WholesalerProduct } from "./wholesaler-product.model";
import { AvailabilityEnum } from "../enums/availability.enum";
import { Product } from "./product.model";

@Table({
  timestamps: true,
  paranoid  : false,
  tableName : "pickup_products"
})
export class PickupProduct extends Model<PickupProduct> {
  @Unique
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => WholesalerProduct)
  @Column(DataType.BIGINT)
  wholesaler_product_id?: number;

  @ForeignKey(() => Product)
  @Column(DataType.BIGINT)
  product_id?: number;

  @Column(DataType.FLOAT)
  amount?: number;

  @Column(DataType.INTEGER)
  required_quantity: number;

  @Column(DataType.INTEGER)
  available_quantity?: number;

  @Column(DataType.ENUM({values: Helpers.iterateEnum<AvailabilityEnum>(AvailabilityEnum)}))
  availability: AvailabilityEnum;

  @Column(DataType.DATEONLY)
  delivery_date?: Date;

  @Column(DataType.INTEGER)
  priority: number;

  @BelongsTo(() => WholesalerProduct)
  wholesalerProduct: WholesalerProduct;

  @BelongsTo(() => Product)
  product: Product;


}
