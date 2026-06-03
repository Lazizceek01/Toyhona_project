import { z } from "zod";

export const UserRole = z.enum(["super_admin", "manager", "staff", "client"]);
export type UserRole = z.infer<typeof UserRole>;

export const BookingStatus = z.enum(["pending", "confirmed", "cancelled"]);
export type BookingStatus = z.infer<typeof BookingStatus>;

export const BookingSchema = z.object({
  id: z.string(),
  hallId: z.string(),
  clientId: z.string(),
  fullName: z.string(),
  phone: z.string(),
  eventDate: z.string(),
  guestCount: z.number().int().positive(),
  status: BookingStatus
});

export type Booking = z.infer<typeof BookingSchema>;

export const WsEvents = {
  BOOKING_CREATED: "booking:created",
  BOOKING_STATUS_UPDATED: "booking:status",
  DASHBOARD_STATS: "dashboard:stats",
  HALL_AVAILABILITY: "hall:availability",
  CHAT_MESSAGE: "chat:message",
  NOTIFICATION_PUSH: "notify:push"
} as const;

export type WsEventName = (typeof WsEvents)[keyof typeof WsEvents];
