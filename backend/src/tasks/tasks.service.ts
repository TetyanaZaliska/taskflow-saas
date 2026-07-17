import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskRequest } from './dto/create-task.request';
import { PermissionsService } from '../permissions/permissions.service';
import { Task } from '@prisma/client';
import { UpdateTaskFieldsDto } from './dto/update-task-fields.dto';

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

    return this.prismaService.$transaction(async (tx) => {
      const project = await tx.project.findUnique({
        where: { id: projectId },
        select: {
          teamId: true,
          nextTaskKey: true,
        },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (data.assigneeId) {
        const isMemberOfTeam = await tx.teamMember.findUnique({
          where: {
            userId_teamId: {
              userId: data.assigneeId,
              teamId: project.teamId,
            },
          },
        });

        if (!isMemberOfTeam) {
          throw new BadRequestException(
            'The assigned user is not a member of this team.',
          );
        }
      }

      const currentTaskKey = project.nextTaskKey;

      const newTask = await tx.task.create({
        data: {
          ...data,
          keyNumber: currentTaskKey,
          projectId: projectId,
          authorId: userId,
        },
      });

      await tx.project.update({
        where: { id: projectId },
        data: { nextTaskKey: { increment: 1 } },
      });

      return newTask;
    });
  }

  async getProjectTasks(projectId: number, userId: number): Promise<Task[]> {
    await this.permissionsService.validateProjectAccess(userId, projectId);

    return this.prismaService.task.findMany({
      where: {
        projectId: projectId,
      },
    });
  }

  async getTask(
    projectId: number,
    taskId: number,
    userId: number,
  ): Promise<Task> {
    await this.permissionsService.validateProjectAccess(userId, projectId);

    try {
      return await this.prismaService.task.findFirstOrThrow({
        where: {
          id: taskId,
          projectId: projectId,
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
    const task = await this.prismaService.task.findUnique({
      where: { id: taskId },
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
      where: { id: taskId },
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
