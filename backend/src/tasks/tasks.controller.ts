import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ProjectRolesGuard } from '../guards/project-roles.guard';
import { CreateTaskRequest } from './dto/create-task.request';
import { CurrentUser } from '../auth/current-user.decorator';
import { UpdateTaskFieldsDto } from './dto/update-task-fields.dto';

@Controller('project/:projectId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(JwtAuthGuard, ProjectRolesGuard)
  async createTask(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: CreateTaskRequest,
    @CurrentUser('userId') userId: number,
  ) {
    return this.tasksService.createTask(projectId, body, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, ProjectRolesGuard)
  async getProjectTasks(
    @Param('projectId', ParseIntPipe) projectId: number,
    @CurrentUser('userId') userId: number,
  ) {
    return this.tasksService.getProjectTasks(projectId, userId);
  }

  @Get(':taskId')
  @UseGuards(JwtAuthGuard, ProjectRolesGuard)
  async getProjectTask(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @CurrentUser('userId') userId: number,
  ) {
    return this.tasksService.getProjectTask(projectId, taskId, userId);
  }

  @Get(':taskId/with-members')
  @UseGuards(JwtAuthGuard, ProjectRolesGuard)
  async getProjectTaskWithMembers(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @CurrentUser('userId') userId: number,
  ) {
    return this.tasksService.getProjectTaskWithMembers(
      projectId,
      taskId,
      userId,
    );
  }

  @Delete(':taskId')
  @UseGuards(JwtAuthGuard, ProjectRolesGuard)
  async removeTask(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @CurrentUser('userId') userId: number,
  ) {
    return this.tasksService.removeTask(projectId, taskId, userId);
  }

  @Patch(':taskId')
  @UseGuards(JwtAuthGuard, ProjectRolesGuard)
  async updateTaskFields(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() body: UpdateTaskFieldsDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.tasksService.updateTaskFields(projectId, taskId, body, userId);
  }
}
