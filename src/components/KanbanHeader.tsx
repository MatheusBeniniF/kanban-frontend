
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface KanbanHeaderProps {
  onCreateTask: () => void;
}

const KanbanHeader: React.FC<KanbanHeaderProps> = ({ onCreateTask }) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-kanban-text-primary">Quadro de Tarefas</h1>
      <Button 
        onClick={onCreateTask}
        className="bg-kanban-blue hover:bg-blue-600"
      >
        <Plus className="h-5 w-5 mr-2" /> Criar Tarefa
      </Button>
    </div>
  );
};

export default KanbanHeader;
