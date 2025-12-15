import BankForm from "../_components/BankForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import FormSkeleton from "@/components/form-skeleton";

const RenderForm = () => {
  return <BankForm />;
};

const NewBankPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl")}>Create Bank</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<FormSkeleton />}>
          <RenderForm />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default NewBankPage;
