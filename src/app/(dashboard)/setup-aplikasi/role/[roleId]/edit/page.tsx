import { roleShow } from "@/data/role";
import Unauthorized from "@/components/unauthorized";
import { selectMenuPermission } from "@/data/select";
import { notFound, redirect } from "next/navigation";
import RoleForm from "../../_components/RoleForm";

type Params = Promise<{ roleId: number }>;

const EditRolePage = async ({ params }: { params: Params }) => {
  const { roleId } = await params;
  const result = await roleShow(roleId);
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
  const { data: menuPermission } = await selectMenuPermission();

  return <RoleForm data={data} menuPermission={menuPermission} />;
};

export default EditRolePage;
