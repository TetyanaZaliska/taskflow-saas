"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import { ButtonCreate } from "@/components/custom/button-create";
import { MemberWithUser } from "@/app/(dashboard)/teams/[teamId]/members/interfaces/member.interface";
import { mapMembersToOptions } from "@/app/common/util/map-members";
import { CreateTaskForm } from "./create-task-form";

interface CreateTaskModalProps {
  projectId: number;
  initialMembers: MemberWithUser[];
}

export function CreateTaskModal({
  projectId,
  initialMembers,
}: CreateTaskModalProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleOpenChange = (visible: boolean) => {
    setModalVisible(visible);
    if (!visible) {
      setFormKey((prev) => prev + 1);
    }
  };

  const mappedMembers = useMemo(() => {
    return mapMembersToOptions(initialMembers);
  }, [initialMembers]);

  return (
    <Dialog open={modalVisible} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <ButtonCreate title="Create Task" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <CreateTaskForm
          key={formKey}
          projectId={projectId}
          mappedMembers={mappedMembers}
          onSuccess={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
