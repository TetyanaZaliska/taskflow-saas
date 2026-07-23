import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ProjectRolesGuard } from '../guards/project-roles.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get(':projectId')
  @UseGuards(JwtAuthGuard, ProjectRolesGuard)
  async getProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Query('include') include: string,
    @CurrentUser('userId') userId: number,
  ) {
    if (include === 'members') {
      return this.projectService.getProjectWithMembers(projectId, userId);
    }
    return this.projectService.getProject(projectId, userId);
  }

  @Get(':projectId/with-members')
  @UseGuards(JwtAuthGuard, ProjectRolesGuard)
  async getProjectWithMembers(
    @Param('projectId', ParseIntPipe) projectId: number,
    @CurrentUser('userId') userId: number,
  ) {
    return this.projectService.getProjectWithMembers(projectId, userId);
  }
}
