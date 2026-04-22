import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const authenticated = await getSessionFromCookies();

  if (!authenticated) {
    redirect("/login");
  }

  return <DashboardClient />;
}
