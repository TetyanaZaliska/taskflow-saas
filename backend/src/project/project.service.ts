import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PermissionsService } from '../permissions/permissions.service';
import { MemberWithUserResponse } from '../team-members/team-members.service';
import { UpdateProjectFields } from './dto/update-project-fields.dto';
import { FieldOutputTypes } from '../prisma/contract';

export type Project = FieldOutputTypes['public']['Project'];

export interface ProjectWithMembers extends Project {
  team: {
    id: number;
    name: string;
    teamMembers: MemberWithUserResponse[];
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

    const project = await this.prismaService.db.orm.public.Project.where({
      id: projectId,
    }).first();

    if (!project) {
      throw new NotFoundException(`Project not found`);
    }

    return project;
  }

  async getProjectWithMembers(
    projectId: number,
    userId: number,
  ): Promise<ProjectWithMembers> {
    await this.permissionsService.validateProjectAccess(userId, projectId);

    const project = await this.prismaService.db.orm.public.Project.where({
      id: projectId,
    })
      .include('team', (team) =>
        team
          .select('id', 'name')
          .include('teamMembers', (teamMembers) =>
            teamMembers
              .where((member) => member.user.some({ isActive: true }))
              .include('user', (user) =>
                user.select('id', 'email', 'isActive'),
              ),
          ),
      )
      .first();

    if (!project) {
      throw new NotFoundException(`Project not found`);
    }

    return project;
  }

  async updateProjectFields(
    projectId: number,
    data: UpdateProjectFields,
    userId: number,
  ): Promise<Project> {
    await this.permissionsService.validateProjectAccess(userId, projectId);

    const project = await this.prismaService.db.orm.public.Project.where({
      id: projectId,
    }).update(data);

    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found.`);
    }

    return project;
  }
}
