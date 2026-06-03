import Link from "next/link";

const stats = [
  { value: "250+", label: "o'tkazilgan tadbir" },
  { value: "98%", label: "mijozlar qoniqishi" },
  { value: "24/7", label: "real-time nazorat" }
];

const benefits = [
  {
    title: "To'y marosimi",
    text: "Nafis zal, bezak, joylashuv va servis bir ritmda boshqariladi."
  },
  {
    title: "Maqomli banket",
    text: "Yubiley, corporate yoki oilaviy kechalar uchun mos format va menyu."
  },
  {
    title: "Premium boshqaruv",
    text: "Bron, admin, staff va monitoring bitta qulay workflow ichida."
  }
];

const gallery = [
  {
    title: "Asosiy zal",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    className: "lg:col-span-2 lg:row-span-2"
  },
  {
    title: "Dekor zona",
    image:
      "https://images.unsplash.com/photo-1522413452208-996ff3f3e740?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Tantanali stol",
    image:
      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Tungi muhit",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80"
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8 lg:py-10">
      <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-950 text-white shadow-[0_30px_100px_rgba(15,23,42,0.24)]">
        <div
          className="relative min-h-[560px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1600&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,8,0.18),rgba(12,10,8,0.66))]" />
          <div className="relative flex min-h-[560px] flex-col items-center justify-center px-6 text-center">
            <p className="text-xs uppercase tracking-[0.52em] text-amber-200/80">ROYAL PALACE</p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
              Orzularingizdagi Tantanalar Maskani
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              To&apos;y marosimlari, banketlar va maxsus kechalar uchun hashamatli interyer,
              professional servis va aniq boshqaruv.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/booking" className="rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-200">
                Bron qilish
              </Link>
              <Link href="/halls" className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Zallarni ko&apos;rish
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-100 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div
            className="min-h-[420px] bg-cover bg-center grayscale"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80')"
            }}
          />
          <div className="absolute bottom-0 left-0 h-28 w-28 bg-amber-300" />
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <p className="text-xs uppercase tracking-[0.42em] text-amber-700">Biz haqimizda</p>
          <h2 className="mt-4 max-w-xl font-display text-4xl leading-tight text-stone-950">
            Har Bir Lahzani San&apos;at Asariga Aylantiramiz
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
            Royal Palace — nafis to&apos;y muhitini yaratishga ixtisoslashgan zamonaviy maskan.
            Bizning yondashuvimiz interyer, servis va event oqimini bir butun tajribaga aylantiradi.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
            Mijoz uchun sodda bron jarayoni, jamoa uchun esa aniqlik va real-time boshqaruv.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/booking" className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800">
              Bron qilish
            </Link>
            <Link href="/halls" className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100">
              Zallar
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <p className="font-display text-3xl text-stone-950">{item.value}</p>
                <p className="mt-1 text-sm text-stone-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.42em] text-amber-700">Nima uchun Biz?</p>
          <h2 className="mt-3 font-display text-4xl text-stone-950">Sizga mos xizmat va nafis ko&apos;rinish</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {benefits.map((item) => (
            <article key={item.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 h-10 w-10 border border-amber-300 bg-amber-100" />
              <h3 className="font-display text-2xl text-stone-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.42em] text-amber-700">Galereya</p>
            <h2 className="mt-3 font-display text-4xl text-stone-950">Tantanali muhitdan lavhalar</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[190px]">
          {gallery.map((item) => (
            <article
              key={item.title}
              className={`relative overflow-hidden rounded-[1.8rem] border border-stone-200 bg-stone-900 shadow-lg ${item.className ?? ""}`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-500 hover:scale-105"
                style={{ backgroundImage: `url('${item.image}')` }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.45))]" />
              <div className="relative flex h-full items-end p-5 text-white">
                <p className="font-display text-3xl">{item.title}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-[2rem] bg-stone-900 px-8 py-12 text-white shadow-[0_26px_90px_rgba(15,23,42,0.22)]">
          <p className="text-4xl leading-[1.5] text-stone-100 sm:text-5xl">
          “Bizning maqsadimiz — har bir voqeani unutilmas, har bir mehmonni hayratda qoldiradigan tajribaga aylantirish.”
        </p>
        <p className="mt-6 text-xs uppercase tracking-[0.42em] text-amber-200">Royal Palace jamoasi</p>
      </section>

      <section id="contact" className="mt-12 rounded-[2rem] border border-stone-200 bg-white px-8 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.42em] text-amber-700">CTA</p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl text-stone-950 sm:text-5xl">
              Sizning Mukammal Tantanangiz Shu Yerdan Boshlanadi
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
              Zallarni ko&apos;ring, bron qiling yoki admin panel orqali barcha jarayonlarni boshqaring.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/booking" className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800">
              Bron qilish
            </Link>
            <Link href="/halls" className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100">
              Zallarni ko&apos;rish
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
