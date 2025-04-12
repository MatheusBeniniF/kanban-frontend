import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Task } from "@/lib/types";
import { CalendarIcon, Loader2, X } from "lucide-react";
import { differenceInCalendarDays, format, isBefore } from "date-fns";
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

  const hasValidTask = Array.isArray(task) && task.length > 0;
  const currentTask = hasValidTask ? task[0] : null;

  const formattedDate = currentTask?.date
    ? format(new Date(currentTask.date), "dd/MM/yyyy", {
        locale: ptBR,
      })
    : "";

  let statusText = "";
  let statusColor = "";
  if (!isLoading && currentTask) {
    const dueDate = currentTask.date
      ? new Date(currentTask.date + "T00:00:00")
      : null;
    const today = new Date();
    const isLate = dueDate && isBefore(dueDate, today);

    if (dueDate) {
      const daysDiff = differenceInCalendarDays(dueDate, today);
      if (isLate) {
        statusText = `Atrasado há ${Math.abs(daysDiff)} dias`;
        statusColor = "text-red-500";
      } else if (daysDiff <= 5) {
        statusText = `Faltam ${daysDiff} dias`;
        statusColor = "text-yellow-500";
      } else {
        statusText = `Faltam ${daysDiff} dias`;
        statusColor = "text-green-500";
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {isLoading ? (
        <div className="h-40 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-kanban-blue" />
        </div>
      ) : error ? (
        <div className="h-40 flex items-center justify-center text-red-500">
          Erro ao carregar os detalhes da tarefa
        </div>
      ) : currentTask ? (
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex justify-between">
            <Button
              onClick={onClose}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all"
              aria-label="Fechar"
            >
              <X className="h-5 w-5 text-gray-500" />
            </Button>
            <DialogTitle className="text-[14px] font-semibold flex justify-between items-center">
              Desenvolvimento de Protótipo
              <div className="flex items-center text-[10px] justify-between">
                <div
                  className={`px-3 py-1 rounded-md font-medium ${statusColor}`}
                >
                  {statusText}
                </div>
                <div className="flex items-center gap-2 text-kanban-text-secondary text-sm border border-dashed p-2 rounded-lg">
                  <CalendarIcon className="w-4 h-4" />
                  {formattedDate}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-kanban-text-primary">
            <div className="text-sm text-kanban-text-secondary">
              Responsáveis:{" "}
              <span className="text-kanban-text-secondary font-medium">
                {currentTask.responsible.join(", ")}
              </span>
            </div>

            <div className="bg-[#F3F4F6] text-sm text-kanban-text-primary p-4 rounded-xl leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto">
              {currentTask.description}
            </div>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
};

export default ViewTaskModal;
