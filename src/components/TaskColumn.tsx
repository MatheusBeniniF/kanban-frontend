
import React from 'react';
import { ColumnData, Task } from '@/lib/types';
import TaskCard from './TaskCard';
import { cn } from '@/lib/utils';

interface TaskColumnProps {
  column: ColumnData;
  onTaskClick: (task: Task) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ column, onTaskClick }) => {
  return (
    <div className="kanban-column flex flex-col bg-kanban-gray rounded-lg">
      <div 
        className="p-4 flex items-center gap-2 border-b border-kanban-border-light"
      >
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: column.color }}
        />
        <h2 className="font-semibold text-kanban-text-primary">
          {column.title}
        </h2>
        <div className="ml-auto bg-white text-xs font-medium px-2 py-1 rounded-full text-kanban-text-secondary">
          {column.tasks.length}
        </div>
      </div>
      
      <div className="flex-1 p-3 flex flex-col gap-3">
        {column.tasks.length === 0 ? (
          <div className="h-20 border-2 border-dashed border-kanban-border-light rounded-lg flex items-center justify-center text-kanban-text-secondary text-sm">
            Sem tarefas
          </div>
        ) : (
          column.tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={onTaskClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
