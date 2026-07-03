import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ProjectRolesGuard } from '../guards/project-roles.guard';
import { CreateTaskRequest } from './dto/create-task.request';
import { CurrentUser } from '../auth/current-user.decorator';
import { type TokenPayload } from '../auth/token-payload.interface';

@Controller('project/:projectId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTask(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: CreateTaskRequest,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.tasksService.createTask(projectId, body, user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, ProjectRolesGuard)
  async getProjectTasks(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.tasksService.getProjectTasks(projectId);
  }
}
