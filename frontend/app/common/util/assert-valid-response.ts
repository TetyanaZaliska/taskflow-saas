import { FormResponse } from "../interfaces/form-response.interface";

export function assertValidResponse<T>(
  response: T | FormResponse,
): asserts response is T {
  if (response && typeof response === "object" && "error" in response) {
    throw new Error(response.error || "Error response data...");
  }
}
