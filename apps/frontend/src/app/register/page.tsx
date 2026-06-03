"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";

type RegisterResponse = {
  token: string;
  user: { id: string; email: string; role: string };
};

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          email,
          password,
          ...(phone ? { phone } : {})
        })
      });

      setToken(data.token);
      router.push("/booking");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ro'yxatdan o'tish amalga oshmadi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-xl px-6 py-8 lg:py-12">
      <form onSubmit={submit} className="w-full space-y-4 rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
        <div className="rounded-[1.4rem] bg-[linear-gradient(180deg,rgba(120,53,15,0.96),rgba(28,25,23,0.96))] p-5 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Ro&apos;yxatdan o&apos;tish</p>
          <h1 className="mt-3 font-display text-3xl leading-tight">Yangi client hisobi</h1>
          <p className="mt-3 text-sm leading-6 text-amber-50/75">
            Ro&apos;yxatdan o&apos;tgach to&apos;g&apos;ridan-to&apos;g&apos;ri bron sahifasiga o&apos;tasiz.
          </p>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">F.I.Sh</span>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Telefon (ixtiyoriy)</span>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Parol (kamida 6 belgi)</span>
          <input
            type="password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Yuborilmoqda..." : "Ro'yxatdan o'tish"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Hisobingiz bormi?{" "}
          <Link href="/login" className="font-semibold text-slate-950 underline">
            Kirish
          </Link>
        </p>
      </form>
    </main>
  );
}
