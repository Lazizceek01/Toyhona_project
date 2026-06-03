"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";

type Shift = { id: string; shiftDate: string; note?: string };
type Task = { id: string; title: string; description?: string; assigneeId?: string; status: string };

const taskStatuses = ["todo", "doing", "done"];

export default function StaffPage() {
  const router = useRouter();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const hasToken = Boolean(getToken());
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(() =>
    hasToken ? "loading" : "idle"
  );
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [taskDrafts, setTaskDrafts] = useState<Record<string, string>>({});
  const [taskForm, setTaskForm] = useState({ title: "", description: "", assigneeId: "", dueDate: "" });

  const loadStaffData = useCallback(async () => {
    const [shiftList, taskList] = await Promise.all([apiFetch<Shift[]>("/staff/shifts"), apiFetch<Task[]>("/staff/tasks")]);
    setShifts(shiftList);
    setTasks(taskList);
    setTaskDrafts(
      taskList.reduce<Record<string, string>>((accumulator, task) => {
        accumulator[task.id] = task.status;
        return accumulator;
      }, {})
    );
    setStatus("ready");
  }, []);

  useEffect(() => {
    if (!getToken()) {
      return;
    }

    void (async () => {
      try {
        await loadStaffData();
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Staff ma'lumotlari yuklanmadi");
        setStatus("error");
      }
    })();
  }, [loadStaffData]);

  const logout = () => {
    clearToken();
    router.push("/login");
  };

  const refreshStaffData = async () => {
    setError("");
    setActionMessage("");

    try {
      await loadStaffData();
      setActionMessage("Ma'lumotlar yangilandi.");
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Yangilash amalga oshmadi");
    }
  };

  const createTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setActionMessage("");

    try {
      await apiFetch("/staff/tasks", {
        method: "POST",
        body: JSON.stringify(taskForm)
      });
      setTaskForm({ title: "", description: "", assigneeId: "", dueDate: "" });
      await refreshStaffData();
      setActionMessage("Yangi task qo'shildi.");
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Task qo'shilmadi");
    }
  };

  const updateTaskStatus = async (taskId: string) => {
    setError("");
    setActionMessage("");

    try {
      await apiFetch(`/staff/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: taskDrafts[taskId] })
      });
      await refreshStaffData();
      setActionMessage("Task statusi yangilandi.");
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Task yangilanmadi");
    }
  };

  const stats = [
    { label: "Vazifalar", value: String(tasks.length) },
    { label: "Smenalar", value: String(shifts.length) },
    { label: "Bugun bajarilgan", value: String(tasks.filter((task) => task.status === "done").length) }
  ];

  const eventRows = tasks.slice(0, 3);

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
              ["Tadbirlarim", "◫"],
              ["Xabarlar", "✉"],
              ["Hisob", "$"],
              ["Sozlamalar", "⚙"]
            ].map(([label, icon], idx) => (
              <div key={label} className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${idx === 0 ? "bg-[#f4ecd8] text-stone-900" : "hover:bg-stone-100"}`}>
                <span className="text-xs text-amber-700">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </nav>

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
                <p className="text-xs uppercase tracking-[0.42em] text-amber-700">Royal Palace</p>
                <h1 className="mt-3 font-display text-5xl leading-[0.95] text-stone-950 sm:text-6xl">
                  Xush kelibsiz, Aziz!
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
                  Smena, task va o&apos;tgan ishlar bir qarashda. Jamoa uchun toza, aniq va tez boshqaruv.
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-stone-500">Tizim holati: {status}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/login" className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-100">
                  Kirish
                </Link>
                <button onClick={refreshStaffData} className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800">
                  Yangilash
                </button>
              </div>
            </div>
          </header>

          {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">{error}</div> : null}
          {actionMessage ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">{actionMessage}</div> : null}

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <article key={item.label} className="rounded-[1.8rem] border border-stone-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
                <p className="text-xs uppercase tracking-[0.35em] text-amber-700">{item.label}</p>
                <p className="mt-4 font-display text-4xl text-stone-950">{item.value}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                <div
                  className="min-h-[360px] bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=80')"
                  }}
                />
                <div className="p-7 lg:p-8">
                  <p className="text-xs uppercase tracking-[0.38em] text-amber-700">Sizning keyingi tadbiringiz</p>
                  <h2 className="mt-3 font-display text-4xl leading-tight text-stone-950">Oltin Zalda to&apos;y marosimi</h2>
                  <p className="mt-4 text-sm leading-7 text-stone-600">
                    Boshqaruv paneli yordamida navbatdagi tadbirlar, xabarlar va vazifalar aniq ko&apos;rinadi.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm">
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Sana</p>
                      <p className="mt-2 font-semibold text-stone-950">15-Oktabr, 2024</p>
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Mehmonlar</p>
                      <p className="mt-2 font-semibold text-stone-950">250 kishi</p>
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Holat</p>
                      <p className="mt-2 font-semibold text-stone-950">Faol</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white">Tafsilotlarni ko&apos;rish</button>
                    <button className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-900">Tahlil</button>
                  </div>
                </div>
              </div>
            </article>

            <div className="space-y-5">
              <article className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                <p className="text-xs uppercase tracking-[0.36em] text-amber-700">So&apos;nggi xabarlar</p>
                <div className="mt-4 space-y-3 text-sm text-stone-600">
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">Menejerdan: zal tayyorlash jadvali yangilandi.</div>
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">Catering guruhiga kechagi buyurtma biriktirildi.</div>
                </div>
              </article>

              <article className="rounded-[2rem] border border-stone-200 bg-stone-900 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                <p className="text-xs uppercase tracking-[0.36em] text-amber-200">Imtiyoz</p>
                <h3 className="mt-3 font-display text-3xl leading-tight">Darajangiz</h3>
                <p className="mt-2 text-sm text-stone-300">Doimiy a&apos;zo</p>
                <p className="mt-6 font-display text-5xl text-amber-200">12,500</p>
                <p className="mt-2 text-sm text-stone-300">Kundalik nazorat uchun ballar.</p>
              </article>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.36em] text-amber-700">O&apos;tgan tadbirlar</p>
                  <h2 className="mt-2 font-display text-3xl text-stone-950">Tadbirlar tarixi</h2>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-stone-400">Hammasi</span>
              </div>
              <div className="mt-5 overflow-hidden rounded-[1.6rem] border border-stone-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50 text-[11px] uppercase tracking-[0.28em] text-stone-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Tadbir nomi</th>
                      <th className="px-4 py-3 font-medium">Sana</th>
                      <th className="px-4 py-3 font-medium">Zal</th>
                      <th className="px-4 py-3 font-medium">Hujjatlar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventRows.map((task, index) => (
                      <tr key={task.id} className="border-t border-stone-200">
                        <td className="px-4 py-4 font-medium text-stone-950">{task.title}</td>
                        <td className="px-4 py-4 text-stone-600">2024-0{index + 1}-22</td>
                        <td className="px-4 py-4 text-stone-600">Oltin Zal</td>
                        <td className="px-4 py-4 text-amber-700">Kvitansiya ↑</td>
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
                    <p className="text-xs uppercase tracking-[0.36em] text-amber-700">Vazifalar</p>
                    <h2 className="mt-2 font-display text-3xl text-stone-950">Bugungi ishlar</h2>
                  </div>
                  <button onClick={refreshStaffData} className="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-900 transition hover:bg-stone-100">
                    Yangilash
                  </button>
                </div>
                <div className="mt-5 space-y-3">
                  {tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="rounded-[1.4rem] border border-stone-200 bg-stone-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-stone-950">{task.title}</p>
                          <p className="text-sm text-stone-600">{task.description ?? "Tavsif kiritilmagan"}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700">{task.status}</span>
                      </div>
                      <div className="mt-4 flex gap-3">
                        <select value={taskDrafts[task.id] ?? task.status} onChange={(event) => setTaskDrafts((prev) => ({ ...prev, [task.id]: event.target.value }))} className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm">
                          {taskStatuses.map((taskStatus) => <option key={taskStatus} value={taskStatus}>{taskStatus}</option>)}
                        </select>
                        <button onClick={() => updateTaskStatus(task.id)} className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white">Saqlash</button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                <p className="text-xs uppercase tracking-[0.36em] text-amber-700">Smena</p>
                <ul className="mt-4 space-y-3 text-sm text-stone-600">
                  {shifts.map((shift) => (
                    <li key={shift.id} className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
                      <p className="font-semibold text-stone-950">{shift.shiftDate}</p>
                      <p className="mt-1">{shift.note ?? "Vazifa kiritilmagan"}</p>
                    </li>
                  ))}
                </ul>
              </article>

              <form onSubmit={createTask} className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                <p className="text-xs uppercase tracking-[0.36em] text-amber-700">Yangi vazifa</p>
                <h3 className="mt-2 font-display text-3xl text-stone-950">Yangi vazifa</h3>
                <div className="mt-4 space-y-3">
                  <input value={taskForm.title} onChange={(event) => setTaskForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Sarlavha" className="w-full rounded-xl border border-stone-300 px-3 py-3 text-sm" />
                  <textarea value={taskForm.description} onChange={(event) => setTaskForm((prev) => ({ ...prev, description: event.target.value }))} placeholder="Tavsif" className="min-h-24 w-full rounded-xl border border-stone-300 px-3 py-3 text-sm" />
                  <input value={taskForm.assigneeId} onChange={(event) => setTaskForm((prev) => ({ ...prev, assigneeId: event.target.value }))} placeholder="Mas'ul ID" className="w-full rounded-xl border border-stone-300 px-3 py-3 text-sm" />
                  <input type="date" value={taskForm.dueDate} onChange={(event) => setTaskForm((prev) => ({ ...prev, dueDate: event.target.value }))} className="w-full rounded-xl border border-stone-300 px-3 py-3 text-sm" />
                  <button className="w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white">Task qo&apos;shish</button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
