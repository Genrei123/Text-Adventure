import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Footer from '../components/Footer';

export default {
  title: 'Stories/Footer',
  component: Footer,
} as Meta;

const Template: StoryFn = (args) => <Footer {...args} />;

export const DefaultFooterStory = Template.bind({});
DefaultFooterStory.args = {};