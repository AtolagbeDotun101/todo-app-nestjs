import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTaskDto } from './dto/update.task.dto';
import { AuthGuard } from '@nestjs/passport';

const enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

@Injectable()
export class TaskService {
    constructor(
        private prisma: PrismaService
    ) {}

    async createTask(userId: number, createTaskDto: UpdateTaskDto) {
        return this.prisma.task.create({
            data: {
                userId,
                title: createTaskDto.title,
                description: createTaskDto.description,
                status: createTaskDto.status || TaskStatus.PENDING,
                startDate: createTaskDto.startDate,
                endDate: createTaskDto.dueDate,   
            },
        });
    }

    async getUserTasks(userId: number) {
        return this.prisma.task.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getTaskById(taskId: number, userId: number) {
        return this.prisma.task.findFirst({
            where: {
                id: taskId,
                userId,
            },
        });
    } 

   async updateTaskStatus(taskId: number, userId: number, updateTaskDto: UpdateTaskDto) {
    try {
      return await this.prisma.task.update({
        where: {
          id_userId: { id: taskId, userId },
        },
        data: updateTaskDto,
      });
    } catch (error) {
      throw new NotFoundException('Task not found or does not belong to the user');
    }
  }

  async deleteTask(taskId: number, userId: number) {
    try {
      return await this.prisma.task.delete({
        where: {
          id_userId: { id: taskId, userId },
        },
      });
    } catch (error) {
      throw new NotFoundException('Task not found or does not belong to the user');
    }
  }
    async getTaskCount(userId: number) {
        return this.prisma.task.count({
            where: { userId },
        });
    }
    async getTaskByStatus(userId: number, status: string) {
        return this.prisma.task.findMany({
            where: {
                userId,
                status,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getTaskByDateRange(userId: number, startDate: Date, endDate: Date) {
        return this.prisma.task.findMany({
            where: {
                userId,
                startDate: {
                    gte: startDate,
                },
                endDate: {
                    lte: endDate,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getTaskBySearch(userId: number, searchTerm: string) {
        return this.prisma.task.findMany({
            where: {
                userId,
                OR: [
                    { title: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } },
                ],
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
