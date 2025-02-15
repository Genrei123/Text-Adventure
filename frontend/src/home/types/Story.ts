export interface Story {
    title: string;
    description: string;
    summary: string;
    genre: string;
    imageUrl: string;
}
export const samplePortraitCardData: Story[] = [
    {
        title: 'The Warhammer Titan',
        description: 'Kunwari Header to diba hahahaah',
        summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip',
        genre: 'GENREY, GENREY, GENREY',
        imageUrl: 'card1.png'
    },
    {
        title: 'The Enchanted Forest',
        description: 'A magical journey through an enchanted forest.',
        summary: 'Join our heroes as they navigate through a forest filled with mystical creatures and hidden secrets. Will they find the treasure they seek?',
        genre: 'Fantasy, Adventure',
        imageUrl: 'card2.png'
    },
    {
        title: 'Space Odyssey',
        description: 'An epic adventure in the vastness of space.',
        summary: 'Follow the crew of the starship Odyssey as they explore uncharted territories and encounter alien civilizations. Their mission: to boldly go where no one has gone before.',
        genre: 'Science Fiction, Adventure',
        imageUrl: 'card3.png'
    }
];

    export default samplePortraitCardData;