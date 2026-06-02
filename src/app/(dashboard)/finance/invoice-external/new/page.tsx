import { connection } from "next/server";
import InvoiceExternalForm from "../_components/InvoiceExternalForm";

const NewInvoiceExternalPage = async () => {
  await connection();

  return <InvoiceExternalForm />;
};

export default NewInvoiceExternalPage;
