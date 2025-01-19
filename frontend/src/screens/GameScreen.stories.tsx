import type { Meta, StoryObj } from '@storybook/react';

import GameScreen from './GameScreen';

const meta = {
  component: GameScreen,
} satisfies Meta<typeof GameScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};