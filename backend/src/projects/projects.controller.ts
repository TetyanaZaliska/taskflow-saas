import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TeamRolesGuard } from '../guards/team-roles.guard';
import { CreateProjectRequest } from './dto/create-project.request';
import { ProjectsService } from './projects.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { type TokenPayload } from '../auth/token-payload.interface';

@Controller('teams/:teamId/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, TeamRolesGuard)
  async createProject(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() body: CreateProjectRequest,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.projectsService.createProject(teamId, body, user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, TeamRolesGuard)
  async getProjects(
    @Param('teamId', ParseIntPipe) teamId: number,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.projectsService.getProjects(teamId, user.userId);
  }

  @Delete(':projectId')
  @UseGuards(JwtAuthGuard, TeamRolesGuard)
  async removeProject(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.projectsService.removeProject(teamId, projectId, user.userId);
  }
}
