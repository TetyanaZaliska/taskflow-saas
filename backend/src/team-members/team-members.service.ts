import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddMemberRequest } from './dto/add-member.request';
import { TeamRole } from '@prisma/client';

@Injectable()
export class TeamMembersService {
  constructor(private readonly prismaService: PrismaService) {}

  async addMember(teamId: number, data: AddMemberRequest, userId: number) {
    await this.assertTeamExist(teamId);
    await this.assertAdmin(teamId, userId);
    await this.assertUserExist(data.userId);
    await this.assertUniqueTeamMember(teamId, data.userId);

    return this.prismaService.teamMember.create({
      data: {
        userId: data.userId,
        teamId: teamId,
        role: data.role ?? TeamRole.MEMBER,
      },
    });
  }

  async getMembers(teamId: number) {
    return this.prismaService.teamMember.findMany({
      where: {
        teamId,
      },
      select: {
        id: true,
        role: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  private async assertAdmin(teamId: number, userId: number) {
    const member = await this.prismaService.teamMember.findFirst({
      where: {
        teamId,
        userId,
        role: TeamRole.ADMIN,
      },
    });

    if (!member) {
      throw new ForbiddenException('Only team admins can add members');
    }
  }

  private async assertUniqueTeamMember(teamId: number, userId: number) {
    const existingMember = await this.prismaService.teamMember.findUnique({
      where: {
        userId_teamId: {
          teamId,
          userId,
        },
      },
    });

    if (existingMember) {
      throw new ConflictException('User is already a team member');
    }
  }

  private async assertUserExist(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  private async assertTeamExist(teamId: number) {
    const team = await this.prismaService.team.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }
  }
}
