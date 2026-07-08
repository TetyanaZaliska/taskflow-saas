"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ComponentProps } from "react";

export function ButtonDelete({ ref, ...props }: ComponentProps<"button">) {
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className="text-destructive hover:bg-destructive/10"
      {...props}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
