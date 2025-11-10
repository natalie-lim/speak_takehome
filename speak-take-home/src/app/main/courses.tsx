import Image from "next/image";
import Logo from "../assets/logo.webp";
import type { Course } from "./types";

type CoursesViewProps = {
  courses: Course[];
  activeCourseId?: string | null;
  onSelectCourse: (course: Course) => void;
  onOpenRecord: (course: Course) => void;
};

export default function CoursesView({
  courses,
  activeCourseId,
  onSelectCourse,
  onOpenRecord,
}: CoursesViewProps) {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-4 text-center text-slate-600">
      <Image src={Logo} alt="Speak logo" width={100} height={100} priority />
      <h1 className="text-2xl font-semibold text-slate-900">Courses</h1>
      <p className="max-w-sm text-sm leading-6 text-slate-500">
        Choose a language path to jump into curated speaking prompts and
        goal-based lessons.
      </p>

      <div className="mt-8 flex w-full max-w-md flex-col gap-3">
        {courses.map((course) => (
          <article
            key={course.id}
            className={`rounded-2xl border px-5 py-4 text-left shadow-sm transition ${
              activeCourseId === course.id
                ? "border-sky-300 bg-sky-50 text-sky-700"
                : "border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">{course.flag}</span>
              <div className="flex-1 px-4">
                <p className="font-semibold text-slate-900">{course.name}</p>
                <p className="text-xs text-slate-500">{course.subtitle}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => onSelectCourse(course)}
                className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-sky-200 hover:text-sky-600"
              >
                View lessons
              </button>
              <button
                type="button"
                onClick={() => onOpenRecord(course)}
                className="flex-1 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-sky-700"
              >
                Start speaking
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
