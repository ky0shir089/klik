import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";
import ByadForm from "../_components/ByadForm";
import { selectBranch } from "@/data/select";
import { connection } from "next/server";

const RenderForm = async () => {
  await connection();

  const { data } = await selectBranch();

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
