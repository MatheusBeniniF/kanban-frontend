import type { Meta, StoryObj } from '@storybook/react';

import TaskCard from './TaskCard';

const meta = {
  component: TaskCard,
} satisfies Meta<typeof TaskCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    task: {
      "title": "testando title",
      "description": "testando description",
      "date": "2025-04-16",
      "responsibles": ["abc ", "abc"],
      "status": "feito"
    },

    onClick: () => {},
    columnId: ""
  }
};