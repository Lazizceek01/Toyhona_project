export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-6xl items-center px-6 py-12 lg:py-16">
      <section className="grid w-full gap-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.75rem] bg-slate-950 p-8 text-white">
          <p className="text-sm uppercase tracking-[0.28em] text-rose-200">Safe access</p>
          <h1 className="mt-4 font-display text-4xl tracking-tight">Kirish paneli</h1>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Admin va staff hisoblari keyinchalik autentifikatsiya bilan ulanish uchun tayyor
            ko&apos;rinishda tuzildi.
          </p>
        </div>

        <div className="flex flex-col justify-center p-2 lg:p-8">
          <h2 className="font-display text-3xl tracking-tight text-slate-950">Hisobga kirish</h2>
          <p className="mt-3 text-sm text-slate-600">
            Demo interfeys. Hozircha bu sahifa login oqimining dizaynini tayyorlab turadi.
          </p>
          <form className="mt-8 space-y-4">
            <input
              type="email"
              placeholder="Email manzil"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
            <input
              type="password"
              placeholder="Parol"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
            <button className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Kirish
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}