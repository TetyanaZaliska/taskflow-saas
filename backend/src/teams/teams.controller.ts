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
import { CreateTeamRequest } from './dto/create-team.request';
import { CurrentUser } from '../auth/current-user.decorator';
import { type TokenPayload } from '../auth/token-payload.interface';
import { TeamsService } from './teams.service';
import { TeamRolesGuard } from '../guards/team-roles.guard';
import { TeamRoles } from './team-roles.decorator';
import { TeamRole } from '@prisma/client';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTeam(
    @Body() body: CreateTeamRequest,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.teamsService.createTeam(body, user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTeams(@CurrentUser() user: TokenPayload) {
    return this.teamsService.getTeams(user.userId);
  }

  @Get(':teamId')
  @UseGuards(JwtAuthGuard, TeamRolesGuard)
  async getTeam(
    @Param('teamId', ParseIntPipe) teamId: number,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.teamsService.getTeam(teamId, user.userId);
  }

  @Delete(':teamId')
  @UseGuards(JwtAuthGuard, TeamRolesGuard)
  @TeamRoles(TeamRole.ADMIN)
  async removeTeam(@Param('teamId', ParseIntPipe) teamId: number) {
    return this.teamsService.removeTeam(teamId);
  }
}
