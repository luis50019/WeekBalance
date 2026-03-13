import cron from "node-cron";
import { BalanceService } from "./balance.service";

const balanceService = new BalanceService();

export function startWeeklyBalanceCron(): void {
  console.log("[Cron] Weekly balance cron job scheduled");
  cron.schedule("0 0 * * 0", async () => {
    console.log("[Cronon] Running weekly balance calculation...");
    try {
      await balanceService.processAllUsers();
      console.log("[Cron] Weekly balance calculation finished successfully");
    } catch (error) {
      console.error("[Cron] Error running weekly balance calculation:", error);
    }
  });

  console.log("[Cron] Cron job scheduled to run every Sunday at midnight");
}
