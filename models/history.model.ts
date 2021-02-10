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
import { User } from "./user.model";
import { Employee } from "./employee.model";
import { isNullOrUndefined } from "util";
import { PaymentStatus } from "../enums/payment-status.enum";
import { OrderStatus } from "../enums/order-status.enum";
import { CompactProduct } from "./compact-product.model";

@Table({
  timestamps: true,
  paranoid  : true,
  tableName : "histories"
})
export class History extends Model<History> {
  @Unique
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @Unique
  @Column(DataType.BIGINT)
  order_id: number;

  @ForeignKey(() => User)
  @Column(DataType.BIGINT)
  user_id: number;

  @Column({
    type: DataType.JSON,
    set : function (this: History, value: number[]) {
      this.setDataValue("products", JSON.stringify(value || []));
    },
    get : function (this: History) {
      const value = this.getDataValue("products");
      if (isNullOrUndefined(value)) {
        return [];
      }
      return JSON.parse(value);
    }
  })
  products: CompactProduct[];

  @Column({
    type: DataType.JSON,
    set : function (this: History, value: number[]) {
      this.setDataValue("undelivered_products", JSON.stringify(value || []));
    },
    get : function (this: History) {
      const value = this.getDataValue("undelivered_products");
      if (isNullOrUndefined(value)) {
        return [];
      }
      return JSON.parse(value);
    }
  })
  undelivered_products?: CompactProduct[];

  @Column(DataType.FLOAT)
  amount: number;

  @Column(DataType.FLOAT)
  delivery_charge: number;

  @Column(DataType.STRING)
  delivery_address: string;

  @ForeignKey(() => Employee)
  @Column(DataType.BIGINT)
  delivery_man_id?: number;

  @ForeignKey(() => Employee)
  @Column(DataType.BIGINT)
  packager_id?: number;

  @Column(DataType.STRING)
  delivery_man?: string;

  @Column(DataType.STRING)
  packager?: string;

  @Column(DataType.ENUM({values: Helpers.iterateEnum<PaymentStatus>(PaymentStatus)}))
  payment_status: PaymentStatus;

  @Column(DataType.ENUM({values: Helpers.iterateEnum<OrderStatus>(OrderStatus)}))
  order_status: OrderStatus;

  @Column(DataType.DATEONLY)
  delivery_date?: Date;

  @Column(DataType.STRING)
  invoice_url?: string;

  @BelongsTo(() => User)
  user: User;
}
