"use client";

import { AlertBox } from "./alert-box";

interface FormErrorProps {
  error?: string | null;
}

export function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  return (
    <div className="mb-4 animate-in fade-in-50 slide-in-from-top-1 duration-200">
      <AlertBox message={error} />
    </div>
  );
}
