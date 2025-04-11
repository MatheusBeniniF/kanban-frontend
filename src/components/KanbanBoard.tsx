
import React, { useState } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useKanban, KanbanProvider } from '@/contexts/KanbanContext';
import { useKanbanDnd } from '@/hooks/useKanbanDnd';
import KanbanHeader from './KanbanHeader';
import KanbanColumns from './KanbanColumns';
import NewTaskModal from './NewTaskModal';
import ViewTaskModal from './ViewTaskModal';

const KanbanBoardContent: React.FC = () => {
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isViewTaskModalOpen, setIsViewTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(undefined);
  
  const { handleCreateTask, isSubmitting } = useKanban();
  const { handleDragStart, handleDragEnd, collisionDetection } = useKanbanDnd();
  
  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required before drag starts
      },
    })
  );
  
  const handleOpenNewTaskModal = () => {
    setIsNewTaskModalOpen(true);
  };
  
  const handleCloseNewTaskModal = () => {
    setIsNewTaskModalOpen(false);
  };
  
  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsViewTaskModalOpen(true);
  };
  
  const handleCloseViewTaskModal = () => {
    setIsViewTaskModalOpen(false);
    setSelectedTaskId(undefined);
  };
  
  const handleSaveNewTask = async (taskData) => {
    await handleCreateTask(taskData);
    handleCloseNewTaskModal();
  };
  
  return (
    <div className="flex flex-col h-full">
      <KanbanHeader onCreateTask={handleOpenNewTaskModal} />
      
      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={collisionDetection}
      >
        <KanbanColumns onTaskClick={handleTaskClick} />
      </DndContext>
      
      <NewTaskModal 
        isOpen={isNewTaskModalOpen}
        onClose={handleCloseNewTaskModal}
        onSave={handleSaveNewTask}
        isSubmitting={isSubmitting}
      />
      
      <ViewTaskModal 
        isOpen={isViewTaskModalOpen}
        onClose={handleCloseViewTaskModal}
        taskId={selectedTaskId}
      />
    </div>
  );
};

const KanbanBoard: React.FC = () => {
  return (
    <KanbanProvider>
      <KanbanBoardContent />
    </KanbanProvider>
  );
};

export default KanbanBoard;
