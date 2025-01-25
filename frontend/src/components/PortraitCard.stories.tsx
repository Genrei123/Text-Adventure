import type { Meta, StoryObj } from '@storybook/react';

import PortraitCard from './PortraitCard';

const meta = {
  component: PortraitCard,
} satisfies Meta<typeof PortraitCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};