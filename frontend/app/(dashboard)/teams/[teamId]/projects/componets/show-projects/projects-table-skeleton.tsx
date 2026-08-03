import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProjectsTableSkeleton() {
  // Створюємо масив із 5 елементів для рендеру 5 фейкових рядків
  const skeletonRows = Array.from({ length: 5 });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-muted-foreground w-[200px]">
            Name
          </TableHead>
          <TableHead className="text-right text-muted-foreground">
            Description
          </TableHead>
          <TableHead className="text-right text-muted-foreground w-[100px]">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skeletonRows.map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-5 w-[150px] rounded" />
            </TableCell>
            <TableCell className="text-right  justify-end">
              <Skeleton className="h-5 w-[250px] rounded" />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
