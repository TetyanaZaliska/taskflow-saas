import { TASK_PRIORITY_LIST } from "@/app/common/constants/task-priority";
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
import { useState } from "react";

export function ChoosePriority() {
  const [open, setOpen] = useState(false);
  const [taskPriority, setTaskPriority] = useState<string>(
    TASK_PRIORITY_LIST[0].value,
  );

  const currentPriority =
    TASK_PRIORITY_LIST.find((p) => p.value === taskPriority) ||
    TASK_PRIORITY_LIST[0];
  const CurrentIcon = currentPriority.icon;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[120px] justify-start gap-2 h-9 px-3"
          >
            <CurrentIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{currentPriority.label}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[180px] p-0">
          <Command>
            <CommandInput placeholder="Change priority to..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {TASK_PRIORITY_LIST.map((priority) => {
                  const IconItem = priority.icon;

                  return (
                    <CommandItem
                      key={priority.value}
                      value={priority.value}
                      onSelect={() => {
                        setTaskPriority(priority.value);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <IconItem className="h-4 w-4 text-muted-foreground" />
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
