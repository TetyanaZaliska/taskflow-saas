"use server";

import { post } from "@/app/common/util/fetch";

export default async function createTeam(formData: FormData) {
  return post("teams", formData);
}
