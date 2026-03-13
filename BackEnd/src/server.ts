import { app } from "./app.ts";
import { env } from "./config/env";
import { startWeeklyBalanceCron } from "./modules/balance/balance.cron";

const PORT = Number(env.port);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  startWeeklyBalanceCron();
});
