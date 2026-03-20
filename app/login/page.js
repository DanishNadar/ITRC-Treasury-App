import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const authenticated = await getSessionFromCookies();

  if (authenticated) {
    redirect("/");
  }

  return (
    <main className="loginPage">
      <section className="loginShell">
        <div className="loginBrand">
          <p className="eyebrow">Illinois Tech Railroad Club</p>
          <h1>ITRC Treasury Portal</h1>
          <p className="loginText">
            The treasury management dashbaord.
          </p>
          <div className="featureList">
            <span>Current Funds</span>
            <span>Donations</span>
            <span>Expenses</span>
            <span>Ledger</span>
          </div>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
