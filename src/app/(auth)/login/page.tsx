import { LoginForm } from "./_components/LoginForm";
import { redirect } from "next/navigation";
import { getCookieData } from "@/lib/cookieData";
import Image from "next/image";

export default async function Page() {
  const user = await getCookieData("user");

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex items-center justify-center w-full p-6 min-h-svh md:p-10">
      <div className="w-full max-w-sm space-y-6">
        <Image
          src="https://kliklelang.co.id/img/logo-klik.svg"
          width={0}
          height={0}
          alt="logo_klik"
          className="object-contain h-auto mx-auto w-fit"
          loading="eager"
        />
        <LoginForm />
      </div>
    </div>
  );
}
