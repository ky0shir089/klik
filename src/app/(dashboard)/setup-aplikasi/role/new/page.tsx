import { selectMenuPermission } from "@/data/select";
import RoleForm from "../_components/RoleForm";
import { connection } from "next/server";

const NewRolePage = async () => {
  await connection();

  const { data } = await selectMenuPermission();

  return <RoleForm menuPermission={data} />;
};

export default NewRolePage;
