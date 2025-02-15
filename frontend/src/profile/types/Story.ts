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
    },
    {
        title: 'Mystery of the Lost City',
        description: 'Uncover the secrets of a forgotten civilization.',
        summary: 'Archaeologists discover a hidden city beneath the sands of the desert. As they delve deeper, they uncover mysteries that could change history forever.',
        genre: 'Mystery, Historical Fiction',
        imageUrl: 'card4.png'
    },
    {
        title: 'The Haunted Manor',
        description: 'A chilling tale of a haunted house.',
        summary: 'When a family moves into an old manor, they begin to experience strange and terrifying events. Can they uncover the truth behind the hauntings before it\'s too late?',
        genre: 'Horror, Thriller',
        imageUrl: 'card5.png'
    },
    {
        title: 'The Time Traveler',
        description: 'A journey through time and space.',
        summary: 'A scientist invents a time machine and embarks on a journey through different eras. Along the way, he must navigate the challenges of time travel and avoid altering the course of history.',
        genre: 'Science Fiction, Adventure',
        imageUrl: 'card6.png'
    }
];

    export default samplePortraitCardData;