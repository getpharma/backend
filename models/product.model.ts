import {
  AutoIncrement, BeforeCreate, BelongsTo, BelongsToMany,
  Column,
  DataType, Default, ForeignKey, HasMany, HasOne,
  Model,
  PrimaryKey,
  Table,
  Unique
} from "sequelize-typescript";
import { ProductCategory } from "./product-category.model";

@Table({
  timestamps: true,
  paranoid  : false,
  tableName : "products"
})
export class Product extends Model<Product> {
  @Unique
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @Column(DataType.STRING)
  title: string;

  @Column(DataType.STRING)
  manufacturer: string;

  @Column(DataType.STRING)
  pack_size: string;

  @Column(DataType.STRING)
  image_url: string;

  @Column(DataType.STRING)
  composition?: string;

  @ForeignKey(() => ProductCategory)
  @Column(DataType.BIGINT)
  category_id: number;

  @Column(DataType.FLOAT)
  mrp: number;

  @Column(DataType.FLOAT)
  off_percentage?: number;

  @Column(DataType.FLOAT)
  off_amount?: number;

  @Column(DataType.FLOAT)
  selling_price?: number;

  @Default(false)
  @Column(DataType.BOOLEAN)
  is_trending?: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  is_wholesaler_trending?: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  is_active?: boolean;

  @BelongsTo(() => ProductCategory)
  category: ProductCategory;

  @Column(DataType.TEXT)
  description?: string;
}
