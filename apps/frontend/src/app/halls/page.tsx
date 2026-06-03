import Link from "next/link";

const halls = [
  {
    name: "Oltin Zal",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=80",
    text:
      "Katta tantanalar uchun mo‘ljallangan, oltin ohangdagi hashamatli interyer va yorug‘lik bilan bezatilgan asosiy zal.",
    detail: "120–250 mehmon · Premium servis · Sahna va raqs maydoni"
  },
  {
    name: "Kumush Zal",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80",
    text:
      "Keng banketlar va rasmiy marosimlar uchun mo‘ljallangan sovuq, nafis va zamonaviy ko‘rinish.",
    detail: "90–180 mehmon · Zamonaviy dekor · Toza minimalist uslub"
  },
  {
    name: "VIP Kichik Zal",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80",
    text:
      "Yaqin do‘stlar va oilaviy tantanalar uchun qulay, sokin va shaxsiy atmosfera.",
    detail: "30–70 mehmon · Intim muhit · VIP xizmat"
  }
];

export default function HallsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8 lg:py-10">
      <section className="rounded-[2rem] border border-stone-200 bg-white px-6 py-14 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:px-10">
        <p className="text-xs uppercase tracking-[0.42em] text-amber-700">ROYAL PALACE</p>
        <h1 className="mt-4 font-display text-5xl leading-[1.05] text-stone-950 sm:text-6xl">
          Bizning Tantanavor Zallarimiz
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-stone-600 sm:text-base">
          Har bir zal o‘z atmosferasi, sig‘imi va uslubiga ega. Quyida sizga mos muhitni tanlang va bron jarayonini boshlang.
        </p>
      </section>

      <section className="mt-12 space-y-10">
        {halls.map((hall, index) => (
          <article
            key={hall.name}
            className={`grid gap-6 items-center lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
          >
            <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-100 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <div
                className="min-h-[320px] bg-cover bg-center"
                style={{ backgroundImage: `url('${hall.image}')` }}
              />
            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.42em] text-amber-700">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-4 font-display text-4xl text-stone-950">{hall.name}</h2>
              <p className="mt-4 text-sm leading-7 text-stone-600">{hall.text}</p>
              <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
                {hall.detail}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/booking" className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800">
                  Bron qilish
                </Link>
                <Link href="/#contact" className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100">
                  Batafsil
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-[2rem] bg-[#f3ead8] px-8 py-12 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.42em] text-amber-800">Xizmat</p>
            <h2 className="mt-4 font-display text-4xl text-stone-950 sm:text-5xl">
              O&apos;zingizga mos to&apos;yxona xonasini tez tanlang
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
              Zallarni solishtiring, bronni boshlang va jamoamizdan mos taklif oling.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/booking" className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800">
              Bron qilish
            </Link>
            <Link href="/" className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-white">
              Bosh sahifa
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}