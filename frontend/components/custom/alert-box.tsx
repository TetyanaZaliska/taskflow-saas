import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface AlertBoxProps {
  message: string;
}

export function AlertBox({ message }: AlertBoxProps) {
  return (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircleIcon className="h-4 w-4" />
      <AlertTitle>Failed</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
