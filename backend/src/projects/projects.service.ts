import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectRequest } from './dto/create-project.request';
import { PermissionsService } from '../permissions/permissions.service';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async createProject(
    teamId: number,
    data: CreateProjectRequest,
    userId: number,
  ): Promise<Project> {
    await this.permissionsService.validateTeamAccess(userId, teamId);

    return await this.prismaService.project.create({
      data: {
        name: data.name,
        description: data.description,
        teamId: teamId,
        authorId: userId,
      },
    });
  }

  async getProjects(teamId: number, userId: number): Promise<Project[]> {
    await this.permissionsService.validateTeamAccess(userId, teamId);

    return this.prismaService.project.findMany({
      where: {
        teamId: teamId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async removeProject(
    teamId: number,
    projectId: number,
    userId: number,
  ): Promise<Project> {
    const projectToRemove = await this.prismaService.project.findUnique({
      where: { id: projectId },
    });

    if (!projectToRemove || projectToRemove.teamId !== teamId) {
      throw new NotFoundException('Project not found for this team.');
    }

    const canRemove = await this.permissionsService.canManageTeamResources(
      userId,
      teamId,
      projectToRemove.authorId,
    );

    if (!canRemove) {
      throw new ForbiddenException(
        'You are not allowed to delete this project. Only the author or a team admins can do this.',
      );
    }

    return this.prismaService.project.delete({
      where: { id: projectId },
    });
  }
}
