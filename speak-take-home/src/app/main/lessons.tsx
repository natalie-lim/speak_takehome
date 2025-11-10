import Image from "next/image";
import Logo from "../assets/logo.webp";

export default function LessonsView() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 text-center text-slate-600">
      <Image src={Logo} alt="Speak logo" width={100} height={100} priority />
      <h1 className="text-2xl font-semibold text-slate-900">Lessons</h1>
      <p className="max-w-sm text-sm leading-6">
        Lesson playback and feedback will land here soon. Keep practicing while
        we prepare fresh material for you.
      </p>
    </section>
  );
}
