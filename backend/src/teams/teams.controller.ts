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
import { CreateTeamRequest } from './dto/create-team.request';
import { CurrentUser } from '../auth/current-user.decorator';
import { type TokenPayload } from '../auth/token-payload.interface';
import { TeamsService } from './teams.service';

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
  async getTeams() {
    return this.teamsService.getTeams();
  }

  @Get(':teamId')
  @UseGuards(JwtAuthGuard)
  async getTeam(@Param('teamId', ParseIntPipe) teamId: number) {
    return this.teamsService.getTeam(teamId);
  }
}
