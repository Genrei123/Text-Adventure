import React from 'react';
import { samplePortraitCardData } from "../types/Story"; // Adjust path as needed

const PortraitCard: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            {samplePortraitCardData.map(({ title, description, summary, genre, imageUrl }, index) => (
                <div
                    key={index}
                    className="portrait-card"
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        border: '1px solid #ccc',
                        borderRadius: '16px',
                        padding: '0',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#563C2D',
                        color: 'white',
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'inline-block', // Ensures the cards are displayed from left to right
                        verticalAlign: 'top', // Aligns the cards to the top
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            borderRadius: '16px 16px 0 0',
                            overflow: 'hidden',
                            height: 'auto',
                            aspectRatio: '16/9', // Ensures the aspect ratio of 1920x1080
                        }}
                    >
                        <img
                            src={imageUrl || 'gradient.png'}
                            alt={title}
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover', // Ensures the image covers the container
                                display: 'block' 
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,10))',
                            }}
                        ></div>
                    </div>
                    <div style={{ padding: '16px' }}>
                        <h5
                            className="portrait-card-title"
                            style={{
                                margin: '8px 0',
                                fontSize: '1.5em',
                                textAlign: 'center',
                                fontFamily: 'Cinzel Decorative, sans-serif',
                                color: '#B28F4C',
                                fontWeight: 'bold',
                            }}
                        >
                            {title}
                        </h5>
                        <p
                            className="portrait-card-description"
                            style={{
                                margin: '8px 0',
                                textAlign: 'center',
                                fontFamily: 'Fairplay Display, sans-serif',
                                color: '#C9B57B',
                            }}
                        >
                            {description}
                        </p>
                        <p
                            className="portrait-card-summary"
                            style={{
                                margin: '8px 0',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 3,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontFamily: 'Poppins, sans-serif',
                                height: '4.5em', // Assuming line-height is 1.5em
                            }}
                        >
                            {summary}
                        </p>
                        {summary.split('\n').length > 3 && (
                            <p
                                style={{
                                    color: '#007bff',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                }}
                            >
                                See more
                            </p>
                        )}
                        <br />
                        <div
                            className="portrait-card-genres"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                gap: '8px',
                                margin: '8px 0',
                                fontFamily: 'Cinzel',
                            }}
                        >
                            {genre.split(',').map((g, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: '8px',
                                        color: 'white',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        minWidth: '50px',
                                    }}
                                >
                                    {g.trim()}
                                </div>
                            ))}
                        </div>

                        <button
                            style={{
                                marginTop: '16px',
                                padding: '8px 16px',
                                backgroundColor: 'black',
                                color: 'white',
                                border: 'none',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                width: '100%',
                                transition: 'background-color 0.3s, color 0.3s',
                            }}
                            onMouseEnter={(e) => {
                                (e.target as HTMLButtonElement).style.backgroundColor = 'white';
                                (e.target as HTMLButtonElement).style.color = '#000000';
                            }}
                            onMouseLeave={(e) => {
                                (e.target as HTMLButtonElement).style.backgroundColor = 'black';
                                (e.target as HTMLButtonElement).style.color = 'white';
                            }}
                        >
                            Explore
                        </button>
                    </div>
                </div>
            ))}
            <style>{`
                @media (max-width: 768px) {
                    .portrait-card {
                        flex: 0 0 100%;
                        max-width: 100%;
                        overflow-x: auto;
                        white-space: nowrap;
                    }
                }

                /* Custom scrollbar styles */
                .portrait-card::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }

                .portrait-card::-webkit-scrollbar-track {
                    background: transparent;
                }

                .portrait-card::-webkit-scrollbar-thumb {
                    background-color: #888;
                    border-radius: 10px;
                    border: 2px solid transparent;
                }

                .portrait-card::-webkit-scrollbar-thumb:hover {
                    background-color: #555;
                }
            `}</style>
        </div>
    );
};

export default PortraitCard;
