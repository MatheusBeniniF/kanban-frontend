import type { Meta, StoryObj } from "@storybook/react";
import { Task } from "@/lib/types";
import TaskCard from "../TaskCard";

const exampleTask: Task = {
  id: "1",
  title: "Criar wireframes",
  description: "Criar os primeiros wireframes para o projeto XPTO.",
  responsibles: ["João", "Maria"],
  date: new Date().toISOString().split("T")[0],
  status: "a-fazer",
};

const meta: Meta<typeof TaskCard> = {
  title: "Kanban/TaskCard",
  component: TaskCard,
  decorators: [
    (Story) => (
      <div className="p-3">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TaskCard>;

export const Default: Story = {
  args: {
    task: exampleTask,
    onClick: () => alert("Card clicado!"),
    columnId: "feito",
  },
};
