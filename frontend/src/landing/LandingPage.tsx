import React, { useRef } from 'react';

const LandingPage: React.FC = () => {
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '1332px', backgroundImage: 'url(/LandingBG.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div ref={contentRef} style={{ textAlign: 'center', opacity: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: '5%', marginRight: '5%', transform: 'translateY(-10%)', height: '1332px' }}>
                    <img src="/SageAI.png" alt="logo" style={{ width: '90%', height: 'auto' }} className="responsive-logo" />
                    <br></br>
                    <h1 style={{ fontFamily: 'Medieval', fontSize: '150%', color: 'white', textTransform: 'uppercase', marginLeft: '10%', marginRight: '10%' }} className="responsive-text">where stories are guided by <br></br> one's intuition and knowledge</h1>
                    <br></br>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button 
                            style={{ backgroundColor: '#1e1e1e', color: 'white', padding: '20px 30px', borderRadius: '5px', cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: '0.3s', marginLeft: '10%', border: '2px solid black' }} 
                            className="shining-button"
                            onClick={() => window.location.href = '/login'}
                        >
                            GATES OF REALM
                        </button>
                        <br></br>
                        <button 
                            style={{ backgroundColor: '#1e1e1e', color: 'white', padding: '20px 30px', borderRadius: '5px', cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: '0.3s', marginRight: '10%', border: '2px solid black' }} 
                            className="shining-button"
                            onClick={() => window.location.href = '/register'}
                        >
                            ENTER THE WORLD
                        </button>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '515px', width: '100%', background: '#000000' }}>
                <h1 style={{ fontFamily: 'Cinzel', fontSize: '150%', color: '#F1DC68', textTransform: 'uppercase', marginLeft: '20%', marginRight: '20%' }} className="responsive-text">SAGE.AI is an AI-driven interactive storytelling platform where you embark on infinite adventures shaped entirely by your imagination.</h1>
            </div>
            <SecondPage />
            <style>{`
                .shining-button:hover {
                    box-shadow: 0 0 10px 2px #B28F4C;
                }
                @media (max-width: 768px) {
                    img.responsive-logo {
                        width: 70%;
                    }
                    h1.responsive-text {
                        font-size: 150%;
                    }
                    .shining-button {
                        padding: 15px 25px;
                    }
                    .responsive-heading {
                        font-size: 20px;
                    }
                    .responsive-paragraph {
                        font-size: 10px;
                    }
                }
                @media (max-width: 480px) {
                    img.responsive-logo {
                        width: 90%;
                    }
                    h1 {
                        font-size: 50%;
                    }
                    .shining-button {
                        padding: 10px 20px;
                    }
                    .responsive-heading {
                        font-size: 10px;
                    }
                    .responsive-paragraph {
                        font-size: 8px;
                    }
                }
            `}</style>
        </>
    );
};

const SecondPage = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '1572px', backgroundImage: 'url(/LandingBG2.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div style={{ opacity: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: '5%', marginRight: '5%' }}>
            <div>
                <p style={{ color: '#B28F4C', fontFamily: 'Cinzel', textAlign: 'left', fontSize: '160%' }} className="responsive-heading">AI-DRIVEN STORY TELLING</p>
                <p style={{ color: '#ffffff', fontSize: '120%', textAlign: 'left', marginRight: '40%', fontFamily: 'Cinzel' }} className="responsive-paragraph">No two adventures are alike. The AI continuously adapts to your input, creating an ever-evolving narrative that responds to your creativity and curiosity.</p>
                <br />
                <br />
                <p style={{ color: '#B28F4C', fontFamily: 'Cinzel', textAlign: 'right', fontSize: '160%' }} className="responsive-heading">ENDLESS POSSIBILITIES</p>
                <p style={{ color: '#FFFFFF', fontSize: '120%', textAlign: 'right', marginLeft: '40%', fontFamily: 'Cinzel' }} className="responsive-paragraph">From epic quests to intimate character moments, the AI weaves together unique storylines, offering countless narrative paths for you to explore in a world limited only by your imagination.</p>
                <br />
                <br />
                <p style={{ color: '#B28F4C', fontFamily: 'Cinzel', textAlign: 'left', fontSize: '160%' }} className="responsive-heading">AI AS YOUR GUIDE</p>
                <p style={{ color: '#FFFFFF', fontSize: '120%', textAlign: 'left', marginRight: '40%', fontFamily: 'Cinzel' }} className="responsive-paragraph">Let the AI be your sage—an intelligent guide that not only reacts to your choices but also leads you toward new discoveries, challenges, and hidden secrets within the story.</p>
            </div>
            </div>
        </div>
    );
}

export default LandingPage;
