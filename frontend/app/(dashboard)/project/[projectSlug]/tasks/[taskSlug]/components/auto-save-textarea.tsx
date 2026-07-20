"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface AutoSaveTextareaProps {
  initialValue: string | undefined;
  fieldName: "title" | "description";
  className?: string;
  onUpdate: (formData: FormData) => Promise<void>;
}

export function AutoSaveTextarea({
  initialValue,
  fieldName,
  className,
  onUpdate,
}: AutoSaveTextareaProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [initialValue]);

  return (
    <form ref={formRef} action={onUpdate} className="w-full">
      <textarea
        ref={textareaRef}
        name={fieldName}
        defaultValue={initialValue}
        onChange={adjustHeight}
        onBlur={() => {
          formRef.current?.requestSubmit();
        }}
        className={cn("w-full min-h-[30px]", className)}
      />
    </form>
  );
}
