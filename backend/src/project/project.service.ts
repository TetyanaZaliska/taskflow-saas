import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PermissionsService } from '../permissions/permissions.service';
import { Project } from '@prisma/client';
import { MemberWithUserResponse } from '../team-members/team-members.service';

export interface ProjectWithMembers extends Project {
  team: {
    id: number;
    name: string;
    members: MemberWithUserResponse[];
  };
}

@Injectable()
export class ProjectService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async getProject(projectId: number, userId: number): Promise<Project> {
    await this.permissionsService.validateProjectAccess(userId, projectId);

    try {
      return await this.prismaService.project.findUniqueOrThrow({
        where: { id: projectId },
      });
    } catch {
      throw new NotFoundException(`Project not found`);
    }
  }
  async getProjectWithMembers(
    projectId: number,
    userId: number,
  ): Promise<ProjectWithMembers> {
    await this.permissionsService.validateProjectAccess(userId, projectId);

    try {
      return await this.prismaService.project.findUniqueOrThrow({
        where: { id: projectId },
        include: {
          team: {
            include: {
              members: {
                where: {
                  user: {
                    isActive: true,
                  },
                },
                include: {
                  user: {
                    select: {
                      id: true,
                      email: true,
                      isActive: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    } catch {
      throw new NotFoundException(`Project not found`);
    }
  }
}
