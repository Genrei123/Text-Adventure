import type { Meta, StoryObj } from '@storybook/react';

import YourLikes from './YourLikes';

const meta = {
  component: YourLikes,
} satisfies Meta<typeof YourLikes>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};