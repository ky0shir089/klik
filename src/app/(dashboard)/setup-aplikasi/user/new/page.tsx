import { selectRole } from "@/data/select";
import UserForm from "../_components/UserForm";

const NewUserPage = async () => {
  const roles = await selectRole();
  const { data } = roles;

  return <UserForm roles={data} />;
};

export default NewUserPage;
