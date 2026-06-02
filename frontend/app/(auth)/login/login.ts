"use server";

import { FormError } from "@/app/common/interfaces/form-error.interface";
import { API_URL } from "@/app/common/constants/api";
import { getErrorMessage } from "@/app/common/util/errors";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function login(_prevState: FormError, formData: FormData) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  const parseRes = await res.json();
  if (!res.ok) {
    return { error: getErrorMessage(parseRes) };
  }
  await setAuthCookie(res);
  redirect("/dashboard");
}

const setAuthCookie = async (response: Response) => {
  const cookieStore = await cookies();
  const setCookieHeader = response.headers.get("Set-Cookie");
  if (setCookieHeader) {
    const token = setCookieHeader.split(";")[0].split("=")[1];
    cookieStore.set({
      name: "Authentication",
      value: token,
      secure: true,
      httpOnly: true,
      path: "/",
      expires: new Date(jwtDecode(token).exp! * 1000),
    });
  }
};
