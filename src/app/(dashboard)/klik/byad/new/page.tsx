import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import ByadForm from "../_components/ByadForm";
import { selectBranch } from "@/data/select";
import { connection } from "next/server";
import { redirectIfUnauthorized } from "@/lib/server-auth";

const RenderForm = async () => {
  await connection();

  const result = await selectBranch();
  await redirectIfUnauthorized(result);

  const { data } = result;

  return <ByadForm branches={data} />;
};

const NewByadPage = () => {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <RenderForm />
    </Suspense>
  );
};

export default NewByadPage;
