import { toast } from "sonner";

interface ActionResult {
  error?: string;
}

export const useActionNotify = () => {
  const handleResult = (
    result: ActionResult | null | undefined,
    successMessage?: string,
  ) => {
    if (result?.error) {
      toast.error(result.error, { position: "top-right" });
      return false;
    }
    if (successMessage?.trim()) {
      toast.success(successMessage, { position: "top-right" });
      return true;
    }
  };

  return { handleResult };
};
