import React, { useRef, useState, useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';
import LoadingBook from '../components/LoadingBook';
import Button from '../components/Button';

const LandingPage: React.FC = () => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [background, setBackground] = useState('/landingMain.gif');
    const backgrounds = ['/landing1.gif', '/landing2.gif', '/landing3.gif'];
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const { navigateWithLoading } = useLoading();
    const [hasRated, setHasRated] = useState(false);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % backgrounds.length;
            setBackground(backgrounds[index]);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleRate = () => {
        if (!hasRated) {
            // Logic to handle rating
            setHasRated(true);
            alert('Thank you for rating!');
        } else {
            alert('You have already rated this game.');
        }
    };

    if (isInitialLoading) {
        return (
            <div className="fixed inset-0 bg-[#1E1E1E] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <LoadingBook message="Entering the Realm..." size="lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1E1E1E] text-white flex flex-col">
            {/* First Section with Fixed Background */}
            <div
                className="relative min-h-screen bg-cover bg-center bg-no-repeat flex justify-center items-center"
                style={{
                    backgroundImage: `url(${background})`,
                    backgroundAttachment: 'fixed', // Keeps the background fixed
                    backgroundSize: 'cover',
                }}
            >
                {/* Top gradient */}
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black to-transparent z-10"></div>

                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent z-10"></div>

                {/* Main content */}
                <div
                    ref={contentRef}
                    className="text-center opacity-100 flex flex-col justify-center items-center mx-[5%] z-20 fade-in"
                >
                    <img
                        src="/SageAI.png"
                        alt="logo"
                        className="w-[90%] md:w-[70%] lg:w-[60%] max-w-[500px] h-auto responsive-logo"
                    />
                    <br />
                    <h1
                        className="font-Medieval text-[120%] md:text-[150%] text-white uppercase mx-[10%] text-shadow-md responsive-text"
                        style={{ textShadow: '2px 2px 4px #000000', fontFamily: 'Medieval' }}
                    >
                        where stories are guided by <br /> one's intuition and knowledge
                    </h1>
                    <br />
                    <div className="flex flex-col gap-8 mt-5">
                        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12">
                            <div className="flex flex-col items-center">
                                
                                <Button
                                    variant="main"
                                    size="custom"
                                    customSize={{
                                        width: 'w-[200px] md:w-[250px]',
                                        height: 'h-[55px] md:h-[65px]',
                                        fontSize: 'text-base md:text-lg',
                                        padding: 'px-4'
                                    }}
                                    onClick={() => navigateWithLoading('/login')}
                                >
                                    gates of realm
                                </Button>
                                <p className="font-cinzel text-[#F1DC68] mt-2 px-3 py-1 bg-black bg-opacity-50 rounded">Login</p>
                            </div>
                            <div className="flex flex-col items-center">
                                
                                <Button
                                    variant="main"
                                    size="custom"
                                    customSize={{
                                        width: 'w-[200px] md:w-[250px]',
                                        height: 'h-[55px] md:h-[65px]',
                                        fontSize: 'text-base md:text-lg',
                                        padding: 'px-4'
                                    }}
                                    onClick={() => navigateWithLoading('/register')}
                                >
                                    enter the world
                                </Button>
                                <p className="font-cinzel text-[#F1DC68] mt-2 px-3 py-1 bg-black bg-opacity-50 rounded">Register</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Black Section */}
            <div className="flex justify-center items-center h-[515px] w-full bg-black z-20 relative">
                <h1 className="font-cinzel text-[120%] md:text-[150%] text-[#F1DC68] text-center max-w-4xl">
                    SAGE.AI is an AI-driven interactive storytelling platform where you embark on infinite adventures shaped entirely by your imagination.
                </h1>
            </div>

            {/* Second Page */}
            <SecondPage />
        </div>
    );
};

const SecondPage = () => {
    return (
        <div
            className="flex justify-center items-center h-[1572px] bg-cover bg-center bg-no-repeat z-20 relative"
            style={{ backgroundImage: 'url(/LandingBG2.png)' }}
        >
            <div className="opacity-100 flex flex-col justify-center items-center mx-[5%]">
                <div>
                    <p className="text-[#B28F4C] font-cinzel text-left text-[120%] md:text-[160%] responsive-heading">
                        AI-Driven Story Telling
                    </p>
                    <p className="text-white text-[100%] md:text-[120%] text-left mr-[40%] font-cinzel responsive-paragraph">
                        No two adventures are alike. The AI continuously adapts to your input, creating an ever-evolving narrative that responds to your creativity and curiosity.
                    </p>
                    <br />
                    <br />
                    <p className="text-[#B28F4C] font-cinzel text-right text-[120%] md:text-[160%] responsive-heading">
                        Endless Possibilities
                    </p>
                    <p className="text-white text-[100%] md:text-[120%] text-right ml-[40%] font-cinzel responsive-paragraph">
                        From epic quests to intimate character moments, the AI weaves together unique storylines, offering countless narrative paths for you to explore in a world limited only by your imagination.
                    </p>
                    <br />
                    <br />
                    <p className="text-[#B28F4C] font-cinzel text-left text-[120%] md:text-[160%] responsive-heading">
                        AI as your Guide
                    </p>
                    <p className="text-white text-[100%] md:text-[120%] text-left mr-[40%] font-cinzel responsive-paragraph">
                        Let the AI be your sage—an intelligent guide that not only reacts to your choices but also leads you toward new discoveries, challenges, and hidden secrets within the story.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;