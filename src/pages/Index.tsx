
import React from 'react';
import KanbanBoard from '@/components/KanbanBoard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const Index: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container py-6 bg-[#E7EDF0] w-full h-full font-roboto">
        <KanbanBoard />
      </div>
    </QueryClientProvider>
  );
};

export default Index;
