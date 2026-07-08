"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { ComponentProps } from "react";

interface ButtonCreateProps extends ComponentProps<"button"> {
  title: string;
}

export function ButtonCreate({ title, ref, ...props }: ButtonCreateProps) {
  return (
    <Button ref={ref} type="button" variant="outline" {...props}>
      <CirclePlus /> {title}
    </Button>
  );
}
