import type { Meta, StoryObj } from '@storybook/react';

import UserProfile from './UserProfile';

const meta = {
  component: UserProfile,
} satisfies Meta<typeof UserProfile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};