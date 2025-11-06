import { rvShow } from "@/data/rv";
import Unauthorized from "@/components/unauthorized";
import { notFound, redirect } from "next/navigation";
import ClassificationForm from "../../_components/ClassificationForm";

type Params = Promise<{ rvId: number }>;

const EditRvPage = async ({ params }: { params: Params }) => {
  const { rvId } = await params;
  const result = await rvShow(rvId);
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

  return <ClassificationForm data={data} />;
};

export default EditRvPage;
