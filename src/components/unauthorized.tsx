import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

const Unauthorized = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>403 - Unauthorized</EmptyTitle>
        <EmptyDescription>
          You&apos;re not authorized to view this page.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default Unauthorized;
