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
import { Helpers } from "../util/helpers.util";

@Table({
  timestamps: true,
  paranoid  : false,
  tableName : "product_categories"
})
export class ProductCategory extends Model<ProductCategory> {
  @Unique
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @Unique
  @Column(DataType.STRING)
  title: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  is_active: boolean;

  @Unique
  @Column(DataType.STRING)
  image_url?: string;
}
