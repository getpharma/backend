import {
  AutoIncrement, BelongsTo, BelongsToMany,
  Column,
  DataType, Default, ForeignKey, HasMany, HasOne,
  Model,
  PrimaryKey,
  Table,
  Unique
} from "sequelize-typescript";
import { Wholesaler } from "./wholesaler.model";
import { Employee } from "./employee.model";
import { Helpers } from "../util/helpers.util";
import { PickupStatus } from "../enums/order-status.enum";
import { CompactProductWholesaler } from "./compact-product.model";
import { isNullOrUndefined } from "util";

@Table({
  timestamps: true,
  paranoid  : true,
  tableName : "pickups"
})
export class Pickup extends Model<Pickup> {
  @Unique
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @Unique
  @Column(DataType.BIGINT)
  pickup_id?: number;

  @ForeignKey(() => Wholesaler)
  @Column(DataType.BIGINT)
  wholesaler_id: number;

  @Column({
    type: DataType.JSON,
    set : function (this: Pickup, value: CompactProductWholesaler[]) {
      this.setDataValue("products", JSON.stringify(value || []));
    },
    get : function (this: Pickup) {
      const value = this.getDataValue("products");
      if (isNullOrUndefined(value)) {
        return [];
      }
      return JSON.parse(value);
    }
  })
  products: CompactProductWholesaler[];

  @Column(DataType.ENUM({values: Helpers.iterateEnum<PickupStatus>(PickupStatus)}))
  pickup_status: PickupStatus;

  @Column(DataType.STRING)
  delivery_code?: string;

  @ForeignKey(() => Employee)
  @Column(DataType.BIGINT)
  employee_id?: number;

  @Column(DataType.STRING)
  pickup_address?: string;

  @Column(DataType.DATEONLY)
  pickup_date?: Date;

  @Column(DataType.STRING)
  employee_name?: string;

  @Column(DataType.FLOAT)
  amount?: number;

  @Column(DataType.STRING)
  latitude?: string;

  @Column(DataType.STRING)
  longitude?: string;

  @BelongsTo(() => Employee)
  employee: Employee;

  @BelongsTo(() => Wholesaler)
  wholesaler: Wholesaler;
}
