import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function NavbarLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 no-underline">
      <Sparkles color="#F48FB1" size={24} />
      <span className="text-xl font-serif font-bold text-[#4A235A]">
        Self-Love Alchemy
      </span>
    </Link>
  );
}