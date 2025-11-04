import { selectRole } from "@/data/select";
import UserForm from "../_components/UserForm";

const NewUserPage = async () => {
  const { data } = await selectRole();

  return <UserForm roles={data} />;
};

export default NewUserPage;
