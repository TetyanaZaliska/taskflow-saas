"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { ButtonCreate } from "@/components/custom/button-create";
import { AddMemberForm } from "./add-member-form";

interface AddMemberModalProps {
  teamId: number;
}

export function AddMemberModal({ teamId }: AddMemberModalProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleOpenChange = (isOpen: boolean) => {
    setModalVisible(isOpen);
    if (!isOpen) {
      setFormKey((prev) => prev + 1);
    }
  };

  return (
    <Dialog open={modalVisible} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <ButtonCreate title="Add Member" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <AddMemberForm
          teamId={teamId}
          key={formKey}
          onSuccess={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
