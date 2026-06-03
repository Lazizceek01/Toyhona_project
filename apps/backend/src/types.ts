import type { FastifyReply, FastifyRequest } from "fastify";
import type { UserRole } from "@toyxona/shared";

export type JwtPayload = {
  sub: string;
  role: UserRole;
  email: string;
};

export type AuthenticatedRequest = FastifyRequest & {
  user: JwtPayload;
};

export type GuardOptions = {
  roles?: UserRole[];
};

export type GuardHandler = (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<void>;
