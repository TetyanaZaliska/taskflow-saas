import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { ProjectRolesGuard } from '../guards/project-roles.guard';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(ProjectRolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
