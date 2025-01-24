
import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Register from '../components/Register';

export default {
  title: 'Components/Register',
  component: Register,
} as Meta<typeof Register>;

const Template: StoryFn<typeof Register> = (args) => <Register {...args} />;

export const Default = Template.bind({});
Default.args = {};