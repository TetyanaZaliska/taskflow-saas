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

interface TasksTableProps {
  projectId: number;
}

export default async function TasksTable({ projectId }: TasksTableProps) {
  const members = await getTasks(projectId);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-muted-foreground">Priority</TableHead>
          <TableHead className="text-muted-foreground">Title</TableHead>
          <TableHead className="text-right text-muted-foreground">
            Status
          </TableHead>
          <TableHead className="text-right text-muted-foreground">
            Author
          </TableHead>
          <TableHead className="text-right text-muted-foreground">
            Date
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((task: Task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </TableBody>
    </Table>
  );
}
