import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import ReviewPage from '../screens/ReviewPage';

export default {
  title: 'Screens/ReviewPage',
  component: ReviewPage,
} as Meta;

const Template: StoryFn = (args) => <ReviewPage title={''} subtitle={''} reads={0} saves={0} comments={0} image={''} {...args} />;

export const Default = Template.bind({});
Default.args = {};
