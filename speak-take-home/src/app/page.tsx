import Image from "next/image";
import Link from "next/link";
import Logo from "./assets/logo.webp";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 font-sans dark:bg-black">
      <p className="text-3xl font-semibold">SPEAK</p>
      <Image src={Logo} alt="Speak logo" width={100} height={100} priority />
      <Link
        href="/studio"
        className="mt-6 rounded-xl bg-[#1b47ff] px-4 py-2 text-sm font-semibold text-white"
      >
        Get Started
      </Link>
    </div>
  );
}
