import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateTeamRequest } from './dto/create-team.request';
import { CurrentUser } from '../auth/current-user.decorator';
import { type TokenPayload } from '../auth/token-payload.interface';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTeam(
    @Body() body: CreateTeamRequest,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.teamService.createTeam(body, user.userId);
  }
}
