
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { Task } from '@/lib/types';
import { CalendarIcon, Loader2, UserCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ViewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId?: string;
}

const fetchTaskDetails = async (): Promise<Task> => {
  const response = await fetch('https://api.npoint.io/21c80c25ed65b6f3484f');
  if (!response.ok) {
    throw new Error('Failed to fetch task details');
  }
  return response.json();
};

const ViewTaskModal: React.FC<ViewTaskModalProps> = ({ isOpen, onClose, taskId }) => {
  const { data: task, isLoading, error } = useQuery({
    queryKey: ['task', taskId],
    queryFn: fetchTaskDetails,
    enabled: isOpen && !!taskId,
  });

  const formattedDate = task ? format(new Date(task[0].date), "dd/MM/yyyy", {
    locale: ptBR,
  }) : '';

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-semibold">
            Detalhes da Tarefa
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-kanban-blue" />
          </div>
        ) : error ? (
          <div className="h-40 flex items-center justify-center text-red-500">
            Erro ao carregar os detalhes da tarefa
          </div>
        ) : task ? (
          <div className="space-y-4 py-2">
            <div>
              <h3 className="text-lg font-semibold text-kanban-text-primary">
                {task[0].title}
              </h3>
            </div>

            <div>
              <h4 className="text-sm font-medium text-kanban-text-secondary mb-1">
                Descrição
              </h4>
              <p className="text-kanban-text-primary max-h-40 overflow-y-auto whitespace-pre-wrap">
                {task[0].description}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <h4 className="text-sm font-medium text-kanban-text-secondary mb-1">
                  Responsáveis
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  {task[0].responsible?.map((name: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 text-kanban-text-primary bg-kanban-gray px-2 py-1 rounded-full text-sm"
                    >
                      <UserCircle
                        size={16}
                        className="text-kanban-text-secondary"
                      />
                      {name}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-kanban-text-secondary mb-1">
                  Data Limite
                </h4>
                <div className="flex items-center gap-2">
                  <CalendarIcon
                    size={20}
                    className="text-kanban-text-secondary"
                  />
                  <span className="text-kanban-text-primary">
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ViewTaskModal;
