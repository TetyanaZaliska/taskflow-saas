import { AuthCard } from "@/components/custom/auth-card";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <AuthCard
        title="Login"
        description="Enter your email to login"
        submitText="Login"
        linkText="Sign up"
        linkHref="/signup"
      ></AuthCard>
    </div>
  );
}
