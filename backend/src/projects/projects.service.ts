import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectRequest } from './dto/create-project.request';
import { PermissionsService } from '../permissions/permissions.service';
import { Project } from '@prisma/client';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedResponse } from '../interfaces/paginated-response.interface';
import { PAGE_LIMIT } from '../constants/constants';

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
        ...data,
        teamId: teamId,
        authorId: userId,
      },
    });
  }

  async getProjects(
    teamId: number,
    query: PaginationQueryDto,
    userId: number,
  ): Promise<PaginatedResponse<Project>> {
    await this.permissionsService.validateTeamAccess(userId, teamId);

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Number(query.limit) || PAGE_LIMIT;
    const skip = (page - 1) * limit;

    const totalCount = await this.prismaService.project.count({
      where: { teamId },
    });

    const totalPages = Math.ceil(totalCount / limit);

    if (totalCount === 0 || skip >= totalCount) {
      return {
        data: [],
        meta: {
          totalItems: totalCount,
          totalPages,
          currentPage: page,
          limit,
        },
      };
    }

    const projects = await this.prismaService.project.findMany({
      where: { teamId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: projects,
      meta: {
        totalItems: totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    };
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
