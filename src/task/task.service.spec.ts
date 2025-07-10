import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';

// Mock the enum
const enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

describe('TaskService', () => {
  let taskService: TaskService;
  let prismaService: PrismaService;

  // Mock PrismaService
  const mockPrismaService = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      // Arrange
      const userId = 1;
      const title = 'Test Task';
      const description = 'Test task description';
      
      const mockTask = {
        id: 1,
        title,
        description,
        status: TaskStatus.PENDING,
        userId,
        startDate: null,
        endDate: null,
        createdAt: new Date('2025-07-10T10:00:00Z'),
        updatedAt: new Date('2025-07-10T10:00:00Z'),
      };

      mockPrismaService.task.create.mockResolvedValue(mockTask);

      // Act
      const result = await taskService.createTask(userId, title, description);

      // Assert
      expect(result).toEqual(mockTask);
      expect(mockPrismaService.task.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: {
          title,
          description,
          status: TaskStatus.PENDING,
          userId,
        },
      });
    });

    it('should handle empty title', async () => {
      // Arrange
      const userId = 1;
      const title = '';
      const description = 'Test description';

      const mockTask = {
        id: 2,
        title,
        description,
        status: TaskStatus.PENDING,
        userId,
        startDate: null,
        endDate: null,
        createdAt: new Date('2025-07-10T10:00:00Z'),
        updatedAt: new Date('2025-07-10T10:00:00Z'),
      };

      mockPrismaService.task.create.mockResolvedValue(mockTask);

      // Act
      const result = await taskService.createTask(userId, title, description);

      // Assert
      expect(result).toEqual(mockTask);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: {
          title: '',
          description,
          status: TaskStatus.PENDING,
          userId,
        },
      });
    });

    it('should handle empty description', async () => {
      // Arrange
      const userId = 1;
      const title = 'Test Task';
      const description = '';

      const mockTask = {
        id: 3,
        title,
        description,
        status: TaskStatus.PENDING,
        userId,
        startDate: null,
        endDate: null,
        createdAt: new Date('2025-07-10T10:00:00Z'),
        updatedAt: new Date('2025-07-10T10:00:00Z'),
      };

      mockPrismaService.task.create.mockResolvedValue(mockTask);

      // Act
      const result = await taskService.createTask(userId, title, description);

      // Assert
      expect(result).toEqual(mockTask);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: {
          title,
          description: '',
          status: TaskStatus.PENDING,
          userId,
        },
      });
    });

    it('should handle different user IDs', async () => {
      // Arrange
      const userId = 999;
      const title = 'Another Task';
      const description = 'Another description';

      const mockTask = {
        id: 4,
        title,
        description,
        status: TaskStatus.PENDING,
        userId,
        startDate: null,
        endDate: null,
        createdAt: new Date('2025-07-10T10:00:00Z'),
        updatedAt: new Date('2025-07-10T10:00:00Z'),
      };

      mockPrismaService.task.create.mockResolvedValue(mockTask);

      // Act
      const result = await taskService.createTask(userId, title, description);

      // Assert
      expect(result).toEqual(mockTask);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: {
          title,
          description,
          status: TaskStatus.PENDING,
          userId,
        },
      });
    });

    it('should handle database errors', async () => {
      // Arrange
      const userId = 1;
      const title = 'Test Task';
      const description = 'Test description';
      
      const dbError = new Error('Database connection failed');
      mockPrismaService.task.create.mockRejectedValue(dbError);

      // Act & Assert
      await expect(taskService.createTask(userId, title, description)).rejects.toThrow(
        'Database connection failed'
      );
      expect(mockPrismaService.task.create).toHaveBeenCalledTimes(1);
    });

    it('should handle Prisma validation errors', async () => {
      // Arrange
      const userId = 1;
      const title = 'Test Task';
      const description = 'Test description';
      
      const prismaError = new Error('Foreign key constraint failed');
      mockPrismaService.task.create.mockRejectedValue(prismaError);

      // Act & Assert
      await expect(taskService.createTask(userId, title, description)).rejects.toThrow(
        'Foreign key constraint failed'
      );
    });

    it('should set default status to PENDING', async () => {
      // Arrange
      const userId = 1;
      const title = 'Status Test Task';
      const description = 'Testing default status';

      const mockTask = {
        id: 5,
        title,
        description,
        status: TaskStatus.PENDING,
        userId,
        startDate: null,
        endDate: null,
        createdAt: new Date('2025-07-10T10:00:00Z'),
        updatedAt: new Date('2025-07-10T10:00:00Z'),
      };

      mockPrismaService.task.create.mockResolvedValue(mockTask);

      // Act
      const result = await taskService.createTask(userId, title, description);

      // Assert
      expect(result.status).toBe(TaskStatus.PENDING);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: {
          title,
          description,
          status: TaskStatus.PENDING,
          userId,
        },
      });
    });

    it('should handle long title and description', async () => {
      // Arrange
      const userId = 1;
      const title = 'A'.repeat(1000); // Very long title
      const description = 'B'.repeat(5000); // Very long description

      const mockTask = {
        id: 6,
        title,
        description,
        status: TaskStatus.PENDING,
        userId,
        startDate: null,
        endDate: null,
        createdAt: new Date('2025-07-10T10:00:00Z'),
        updatedAt: new Date('2025-07-10T10:00:00Z'),
      };

      mockPrismaService.task.create.mockResolvedValue(mockTask);

      // Act
      const result = await taskService.createTask(userId, title, description);

      // Assert
      expect(result).toEqual(mockTask);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: {
          title,
          description,
          status: TaskStatus.PENDING,
          userId,
        },
      });
    });
  });


    describe('getUserTasks', () => {
        it('should return tasks for a user', async () => {
        // Arrange
        const userId = 1;
        const mockTasks = [
            { id: 1, title: 'Task 1', userId, status: TaskStatus.PENDING },
            { id: 2, title: 'Task 2', userId, status: TaskStatus.IN_PROGRESS },
        ];
    
        mockPrismaService.task.findMany.mockResolvedValue(mockTasks);
    
        // Act
        const result = await taskService.getUserTasks(userId);
    
        // Assert
        expect(result).toEqual(mockTasks);
        expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        });
    
        it('should return an empty array if no tasks found', async () => {
        // Arrange
        const userId = 2;
        mockPrismaService.task.findMany.mockResolvedValue([]);
    
        // Act
        const result = await taskService.getUserTasks(userId);
    
        // Assert
        expect(result).toEqual([]);
        });
    });


    describe('getTaskById', () => {
        it('should return a task by ID for a user', async () => {
            // Arrange
            const userId = 1;
            const taskId = 1;
            const mockTask = { id: taskId, title: 'Test Task', userId, status: TaskStatus.PENDING };
    
            mockPrismaService.task.findFirst.mockResolvedValue(mockTask);
    
            // Act
            const result = await taskService.getTaskById(taskId, userId);
    
            // Assert
            expect(result).toEqual(mockTask);
            expect(mockPrismaService.task.findFirst).toHaveBeenCalledWith({
                where: { id: taskId, userId },
            });
        });
    
        it('should return null if task not found for user', async () => {
            // Arrange
            const userId = 1;
            const taskId = 999;
    
            mockPrismaService.task.findFirst.mockResolvedValue(null);
    
            // Act
            const result = await taskService.getTaskById(taskId, userId);
    
            // Assert
            expect(result).toBeNull();
        });
    });

    describe('updateTaskStatus', () => {
        it('should update task status successfully', async () => {
            // Arrange
            const userId = 1;
            const taskId = 1;
            const updateTaskDto = { status: TaskStatus.COMPLETED, title: 'Updated Task', description: 'Updated description' };
    
            mockPrismaService.task.update.mockResolvedValue({
                id: taskId,
                ...updateTaskDto,
                userId,
                startDate: null,
                endDate: null,
                createdAt: new Date('2025-07-10T10:00:00Z'),
                updatedAt: new Date('2025-07-10T10:00:00Z'),
            });
    
            // Act
            const result = await taskService.updateTaskStatus(taskId, userId, updateTaskDto);
    
            // Assert
            expect(result).toEqual({
                id: taskId,
                ...updateTaskDto,
                userId,
                startDate: null,
                endDate: null,
                createdAt: new Date('2025-07-10T10:00:00Z'),
                updatedAt: new Date('2025-07-10T10:00:00Z'),
            });
            expect(mockPrismaService.task.update).toHaveBeenCalledWith({
              where: {
                id_userId: { id: taskId, userId },
              },
              data: updateTaskDto,
            });
        });
    
        it('should handle non-existent task for user', async () => {
            // Arrange
            const userId = 1;
            const taskId = 999;
            const updateTaskDto = { status: TaskStatus.CANCELLED };
    
            mockPrismaService.task.update.mockRejectedValue(new Error('Task not found or does not belong to the user'));

    
            // Act & Assert
            await expect(taskService.updateTaskStatus(taskId, userId, updateTaskDto)).rejects.toThrow(
                'Task not found or does not belong to the user'
            );
        });
    });

    describe('deleteTask', () => {
        it('should delete a task successfully', async () => {
            // Arrange
            const userId = 1;
            const taskId = 1;
    
            mockPrismaService.task.delete.mockResolvedValue({ id: taskId, userId });
    
            // Act
            const result = await taskService.deleteTask(taskId, userId);
    
            // Assert
            expect(result).toEqual({ id: taskId, userId });
            expect(mockPrismaService.task.delete).toHaveBeenCalledWith({
              where: {
                id_userId: { id: taskId, userId },
              },
            });
        });
    
        it('should handle non-existent task for user', async () => {
            // Arrange
            const userId = 1;
            const taskId = 999;
    
            mockPrismaService.task.delete.mockRejectedValue(new Error('Task not found or does not belong to the user'));

    
            // Act & Assert
            await expect(taskService.deleteTask(taskId, userId)).rejects.toThrow(
                'Task not found or does not belong to the user'
            );
        });
    });
});