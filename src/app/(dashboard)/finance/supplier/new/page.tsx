import { selectBank } from "@/data/select";
import SupplierForm from "../_components/SupplierForm";
import { connection } from "next/server";

const NewSupplierPage = async () => {
  await connection();
  
  const { data: banks } = await selectBank();

  return <SupplierForm banks={banks} />;
};

export default NewSupplierPage;
