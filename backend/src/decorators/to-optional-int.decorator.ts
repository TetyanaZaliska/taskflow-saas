import { Transform } from 'class-transformer';

export function ToOptionalInt() {
  return Transform(({ value }: { value: unknown }) => {
    if (value === '' || value === null || value === 'null') return undefined;

    if (typeof value === 'number') {
      return value;
    }

    const stringValue = value as string;
    const parsed = parseInt(stringValue, 10);
    return isNaN(parsed) ? stringValue : parsed;
  });
}
