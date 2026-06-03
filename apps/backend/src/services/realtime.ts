import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { Redis } from "ioredis";
import { WsEvents } from "@toyxona/shared";
import { env } from "../env.js";

export const createRealtimeServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: env.CORS_ORIGIN, credentials: true }
  });

  if (env.REDIS_URL) {
    const pubClient = new Redis(env.REDIS_URL);
    const subClient = pubClient.duplicate();
    io.adapter(createAdapter(pubClient, subClient));
  }

  io.on("connection", (socket) => {
    socket.on("join:dashboard", () => socket.join("dashboard"));
    socket.on("join:hall", (hallId: string) => socket.join(`hall:${hallId}`));
    socket.on("join:chat", (roomId: string) => socket.join(`chat:${roomId}`));

    socket.on(WsEvents.CHAT_MESSAGE, (payload) => {
      io.to(`chat:${payload.roomId}`).emit(WsEvents.CHAT_MESSAGE, payload);
    });
  });

  return io;
};
