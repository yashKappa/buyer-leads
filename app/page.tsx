// app/page.tsx
import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function HomePage() {
  redirect("/home");
}
