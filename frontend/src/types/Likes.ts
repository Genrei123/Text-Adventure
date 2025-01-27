interface Likes {
    username: string;
    dateCreated: string;
    title: string;
    stars: number;
    comments: number;
    favorites: number;
    description: string;
    genres: string[];
}

const likes: Likes[] = [
    {
        username: "Zyciann",
        dateCreated: "2023-01-01",
        title: "Something Spectacular",
        stars: 5,
        comments: 10,
        favorites: 20,
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        genres: ["Adventure", "Puzzle"],
    },
    {
        username: "JaneDoe",
        dateCreated: "2023-02-15",
        title: "Mystery of the Old House",
        stars: 4,
        comments: 8,
        favorites: 15,
        description:
            "A thrilling mystery that keeps you on the edge of your seat. Explore the old house and uncover its secrets.",
        genres: ["Mystery", "Thriller"],
    },
    {
        username: "JohnSmith",
        dateCreated: "2023-03-10",
        title: "Galactic Journey",
        stars: 5,
        comments: 12,
        favorites: 25,
        description:
            "An epic space adventure that takes you across the galaxy. Experience the wonders of the universe.",
        genres: ["Sci-Fi", "Adventure"],
    },
    {
        username: "AliceWonder",
        dateCreated: "2023-04-05",
        title: "Enchanted Forest",
        stars: 4,
        comments: 9,
        favorites: 18,
        description:
            "A magical journey through an enchanted forest. Discover the mystical creatures and hidden treasures.",
        genres: ["Fantasy", "Adventure"],
    },
];

export default likes;
