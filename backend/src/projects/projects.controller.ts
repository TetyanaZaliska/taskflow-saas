import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TeamRolesGuard } from '../guards/team-roles.guard';
import { TeamRoles } from '../teams/team-roles.decorator';
import { TeamRole } from '@prisma/client';
import { CreateProjectRequest } from './dto/create-project.request';
import { ProjectsService } from './projects.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { type TokenPayload } from '../auth/token-payload.interface';

@Controller('teams/:teamId/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, TeamRolesGuard)
  @TeamRoles(TeamRole.ADMIN)
  async createProject(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() body: CreateProjectRequest,
  ) {
    return this.projectsService.createProject(teamId, body);
  }

  @Get()
  @UseGuards(JwtAuthGuard, TeamRolesGuard)
  async getProjects(@Param('teamId', ParseIntPipe) teamId: number) {
    return this.projectsService.getProjects(teamId);
  }
}
