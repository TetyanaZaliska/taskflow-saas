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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function TaskAssignee() {
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
      <Select>
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

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
