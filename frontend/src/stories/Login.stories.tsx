import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Login from '../components/Login';

export default {
  title: 'Components/Login',
  component: Login,
} as Meta;

const Template: StoryFn = (args) => <Login {...args} />;

export const Default = Template.bind({});
Default.args = {};

