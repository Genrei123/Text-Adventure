import React, { useState } from 'react';

interface YourLikesProps {
    game: {
        picture: string;
        username: string;
        dateCreated: string;
        title: string;
        stars: number;
        comments: number;
        favorites: number;
        description: string;
        genres: string[];
    };
}

const YourLikes: React.FC<YourLikesProps> = ({ game }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const truncatedDescription = game.description.length > 100 && !showFullDescription
        ? game.description.substring(0, 100) + '...'
        : game.description;

    return (
        <div style={styles.container}>
            <img
                style={styles.image}
                src={game.picture}
                alt={game.title}
            />
            <div style={styles.content}>
                <div style={styles.header}>
                    <p style={styles.username}>{game.username}</p>
                    <p style={styles.date}>{game.dateCreated}</p>
                </div>              
                <h2 style={styles.title}>
                    {game.title}
                </h2>
                <div style={styles.stats}>
                    <img src="/Star.svg" alt="Stars" style={styles.icon} /> {game.stars}
                    <img src="/Comments.svg" alt="Comments" style={styles.icon} /> {game.comments}
                    <img src="/Favorites.svg" alt="Favorites" style={styles.icon} /> {game.favorites}
                </div>
                <div style={{ ...styles.descriptionContainer, maxHeight: showFullDescription ? 'none' : '60px' }}>
                    <p style={{ ...styles.description, whiteSpace: showFullDescription ? 'normal' : 'nowrap' }}>
                        {truncatedDescription}
                    </p>
                </div>
                
                <div style={styles.genres}>
                    <strong style={styles.genreLabel}>Genre:</strong>
                    {game.genres.map((genre, index) => (
                        <span key={index} style={styles.genre}>
                            {genre}{index < game.genres.length - 1 ? ',' : ''}
                        </span>
                    ))}
                </div>
                <div style={styles.buttonContainer}>
                    <button style={styles.button}>
                        Explore
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        marginBottom: '20px',
        maxHeight: '400px',
        overflow: 'hidden',
        flexDirection: 'column' as 'column',
        '@media (min-width: 600px)': {
            flexDirection: 'row' as 'row',
        },
    },
    image: {
        width: '100%',
        height: 'auto',
        objectFit: 'cover' as 'cover',
        marginRight: '0px',
        display: 'none',
        '@media (min-width: 600px)': {
            width: '150px',
            height: '290px',
            display: 'block',
        },
    },
    content: {
        flex: '1 0 auto',
        border: '0px solid #ccc',
        padding: '10px',
        backgroundColor: '#634630',
        overflow: 'hidden',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    username: {
        color: '#B28F4C',
    },
    date: {
        color: 'white',
    },
    title: {
        display: 'flex',
        justifyContent: 'flex-start',
        margin: '10px 0 10px 10px',
        fontSize: '2em',
        fontFamily: 'Cinzel, serif',
        color: '#B28F4C',
        whiteSpace: 'nowrap' as 'nowrap',
        overflow: 'hidden' as 'hidden',
        textOverflow: 'ellipsis' as 'ellipsis',
        '@media (min-width: 600px)': {
            fontSize: '3em',
        },
    },
    stats: {
        display: 'flex',
        justifyContent: 'flex-start',
        color: 'white',
        gap: '10px',
        marginBottom: '3px',
    },
    icon: {
        width: '20px',
        height: '20px',
    },
    descriptionContainer: {
        position: 'relative' as 'relative',
        overflow: 'hidden' as 'hidden',
        margin: '10px 0',
    },
    description: {
        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: '3px',
        overflow: 'hidden' as 'hidden',
        textOverflow: 'ellipsis' as 'ellipsis',
        color: 'white',
    },
    genres: {
        display: 'flex',
        justifyContent: 'flex-start',
        color: '#ffffff',
        margin: '20px 0 3px 0',
    },
    genreLabel: {
        marginRight: '10px',
    },
    genre: {
        margin: '0 5px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: 'auto',
    },
    button: {
        backgroundColor: '#C9B57B',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        cursor: 'pointer' as 'pointer',
    },
};

export default YourLikes;
