import { LoginForm } from "./_components/LoginForm";
import { redirect } from "next/navigation";
import { getCookieData } from "@/lib/cookieData";

export default async function Page() {
  const user = await getCookieData("user");

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex items-center justify-center w-full p-6 min-h-svh md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
