import type { Meta, StoryObj } from '@storybook/react';

import GameHeader from './GameHeader';

const meta = {
  component: GameHeader,
} satisfies Meta<typeof GameHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};