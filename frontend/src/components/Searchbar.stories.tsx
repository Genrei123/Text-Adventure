
import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Searchbar from './Searchbar';

export default {
  title: 'Components/Searchbar',
  component: Searchbar,
} as Meta<typeof Searchbar>;

const Template: StoryFn<typeof Searchbar> = (args) => <Searchbar {...args} />;

export const Default = Template.bind({});
Default.args = {};