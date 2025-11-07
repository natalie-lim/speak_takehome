export default function Studio() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-sky-50 via-white to-slate-100 px-6 text-center text-slate-700">
      <div className="rounded-3xl bg-white/90 px-8 py-10 shadow-xl backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-sky-500">
          Session Ready
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">
          Welcome to your Speaking Studio
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
          Here you&apos;ll find personalized prompts, pronunciation feedback,
          and live conversation partners aligned with your goals.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
        <div className="rounded-2xl bg-white px-5 py-4 shadow">
          🎙️ Live practice queue
        </div>
        <div className="rounded-2xl bg-white px-5 py-4 shadow">
          📝 Prompt library
        </div>
        <div className="rounded-2xl bg-white px-5 py-4 shadow">
          📊 Progress timeline
        </div>
      </div>
    </main>
  );
}
