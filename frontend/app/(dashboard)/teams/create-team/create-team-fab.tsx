"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";

export default function CreateTeamFab() {
  return (
    <Button variant="outline" size="icon">
      <CirclePlus />
    </Button>
  );
}
