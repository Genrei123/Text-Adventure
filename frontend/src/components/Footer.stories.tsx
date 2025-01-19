import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Footer from './Footer';

export default {
  title: 'Components/Footer',
  component: Footer,
} as Meta<typeof Footer>;

const Template: StoryFn<typeof Footer> = (args) => <Footer {...args} />;

export const Default = Template.bind({});
Default.args = {};