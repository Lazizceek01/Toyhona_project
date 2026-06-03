import { z } from "zod";
import bcrypt from "bcryptjs";
import type { FastifyInstance } from "fastify";
import { UserRole } from "@toyxona/shared";
import { prisma } from "../services/prisma.js";

const SALT_ROUNDS = 10;

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  phone: z.string().min(7).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const toPublicUser = (user: { id: string; email: string; role: string; fullName: string }) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  fullName: user.fullName
});

export const authRoutes = async (app: FastifyInstance) => {
  app.post("/auth/register", async (request, reply) => {
    const data = registerSchema.parse(request.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return reply.conflict("Bu email allaqachon ro'yxatdan o'tgan");
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        passwordHash,
        role: UserRole.enum.client
      }
    });

    const token = await reply.jwtSign({ sub: user.id, role: "client", email: user.email });
    return reply.code(201).send({ token, user: toPublicUser(user) });
  });

  app.post("/auth/login", async (request, reply) => {
    const data = loginSchema.parse(request.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return reply.unauthorized("Email yoki parol noto'g'ri");
    }

    const passwordOk = await bcrypt.compare(data.password, user.passwordHash);
    if (!passwordOk) {
      return reply.unauthorized("Email yoki parol noto'g'ri");
    }

    const parsedRole = UserRole.safeParse(user.role);
    if (!parsedRole.success) {
      return reply.internalServerError("Foydalanuvchi roli yaroqsiz");
    }

    const token = await reply.jwtSign({ sub: user.id, role: parsedRole.data, email: user.email });
    return { token, user: toPublicUser(user) };
  });
};
