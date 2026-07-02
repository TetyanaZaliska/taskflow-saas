import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProject(projectId: number) {
    try {
      return await this.prismaService.project.findUniqueOrThrow({
        where: { id: projectId },
      });
    } catch (err) {
      throw new NotFoundException(`Project not found`);
    }
  }
}
