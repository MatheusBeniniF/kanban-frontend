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
    <div key={column.id} className="kanban-column flex-shrink-0 w-[354px]">
      <div className="p-4 flex items-center gap-2 border-b border-kanban-border-light">
        <h2 className="font-semibold text-kanban-text-primary">
          {column.title}
        </h2>
        {column.tasks.length > 0 && (
          <div className="ml-auto bg-white text-xs font-medium px-2 py-1 rounded-full text-kanban-text-secondary">
            {column.tasks.length}
          </div>
        )}
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 p-3 flex flex-col gap-3 min-h-[200px] w-[352px]"
      >
        <SortableContext
          items={column.tasks.map((task) => task.id)}
          strategy={rectSortingStrategy}
        >
          {column.tasks.length === 0
            ? ""
            : column.tasks.map((task) => (
                <SortableTaskCard
                  key={task.id}
                  task={task}
                  onClick={() => onTaskClick(task.id)}
                  columnId={column.id}
                />
              ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default DroppableColumn;
