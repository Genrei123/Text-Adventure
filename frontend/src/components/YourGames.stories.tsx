import type { Meta, StoryObj } from '@storybook/react';

import YourGames from './YourGames';

const meta = {
  component: YourGames,
} satisfies Meta<typeof YourGames>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};