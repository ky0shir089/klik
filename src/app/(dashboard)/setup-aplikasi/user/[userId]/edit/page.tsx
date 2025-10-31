import UserForm from "../../_components/UserForm";
import { selectRole } from "@/data/select";
import Unauthorized from "@/components/unauthorized";
import { userShow } from "@/data/user";

type Params = Promise<{ userId: number }>;

const EditUserPage = async ({ params }: { params: Params }) => {
  const { userId } = await params;
  const result = await userShow(userId);
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  const { data } = result;
  const { data: roles } = await selectRole();

  return <UserForm data={data} roles={roles} />;
};

export default EditUserPage;
