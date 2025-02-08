import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Carousel } from './Carousel';

export default {
  title: 'Components/Carousel',
  component: Carousel,
} as Meta;

const Template: StoryFn = (args) => <Carousel {...args} />;

export const Default = Template.bind({});
Default.args = {};
