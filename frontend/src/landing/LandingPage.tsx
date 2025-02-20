import React, { useRef, useState, useEffect } from 'react';

const LandingPage: React.FC = () => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [background, setBackground] = useState('/landingMain.gif');
    const backgrounds = ['/landing1.gif', '/landing2.gif' , '/landing3.gif'];
    let index = 0;

    useEffect(() => {
        const interval = setInterval(() => {
            index = (index + 1) % backgrounds.length;
            setBackground(backgrounds[index]);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="flex justify-center items-center h-[990px] bg-cover bg-center fade-in" style={{ backgroundImage: `url(${background})` }}>
                <div ref={contentRef} className="text-center opacity-100 flex flex-col justify-center items-center mx-[5%] -translate-y-[105px] h-[1332px]">
                    <img src="/SageAI.png" alt="logo" className="w-[90%] h-auto responsive-logo" />
                    <br></br>
                    <h1 className="font-Medieval text-[150%] text-white uppercase mx-[10%] text-shadow-md responsive-text" style={{ textShadow: '2px 2px 4px #000000', fontFamily: 'Medieval' }}>
                        where stories are guided by <br></br> one's intuition and knowledge
                    </h1>
                    <br></br>
                    <div className="flex gap-2.5 mt-5">
                        <button 
                            className="bg-[#1e1e1e] text-white py-5 px-7 rounded-md cursor-pointer relative overflow-hidden transition duration-300 ml-[10%] border-2 border-black hover:shadow-[0_0_30px_#b28f4c] hover:scale-110"
                            onClick={() => window.location.href = '/login'}
                        >
                            GATES OF REALM
                        </button>
                        <br></br>
                        <button 
                            className="bg-[#1e1e1e] text-white py-5 px-7 rounded-md cursor-pointer relative overflow-hidden transition duration-300 mr-[10%] border-2 border-black hover:shadow-[0_0_30px_#b28f4c] hover:scale-110"
                            onClick={() => window.location.href = '/register'}
                        >
                            ENTER THE WORLD
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center h-[515px] w-full bg-black">
                <h1 className="font-Cinzel text-[150%] text-[#F1DC68] uppercase mx-[20%] responsive-text">SAGE.AI is an AI-driven interactive storytelling platform where you embark on infinite adventures shaped entirely by your imagination.</h1>
            </div>
            <SecondPage />
        </>
    );
};

const SecondPage = () => {
    return (
        <div className="flex justify-center items-center h-[1572px] bg-cover bg-center" style={{ backgroundImage: 'url(/LandingBG2.png)' }}>
            <div className="opacity-100 flex flex-col justify-center items-center mx-[5%]">
            <div>
                <p className="text-[#B28F4C] font-Cinzel text-left text-[160%] responsive-heading">AI-DRIVEN STORY TELLING</p>
                <p className="text-white text-[120%] text-left mr-[40%] font-Cinzel responsive-paragraph">No two adventures are alike. The AI continuously adapts to your input, creating an ever-evolving narrative that responds to your creativity and curiosity.</p>
                <br />
                <br />
                <p className="text-[#B28F4C] font-Cinzel text-right text-[160%] responsive-heading">ENDLESS POSSIBILITIES</p>
                <p className="text-white text-[120%] text-right ml-[40%] font-Cinzel responsive-paragraph">From epic quests to intimate character moments, the AI weaves together unique storylines, offering countless narrative paths for you to explore in a world limited only by your imagination.</p>
                <br />
                <br />
                <p className="text-[#B28F4C] font-Cinzel text-left text-[160%] responsive-heading">AI AS YOUR GUIDE</p>
                <p className="text-white text-[120%] text-left mr-[40%] font-Cinzel responsive-paragraph">Let the AI be your sage—an intelligent guide that not only reacts to your choices but also leads you toward new discoveries, challenges, and hidden secrets within the story.</p>
            </div>
            </div>
        </div>
    );
}

export default LandingPage;
