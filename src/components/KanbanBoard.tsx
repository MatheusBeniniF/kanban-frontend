import React, { useEffect, useRef, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useKanban, KanbanProvider } from "@/contexts/KanbanContext";
import { useKanbanDnd } from "@/hooks/useKanbanDnd";
import KanbanHeader from "./KanbanHeader";
import KanbanColumns from "./KanbanColumns";
import NewTaskModal from "./NewTaskModal";
import ViewTaskModal from "./ViewTaskModal";
import { ChevronLeft, ChevronRight } from "lucide-react";

const KanbanBoardContent: React.FC = () => {
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isViewTaskModalOpen, setIsViewTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(
    undefined
  );
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { handleCreateTask, isSubmitting } = useKanban();
  const { handleDragStart, handleDragEnd, collisionDetection } = useKanbanDnd();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Ref para controlar o scroll horizontal
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    console.log(direction);
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 300;
      console.log(scrollAmount);
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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

  useEffect(() => {
    const container = scrollRef.current;

    const updateScrollButtons = () => {
      if (container) {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
      }
    };

    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons(); // run once on mount
    }

    return () => {
      container?.removeEventListener("scroll", updateScrollButtons);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <KanbanHeader onCreateTask={handleOpenNewTaskModal} />

      <div className="flex justify-end items-center gap-4 mt-4 mb-2 px-2 lg:px-[12rem]">
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={`bg-white shadow p-2 rounded-full transition ${
            canScrollLeft
              ? "hover:bg-gray-100"
              : "opacity-50 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>

        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={`bg-white shadow p-2 rounded-full transition ${
            canScrollRight
              ? "hover:bg-gray-100"
              : "opacity-50 cursor-not-allowed"
          }`}
        >
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div ref={scrollRef} className="overflow-x-auto px-4 scrollbar-hide">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          collisionDetection={collisionDetection}
        >
          <KanbanColumns onTaskClick={handleTaskClick} />
        </DndContext>
      </div>

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
