import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getProjects from "../../actions/get-projects";
import ProjectRow from "./project-row";
import { Project } from "../../interfaces/project.interface";
import { FormError } from "@/components/custom/form-error";
import { PaginationControls } from "@/components/custom/pagination-controls";

interface ProjectsTableProps {
  teamId: number;
  currentPage: number;
  currentLimit: number;
}

export default async function ProjectsTable({
  teamId,
  currentLimit,
  currentPage,
}: ProjectsTableProps) {
  const projects = await getProjects(teamId, {
    page: currentPage,
    limit: currentLimit,
  });

  if (projects && "error" in projects) {
    return <FormError error={projects.error} />;
  }

  return (
    <>
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
          {projects.data.map((project: Project) => (
            <ProjectRow key={project.id} project={project} teamId={teamId} />
          ))}
        </TableBody>
      </Table>
      <PaginationControls meta={projects.meta} />
    </>
  );
}
