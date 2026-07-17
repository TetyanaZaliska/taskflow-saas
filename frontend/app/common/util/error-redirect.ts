import { redirect } from "next/navigation";
import { FormResponse } from "../interfaces/form-response.interface";

export function assertNoErrors<T>(
  response: T | FormResponse,
  route: string,
): asserts response is T {
  if (response && typeof response === "object" && "error" in response) {
    redirect(route);
  }
}
