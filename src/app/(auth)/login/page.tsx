import { cookies } from "next/headers";
import { LoginForm } from "./_components/LoginForm";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
  const user = cookieStore.get("user");

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
