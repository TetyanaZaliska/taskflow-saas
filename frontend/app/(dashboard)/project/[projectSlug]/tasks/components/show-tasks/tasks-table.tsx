import { Table, TableBody } from "@/components/ui/table";
import { Task } from "../../interfaces/task.interface";
import TaskRow from "./task-row";

interface TasksTableProps {
  projectSlug: string;
  tasks: Task[];
}

export function TasksTable({ projectSlug, tasks }: TasksTableProps) {
  return (
    <Table>
      <TableBody>
        {tasks.map((task: Task) => (
          <TaskRow key={task.id} task={task} projectSlug={projectSlug} />
        ))}
      </TableBody>
    </Table>
  );
}
