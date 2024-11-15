
import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Verification from './Verification';

export default {
  title: 'Components/Verification',
  component: Verification,
} as Meta<typeof Verification>;

const Template: StoryFn<typeof Verification> = (args) => <Verification {...args} />;

export const Default = Template.bind({});
Default.args = {};