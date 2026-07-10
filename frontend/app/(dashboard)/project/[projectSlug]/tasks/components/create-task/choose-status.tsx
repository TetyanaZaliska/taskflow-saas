import { TASK_PRIORITY_LIST } from "@/app/common/constants/task-priority";
import { TASK_STATUS_LIST } from "@/app/common/constants/task-status";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function ChooseStatus() {
  const [open, setOpen] = useState(false);
  const [taskStatus, setTaskStatus] = useState<string>(
    TASK_STATUS_LIST[0].value,
  );

  const currentStatus =
    TASK_STATUS_LIST.find((p) => p.value === taskStatus) || TASK_STATUS_LIST[0];
  const CurrentIcon = currentStatus.icon;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[120px] justify-start gap-2 h-9 px-3"
          >
            <CurrentIcon
              className={cn(
                "h-4 w-4 text-muted-foreground",
                currentStatus.color,
              )}
            />
            <span className="text-sm font-medium">{currentStatus.label}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[180px] p-0">
          <Command>
            <CommandInput placeholder="Change priority to..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {TASK_STATUS_LIST.map((priority) => {
                  const IconItem = priority.icon;

                  return (
                    <CommandItem
                      key={priority.value}
                      value={priority.value}
                      onSelect={() => {
                        setTaskStatus(priority.value);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <IconItem
                        className={cn(
                          "h-4 w-4 text-muted-foreground",
                          priority.color,
                        )}
                      />
                      <span>{priority.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
