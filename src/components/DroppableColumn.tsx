import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { ColumnData } from "@/lib/types";
import SortableTaskCard from "./SortableTaskCard";

interface DroppableColumnProps {
  column: ColumnData;
  onTaskClick: (taskId: string) => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({
  column,
  onTaskClick,
}) => {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div key={column.id} className="kanban-column flex-shrink-0 w-[300px]">
      <div className="p-4 flex items-center gap-2 border-b border-kanban-border-light">
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

      <div
        ref={setNodeRef}
        className="flex-1 p-3 flex flex-col gap-3 min-h-[200px]"
      >
        <SortableContext
          items={column.tasks.map((task) => task.id)}
          strategy={rectSortingStrategy}
        >
          {column.tasks.length === 0 ? (
            <div className="h-20 border-2 border-dashed border-kanban-border-light rounded-lg flex items-center justify-center text-kanban-text-secondary text-sm">
              Sem tarefas
            </div>
          ) : (
            column.tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task.id)}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default DroppableColumn;
