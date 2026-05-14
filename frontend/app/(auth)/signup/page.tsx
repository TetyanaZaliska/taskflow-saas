import { AuthCard } from "@/components/custom/auth-card";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <AuthCard
        title="Create account"
        description="Fill in your details"
        submitText="Signup"
        linkText="Back to login"
        linkHref="/login"
      ></AuthCard>
    </div>
  );
}
