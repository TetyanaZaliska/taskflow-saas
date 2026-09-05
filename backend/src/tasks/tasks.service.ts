import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskRequest } from './dto/create-task.request';
import { PermissionsService } from '../permissions/permissions.service';
import type { FieldOutputTypes } from '../prisma/contract.d';
import { UpdateTaskFieldsDto } from './dto/update-task-fields.dto';
import { ProjectWithMembers } from '../project/project.service';

export type Project = FieldOutputTypes['public']['Project'];
export type Task = FieldOutputTypes['public']['Task'];

export interface TaskWithProject extends Task {
  project: Project;
}

export interface TaskWithProjectAndMembers extends Task {
  project: ProjectWithMembers;
}

@Injectable()
export class TasksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async createTask(
    projectId: number,
    data: CreateTaskRequest,
    userId: number,
  ): Promise<Task> {
    await this.permissionsService.validateProjectAccess(userId, projectId);

    return this.prismaService.db.transaction(async (tx) => {
      const project = await tx.orm.public.Project.select(
        'teamId',
        'nextTaskKey',
      ).first({ id: projectId });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (data.assigneeId) {
        const isMemberOfTeam = await tx.orm.public.TeamMember.first({
          userId: data.assigneeId,
          teamId: project.teamId,
        });

        if (!isMemberOfTeam) {
          throw new BadRequestException(
            'The assigned user is not a member of this team.',
          );
        }
      }

      const currentTaskKey = project.nextTaskKey;

      const newTask = await tx.orm.public.Task.create({
        ...data,
        keyNumber: currentTaskKey,
        projectId: projectId,
        authorId: userId,
      });

      await tx.orm.public.Project.where({ id: projectId }).update({
        nextTaskKey: currentTaskKey + 1,
      });

      return newTask;
    });
  }

  async getProjectTasks(projectId: number, userId: number): Promise<Task[]> {
    await this.permissionsService.validateProjectAccess(userId, projectId);

    return this.prismaService.db.orm.public.Task.where({
      projectId: projectId,
    }).all();
  }

  async getProjectTask(
    projectId: number,
    taskId: number,
    userId: number,
  ): Promise<TaskWithProject> {
    await this.permissionsService.validateProjectAccess(userId, projectId);

    const task = await this.prismaService.db.orm.public.Task.where({
      id: taskId,
      projectId: projectId,
    })
      .include('project')
      .first();

    if (!task) {
      throw new NotFoundException(
        `Task with id ${taskId} not found in this project.`,
      );
    }

    return task;
  }

  async getProjectTaskWithMembers(
    projectId: number,
    taskId: number,
    userId: number,
  ): Promise<TaskWithProjectAndMembers> {
    await this.permissionsService.validateProjectAccess(userId, projectId);

    try {
      return await this.prismaService.task.findFirstOrThrow({
        where: {
          id: taskId,
          projectId: projectId,
        },
        include: {
          project: {
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
          },
        },
      });
    } catch {
      throw new NotFoundException(
        `Task with id ${taskId} not found in this project.`,
      );
    }
  }

  async removeTask(
    projectId: number,
    taskId: number,
    userId: number,
  ): Promise<Task> {
    const task = await this.prismaService.task.findFirst({
      where: { id: taskId, projectId: projectId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const canRemove = await this.permissionsService.canManageProjectResources(
      userId,
      projectId,
      task.authorId,
    );

    if (!canRemove) {
      throw new ForbiddenException(
        'You are not allowed to delete this task. Only the author or a team admins can do this.',
      );
    }

    return this.prismaService.task.delete({
      where: { id: taskId, projectId: projectId },
    });
  }

  async updateTaskFields(
    projectId: number,
    taskId: number,
    data: UpdateTaskFieldsDto,
    userId: number,
  ): Promise<Task> {
    await this.permissionsService.validateProjectAccess(userId, projectId);

    try {
      return await this.prismaService.task.update({
        where: {
          id: taskId,
          projectId: projectId,
        },
        data,
      });
    } catch {
      throw new NotFoundException(
        `Task with id ${taskId} not found in this project.`,
      );
    }
  }
}
