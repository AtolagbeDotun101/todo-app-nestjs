export class UpdateTaskDto{
    title?: string;
    description?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    startDate?: Date;
    dueDate?: Date;
    
}