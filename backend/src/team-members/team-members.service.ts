import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddMemberRequest } from './dto/add-member.request';
import { TeamRole } from '@prisma/client';

@Injectable()
export class TeamMembersService {
  constructor(private readonly prismaService: PrismaService) {}

  async addMember(teamId: number, data: AddMemberRequest, curUserId: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: data.email,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found!');
      }

      return this.prismaService.teamMember.create({
        data: {
          userId: user.id,
          teamId: teamId,
          role: data.role ?? TeamRole.MEMBER,
        },
      });
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new BadRequestException(
          'This user is already a member of the team.',
        );
      }

      throw error;
    }
  }

  async getMembers(teamId: number, currentUserId: number) {
    return this.prismaService.teamMember.findMany({
      where: {
        teamId,
      },
      select: {
        id: true,
        teamId: true,
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

  async removeMember(teamId: number, memberId: number) {
    return this.prismaService.$transaction(async (tx) => {
      const memberToDelete = await tx.teamMember.findUnique({
        where: {
          userId_teamId: { teamId, userId: memberId },
        },
      });

      if (!memberToDelete) {
        throw new NotFoundException('Member not found in this team.');
      }

      const deletedMember = await tx.teamMember.delete({
        where: { id: memberToDelete.id },
      });

      if (memberToDelete.role === TeamRole.ADMIN) {
        const remainingAdmins = await tx.teamMember.count({
          where: { teamId, role: TeamRole.ADMIN },
        });

        if (remainingAdmins === 0) {
          throw new BadRequestException(
            'Impossible to delete the last admin! Promote another team member first.',
          );
        }
      }

      return deletedMember;
    });
  }
}
