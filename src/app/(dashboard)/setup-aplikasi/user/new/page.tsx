import { selectRole } from "@/data/select";
import UserForm from "../_components/UserForm";
import { connection } from "next/server";

const NewUserPage = async () => {
  await connection();

  const { data } = await selectRole();

  return <UserForm roles={data} />;
};

export default NewUserPage;
