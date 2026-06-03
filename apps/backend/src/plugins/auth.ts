import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { UserRole, type UserRole as UserRoleType } from "@toyxona/shared";
import type { FastifyRequest } from "fastify";
import type { GuardHandler, GuardOptions, JwtPayload } from "../types.js";
import { env } from "../env.js";

declare module "fastify" {
  interface FastifyInstance {
    authorize: (options?: GuardOptions) => GuardHandler;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

const authPlugin = fp(async (app) => {
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET
  });

  app.decorate("authorize", (options?: GuardOptions) => {
    return async (request, reply) => {
      await request.jwtVerify();
      const allowedRoles = options?.roles;
      if (!allowedRoles || allowedRoles.length === 0) return;

      const parsedRole = UserRole.safeParse(request.user.role);
      if (!parsedRole.success) {
        return reply.forbidden("Unknown role");
      }

      const hasRole = allowedRoles.includes(parsedRole.data as UserRoleType);
      if (!hasRole) {
        return reply.forbidden("Not enough permissions");
      }
    };
  });
});

export const auth = authPlugin;

export const optionalUser = async (request: FastifyRequest) => {
  try {
    await request.jwtVerify();
  } catch {
    return undefined;
  }
  return request.user;
};
