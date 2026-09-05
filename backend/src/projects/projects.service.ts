import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectRequest } from './dto/create-project.request';
import { PermissionsService } from '../permissions/permissions.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { PAGE_LIMIT } from '../common/constants/constants';
import { FieldOutputTypes } from '../prisma/contract';

export type Project = FieldOutputTypes['public']['Project'];

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

    const project = await this.prismaService.db.orm.public.Project.create({
      ...data,
      teamId: teamId,
      authorId: userId,
    });
    return project;
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

    const result = await this.prismaService.db.orm.public.Project.where({
      teamId,
    }).aggregate((a) => ({ total: a.count() }));
    const totalCount = result.total;

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

    const projects = await this.prismaService.db.orm.public.Project.where({
      teamId,
    })
      .orderBy((project) => project.createdAt.desc())
      .limit(limit)
      .offset(skip)
      .all();

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
    const projectToRemove =
      await this.prismaService.db.orm.public.Project.where({
        id: projectId,
      }).first();

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

    const project = await this.prismaService.db.orm.public.Project.where({
      id: projectId,
    }).delete();

    if (!project) {
      throw new NotFoundException('Project not found for this team.');
    }

    return project;
  }
}
