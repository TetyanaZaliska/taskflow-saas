"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useActionState } from "react";
import { AlertBox } from "@/components/custom/alert-box";
import login from "./login";
import { routes } from "@/app/common/constants/routes";

export default function Login() {
  const [state, formAction] = useActionState(login, { error: "" });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <form action={formAction} className="w-full max-w-sm shadow-xl">
        <Card>
          <CardHeader>
            <CardTitle>Login to account</CardTitle>
            <CardDescription>Fill in your details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href={routes.auth.forgotPassword}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              {!!state.error && <AlertBox message={state.error}></AlertBox>}
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={routes.auth.signup}>Signup</Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
