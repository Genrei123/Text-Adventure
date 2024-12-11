import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import LoginScreen from './LoginScreen';

export default {
  title: 'Components/LoginScreen',
  component: LoginScreen,
} as Meta;

const Template: StoryFn = (args) => <LoginScreen {...args} />;

export const Default = Template.bind({});
Default.args = {};

