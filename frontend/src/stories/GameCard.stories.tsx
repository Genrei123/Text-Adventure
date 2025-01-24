import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { BookCard } from '../components/GameCard';
import { BookCardProps } from '../types/GameCard';

export default {
  title: 'Components/BookCard',
  component: BookCard,
} as Meta;

const Template: StoryFn<BookCardProps> = (args) => <BookCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  author: '@Zen_Garden',
  date: 'January 1, 2023',
  title: 'Whispers of the Shore',
  description: "A lone cat stands at the edge of the world, where the whispering waves meet the ancient forest. Embark on a journey of discovery, following the cat's path into a realm of hidden magic and",
  coverImage: 'src/assets/posa.jpg',
  iconImage: 'icon ng ',
  genres: ['Adventure', 'Fantasy', 'Action'],
};
