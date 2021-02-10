import logger from "../../util/logger.util";
import { Inventory } from "../../models/inventory.model";
import { Product } from "../../models/product.model";
import { OutOfStockException } from "../../exceptions/product/out-of-stock.exception";
import { InsufficientQuantityException } from "../../exceptions/cart/insufficient-quantity.exception";
import { Transaction } from "sequelize";

class InventoryService {
  constructor() {
    logger.silly("[N-GP] InventoryService");
  }

  static getInstance(): InventoryService {
    return new InventoryService();
  }

  async showByProductId(product_id: number): Promise<Inventory> {
    return Inventory.findOne({where: {product_id: product_id}, include: [Product]});
  }

  async createInventory(product_id: number, no_of_units: number, transaction?: Transaction): Promise<Inventory> {
    const inventory = await this.showByProductId(product_id);
    if (inventory) {
      const newQuantity = no_of_units + inventory.no_of_units;
      return inventory.update({
        no_of_units: newQuantity
      }, {transaction});
    }
    return Inventory.create({
      product_id : product_id,
      no_of_units: no_of_units
    }, {transaction});
  }

  async reduceQty(product_id: number, no_of_units: number, transaction?: Transaction): Promise<Inventory> {
    const inventory = await this.showByProductId(product_id);
    if (!inventory) {
      throw new OutOfStockException();
    }
    const newQty = inventory.no_of_units - no_of_units;
    if (newQty < 0) {
      throw new InsufficientQuantityException();
    }
    return inventory.update({
      no_of_units: newQty
    }, {transaction});
  }
}

export const inventoryService = InventoryService.getInstance();
