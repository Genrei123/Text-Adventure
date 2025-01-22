import React, { useState } from "react";
import likes from "../types/Likes"; // Adjust the path as necessary

const YourLikes: React.FC = () => {
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

    const toggleDescription = (index: number) => {
        const updatedExpandedItems = new Set(expandedItems);
        if (expandedItems.has(index)) {
            updatedExpandedItems.delete(index);
        } else {
            updatedExpandedItems.add(index);
        }
        setExpandedItems(updatedExpandedItems);
    };

    return (
        <div style={styles.scrollContainer}>
            {likes.map((like, index) => {
                const isExpanded = expandedItems.has(index);
                const truncatedDescription =
                    like.description.length > 100 && !isExpanded
                        ? like.description.substring(0, 100) + "..."
                        : like.description;

                return (
                    <div key={index} style={styles.container}>
                        <img style={styles.image} src="/placeholder.png" alt={like.title} />
                        <div style={styles.content}>
                            <div style={styles.header}>
                                <p style={styles.username}>{like.username}</p>
                                <p style={styles.date}>{like.dateCreated}</p>
                            </div>
                            <h2 style={styles.title}>{like.title}</h2>
                            <div style={styles.stats}>
                                <img src="/Star.svg" alt="Stars" style={styles.icon} /> {like.stars}
                                <img src="/Comments.svg" alt="Comments" style={styles.icon} /> {like.comments}
                                <img src="/Favorites.svg" alt="Favorites" style={styles.icon} /> {like.favorites}
                            </div>
                            <div style={styles.descriptionContainer}>
                                <p
                                    style={{
                                        ...styles.description,
                                        whiteSpace: isExpanded ? "normal" : "nowrap",
                                    }}
                                >
                                    {truncatedDescription}
                                </p>
                                <button
                                    onClick={() => toggleDescription(index)}
                                    style={styles.readMoreButton}
                                >
                                    {isExpanded ? "Show Less" : "Read More"}
                                </button>
                            </div>
                            <div style={styles.genres}>
                                <strong style={styles.genreLabel}>Genre:</strong>
                                {like.genres.map((genre, genreIndex) => (
                                    <span key={genreIndex} style={styles.genre}>
                                        {genre}
                                        {genreIndex < like.genres.length - 1 ? "," : ""}
                                    </span>
                                ))}
                            </div>
                            <div style={styles.buttonContainer}>
                                <button style={styles.button}>Explore</button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const styles = {
    scrollContainer: {  
        maxHeight: "400px",
        overflowY: "auto" as "auto",
        margin: "2px", // Added margin
        padding: "10px", // Added padding to separate data from scroll
        // For Firefox
        scrollbarColor: "#634630 transparent", // For Firefox
        "&::-webkit-scrollbar": {
            width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "10px",
        },
        "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
        },
        "@media (max-width: 600px)": {
            maxHeight: "200px", // Adjusted height for mobile view
        },
    },
    container: {
        display: "flex",
        marginBottom: "10px", // Reduced margin to make the card smaller
        flexDirection: "column" as "column",
        padding: "10px", // Added padding to make the card smaller
        backgroundColor: "#634630",
        borderRadius: "20px", // Changed to rounded rectangle
        "@media (min-width: 600px)": {
            flexDirection: "row" as "row",
        },
    },
    image: {
        width: "100%",
        height: "auto",
        objectFit: "cover" as "cover",
        marginRight: "0px",
        display: "none",
        borderRadius: "20px", // Changed to rounded rectangle
        "@media (min-width: 600px)": {
            width: "100px", // Reduced width to make the card smaller
            height: "150px", // Reduced height to make the card smaller
            display: "block",
        },
    },
    content: {
        flex: "1 0 auto",
        padding: "10px",
        overflow: "hidden",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
    },
    username: {
        color: "#B28F4C",
    },
    date: {
        color: "white",
    },
    title: {
        display: "flex",
        justifyContent: "flex-start",
        margin: "10px 0 10px 10px",
        fontSize: "2em", // Reduced font size to make the card smaller
        fontFamily: "Cinzel, serif",
        color: "#B28F4C",
        whiteSpace: "nowrap" as "nowrap",
        overflow: "hidden" as "hidden",
        textOverflow: "ellipsis" as "ellipsis",
        "@media (min-width: 600px)": {
            fontSize: "2em", // Reduced font size to make the card smaller
        },
    },
    stats: {
        display: "flex",
        justifyContent: "flex-start",
        color: "white",
        gap: "10px",
        marginBottom: "3px",
    },
    icon: {
        width: "20px",
        height: "20px",
    },
    descriptionContainer: {
        position: "relative" as "relative",
        overflow: "hidden" as "hidden",
        margin: "10px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    description: {
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: "3px",
        overflow: "hidden" as "hidden",
        textOverflow: "ellipsis" as "ellipsis",
        color: "white",
        flex: "1",
    },
    readMoreButton: {
        backgroundColor: "",
        color: "#B28F4C",
        border: "none",
        // Reduced padding to make the button smaller
        cursor: "pointer" as "pointer",
        marginLeft: "10px",
        },
        genres: {
        display: "flex",
        justifyContent: "flex-start",
        color: "#ffffff",
        margin: "10px 0", // Adjusted margin for better placement
        },
        genreLabel: {
        marginRight: "10px",
        },
        genre: {
        margin: "0 5px",
        },
        buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "10px", // Adjusted margin for better placement
        },
        button: {
        backgroundColor: "#1e1e1e",
        color: "#B28F4C",
        border: "none",
        padding: "10px 20px",
        cursor: "pointer" as "pointer",
        borderRadius: "20px", // Changed to rounded rectangle
        alignSelf: "flex-end", // Align the button to the end
    },
};

export default YourLikes;
