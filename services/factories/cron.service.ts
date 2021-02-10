import logger from "../../util/logger.util";
import cron from "cron";


class CronService {
  private static _instance: CronService;


  private constructor() {
    logger.silly("[N-FT] CronService");
    this.addSubscriptionToOrder();
  }

  static getInstance(): CronService {
    if (!this._instance) {
      this._instance = new CronService();
    }
    return this._instance;
  }

  private addSubscriptionToOrder() {
    new cron.CronJob("0 0 0 * * *", async () => {
      // await subscriptionService.addToOrder();
      console.log("hello");
    }, undefined, true, "Asia/Kolkata");
  }
}

export const cronService = CronService.getInstance();
