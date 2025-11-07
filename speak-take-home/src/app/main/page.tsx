"use client";
import Image from "next/image";
import { Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "../assets/logo.webp";
import Record from "./record";

type ActiveView = "record" | "courses" | "lessons";

const navOptions: Array<{ label: string; value: ActiveView }> = [
  { label: "Profile & Voice", value: "record" },
  { label: "Browse Courses", value: "courses" },
  { label: "View Lessons", value: "lessons" },
];

export default function Main() {
  const [isOpen, setIsOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [activeView, setActiveView] = useState<ActiveView>("record");

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
    setActiveView(view);
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
          <section className="flex flex-col items-center justify-center gap-4 text-center text-slate-600">
            <Image
              src={Logo}
              alt="Speak logo"
              width={100}
              height={100}
              priority
            />
            <h1 className="text-2xl font-semibold text-slate-900">Courses</h1>
            <p className="max-w-sm text-sm leading-6">
              Browse Courses is on the way. We&apos;re curating guided speaking
              journeys that align with your goals.
            </p>
          </section>
        );
      case "lessons":
        return (
          <section className="flex flex-col items-center justify-center gap-4 text-center text-slate-600">
            <Image
              src={Logo}
              alt="Speak logo"
              width={100}
              height={100}
              priority
            />
            <h1 className="text-2xl font-semibold text-slate-900">Lessons</h1>
            <p className="max-w-sm text-sm leading-6">
              Lesson playback and feedback will appear here soon. Keep
              practicing while we prepare fresh material.
            </p>
          </section>
        );
      default:
        return <Record />;
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
