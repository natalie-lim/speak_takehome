import Image from "next/image";
import Logo from "../assets/logo.webp";

export default function CoursesView() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 text-center text-slate-600">
      <Image src={Logo} alt="Speak logo" width={100} height={100} priority />
      <h1 className="text-2xl font-semibold text-slate-900">Courses</h1>
      <p className="max-w-sm text-sm leading-6">
        Browse Courses is coming soon. We&apos;re curating guided speaking paths
        to help you stay on track. Check back shortly!
      </p>
    </section>
  );
}
