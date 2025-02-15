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
        description: 'Marley vs. Paradis: The ultimate showdown.',
        summary: 'The Warhammer Titan is one of the Nine Titans featured in the anime and manga series Attack on Titan. This formidable Titan is known for its unique ability to create weapons and structures out of hardened Titan flesh, making it a formidable opponent on the battlefield. Unlike most Titans, the Warhammer Titan can control its form from a distance through a cable-like connection, allowing its user to remain hidden and protected. Its fearsome appearance, characterized by a skeletal white exterior and a large hammer weapon, adds to its intimidating presence. This Titans abilities make it a versatile and strategic asset in the ongoing battle against humanitys enemies.',
        genre: 'GENREY, GENREY, GENREY',
        imageUrl: 'warhammer.jpg'
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