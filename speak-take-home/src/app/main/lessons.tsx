import Image from "next/image";
import Logo from "../assets/logo.webp";
import type { Course } from "./types";

type LessonsViewProps = {
  course: Course | null;
  onBack: () => void;
  onStart: (course: Course, lessonTitle: string) => void;
};

export default function LessonsView({
  course,
  onBack,
  onStart,
}: LessonsViewProps) {
  if (!course) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 text-center text-slate-600">
        <Image src={Logo} alt="Speak logo" width={100} height={100} priority />
        <h1 className="text-2xl font-semibold text-slate-900">
          Select a course
        </h1>
        <p className="max-w-sm text-sm leading-6">
          Choose a language track to view its active lessons and warm-up drills.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="rounded-full bg-sky-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-sky-700"
        >
          Browse courses
        </button>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col items-center justify-center gap-6 text-center text-slate-600">
      <div className="flex flex-col items-center gap-3">
        <span className="text-4xl">{course.flag}</span>
        <h1 className="text-3xl font-semibold text-slate-900">{course.name}</h1>
        <p className="max-w-sm text-sm leading-6 text-slate-500">
          {course.subtitle}
        </p>
      </div>

      <div className="grid w-full max-w-xl gap-4 text-left">
        {course.lessons.map((lesson) => (
          <article
            key={lesson.id}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-sky-200 hover:shadow-md"
          >
            <header className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {lesson.title}
              </h2>
              <span className="text-xs font-semibold uppercase tracking-wide text-sky-500">
                {lesson.duration}
              </span>
            </header>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {lesson.summary}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => onStart(course, lesson.title)}
                className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-sky-700"
              >
                Practice now
              </button>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-sky-200 hover:text-sky-600"
      >
        Back to courses
      </button>
    </section>
  );
}
