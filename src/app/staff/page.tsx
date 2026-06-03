const tasks = [
  { title: "Zal tayyorlash", detail: "Stol joylashuvi va bezakni tekshiring." },
  { title: "Mijozga javob", detail: "Bron bo&apos;yicha yangi savollarga javob bering." },
  { title: "Xizmatlar monitoringi", detail: "Oziq-ovqat va texnik ehtiyojlarni kuzating." }
];

export default function StaffPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="inline-flex rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            Staff panel
          </p>
          <h1 className="mt-5 font-display text-4xl tracking-tight text-slate-950 sm:text-5xl">
            Smena, vazifa va xizmat sifati uchun tezkor markaz
          </h1>
          <p className="mt-4 text-slate-600">
            Xodimlar uchun asosiy ma&apos;lumotlar bitta joyda jamlangan. Keyinchalik bu yerga
            topshiriqlar, chek-listlar va bildirishnomalar qo&apos;shiladi.
          </p>
        </div>

        <div className="grid gap-4">
          {tasks.map((task, index) => (
            <article key={task.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                  0{index + 1}
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">{task.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{task.detail}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}