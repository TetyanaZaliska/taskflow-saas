import { SelectOption } from "@/app/common/interfaces/select-option.interface";
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

interface TaskSelectProps {
  items: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TaskSelect({
  items,
  value,
  onChange,
  placeholder = "Search...",
  className,
}: TaskSelectProps) {
  const [open, setOpen] = useState(false);

  const currentItem = items.find((item) => item.value === value) || items[0];
  const CurrentIcon = currentItem.icon;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-[120px] justify-start gap-2 h-9 px-3", className)}
          >
            <CurrentIcon
              className={cn("h-4 w-4 text-muted-foreground", currentItem.color)}
            />
            <span className="text-sm font-medium">{currentItem.label}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-0 w-full">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => {
                  const IconItem = item.icon;

                  return (
                    <CommandItem
                      key={item.value}
                      value={item.label.toLowerCase()}
                      onSelect={() => {
                        onChange(item.value);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <IconItem
                        className={cn(
                          "h-4 w-4 text-muted-foreground",
                          item.color,
                        )}
                      />
                      <span>{item.label}</span>
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
