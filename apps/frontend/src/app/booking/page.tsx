"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WsEvents } from "@toyxona/shared";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { socket } from "@/lib/socket";

type Hall = { id: string; name: string; capacity: number };
type Booking = {
  id: string;
  hallId: string;
  fullName: string;
  phone: string;
  eventDate: string;
  guestCount: number;
  status: string;
};
type Message = { id: string; body: string };

export default function BookingPage() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [statusFeed, setStatusFeed] = useState<string[]>([]);
  const [chatRoomId, setChatRoomId] = useState("public-room");
  const [chatText, setChatText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    hallId: "",
    fullName: "",
    phone: "",
    eventDate: "",
    guestCount: 200
  });

  useEffect(() => {
    apiFetch<Hall[]>("/halls").then((list) => {
      setHalls(list);
      if (list[0]) setForm((prev) => ({ ...prev, hallId: list[0].id }));
    });
  }, []);

  useEffect(() => {
    socket.connect();
    socket.emit("join:chat", chatRoomId);
    socket.on(WsEvents.BOOKING_STATUS_UPDATED, (booking: Booking) => {
      setStatusFeed((prev) => [`${booking.fullName}: ${booking.status}`, ...prev].slice(0, 10));
    });
    socket.on(WsEvents.CHAT_MESSAGE, (message: Message) => {
      setMessages((prev) => [...prev, message].slice(-10));
    });
    socket.on(WsEvents.NOTIFICATION_PUSH, (notification: { title: string }) => {
      setStatusFeed((prev) => [`Bildirishnoma: ${notification.title}`, ...prev].slice(0, 10));
    });
    return () => {
      socket.off(WsEvents.BOOKING_STATUS_UPDATED);
      socket.off(WsEvents.CHAT_MESSAGE);
      socket.off(WsEvents.NOTIFICATION_PUSH);
      socket.disconnect();
    };
  }, [chatRoomId]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!getToken()) {
      setError("Bron yuborish uchun avval login qiling.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setStatusFeed((prev) => ["So'rov yuborildi", ...prev]);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Bron yuborilmadi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendChat = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!getToken()) {
      setError("Chat yuborish uchun login qiling.");
      return;
    }

    try {
      const message = await apiFetch<Message>(`/chat/${chatRoomId}/messages`, {
        method: "POST",
        body: JSON.stringify({ body: chatText })
      });
      setMessages((prev) => [...prev, message].slice(-10));
      setChatText("");
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Xabar yuborilmadi");
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 lg:py-10">
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <p className="text-xs uppercase tracking-[0.42em] text-amber-700">ROYAL PALACE</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.03] text-stone-950 sm:text-6xl">
            Sizning Tantanangiz Uchun Bron Qilish
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            O&apos;zingizga mos zalni tanlang, mehmonlar sonini kiriting va bron jarayonini tez yakunlang.
            Bizning jamoa siz bilan birga ishlaydi.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.6rem] border border-stone-200 bg-stone-50 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-700">Bron formasi</p>
              <form onSubmit={submit} className="mt-4 space-y-3">
                <select
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-sm"
                  value={form.hallId}
                  onChange={(e) => setForm({ ...form, hallId: e.target.value })}
                >
                  {halls.map((hall) => (
                    <option key={hall.id} value={hall.id}>
                      {hall.name} ({hall.capacity})
                    </option>
                  ))}
                </select>
                <input className="w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-sm" placeholder="F.I.Sh" onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                <input className="w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-sm" placeholder="Telefon" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input type="date" className="w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-sm" onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
                <input type="number" className="w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-sm" value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: Number(e.target.value) })} />
                <button disabled={isSubmitting} className="w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-70">
                  {isSubmitting ? "Yuborilmoqda..." : "Bron yuborish"}
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.6rem] overflow-hidden border border-stone-200 bg-stone-100 shadow-sm">
                <div
                  className="min-h-[250px] bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1519167758481-83f29c86c39d?auto=format&fit=crop&w=1200&q=80')"
                  }}
                />
              </div>
              <div className="rounded-[1.6rem] bg-[#f3ead8] p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-800">Bron holati</p>
                <p className="mt-3 font-display text-2xl text-stone-950">Sizning mukammal kechangizga bir qadam qoldi</p>
                <p className="mt-2 text-sm leading-6 text-stone-700">Zal, sana va mehmonlar sonini belgilab yuboring.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-stone-200">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-amber-700">Ma&apos;lumot</p>
                <h2 className="mt-2 font-display text-3xl text-stone-950">Bron jarayoni</h2>
              </div>
              <Link href="/login" className="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-900 transition hover:bg-stone-100">
                Login
              </Link>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Zallar</p>
                <p className="mt-2 font-display text-3xl text-stone-950">{halls.length}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Xabarlar</p>
                <p className="mt-2 font-display text-3xl text-stone-950">{messages.length}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">24/7</p>
                <p className="mt-2 font-display text-3xl text-stone-950">Yordam</p>
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-stone-200">
            <h2 className="font-display text-3xl text-stone-950">So&apos;nggi Xabarlar</h2>
            <ul className="mt-4 space-y-2 text-sm text-stone-600">
              {statusFeed.length ? statusFeed.slice(0, 5).map((item, idx) => (
                <li key={`${item}-${idx}`} className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">{item}</li>
              )) : <li className="text-stone-500">Hozircha status yo&apos;q.</li>}
            </ul>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-stone-200">
            <h3 className="font-display text-3xl text-stone-950">Client-Admin Chat</h3>
            <p className="mt-2 text-sm text-stone-600">Room ID ni kiriting va yozishishni boshlang.</p>
            <input
              className="mt-4 w-full rounded-xl border border-stone-300 px-3 py-3 text-sm"
              value={chatRoomId}
              onChange={(e) => setChatRoomId(e.target.value)}
              placeholder="Room ID"
            />
            <ul className="mt-4 space-y-2 text-xs text-stone-600">
              {messages.map((message) => (
                <li key={message.id} className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">{message.body}</li>
              ))}
            </ul>
            <form onSubmit={sendChat} className="mt-4 flex gap-2">
              <input
                className="w-full rounded-xl border border-stone-300 px-3 py-3 text-sm"
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                placeholder="Xabar yozing"
              />
              <button className="rounded-xl bg-amber-300 px-4 py-3 text-xs font-semibold text-stone-950 transition hover:bg-amber-200">
                Yuborish
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
