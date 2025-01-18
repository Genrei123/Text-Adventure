import type { Meta, StoryObj } from '@storybook/react';

import Homepage from './Homepage';

const meta = {
  component: Homepage,
} satisfies Meta<typeof Homepage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};