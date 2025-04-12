import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDaysIcon, ChevronDown, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsibleOption, Task } from "@/lib/types";
import { toast } from "sonner";
import { Checkbox } from "./ui/checkbox";
import { DialogDescription } from "@radix-ui/react-dialog";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id" | "status">) => void;
  isSubmitting?: boolean;
}

const RESPONSIBLE_OPTIONS: ResponsibleOption[] = [
  { id: "1", name: "Ana Silva" },
  { id: "2", name: "Bruno Santos" },
  { id: "3", name: "Carla Oliveira" },
];

const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responsibles, setResponsibles] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    responsibles: "",
    date: "",
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setResponsibles([]);
    setDate(undefined);
    setErrors({
      title: "",
      description: "",
      responsibles: "",
      date: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const newErrors = {
      title: !title.trim() ? "O título é obrigatório" : "",
      description: !description.trim() ? "A descrição é obrigatória" : "",
      responsibles:
        responsibles.length === 0 ? "Selecione ao menos um responsável" : "",
      date: !date ? "A data limite é obrigatória" : "",
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave({
        title,
        description,
        responsibles: RESPONSIBLE_OPTIONS.filter((option) =>
          responsibles.includes(option.id)
        ).map((option) => option.name),
        date: date ? format(date, "yyyy-MM-dd") : "",
      });
      if (!isSubmitting) resetForm();
    } else {
      toast.error("Por favor, preencha todos os campos obrigatórios");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => handleClose()}>
      <DialogContent className="max-w-md pt-10">
        <Button
          onClick={handleClose}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center hover:bg-muted transition"
          aria-label="Fechar"
        >
          <X className="h-5 w-5 text-gray-500" />
        </Button>
        <DialogHeader className="flex justify-between">
          <DialogTitle className="text-[18px] font-semibold">
            Adicionar tarefa
          </DialogTitle>
          <DialogDescription className="text-[10px]">
            Preencha os detalhes da nova tarefa
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-kanban-label"
            >
              Título da Tarefa
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={cn(
                "rounded-full border-[#ADB8CB]",
                errors.title && "border-red-500"
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-kanban-label"
            >
              Descrição
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={cn(
                "rounded-lg border-[#ADB8CB]",
                errors.description && "border-red-500"
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="responsibles"
              className="block text-sm font-medium text-kanban-label"
            >
              Responsáveis
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between rounded-full border-[#ADB8CB]",
                    errors.responsibles && "border-red-500"
                  )}
                >
                  <div className="flex w-full justify-between items-center">
                    <span className="truncate">
                      {responsibles.length > 0
                        ? RESPONSIBLE_OPTIONS.filter((option) =>
                            responsibles.includes(option.id)
                          )
                            .map((option) => option.name)
                            .join(", ")
                        : ""}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 text-[#ADB8CB]" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-2">
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {RESPONSIBLE_OPTIONS.map((option) => {
                    const isSelected = responsibles.includes(option.id);
                    return (
                      <label
                        key={option.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => {
                            if (isSelected) {
                              setResponsibles(
                                responsibles.filter((id) => id !== option.id)
                              );
                            } else {
                              setResponsibles([...responsibles, option.id]);
                            }
                          }}
                        />
                        <span>{option.name}</span>
                      </label>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
            {errors.responsibles && (
              <p className="text-red-500 text-xs mt-1">{errors.responsibles}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-kanban-label"
            >
              Data Limite
            </label>
            <Popover>
              <PopoverTrigger asChild className="rounded-lg">
                <Button
                  variant="outline"
                  className={cn(
                    "w-1/2 justify-start text-left font-normal rounded-full border-[#ADB8CB]",
                    !date && "text-muted-foreground",
                    errors.date && "border-red-500"
                  )}
                >
                  <div className="flex justify-between w-full items-center">
                    {date ? (
                      format(date, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Data:</span>
                    )}
                    <CalendarDaysIcon className="mr-2 h-4 w-4" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  // disabled={(date) =>
                  //   date < new Date(new Date().setHours(0, 0, 0, 0))
                  // }
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
              className="w-full bg-kanban-blue hover:bg-blue-600 text-white !rounded-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Adicionar tarefa"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskModal;
