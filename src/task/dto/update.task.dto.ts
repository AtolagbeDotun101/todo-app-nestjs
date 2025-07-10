export class UpdateTaskDto{
    title?: string;
    description?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    startDate?: Date;
    dueDate?: Date;
    
}

export class CreateTaskDto {
    title: string;
    description: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    startDate?: Date;
    dueDate?: Date;
}