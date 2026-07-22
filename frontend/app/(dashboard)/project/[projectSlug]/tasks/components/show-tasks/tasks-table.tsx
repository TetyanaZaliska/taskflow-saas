import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getTasks from "../../actions/get-tasks";
import { Task } from "../../interfaces/task.interface";
import TaskRow from "./task-row";
import { FormError } from "@/components/custom/form-error";

interface TasksTableProps {
  projectSlug: string;
}

export default async function TasksTable({ projectSlug }: TasksTableProps) {
  const projectId = parseInt(projectSlug.split("-")[0], 10);
  const members = await getTasks(projectId);

  if (members && "error" in members) {
    return <FormError error={members.error} />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-muted-foreground w-[30px]"></TableHead>
          <TableHead className="text-right text-muted-foreground w-[50px]">
            Task
          </TableHead>
          <TableHead className="text-right text-muted-foreground w-[50px]">
            Status
          </TableHead>
          <TableHead className="text-muted-foreground">Title</TableHead>
          <TableHead className="text-right text-muted-foreground">
            Date
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((task: Task) => (
          <TaskRow key={task.id} task={task} projectSlug={projectSlug} />
        ))}
      </TableBody>
    </Table>
  );
}
