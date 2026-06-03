import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { UserRole, type UserRole as UserRoleType } from "@toyxona/shared";
import { prisma } from "../services/prisma.js";
import { hashPassword, verifyPassword } from "../utils/crypto.js";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  phone: z.string().optional(),
  role: UserRole.default("client")
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: UserRole.default("client")
});

export const authRoutes = async (app: FastifyInstance) => {
  app.post("/auth/register", async (request, reply) => {
    const data = registerSchema.parse(request.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return reply.badRequest("Ushbu email bilan ro'yxatdan o'tilgan");
    }

    const passwordHash = hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        passwordHash,
        role: data.role
      }
    });

    const token = await reply.jwtSign({
      sub: user.id,
      role: user.role as UserRoleType,
      email: user.email
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      }
    };
  });

  app.post("/auth/login", async (request, reply) => {
    const data = loginSchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      return reply.unauthorized("Email yoki parol noto'g'ri");
    }

    const isPasswordValid = verifyPassword(data.password, user.passwordHash);
    if (!isPasswordValid) {
      return reply.unauthorized("Email yoki parol noto'g'ri");
    }

    if (user.role !== data.role) {
      return reply.forbidden("Ushbu rol bilan kirishga ruxsat yo'q");
    }

    const token = await reply.jwtSign({
      sub: user.id,
      role: user.role as UserRoleType,
      email: user.email
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      }
    };
  });
};

