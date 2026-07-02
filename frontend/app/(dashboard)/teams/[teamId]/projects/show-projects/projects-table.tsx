import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getProjects from "../actions/get-projects";
import ProjectRow from "./project-row";
import { Project } from "../interfaces/project.interface";

interface ProjectsTableProps {
  teamId: number;
}

export default async function ProjectsTable({ teamId }: ProjectsTableProps) {
  const projects = await getProjects(teamId);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-muted-foreground">Name</TableHead>
          <TableHead className="text-right text-muted-foreground">
            Description
          </TableHead>
          <TableHead className="text-right text-muted-foreground">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project: Project) => (
          <ProjectRow key={project.id} project={project} teamId={teamId} />
        ))}
      </TableBody>
    </Table>
  );
}
