"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";

type LoginResponse = {
  token: string;
  user: { id: string; email: string; role: string };
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@toyxona.uz");
  const [password, setPassword] = useState("123456");
  const [role, setRole] = useState("manager");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role })
      });

      setToken(data.token);

      if (data.user.role === "staff") {
        router.push("/staff");
        return;
      }

      if (data.user.role === "client") {
        router.push("/booking");
        return;
      }

      router.push("/admin");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Kirish amalga oshmadi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 lg:py-12">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <div className="relative overflow-hidden rounded-[2rem] border border-amber-200/40 bg-[linear-gradient(160deg,rgba(28,25,23,0.98),rgba(69,39,16,0.92)_55%,rgba(24,24,27,0.98))] p-8 text-white shadow-[0_24px_80px_rgba(120,53,15,0.28)] lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(250,204,21,0.22),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(251,191,36,0.12),_transparent_28%),linear-gradient(to_bottom_right,_rgba(255,255,255,0.04),_transparent_30%)]" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-amber-200">
              Access
            </div>

            <div className="max-w-3xl space-y-5">
              <p className="text-sm uppercase tracking-[0.35em] text-amber-200/80">Welcome back</p>
              <h1 className="font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                Tizimga kirish — premium panelga yo&apos;l
              </h1>
              <p className="max-w-2xl text-base leading-8 text-amber-50/80 sm:text-lg">
                Demo backend har qanday email/parolni qabul qiladi. Tanlangan rol sizni client,
                staff yoki admin oqimiga olib boradi.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/6 p-4 backdrop-blur-md">
                <p className="font-display text-3xl text-amber-200">1</p>
                <p className="mt-1 text-sm text-white/70">Kiruvchi sahifa</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/6 p-4 backdrop-blur-md">
                <p className="font-display text-3xl text-amber-200">4</p>
                <p className="mt-1 text-sm text-white/70">Rol varianti</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/6 p-4 backdrop-blur-md">
                <p className="font-display text-3xl text-amber-200">24/7</p>
                <p className="mt-1 text-sm text-white/70">Platforma kirishi</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="w-full space-y-4 rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
          <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.4rem] bg-[linear-gradient(180deg,rgba(120,53,15,0.96),rgba(28,25,23,0.96))] p-5 text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Kirish paneli</p>
              <h2 className="mt-3 font-display text-3xl leading-tight">Login, rol va yo&apos;nalish</h2>
              <p className="mt-3 text-sm leading-6 text-amber-50/75">
                Foydalanuvchi platformadagi kerakli oqimga bir zumda o&apos;tadi.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Demo</p>
              <p className="mt-4 font-display text-2xl text-slate-950">Hamma rol ochiq</p>
              <p className="mt-2 text-sm text-slate-600">super_admin, manager, staff va client.</p>
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Parol</span>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Rol</span>
            <select
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="super_admin">super_admin</option>
              <option value="manager">manager</option>
              <option value="staff">staff</option>
              <option value="client">client</option>
            </select>
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
            {loading ? "Kirilmoqda..." : "Kirish"}
          </button>
        </form>
      </section>
    </main>
  );
}
