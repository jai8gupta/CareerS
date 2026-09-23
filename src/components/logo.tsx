import Link from "next/link";
import { MessageSquareText } from "lucide-react";

export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="CareerSpeak home">
      <span className="logoMark"><MessageSquareText size={20} strokeWidth={2.4} /></span>
      CareerSpeak
    </Link>
  );
}
