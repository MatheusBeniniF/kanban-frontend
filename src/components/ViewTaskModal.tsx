import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Task } from "@/lib/types";
import { CalendarIcon, Loader2, UserCircle, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "./ui/button";

interface ViewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId?: string;
}

const fetchTaskDetails = async (): Promise<Task> => {
  const response = await fetch("https://api.npoint.io/21c80c25ed65b6f3484f");
  if (!response.ok) {
    throw new Error("Failed to fetch task details");
  }
  return response.json();
};

const ViewTaskModal: React.FC<ViewTaskModalProps> = ({
  isOpen,
  onClose,
  taskId,
}) => {
  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: fetchTaskDetails,
    enabled: isOpen && !!taskId,
  });

  const formattedDate = task
    ? format(new Date(task[0].date), "dd/MM/yyyy", {
        locale: ptBR,
      })
    : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex justify-between">
          <Button
            onClick={onClose}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all"
            aria-label="Fechar"
          >
            <X className="h-5 w-5 text-gray-500" />
          </Button>
          <DialogTitle className="text-[18px] font-semibold">
            Desenvolvimento de Protótipo
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
          <div className="space-y-3 text-kanban-text-primary">
            <div className="text-sm text-kanban-text-secondary">
              Responsáveis:{" "}
              <span className="text-kanban-text-secondary font-medium">
                {task[0].responsible.join(", ")}
              </span>
            </div>

            <div className="bg-[#F3F4F6] text-sm text-kanban-text-primary p-4 rounded-xl leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto">
              {task[0].description}
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 text-kanban-text-secondary text-sm border border-dashed p-2 rounded-lg">
                <CalendarIcon className="w-4 h-4" />
                {formattedDate}
              </div>

              <div className="text-yellow-500 text-xs px-3 py-1 rounded-md font-medium">
                Faltam 5 dias
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ViewTaskModal;
