import cron from "node-cron";
import { BalanceService } from "./balance.service";

const balanceService = new BalanceService();

export function startWeeklyBalanceCron(): void {
  cron.schedule("0 0 * * 0", async () => {
    try {
      await balanceService.processAllUsers();
    } catch (error) {
      // Silent fail for cron job
    }
  });
}
