"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WsEvents } from "@toyxona/shared";
import { apiFetch } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";
import { socket } from "@/lib/socket";

type Hall = { id: string; name: string; capacity: number; pricePerSeat: number };
type Booking = {
  id: string;
  hallId: string;
  hall?: { name: string };
  fullName: string;
  status: string;
  eventDate: string;
};
type Payment = { id: string; amount: number; status: string };

const bookingStatuses = ["pending", "confirmed", "cancelled"];

export default function AdminPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [liveStats, setLiveStats] = useState<string[]>([]);
  const hasToken = Boolean(getToken());
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(() =>
    hasToken ? "loading" : "idle"
  );
  const [error, setError] = useState("");
  const [bookingStatusDrafts, setBookingStatusDrafts] = useState<Record<string, string>>({});
  const [hallForm, setHallForm] = useState({ name: "", capacity: 200, pricePerSeat: 150000 });
  const [paymentForm, setPaymentForm] = useState({ bookingId: "", amount: 0, status: "pending" });
  const [actionMessage, setActionMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    const [bookingList, paymentList, hallList] = await Promise.all([
      apiFetch<Booking[]>("/bookings"),
      apiFetch<Payment[]>("/payments"),
      apiFetch<Hall[]>("/halls")
    ]);

    setBookings(bookingList);
    setPayments(paymentList);
    setHalls(hallList);
    setBookingStatusDrafts(
      bookingList.reduce<Record<string, string>>((accumulator, booking) => {
        accumulator[booking.id] = booking.status;
        return accumulator;
      }, {})
    );
    setPaymentForm((prev) => ({
      ...prev,
      bookingId: prev.bookingId || bookingList[0]?.id || ""
    }));
    setStatus("ready");
  }, []);

  useEffect(() => {
    if (!getToken()) {
      return;
    }

    void (async () => {
      try {
        await loadDashboard();
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Dashboard yuklanmadi");
        setStatus("error");
      }
    })();
  }, [loadDashboard]);

  useEffect(() => {
    socket.connect();
    socket.emit("join:dashboard");
    socket.on(WsEvents.DASHBOARD_STATS, (event: { type: string; bookingId: string }) => {
      setLiveStats((prev) => [`${event.type}: ${event.bookingId}`, ...prev].slice(0, 8));
    });
    return () => {
      socket.off(WsEvents.DASHBOARD_STATS);
      socket.disconnect();
    };
  }, []);

  const logout = () => {
    clearToken();
    router.push("/login");
  };

  const refreshDashboard = async () => {
    setError("");
    setActionMessage("");

    try {
      await loadDashboard();
      setActionMessage("Ma'lumotlar yangilandi.");
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Yangilash amalga oshmadi");
    }
  };

  const createHall = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setActionMessage("");

    try {
      await apiFetch("/halls", {
        method: "POST",
        body: JSON.stringify(hallForm)
      });
      setHallForm({ name: "", capacity: 200, pricePerSeat: 150000 });
      await refreshDashboard();
      setActionMessage("Yangi zal yaratildi.");
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Zal yaratilmadi");
    }
  };

  const updateBookingStatus = async (bookingId: string) => {
    setError("");
    setActionMessage("");

    try {
      await apiFetch(`/bookings/${bookingId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: bookingStatusDrafts[bookingId] })
      });
      await refreshDashboard();
      setActionMessage("Booking statusi yangilandi.");
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Status yangilanmadi");
    }
  };

  const createPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setActionMessage("");

    try {
      await apiFetch("/payments", {
        method: "POST",
        body: JSON.stringify(paymentForm)
      });
      await refreshDashboard();
      setActionMessage("To'lov yozuvi qo'shildi.");
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : "To'lov qo'shilmadi");
    }
  };

  const monthlyRevenue = [
    { month: "JAN", value: 38 },
    { month: "FEB", value: 52 },
    { month: "MAR", value: 49 },
    { month: "APR", value: 61 },
    { month: "MAY", value: 58 },
    { month: "JUN", value: 74 },
    { month: "JUL", value: 69 },
    { month: "AUG", value: 83 },
    { month: "SEP", value: 79 },
    { month: "OCT", value: 92 },
    { month: "NOV", value: 88 },
    { month: "DEC", value: 96 }
  ];

  const serviceRows = [
    { name: "Katering xizmati", item: 142, revenue: "$420k", growth: "+12%" },
    { name: "Gul bezagi", item: 86, revenue: "$95k", growth: "+8%" },
    { name: "Yoritish va effekt", item: 114, revenue: "$220k", growth: "+21%" }
  ];

  const recentActivity = bookings.slice(0, 4).map((booking, index) => ({
    client: booking.fullName,
    venue: booking.hall?.name ?? booking.hallId,
    date: booking.eventDate,
    status: booking.status,
    label: index === 0 ? "YANGI" : index === 1 ? "KUTILMOQDA" : index === 2 ? "TASDIQLANGAN" : "JARAYONDA"
  }));

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-4 lg:px-5 lg:py-5">
      <section className="grid min-h-[calc(100vh-2rem)] gap-5 xl:grid-cols-[260px_1fr]">
        <aside className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div>
            <p className="font-display text-3xl tracking-[0.16em] text-stone-900">Royal Palace</p>
            <p className="mt-1 text-xs uppercase tracking-[0.34em] text-amber-700">Boshqaruv tizimi</p>
          </div>

          <nav className="mt-8 space-y-2 text-sm font-medium text-stone-600">
            {[
              ["Boshqaruv", "■"],
              ["Kalendar", "◫"],
              ["Bronlar", "⌂"],
              ["Xizmatlar", "◉"],
              ["Moliya", "$"]
            ].map(([label, icon], idx) => (
              <div key={label} className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${idx === 0 ? "bg-[#f4ecd8] text-stone-900" : "hover:bg-stone-100"}`}>
                <span className="text-xs text-amber-700">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </nav>

          <button onClick={refreshDashboard} className="mt-8 w-full rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800">
            + Yangi bron
          </button>

          <div className="mt-8 space-y-3 text-sm text-stone-500">
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3 hover:bg-stone-100">Yordam</div>
            <button onClick={logout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left hover:bg-stone-100">
              Chiqish
            </button>
          </div>
        </aside>

        <div className="space-y-5">
          <header className="rounded-[2rem] border border-stone-200 bg-white px-6 py-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.42em] text-amber-700">Royal Palace boshqaruvi</p>
                <h1 className="mt-3 font-display text-5xl leading-[0.95] text-stone-950 sm:text-6xl">
                  Umumiy ko&apos;rinish
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
                  Zal faoliyati va jonli bron oqimi bo&apos;yicha strategik ko&apos;rsatkichlar.
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-stone-500">{halls.length} ta zal boshqarilmoqda</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/login" className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-100">
                  Kirish
                </Link>
                <button onClick={logout} className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800">
                  Chiqish
                </button>
              </div>
            </div>
          </header>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">{error}</div>
          ) : null}
          {actionMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">{actionMessage}</div>
          ) : null}

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Jami bronlar", bookings.length.toLocaleString(), "O'tgan oyga +12%"],
              ["Faol tadbirlar", String(halls.length), "Mavsum cho'qqisi"],
              ["Oylik daromad", "$2.4M", "Reja oshmoqda"],
              ["Kutilayotgan so'rovlar", String(bookings.filter((booking) => booking.status === "pending").length), "Shoshilinch"]
            ].map(([label, value, sub]) => (
              <article key={label} className="rounded-[1.8rem] border border-stone-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
                <p className="text-[11px] uppercase tracking-[0.35em] text-amber-700">{sub}</p>
                <p className="mt-4 text-sm uppercase tracking-[0.2em] text-stone-500">{label}</p>
                <p className="mt-2 font-display text-4xl text-stone-950">{value}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.36em] text-amber-700">Yillik daromad</p>
                  <h2 className="mt-2 font-display text-3xl text-stone-950">Daromad 2024</h2>
                </div>
                <button className="rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white">Hisobotni yuklash</button>
              </div>
              <div className="mt-8 rounded-[1.8rem] border border-stone-200 bg-stone-50 p-5">
                <div className="flex h-64 items-stretch gap-3">
                  {monthlyRevenue.map((item) => (
                    <div key={item.month} className="flex flex-1 flex-col items-center gap-3">
                      <div className="flex w-full flex-1 items-end justify-center">
                        <div className="w-full max-w-7 rounded-t-full bg-[linear-gradient(180deg,#b48a1e,#3f2a07)]" style={{ height: `${item.value}%` }} />
                      </div>
                      <span className="text-[10px] font-semibold tracking-[0.2em] text-stone-500">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <div className="grid gap-5">
              <article className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.36em] text-amber-700">Zal bandligi</p>
                    <h2 className="mt-2 font-display text-3xl text-stone-950">Jami 88%</h2>
                  </div>
                  <div className="h-24 w-24 rounded-full" style={{ background: "conic-gradient(#b48a1e 0 88%, #e5e7eb 88% 100%)" }} />
                </div>
                <ul className="mt-5 space-y-2 text-sm text-stone-600">
                  <li className="flex justify-between"><span>Oltin Zal</span><span>60%</span></li>
                  <li className="flex justify-between"><span>Kumush Zal</span><span>30%</span></li>
                  <li className="flex justify-between"><span>VIP Zal</span><span>10%</span></li>
                </ul>
              </article>

              <article className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.36em] text-amber-700">Ommabop xizmatlar</p>
                    <h2 className="mt-2 font-display text-3xl text-stone-950">Daromad manbalari</h2>
                  </div>
                </div>
                <div className="mt-5 space-y-4 text-sm">
                  {serviceRows.map((row) => (
                    <div key={row.name} className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
                      <div>
                        <p className="font-medium text-stone-950">{row.name}</p>
                        <p className="text-xs text-stone-500">Bitimlar {row.item}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-stone-950">{row.revenue}</p>
                        <p className="text-xs text-emerald-600">{row.growth}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.36em] text-amber-700">So&apos;nggi faollik</p>
                  <h2 className="mt-2 font-display text-3xl text-stone-950">Jonli bron navbati</h2>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-stone-400">Hammasi</span>
              </div>
              <div className="mt-5 overflow-hidden rounded-[1.6rem] border border-stone-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50 text-[11px] uppercase tracking-[0.28em] text-stone-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Mijoz</th>
                      <th className="px-4 py-3 font-medium">Zal</th>
                      <th className="px-4 py-3 font-medium">Sana</th>
                      <th className="px-4 py-3 font-medium">Holat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((item) => (
                      <tr key={`${item.client}-${item.date}`} className="border-t border-stone-200">
                        <td className="px-4 py-4 font-medium text-stone-950">{item.client}</td>
                        <td className="px-4 py-4 text-stone-600">{item.venue}</td>
                        <td className="px-4 py-4 text-stone-600">{item.date}</td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-emerald-700">
                            {item.label}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <div className="space-y-5">
              <article className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.36em] text-amber-700">Tezkor amallar</p>
                    <h2 className="mt-2 font-display text-3xl text-stone-950">Bronlarni boshqarish</h2>
                  </div>
                  <button onClick={refreshDashboard} className="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-900 transition hover:bg-stone-100">
                    Yangilash
                  </button>
                </div>
                <div className="mt-5 space-y-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="rounded-[1.4rem] border border-stone-200 bg-stone-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-stone-950">{booking.fullName}</p>
                          <p className="text-sm text-stone-600">{booking.hall?.name ?? booking.hallId} · {booking.eventDate}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-700">
                          {booking.status}
                        </span>
                      </div>
                      <div className="mt-4 flex gap-3">
                        <select
                          value={bookingStatusDrafts[booking.id] ?? booking.status}
                          onChange={(event) => setBookingStatusDrafts((prev) => ({ ...prev, [booking.id]: event.target.value }))}
                          className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
                        >
                          {bookingStatuses.map((bookingStatus) => (
                            <option key={bookingStatus} value={bookingStatus}>{bookingStatus}</option>
                          ))}
                        </select>
                        <button onClick={() => updateBookingStatus(booking.id)} className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white">
                          Saqlash
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                <p className="text-xs uppercase tracking-[0.36em] text-amber-700">Jonli navbat</p>
                <ul className="mt-4 space-y-2 text-sm text-stone-600">
                  {liveStats.length ? liveStats.map((item, idx) => (
                    <li key={`${item}-${idx}`} className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">{item}</li>
                  )) : <li className="text-stone-500">Live event yo&apos;q.</li>}
                </ul>
              </article>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[0.95fr_0.95fr_0.95fr]">
            <form onSubmit={createHall} className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <p className="text-xs uppercase tracking-[0.36em] text-amber-700">Yangi zal</p>
              <h3 className="mt-2 font-display text-3xl text-stone-950">Yangi zal qo&apos;shish</h3>
              <div className="mt-4 space-y-3">
                <input value={hallForm.name} onChange={(event) => setHallForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Zal nomi" className="w-full rounded-xl border border-stone-300 px-3 py-3 text-sm" />
                <input type="number" value={hallForm.capacity} onChange={(event) => setHallForm((prev) => ({ ...prev, capacity: Number(event.target.value) }))} placeholder="Sig'imi" className="w-full rounded-xl border border-stone-300 px-3 py-3 text-sm" />
                <input type="number" value={hallForm.pricePerSeat} onChange={(event) => setHallForm((prev) => ({ ...prev, pricePerSeat: Number(event.target.value) }))} placeholder="Narx" className="w-full rounded-xl border border-stone-300 px-3 py-3 text-sm" />
                <button className="w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white">Zal yaratish</button>
              </div>
            </form>

            <form onSubmit={createPayment} className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <p className="text-xs uppercase tracking-[0.36em] text-amber-700">To&apos;lovlar</p>
              <h3 className="mt-2 font-display text-3xl text-stone-950">To&apos;lov qo&apos;shish</h3>
              <div className="mt-4 space-y-3">
                <select value={paymentForm.bookingId} onChange={(event) => setPaymentForm((prev) => ({ ...prev, bookingId: event.target.value }))} className="w-full rounded-xl border border-stone-300 px-3 py-3 text-sm">
                  {bookings.map((booking) => (
                    <option key={booking.id} value={booking.id}>{booking.fullName}</option>
                  ))}
                </select>
                <input type="number" value={paymentForm.amount} onChange={(event) => setPaymentForm((prev) => ({ ...prev, amount: Number(event.target.value) }))} placeholder="Summa" className="w-full rounded-xl border border-stone-300 px-3 py-3 text-sm" />
                <select value={paymentForm.status} onChange={(event) => setPaymentForm((prev) => ({ ...prev, status: event.target.value }))} className="w-full rounded-xl border border-stone-300 px-3 py-3 text-sm">
                  <option value="pending">pending</option>
                  <option value="paid">paid</option>
                  <option value="failed">failed</option>
                  <option value="refunded">refunded</option>
                </select>
                <button className="w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white">To&apos;lovni saqlash</button>
              </div>
            </form>

            <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <p className="text-xs uppercase tracking-[0.36em] text-amber-700">Bildirishnomalar</p>
              <h3 className="mt-2 font-display text-3xl text-stone-950">Tizim holati</h3>
              <div className="mt-4 rounded-[1.4rem] bg-stone-50 p-4 text-sm text-stone-600">
                {status === "loading" ? "Dashboard yuklanmoqda..." : "Tizim faol, real-time oqim ishlayapti."}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Pending</p>
                  <p className="mt-2 font-display text-3xl text-stone-950">{bookings.filter((booking) => booking.status === "pending").length}</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Paid</p>
                  <p className="mt-2 font-display text-3xl text-stone-950">{payments.filter((payment) => payment.status === "paid").length}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
