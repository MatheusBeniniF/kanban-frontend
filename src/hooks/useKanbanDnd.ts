
import { DragEndEvent, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { useKanban } from '@/contexts/KanbanContext';
import { ColumnType } from '@/lib/types';

export const useKanbanDnd = () => {
  const { columns, setActiveId, moveTask, reorderTask } = useKanban();

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const taskId = active.id as string;

    // Find source column and index
    let sourceColumnId: ColumnType | null = null;
    let fromIndex: number | null = null;


    for (const column of columns) {
      const idx = column.tasks.findIndex(task => task.id === taskId);
      if (idx !== -1) {
        sourceColumnId = column.id;
        fromIndex = idx;
        break;
      }
    }

    if (!sourceColumnId || fromIndex === null) return;

    // Find target column and index
    let targetColumnId: ColumnType | null = null;
    let toIndex: number | null = null;

    for (const column of columns) {
      const idx = column.tasks.findIndex(task => task.id === over.id);
      if (idx !== -1) {
        targetColumnId = column.id;
        toIndex = idx;
        break;
      }
    }

    // Dropped into empty space in a column
    if (!targetColumnId) {
      const targetCol = columns.find(col => col.id === over.id);
      if (targetCol) {
        targetColumnId = targetCol.id;
        toIndex = targetCol.tasks.length;
      }
    }

    if (!targetColumnId || toIndex === null) return;

    // If same column and just reorder
    if (sourceColumnId === targetColumnId) {
      if (fromIndex !== toIndex) {
        reorderTask(sourceColumnId, fromIndex, toIndex);
      }
      return;
    }

    // Else move to another column
    moveTask(taskId, sourceColumnId, targetColumnId);
  };

  return {
    handleDragStart,
    handleDragEnd,
    collisionDetection: closestCorners
  };
};
