import { selectMenuPermission } from "@/data/select";
import RoleForm from "../_components/RoleForm";

const NewRolePage = async () => {
  const { data } = await selectMenuPermission();

  return <RoleForm menuPermission={data} />;
};

export default NewRolePage;
