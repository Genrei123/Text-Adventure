import type { Meta, StoryObj } from '@storybook/react';

import YourComments from './YourComments';

const meta = {
  component: YourComments,
} satisfies Meta<typeof YourComments>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};