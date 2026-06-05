import ResetPasswordForm from "./_components/ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <div>
      <div className="flex items-center justify-center w-full p-6 min-h-svh md:p-10">
        <div className="w-full max-w-sm">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
