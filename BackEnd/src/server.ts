import { app } from "./app";
import { env } from "./config/env";

const PORT = Number(env.port);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
