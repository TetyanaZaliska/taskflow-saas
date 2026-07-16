import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
  icon: LucideIcon;
  color?: string;
}

interface TaskFieldDropdownProps {
  currentValue: string;
  options: DropdownOption[];
  fieldName: "status" | "priority";
  onUpdate: (formData: FormData) => Promise<void>;
  defaultIcon: LucideIcon;
}

export function TaskFieldDropdown({
  currentValue,
  options,
  fieldName,
  onUpdate,
  defaultIcon: DefaultIcon,
}: TaskFieldDropdownProps) {
  const currentItem = options.find((opt) => opt.value === currentValue);
  const TriggerIcon = currentItem?.icon || DefaultIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TriggerIcon
          className={cn(
            "h-4 w-4 text-muted-foreground cursor-pointer",
            currentItem?.color,
          )}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          {options.map((option) => {
            const ItemIcon = option.icon;

            return (
              <DropdownMenuItem key={option.value} asChild>
                <form action={onUpdate} className="w-full">
                  <input type="hidden" name={fieldName} value={option.value} />
                  <button
                    type="submit"
                    className={cn(
                      "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground text-left",
                      currentValue === option.value && "bg-muted font-medium",
                    )}
                  >
                    <ItemIcon className={cn("h-4 w-4", option.color)} />
                    <span>{option.label}</span>
                  </button>
                </form>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
