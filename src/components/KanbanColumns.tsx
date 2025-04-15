import React from "react";
import { useKanban } from "@/contexts/KanbanContext";
import DroppableColumn from "./DroppableColumn";

interface KanbanColumnsProps {
  onTaskClick: (taskId: string) => void;
}

const KanbanColumns: React.FC<KanbanColumnsProps> = ({ onTaskClick }) => {
  const { columns } = useKanban();

  return (
    <div className="flex justify-between pb-4 whitespace-nowrap">
      {columns.map((column) => (
        <DroppableColumn
          key={column.id}
          column={column}
          onTaskClick={onTaskClick}
        />
      ))}
    </div>
  );
};

export default KanbanColumns;
