import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskRequest } from './dto/create-task.request';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTask(projectId: number, data: CreateTaskRequest, userId: number) {
    const project = await this.prismaService.project.findUnique({
      where: { id: projectId },
      select: { teamId: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (data.assigneeId) {
      const isMemberOfTeam = await this.prismaService.teamMember.findUnique({
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

    const duplicateTask = await this.prismaService.task.findFirst({
      where: {
        projectId: projectId,
        title: {
          equals: data.title,
          mode: 'insensitive',
        },
        status: {
          not: 'DONE',
        },
      },
    });

    if (duplicateTask) {
      throw new BadRequestException(
        'A task with this title already exists in this project and is currently active.',
      );
    }

    return await this.prismaService.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assigneeId: data.assigneeId,
        authorId: userId,
        projectId: projectId,
      },
    });
  }

  async getProjectTasks(projectId: number) {
    return this.prismaService.task.findMany({
      where: {
        projectId: projectId,
      },
    });
  }
}
