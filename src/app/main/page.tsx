"use client";
import { Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import CoursesView from "./courses";
import LessonsView from "./lessons";
import Record from "./record";
import type { Course } from "./types";

type ActiveView = "record" | "courses" | "lessons";

const navOptions: Array<{ label: string; value: ActiveView }> = [
  { label: "Profile & Voice", value: "record" },
  { label: "Browse Courses", value: "courses" },
  { label: "View Lessons", value: "lessons" },
];

const courseCatalog: Course[] = [
  {
    id: "fr",
    flag: "🇫🇷",
    name: "French Français",
    subtitle: "Daily Parisian dialogues and pronunciation drills.",
    lessons: [
      {
        id: "fr-1",
        title: "Ordering at the café",
        summary:
          "Practice casual greetings, ordering drinks, and confirming the bill with native pacing.",
        duration: "12 min",
      },
      {
        id: "fr-2",
        title: "Weekend plans",
        summary:
          "Learn to suggest activities, respond enthusiastically, and negotiate schedules with friends.",
        duration: "10 min",
      },
      {
        id: "fr-3",
        title: "Metro directions",
        summary:
          "Give and receive navigation tips using landmarks, metro lines, and polite fillers.",
        duration: "9 min",
      },
    ],
  },
  {
    id: "es",
    flag: "🇲🇽",
    name: "Spanish Español",
    subtitle: "Latin American small talk and storytelling practice.",
    lessons: [
      {
        id: "es-1",
        title: "Market conversations",
        summary:
          "Negotiate prices, compliment produce, and wrap up purchases with cultural phrases.",
        duration: "11 min",
      },
      {
        id: "es-2",
        title: "Sharing your story",
        summary:
          "Describe your background, hobbies, and daily routine with confident tenses.",
        duration: "13 min",
      },
      {
        id: "es-3",
        title: "Planning a trip",
        summary:
          "Discuss destinations, preferences, and travel plans while understanding suggestions.",
        duration: "10 min",
      },
    ],
  },
  {
    id: "ko",
    flag: "🇰🇷",
    name: "Korean 한국어",
    subtitle: "Conversational Korean for everyday moments in Seoul.",
    lessons: [
      {
        id: "ko-1",
        title: "Meeting someone new",
        summary:
          "Introduce yourself, exchange polite questions, and respond naturally to follow-ups.",
        duration: "12 min",
      },
      {
        id: "ko-2",
        title: "Ordering delivery",
        summary:
          "Practice placing an order, confirming details, and thanking the delivery driver.",
        duration: "8 min",
      },
      {
        id: "ko-3",
        title: "After-work hangout",
        summary:
          "Make casual invitations, talk about interests, and politely decline with reasons.",
        duration: "9 min",
      },
    ],
  },
];

export default function Main() {
  const [isOpen, setIsOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [activeView, setActiveView] = useState<ActiveView>("record");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(
    courseCatalog[0]
  );
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleSelectView = (view: ActiveView) => {
    if (view === "lessons" && !selectedCourse) {
      setSelectedCourse(courseCatalog[0]);
    }
    if (view === "record" && !selectedCourse) {
      setSelectedCourse(courseCatalog[0]);
    }
    if (view !== "record") {
      setSelectedLesson(null);
    }
    setActiveView(view);
    closeMenu();
  };

  const openLessonsForCourse = (course: Course) => {
    setSelectedCourse(course);
    setSelectedLesson(null);
    setActiveView("lessons");
    closeMenu();
  };

  const startRecordingForCourse = (
    course: Course,
    lessonTitle: string | null = null
  ) => {
    setSelectedCourse(course);
    setSelectedLesson(lessonTitle);
    setActiveView("record");
    closeMenu();
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStartX(event.touches[0].clientX);
    setTouchEndX(event.touches[0].clientX);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    setTouchEndX(event.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchEndX - touchStartX > 60) {
      openMenu();
    }

    if (touchStartX - touchEndX > 60) {
      closeMenu();
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "courses":
        return (
          <CoursesView
            courses={courseCatalog}
            activeCourseId={selectedCourse?.id}
            onSelectCourse={openLessonsForCourse}
            onOpenRecord={(course) => startRecordingForCourse(course)}
          />
        );
      case "lessons":
        return (
          <LessonsView
            course={selectedCourse ?? null}
            onBack={() => setActiveView("courses")}
            onStart={(course, lessonTitle) =>
              startRecordingForCourse(course, lessonTitle)
            }
          />
        );
      default:
        return (
          <Record
            course={selectedCourse ?? null}
            lessonTitle={selectedLesson}
          />
        );
    }
  };

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-slate-100 px-6 text-center text-slate-700"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {isOpen && (
        <div
          role="presentation"
          aria-hidden="true"
          onClick={closeMenu}
          className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-72 max-w-[75vw] border-r border-slate-100 bg-white/90 p-6 shadow-2xl backdrop-blur transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <p className="text-lg font-semibold text-slate-800">Settings</p>
          <button
            type="button"
            onClick={closeMenu}
            className="rounded-full p-2 text-slate-400 transition hover:text-slate-600"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-4 text-left text-sm text-slate-500">
          {navOptions.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleSelectView(value)}
              className={`w-full rounded-xl px-4 py-3 text-left transition hover:bg-slate-100 ${
                activeView === value ? "bg-sky-50 font-medium text-sky-700" : ""
              }`}
            >
              {label}
            </button>
          ))}

          <button
            type="button"
            className="w-full rounded-xl px-4 py-3 text-left text-rose-500 transition hover:bg-rose-50"
            onClick={closeMenu}
          >
            Log out
          </button>
        </nav>
      </aside>

      <button
        type="button"
        className="absolute left-4 top-4 z-10 inline-flex items-center rounded-full bg-white/70 p-3 text-slate-500 shadow-lg backdrop-blur transition hover:bg-white hover:text-slate-700"
        aria-label="Toggle settings"
        onClick={toggleMenu}
      >
        <Settings2 className="h-5 w-5" />
      </button>

      {renderActiveView()}
    </main>
  );
}
