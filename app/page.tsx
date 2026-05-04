import { redirect } from "next/navigation";

/* Root redirect is handled by middleware.
   This is a fallback for direct server renders. */
export default function RootPage() {
  redirect("/login");
}
