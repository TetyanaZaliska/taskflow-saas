import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { type TokenPayload } from '../auth/token-payload.interface';
import { ProjectRolesGuard } from '../guards/project-roles.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get(':projectId')
  @UseGuards(JwtAuthGuard, ProjectRolesGuard)
  async getProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectService.getProject(projectId);
  }
}
