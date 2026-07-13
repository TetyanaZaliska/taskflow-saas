import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async getProject(projectId: number, userId: number) {
    await this.permissionsService.validateProjectAccess(userId, projectId);

    try {
      return await this.prismaService.project.findUniqueOrThrow({
        where: { id: projectId },
      });
    } catch {
      throw new NotFoundException(`Project not found`);
    }
  }
}
