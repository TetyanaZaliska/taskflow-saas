"use server";

import { routes } from "@/app/common/constants/routes";
import { FormResponse } from "@/app/common/interfaces/form-response.interface";
import { post } from "@/app/common/util/fetch";
import { getRouteName } from "@/app/common/util/get-route-name";
import { redirect } from "next/navigation";

export default async function createUser(
  _prevState: FormResponse,
  formData: FormData,
) {
  const { error } = await post(getRouteName(routes.app.users), formData);

  if (error) {
    return { error };
  }
  redirect("/");
}
