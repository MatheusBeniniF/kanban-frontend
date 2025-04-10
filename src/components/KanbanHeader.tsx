import React from "react";
import { Plus, LayoutDashboard } from "lucide-react";

interface KanbanHeaderProps {
  onCreateTask: () => void;
}

const KanbanHeader: React.FC<KanbanHeaderProps> = ({ onCreateTask }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full px-6 pb-14 gap-1.5">
      <div className="bg-white w-full max-w-5xl rounded-3xl p-6 flex items-center shadow-sm">
        <div className="bg-[#4661E6] p-4 rounded-2xl">
          <LayoutDashboard className="text-white" />
        </div>
        <span className="ml-4 font-medium text-[#4661E6] text-base">
          Teste vaga front
        </span>
      </div>
      <div className="bg-white py-4 px-6 rounded-b-[16px]">

        <button
          onClick={onCreateTask}
          className="bg-[#4661E6] text-white text-sm px-4 py-3 rounded-full shadow-md hover:bg-[#3752c6] transition"
          >
          Adicionar tarefa
        </button>
      </div>
    </div>
  );
};

export default KanbanHeader;
