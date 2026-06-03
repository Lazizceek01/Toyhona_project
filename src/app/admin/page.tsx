const stats = [
  { label: "Bugungi bookinglar", value: "18" },
  { label: "Tasdiqlanganlar", value: "14" },
  { label: "Kutilayotgan to'lovlar", value: "4" },
  { label: "O'rtacha javob vaqti", value: "2m" }
];

const queue = [
  { name: "Murod va Dilnoza", status: "Tasdiq kutilyapti", date: "12 iyun" },
  { name: "Azizxon oilasi", status: "To'lov bosqichi", date: "18 iyun" },
  { name: "Nilufar bayrami", status: "Hall tayyor", date: "25 iyun" }
];

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
          Admin dashboard
        </p>
        <h1 className="mt-5 font-display text-4xl tracking-tight text-slate-950 sm:text-5xl">
          Bookinglar, to&apos;lovlar va real-time jarayonlar bir joyda
        </h1>
        <p className="mt-4 max-w-3xl text-slate-600">
          Bu sahifa keyingi bosqichda backend ma&apos;lumotlari bilan bog&apos;lanishga tayyor. Hozircha
          u rahbar uchun toza va tushunarli dashboard sifatida ishlaydi.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="font-display text-3xl tracking-tight text-slate-950">Navbat holati</h2>
          <div className="mt-6 space-y-4">
            {queue.map((item) => (
              <article key={item.name} className="rounded-3xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-950">{item.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{item.status}</p>
                  </div>
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                    {item.date}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-sm">
          <p className="text-sm uppercase tracking-[0.28em] text-rose-200">Live ops</p>
          <h2 className="mt-4 font-display text-3xl tracking-tight">Operatsion panel</h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Admin sahifasi orqali hali real API bo&apos;lmasa ham, jarayon logikasi, navbat va
            tasdiqlash oqimi aniq ko&apos;rinadi.
          </p>

          <div className="mt-6 space-y-3 text-sm text-slate-200">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Status update: 3 booking tekshirildi</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Payment queue: 2 yangi yozuv</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Hall availability: 1 slot bo&apos;sh</div>
          </div>
        </aside>
      </section>
    </main>
  );
}