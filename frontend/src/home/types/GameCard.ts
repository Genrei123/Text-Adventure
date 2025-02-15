export interface BookCardProps {
    author?: string;
    date?: string;
    title?: string;
    description?: string;
    coverImage?: string;
    iconImage?: string;
    genres?: string[];
}

export const DefaultBookCardProps: BookCardProps = {
    author: '@Zen_Garden',
    date: 'January 1, 2023',
    title: 'Whispers of the Shore',
    description: "A lone cat stands at the edge of the world, where the whispering waves meet the ancient forest. Embark on a journey of discovery, following the cat's path into a realm of hidden magic and",
    coverImage: 'src/assets/posa.jpg',
    iconImage: 'icon ng menu',
    genres: ['Adventure', 'Fantasy', 'Action'],
};