import { moduleShow } from "@/data/module";
import ModuleForm from "../../_components/ModuleForm";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";

type Params = Promise<{ moduleId: number }>;

const EditModulePage = async ({ params }: { params: Params }) => {
  const { moduleId } = await params;
  const result = await moduleShow(moduleId);
  if (result.isUnauthorized) {
    redirect("/login");
  }
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  if (result.isNotFound) {
    return notFound();
  }
  const { data } = result;

  return <ModuleForm data={data} />;
};

export default EditModulePage;
