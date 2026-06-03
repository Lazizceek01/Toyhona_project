import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { UserRole } from "@toyxona/shared";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: UserRole.default("client")
});

export const authRoutes = async (app: FastifyInstance) => {
  app.post("/auth/login", async (request, reply) => {
    const data = loginSchema.parse(request.body);
    const token = await reply.jwtSign({
      sub: crypto.randomUUID(),
      role: data.role,
      email: data.email
    });

    return {
      token,
      user: {
        id: "demo-user",
        email: data.email,
        role: data.role
      }
    };
  });
};
