import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface AuthCardProps {
  title: string;
  description: string;
  submitText: string;
  linkText?: string;
  linkHref?: string;
  showNameField?: boolean;
}

export function AuthCard({
  title,
  description,
  submitText,
  linkText,
  linkHref,
  showNameField = false,
}: AuthCardProps) {
  return (
    <Card className="w-full max-w-md max-w-sm shadow-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {linkText && linkHref && (
          <CardAction>
            <Link href={linkHref}>{linkText}</Link>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            {showNameField && (
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          {submitText}
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
