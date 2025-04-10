import React from "react";
import { Task } from "@/lib/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";

interface SortableTaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  columnId: string;
}

const SortableTaskCard = ({
  task,
  onClick,
  columnId,
}: SortableTaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={onClick} columnId={columnId} />
    </div>
  );
};

export default SortableTaskCard;
