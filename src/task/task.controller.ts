import { Post, Body, Request, Controller, UseGuards, Get, Param, Patch, Delete } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/update.task.dto";
import { JwtAuthGuard } from "src/auth/jwt/jwt.guard";

@Controller('task')
@UseGuards(JwtAuthGuard) 
export class TaskController{
    constructor(private taskService: TaskService) {}

    @Post()
    async createTask(
        @Request() req: any,
        @Body() createTaskDto: CreateTaskDto) {
            console.log(req.user)
        const userId = req.user.id; // Assuming user ID is stored in the request object
        if (!userId) {
            throw new Error('User ID not found in request');
        }
        return this.taskService.createTask(userId, createTaskDto);
    }

    @Get()
    async getTasks(@Request() req: any) {
        const userId = req.user.id; // Assuming user ID is stored in the request object
        if (!userId) {
            throw new Error('User ID not found in request');
        }
        return this.taskService.getUserTasks(userId);
    }

    @Get(':id')
    async getTaskById(
        @Request() req: any,
        @Param('id') id: number) {
        const userId = req.user.id; // Assuming user ID is stored in the request object
        if (!userId) {
            throw new Error('User ID not found in request');
        }
        return this.taskService.getTaskById(userId, id);
    }

    @Get("status/:status")
    async getTasksByStatus(
        @Request() req: any,
        @Param('status') status: string) {
        const userId = req.user.id; // Assuming user ID is stored in the request object
        if (!userId) {
            throw new Error('User ID not found in request');
        }
        return this.taskService.getTaskByStatus(userId, status);
        }

        @Get("date")
    async getTasksByDate(
        @Request() req: any,
        @Body('startDate') startdate: Date,
        @Body('endDate') endDate: Date) {
        const userId = req.user.id; // Assuming user ID is stored in the request object
        if (!userId) {
            throw new Error('User ID not found in request');
        }
        return this.taskService.getTaskByDateRange(userId, startdate, endDate);
    }

    @Get("search/:searchTerm")
    async searchTasks(
        @Request() req: any,
        @Param('searchTerm') searchTerm: string) {
        const userId = req.user.id; // Assuming user ID is stored in the request object
        if (!userId) {
            throw new Error('User ID not found in request');
        }
        return this.taskService.getTaskBySearch(userId, searchTerm);
    }

    @Patch(':id')
    async updateTask(
        @Request() req: any,
        @Param('id') id: number,
        @Body() updateTaskDto: CreateTaskDto) {
        const userId = req.user.id; // Assuming user ID is stored in the request object
        if (!userId) {      
            throw new Error('User ID not found in request');
        }
        return this.taskService.updateTaskStatus(id, userId, updateTaskDto);
    }

    @Delete(':id')
    async deleteTask(
        @Request() req: any,
        @Param('id') id: number) {
        const userId = req.user.id; // Assuming user ID is stored in the request object
        if (!userId) {
            throw new Error('User ID not found in request');
        }
        return this.taskService.deleteTask(id, userId);
    }

}