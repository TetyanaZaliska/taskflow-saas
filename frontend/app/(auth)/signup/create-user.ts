"use server";

import { API_URL } from "@/app/constants/api";
import { getErrorMessage } from "@/app/util/errors";
import { redirect } from "next/navigation";

export default async function createUser(_prevState: any, formData: FormData) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    body: formData,
  });
  const parseRes = await res.json();
  if (!res.ok) {
    return { error: getErrorMessage(parseRes) };
  }
  redirect("/");
}
