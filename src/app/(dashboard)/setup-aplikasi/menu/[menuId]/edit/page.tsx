import MenuForm from "../../_components/MenuForm";
import { selectModule } from "@/data/select";
import Unauthorized from "@/components/unauthorized";
import { menuShow } from "@/data/menu";
import { notFound, redirect } from "next/navigation";

type Params = Promise<{ menuId: number }>;

const EditMenuPage = async ({ params }: { params: Params }) => {
  const { menuId } = await params;
  const result = await menuShow(menuId);
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
  const { data: modules } = await selectModule();

  return <MenuForm data={data} modules={modules} />;
};

export default EditMenuPage;
