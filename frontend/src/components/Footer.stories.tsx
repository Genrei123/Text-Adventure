import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Footer from './Footer';

export default {
  title: 'Components/Footer',
  component: Footer,
} as Meta;

const Template: StoryFn = (args) => <Footer {...args} />;

export const DefaultFooter = Template.bind({});
DefaultFooter.args = {
  // ...existing args...
};