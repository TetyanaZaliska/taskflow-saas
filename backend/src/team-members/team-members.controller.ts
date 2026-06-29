import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { type TokenPayload } from '../auth/token-payload.interface';
import { AddMemberRequest } from './dto/add-member.request';
import { TeamRolesGuard } from '../guards/team-roles.guard';
import { TeamRole } from '@prisma/client';
import { TeamRoles } from '../teams/team-roles.decorator';

@Controller('teams/:teamId/members')
export class TeamMembersController {
  constructor(private readonly teamMemberService: TeamMembersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, TeamRolesGuard)
  @TeamRoles(TeamRole.ADMIN)
  async addMember(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() body: AddMemberRequest,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.teamMemberService.addMember(teamId, body, user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, TeamRolesGuard)
  async getMembers(
    @Param('teamId', ParseIntPipe) teamId: number,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.teamMemberService.getMembers(teamId, user.userId);
  }
}
