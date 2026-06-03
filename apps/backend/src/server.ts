import { buildApp } from "./app.js";
import { env } from "./env.js";
import { createRealtimeServer } from "./services/realtime.js";
import { prisma } from "./services/prisma.js";

const start = async () => {
  const app = await buildApp();
  const io = createRealtimeServer(app.server);
  app.decorate("io", io);

  process.on("SIGINT", async () => {
    await app.close();
    await prisma.$disconnect();
    process.exit(0);
  });

  await app.listen({ port: env.PORT, host: env.HOST });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
