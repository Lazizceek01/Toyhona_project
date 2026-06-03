import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { BookingStatus, WsEvents } from "@toyxona/shared";
import { prisma } from "../services/prisma.js";

const bookingInput = z.object({
  hallId: z.string(),
  fullName: z.string().min(2),
  phone: z.string().min(7),
  eventDate: z.string(),
  guestCount: z.coerce.number().int().positive()
});

const bookingStatusInput = z.object({
  status: BookingStatus
});

export const domainRoutes = async (app: FastifyInstance) => {
  app.get("/health", async () => ({ status: "ok", uptime: process.uptime() }));

  app.get("/halls", async () => {
    return prisma.hall.findMany({ orderBy: { createdAt: "desc" } });
  });

  app.post("/halls", { preHandler: app.authorize({ roles: ["super_admin", "manager"] }) }, async (request) => {
    const body = z
      .object({
        name: z.string().min(2),
        capacity: z.coerce.number().int().positive(),
        pricePerSeat: z.coerce.number().positive()
      })
      .parse(request.body);
    return prisma.hall.create({ data: body });
  });

  app.get("/bookings", { preHandler: app.authorize({ roles: ["super_admin", "manager", "staff"] }) }, async () => {
    return prisma.booking.findMany({ include: { hall: true }, orderBy: { createdAt: "desc" } });
  });

  app.post("/bookings", { preHandler: app.authorize() }, async (request) => {
    const body = bookingInput.parse(request.body);
    const booking = await prisma.booking.create({
      data: {
        ...body,
        clientId: request.user.sub,
        status: "pending"
      },
      include: { hall: true }
    });

    app.io.emit(WsEvents.BOOKING_CREATED, booking);
    app.io.to("dashboard").emit(WsEvents.DASHBOARD_STATS, { type: "booking:new", bookingId: booking.id });
    app.io.to(`hall:${booking.hallId}`).emit(WsEvents.HALL_AVAILABILITY, {
      hallId: booking.hallId,
      date: booking.eventDate
    });

    return booking;
  });

  app.patch(
    "/bookings/:bookingId/status",
    { preHandler: app.authorize({ roles: ["super_admin", "manager", "staff"] }) },
    async (request) => {
      const params = z.object({ bookingId: z.string() }).parse(request.params);
      const body = bookingStatusInput.parse(request.body);
      const booking = await prisma.booking.update({
        where: { id: params.bookingId },
        data: { status: body.status }
      });

      await prisma.bookingStatusHistory.create({
        data: {
          bookingId: booking.id,
          status: body.status,
          changedBy: request.user.sub
        }
      });

      app.io.emit(WsEvents.BOOKING_STATUS_UPDATED, booking);
      app.io.to("dashboard").emit(WsEvents.DASHBOARD_STATS, {
        type: "booking:status",
        bookingId: booking.id,
        status: body.status
      });
      return booking;
    }
  );

  app.get("/payments", { preHandler: app.authorize({ roles: ["super_admin", "manager"] }) }, async () => {
    return prisma.payment.findMany({ orderBy: { createdAt: "desc" } });
  });

  app.post("/payments", { preHandler: app.authorize({ roles: ["super_admin", "manager"] }) }, async (request) => {
    const body = z
      .object({
        bookingId: z.string(),
        amount: z.coerce.number().positive(),
        status: z.enum(["pending", "paid", "failed", "refunded"]).default("pending")
      })
      .parse(request.body);
    return prisma.payment.create({ data: body });
  });

  app.get("/staff/shifts", { preHandler: app.authorize({ roles: ["super_admin", "manager", "staff"] }) }, async () => {
    return prisma.staffShift.findMany({ orderBy: { shiftDate: "desc" } });
  });

  app.post(
    "/staff/shifts",
    { preHandler: app.authorize({ roles: ["super_admin", "manager"] }) },
    async (request) => {
      const body = z
        .object({
          staffId: z.string(),
          shiftDate: z.string(),
          note: z.string().optional()
        })
        .parse(request.body);
      return prisma.staffShift.create({ data: body });
    }
  );

  app.get("/staff/tasks", { preHandler: app.authorize({ roles: ["super_admin", "manager", "staff"] }) }, async (request) => {
    const where = request.user.role === "staff" ? { assigneeId: request.user.sub } : undefined;
    return prisma.task.findMany({ where, orderBy: { createdAt: "desc" } });
  });

  app.post(
    "/staff/tasks",
    { preHandler: app.authorize({ roles: ["super_admin", "manager"] }) },
    async (request) => {
      const body = z
        .object({
          title: z.string().min(2),
          description: z.string().optional(),
          assigneeId: z.string(),
          dueDate: z.string().optional()
        })
        .parse(request.body);
      return prisma.task.create({ data: body });
    }
  );

  app.patch(
    "/staff/tasks/:taskId",
    { preHandler: app.authorize({ roles: ["super_admin", "manager", "staff"] }) },
    async (request) => {
      const params = z.object({ taskId: z.string() }).parse(request.params);
      const body = z.object({ status: z.enum(["todo", "doing", "done"]) }).parse(request.body);
      return prisma.task.update({ where: { id: params.taskId }, data: { status: body.status } });
    }
  );

  app.get(
    "/notifications",
    { preHandler: app.authorize({ roles: ["super_admin", "manager", "staff", "client"] }) },
    async (request) => {
      return prisma.notification.findMany({ where: { userId: request.user.sub }, orderBy: { createdAt: "desc" } });
    }
  );

  app.post(
    "/notifications",
    { preHandler: app.authorize({ roles: ["super_admin", "manager"] }) },
    async (request) => {
      const body = z
        .object({
          userId: z.string(),
          title: z.string(),
          body: z.string()
        })
        .parse(request.body);
      const notification = await prisma.notification.create({ data: body });
      app.io.emit(WsEvents.NOTIFICATION_PUSH, notification);
      return notification;
    }
  );

  app.get(
    "/chat/:roomId/messages",
    { preHandler: app.authorize({ roles: ["super_admin", "manager", "staff", "client"] }) },
    async (request) => {
      const params = z.object({ roomId: z.string() }).parse(request.params);
      return prisma.message.findMany({
        where: { roomId: params.roomId },
        orderBy: { createdAt: "asc" }
      });
    }
  );

  app.post(
    "/chat/:roomId/messages",
    { preHandler: app.authorize({ roles: ["super_admin", "manager", "staff", "client"] }) },
    async (request) => {
      const params = z.object({ roomId: z.string() }).parse(request.params);
      const body = z.object({ body: z.string().min(1) }).parse(request.body);

      // Ensure the ChatRoom exists first
      await prisma.chatRoom.upsert({
        where: { id: params.roomId },
        update: {},
        create: { id: params.roomId }
      });

      const message = await prisma.message.create({
        data: {
          roomId: params.roomId,
          senderId: request.user.sub,
          body: body.body
        }
      });
      app.io.to(`chat:${params.roomId}`).emit(WsEvents.CHAT_MESSAGE, message);
      return message;
    }
  );

  app.get(
    "/users/staff",
    { preHandler: app.authorize({ roles: ["super_admin", "manager", "staff"] }) },
    async () => {
      return prisma.user.findMany({
        where: { role: "staff" },
        select: { id: true, fullName: true, email: true },
        orderBy: { fullName: "asc" }
      });
    }
  );
};
