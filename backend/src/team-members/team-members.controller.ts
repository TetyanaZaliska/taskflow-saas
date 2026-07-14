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
import {
  MemberWithUserResponse,
  TeamMembersService,
} from './team-members.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { type TokenPayload } from '../auth/token-payload.interface';
import { AddMemberRequest } from './dto/add-member.request';
import { TeamRolesGuard } from '../guards/team-roles.guard';
import { TeamMember } from '@prisma/client';

@Controller('teams/:teamId/members')
export class TeamMembersController {
  constructor(private readonly teamMemberService: TeamMembersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, TeamRolesGuard)
  async addMember(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() body: AddMemberRequest,
    @CurrentUser() user: TokenPayload,
  ): Promise<TeamMember> {
    return this.teamMemberService.addMember(teamId, body, user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, TeamRolesGuard)
  async getMembers(
    @Param('teamId', ParseIntPipe) teamId: number,
    @CurrentUser() user: TokenPayload,
  ): Promise<MemberWithUserResponse[]> {
    return this.teamMemberService.getMembers(teamId, user.userId);
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard, TeamRolesGuard)
  async removeMember(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() user: TokenPayload,
  ): Promise<TeamMember> {
    return this.teamMemberService.removeMember(teamId, userId, user.userId);
  }
}
