import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectRequest } from './dto/create-project.request';

@Injectable()
export class ProjectsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProject(teamId: number, data: CreateProjectRequest) {
    return await this.prismaService.project.create({
      data: {
        name: data.name,
        description: data.description,
        teamId: teamId,
      },
    });
  }

  async getProjects(teamId: number) {
    return this.prismaService.project.findMany({
      where: {
        teamId: teamId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async removeProject(teamId: number, projectId: number) {
    const projectToRemove = await this.prismaService.project.findUnique({
      where: { id: projectId },
    });

    if (!projectToRemove || projectToRemove.teamId !== teamId) {
      throw new NotFoundException('Project not found for this team.');
    }

    return this.prismaService.project.delete({
      where: { id: projectId },
    });
  }
}
