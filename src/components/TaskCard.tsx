import React from "react";
import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format, differenceInCalendarDays, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import CheckIcon from "@/components/icons/check.svg";

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  className?: string;
  columnId?: string;
}

const TaskCard = ({ task, onClick, className, columnId }: TaskCardProps) => {
  const today = new Date();
  const dueDate = task.date ? new Date(task.date) : null;

  let statusText = "";
  let statusColor = "";
  
  const isDone = columnId === "feito";
  console.log(columnId);
  const isLate = dueDate && isBefore(dueDate, today);

  if (dueDate) {
    const daysDiff = differenceInCalendarDays(dueDate, today);

    if (isDone) {
      statusText = isLate ? "Fora do prazo" : "Dentro do prazo";
      statusColor = isLate ? "text-red-500" : "text-green-600";
    } else {
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

  const formattedDate = dueDate
    ? format(dueDate, "dd/MM", { locale: ptBR })
    : "";

  return (
    <div
      className={cn(
        "relative bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 w-full border",
        isDone ? "border-green-600" : "border-kanban-border-light",
        className
      )}
      onClick={() => onClick(task)}
    >
      {isDone && (
        <img
          src={CheckIcon}
          alt="Ícone de concluído"
          className="absolute -top-2 bg-transparent left-3 w-6 h-6 shadow"
        />
      )}

      <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
        {task.title}
      </h3>

      <p className="text-sm text-gray-500 line-clamp-2 mb-4">
        {task.description}
      </p>

      {dueDate && (
        <div className="border border-dashed border-gray-300 rounded-lg px-3 py-2 flex justify-between items-center text-sm mb-4">
          <span className="text-gray-500">Data limite: {formattedDate}</span>
          <span className={cn("font-medium", statusColor)}>{statusText}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {task.members?.map((member, idx) => (
          <span
            key={idx}
            className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full"
          >
            {member}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;
