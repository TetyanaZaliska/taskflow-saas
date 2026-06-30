import { redirect } from "next/navigation";
import { FormResponse } from "../interfaces/form-response.interface";

export const assertNoErrors = <T>(
  response: T | FormResponse,
  route: string,
) => {
  if (response && typeof response === "object" && "error" in response) {
    redirect(route);
  }
};
