import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import type { Server } from "socket.io";
import { env } from "./env.js";
import { auth } from "./plugins/auth.js";
import { authRoutes } from "./routes/auth.js";
import { domainRoutes } from "./routes/domain.js";

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }
}

export const buildApp = async () => {
  const app = Fastify({
    logger: {
      transport: env.NODE_ENV === "development" ? { target: "pino-pretty" } : undefined
    }
  });

  await app.register(sensible);
  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true
  });
  await app.register(auth);
  await app.register(authRoutes, { prefix: "/api" });
  await app.register(domainRoutes, { prefix: "/api" });

  return app;
};
