import { app } from "./app";
import { env } from "./config/env";
import { startWeeklyBalanceCron } from "./modules/balance/balance.cron";

const PORT = Number(env.port);

app.listen(PORT, () => {
  // Server running
  startWeeklyBalanceCron();
});
