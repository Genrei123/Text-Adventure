import type { Meta, StoryObj } from '@storybook/react';

import HomeScreen from './HomeScreen';

const meta = {
  component: HomeScreen,
} satisfies Meta<typeof HomeScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};