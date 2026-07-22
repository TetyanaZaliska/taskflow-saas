import { TEAM_ROLES_LIST } from "@/app/common/constants/team-roles";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function ChooseRole() {
  return (
    <RadioGroup
      name="role"
      defaultValue={TEAM_ROLES_LIST[0].value}
      className="max-w-sm"
    >
      {TEAM_ROLES_LIST.map((role) => (
        <FieldLabel key={role.value} htmlFor={role.value}>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>{role.label}</FieldTitle>
            </FieldContent>
            <RadioGroupItem value={role.value} id={role.value} hidden={true} />
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  );
}
