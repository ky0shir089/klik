const Unauthorized = () => {
  return (
    <div
      data-slot="empty"
      className="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12"
    >
      <div
        data-slot="empty-header"
        className="flex max-w-sm flex-col items-center gap-2 text-center"
      >
        <div
          data-slot="empty-title"
          className="text-lg font-medium tracking-tight"
        >
          403 - Unauthorized
        </div>
        <div
          data-slot="empty-description"
          className="text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4"
        >
          You&apos;re not authorized to view this page.
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
