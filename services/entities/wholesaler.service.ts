import logger from "../../util/logger.util";
import { WholesalerCreateDto } from "../../dtos/wholesaler/wholesaler-create.dto";
import { WholesalerUpdateDto } from "../../dtos/wholesaler/wholesaler-update.dto";
import { Wholesaler } from "../../models/wholesaler.model";
import { Transaction } from "sequelize";
import { ProductIndexDto } from "../../dtos/product/product-index.dto";
import { Product } from "../../models/product.model";
import { Sequelize } from "sequelize";
import { ProductCategory } from "../../models/product-category.model";

class WholesalerService {
  private readonly LIMIT = 20;

  private constructor() {
    logger.silly("[N-FT] WholesalerService");
  }

  static getInstance(): WholesalerService {
    return new WholesalerService();
  }

  async create(data: WholesalerCreateDto, transaction?: Transaction): Promise<Wholesaler> {
    return Wholesaler.create(data, {transaction});
  }

  async show(wholesalerId: number, withIncludes?: boolean): Promise<Wholesaler> {
    return Wholesaler.findOne({
      where  : {
        id: wholesalerId
      },
      include: withIncludes ? [
        {all: true}
      ] : []
    });
  }

  async showWholesalerByEmail(email: string, withIncludes?: boolean): Promise<Wholesaler> {
    return Wholesaler.findOne({
      where  : {
        email: email
      },
      include: withIncludes ? [
        {all: true}
      ] : []
    });
  }

  async showWholesalerByMobile(mobile: string, withIncludes?: boolean): Promise<Wholesaler> {
    return Wholesaler.findOne({
      where  : {
        mobile_no: mobile
      },
      include: withIncludes ? [
        {all: true}
      ] : []
    });
  }

  async wholesalersForAdmin(filters?: ProductIndexDto, withIncludes?: boolean): Promise<Wholesaler[]> {
    if (filters.query && filters.query !== "") {
      return Wholesaler.findAll({
        where: {
          [Sequelize.Op.or]: {
            ["store_name" as any]: {
              like: "%" + filters.query + "%"
            },
            ["name" as any]      : {
              like: "%" + filters.query + "%"
            }
          },
        },
        order: [["name", "asc"]],
      });
    }
    if (filters.query == "") {
      return [];
    } else {
      return Wholesaler.findAll();
    }
  }

  async update(wholesaler: Wholesaler, data: WholesalerUpdateDto): Promise<Wholesaler> {
    return wholesaler.update(data);
  }

  async delete(wholesaler: Wholesaler): Promise<any> {
    await wholesaler.destroy();
  }
}

export const wholesalerService = WholesalerService.getInstance();
