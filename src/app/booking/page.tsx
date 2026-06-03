"use client";

import { FormEvent, useState } from "react";

type BookingFormData = {
  fullName: string;
  phone: string;
  date: string;
  guestCount: string;
  eventType: string;
};

const initialForm: BookingFormData = {
  fullName: "",
  phone: "",
  date: "",
  guestCount: "",
  eventType: "To'y"
};

const eventTypes = ["To'y", "Nishon", "Tug'ilgan kun", "Korxona tadbiri"];

export default function BookingPage() {
  const [form, setForm] = useState<BookingFormData>(initialForm);
  const [submitted, setSubmitted] = useState<BookingFormData | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(form);
    setForm(initialForm);
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-sm backdrop-blur">
          <div className="inline-flex rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
            Bron qilish markazi
          </div>
          <h1 className="mt-4 font-display text-4xl tracking-tight text-slate-950 sm:text-5xl">
            To&apos;yxona uchun tez va tushunarli booking shakli
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Sana, tadbir turi, mehmonlar soni va aloqa ma&apos;lumotlarini kiriting. Demo holatda
            bo&apos;lsa ham, foydalanuvchi oqimi real servisga tayyor tuzilgan.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Tadbir turi</span>
                <select
                  value={form.eventType}
                  onChange={(event) => setForm({ ...form, eventType: event.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                >
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Mehmonlar soni</span>
                <input
                  required
                  min={20}
                  max={1000}
                  type="number"
                  value={form.guestCount}
                  onChange={(event) => setForm({ ...form, guestCount: event.target.value })}
                  placeholder="Masalan, 250"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">F.I.Sh</span>
              <input
                required
                type="text"
                value={form.fullName}
                onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                placeholder="Ismingizni kiriting"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Telefon</span>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                placeholder="+998 90 123 45 67"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">To&apos;y sanasi</span>
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm({ ...form, date: event.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              So&apos;rov yuborish
            </button>
          </form>
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="font-display text-3xl tracking-tight text-slate-950">Bron xulosasi</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Formani yuborganingizdan keyin shu panelda qisqa xulosa ko&apos;rinadi. Keyin buni real
            backendga ulash oson bo&apos;ladi.
          </p>
          {!submitted ? (
            <div className="mt-6 space-y-3 rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Bugungi afzalliklar</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Tez bron shakli</li>
                <li>• Real-time status oqimi</li>
                <li>• Mijoz xabarlari uchun tayyor UI</li>
              </ul>
            </div>
          ) : (
            <div className="mt-6 space-y-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Mijoz:</span> {submitted.fullName}
                </p>
                <p>
                  <span className="font-semibold">Telefon:</span> {submitted.phone}
                </p>
                <p>
                  <span className="font-semibold">Sana:</span> {submitted.date}
                </p>
                <p>
                  <span className="font-semibold">Mehmonlar:</span> {submitted.guestCount}
                </p>
                <p>
                  <span className="font-semibold">Tadbir turi:</span> {submitted.eventType}
                </p>
              </div>
              <p className="rounded-2xl bg-white px-4 py-3 text-emerald-700 shadow-sm">
                So&apos;rov demo rejimda qabul qilindi.
              </p>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
