
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsibleOption, Task } from '@/lib/types';
import { toast } from 'sonner';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'status'>) => void;
  isSubmitting?: boolean;
}

const RESPONSIBLE_OPTIONS: ResponsibleOption[] = [
  { id: '1', name: 'Ana Silva' },
  { id: '2', name: 'Bruno Santos' },
  { id: '3', name: 'Carla Oliveira' },
];

const NewTaskModal: React.FC<NewTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [responsible, setResponsible] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  // Form validation errors
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    responsible: '',
    date: '',
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setResponsible('');
    setDate(undefined);
    setErrors({
      title: '',
      description: '',
      responsible: '',
      date: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const newErrors = {
      title: !title.trim() ? 'O título é obrigatório' : '',
      description: !description.trim() ? 'A descrição é obrigatória' : '',
      responsible: !responsible ? 'O responsável é obrigatório' : '',
      date: !date ? 'A data limite é obrigatória' : '',
    };
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        title,
        description,
        responsible: RESPONSIBLE_OPTIONS.find(option => option.id === responsible)?.name || '',
        date: date ? format(date, 'yyyy-MM-dd') : '',
      });
    } else {
      toast.error('Por favor, preencha todos os campos obrigatórios');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-semibold">Criar Tarefa</DialogTitle>
          <button 
            onClick={handleClose}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-kanban-text-primary">
              Título da Tarefa
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={cn(errors.title && "border-red-500")}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-kanban-text-primary">
              Descrição
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={cn(errors.description && "border-red-500")}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="responsible" className="block text-sm font-medium text-kanban-text-primary">
              Responsável
            </label>
            <Select value={responsible} onValueChange={setResponsible}>
              <SelectTrigger 
                id="responsible" 
                className={cn(errors.responsible && "border-red-500")}
              >
                <SelectValue placeholder="Selecione um responsável" />
              </SelectTrigger>
              <SelectContent>
                {RESPONSIBLE_OPTIONS.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.responsible && (
              <p className="text-red-500 text-xs mt-1">{errors.responsible}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium text-kanban-text-primary">
              Data Limite
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                    errors.date && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  locale={ptBR}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date}</p>
            )}
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit"
              className="w-full bg-kanban-blue hover:bg-blue-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Tarefa'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskModal;
