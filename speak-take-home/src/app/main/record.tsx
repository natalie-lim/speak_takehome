"use client";
import Image from "next/image";
import { Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "../assets/logo.webp";

export default function Record() {
  const [isOpen, setIsOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <Image src={Logo} className="h-12 w-12" alt="logo" />
        <h1 className="text-3xl font-semibold">Speak</h1>
      </div>
      <div className="flex flex-col mt-8">
        <p>Practice *Insert Language here*</p>
        <p>Let's see how much you've learned!</p>
      </div>

      <button
        type="button"
        className="group mt-48 flex h-14 w-14 items-center justify-center rounded-full bg-white transition"
        aria-label="Start recording"
      >
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-700">
          <span
            className="absolute inset-0 rounded-full border-2 border-red-400 opacity-60 transition group-hover:animate-ping"
            aria-hidden
          />
          <span className="block h-9 w-9 rounded-full bg-red-500 shadow-inner group-hover:scale-105 group-hover:bg-red-600 transition" />
        </span>
      </button>
    </div>
  );
}
