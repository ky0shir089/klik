import { selectSupplier, selectTypeTrx } from "@/data/select";

import { connection } from "next/server";
import InvoiceForm from "./_components/InvoiceForm";

const NewInvoicePage = async () => {
  await connection();

  const [{ data: typeTrxes }, { data: suppliers }] = await Promise.all([
    selectTypeTrx("OUT"),
    selectSupplier(),
  ]);

  return <InvoiceForm suppliers={suppliers} typeTrxes={typeTrxes} />;
};

export default NewInvoicePage;
