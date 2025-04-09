
import React from 'react';
import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CalendarIcon, UserCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  className?: string;
}

const TaskCard = ({ task, onClick, className }: TaskCardProps) => {
  // Format date to Brazilian format (DD/MM/YYYY)
  const formattedDate = task.date ? 
    format(new Date(task.date), 'dd/MM/yyyy', { locale: ptBR }) : '';
  
  return (
    <div 
      className={cn(
        'task-card bg-white p-4 rounded-lg shadow-sm border border-kanban-border-light',
        'hover:shadow-md transition-shadow duration-200',
        className
      )}
      onClick={() => onClick(task)}
    >
      <h3 className="font-semibold text-kanban-text-primary mb-2 line-clamp-2">
        {task.title}
      </h3>
      
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center text-sm text-kanban-text-secondary gap-2">
          <UserCircle size={16} className="text-kanban-text-secondary" />
          <span className="truncate">{task.responsible}</span>
        </div>
        
        {task.date && (
          <div className="flex items-center text-sm text-kanban-text-secondary gap-2">
            <CalendarIcon size={16} className="text-kanban-text-secondary" />
            <span>{formattedDate}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
