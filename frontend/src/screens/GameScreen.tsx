import React from 'react';
import Sidebar from '../components/Sidebar';
import Searchbar from '../components/SearchBar';

const GameScreen: React.FC = () => {
    return (
        <>
        <div className="min-h-screen bg-[#1E1E1E] text-[#E5D4B3] flex flex-col">
            <nav className="bg-[#1e1e1e] py-3.5 px-4 shadow-[0_10px_10px_0_rgba(0,0,0,0.75)] z-50">
            <div className="flex justify-between items-center">
                <div className="text-2xl font-cinzel text-[#C8A97E]">
                    Sage.AI
                </div>
                <div className="text-2xl font-cinzel text-white font-bold absolute left-1/4 transform -translate-x-1/2 hidden md:block md:whitespace-nowrap overflow-hidden text-ellipsis">
                    HIDDEN TAVERN
                </div>
                <div className="flex items-center space-x-4 mr-10">
                    <img src="src/assets/Tokens.svg" alt="Placeholder" className="w-8 h-8 rounded-full" />
                    <span className="text-xl font-cinzel text-white">14</span>
                </div>
            </div>
            </nav>
            <Sidebar/>
            <br/>
            <br/>
            <br/>
            <div className="flex-grow flex justify-center items-center mt-[-5%]">
                <div className="bg- text-white w-full md:w-1/2 p-4 rounded mt-1 mx-auto overflow-y-auto max-h-[calc(1.5em*30)] scrollbar-hide" style={{ scrollbarColor: '#634630 #1E1E1E' }}>
                    <p className="text-left first-letter:ml-10 font-playfair text-sm md:text-lg tracking-[0.1em] leading-[183%] fade-scroll text-xs md:text-sm">
                        My name is Gian Higino Fungo. I'm a BSCS student studying at Caloocan City. My house is in Bagong Silang, and I live with my family. I attend classes at the university, and I study diligently to achieve my goals. I don't smoke, but I occasionally drink coffee to keep me awake during late-night study sessions.
                    </p>
                    <p className="text-left first-letter:ml-10 mt-4 font-playfair text-sm md:text-lg tracking-[0.1em] leading-[183%] fade-scroll text-xs md:text-sm">
                        I'm in bed by 11 PM, and I make sure I get eight hours of sleep, no matter what. After having a glass of warm milk and doing about twenty minutes of stretches before going to bed, I usually have no problems sleeping until morning. Just like a baby, I wake up without any fatigue or stress in the morning.
                    </p>
                    <p className="text-left first-letter:ml-10 mt-4 font-playfair text-sm md:text-lg tracking-[0.1em] leading-[183%] fade-scroll text-xs md:text-sm">
                        My daily routine involves attending lectures, working on programming projects, and collaborating with my classmates on various assignments. I'm passionate about technology and continuously strive to improve my skills and knowledge.
                    </p>
                    <p className="text-left first-letter:ml-10 mt-4 font-playfair text-sm md:text-lg tracking-[0.1em] leading-[183%] fade-scroll text-xs md:text-sm">
                        In my free time, I enjoy reading tech blogs, experimenting with new coding languages, and exploring innovative solutions to real-world problems. This not only helps me stay updated with the latest trends but also fuels my creativity and problem-solving abilities.
                    </p>
                    <p className="text-left first-letter:ml-10 mt-4 font-playfair text-sm md:text-lg tracking-[0.1em] leading-[183%] fade-scroll text-xs md:text-sm">
                        I believe that a balanced life is essential for success. I make time for relaxation and hobbies, such as playing video games, going for a run, or spending quality time with my family and friends. This helps me recharge and maintain a positive outlook on life.
                    </p>
                    <p className="text-left first-letter:ml-10 mt-4 font-playfair text-sm md:text-lg tracking-[0.1em] leading-[183%] fade-scroll text-xs md:text-sm">
                        As a BSCS student, I am committed to making a difference in the field of technology. I aspire to contribute to innovative projects that can positively impact society and improve people's lives. With determination and perseverance, I am confident that I can achieve my goals and make a meaningful contribution to the tech industry.
                    </p>
                    <p className="text-left first-letter:ml-10 mt-4 font-playfair text-sm md:text-lg tracking-[0.1em] leading-[183%] fade-scroll text-xs md:text-sm">
                        This is how I approach my life and studies, and I believe it is what brings me fulfillment and happiness. Although I face challenges along the way, I am confident in my abilities to overcome them and succeed.
                    </p>
                    <p className="text-left first-letter:ml-10 mt-4 font-playfair text-sm md:text-lg tracking-[0.1em] leading-[183%] fade-scroll text-xs md:text-sm">
                        This is how I approach my life and studies, and I believe it is what brings me fulfillment and happiness. Although I face challenges along the way, I am confident in my abilities to overcome them and succeed.
                    </p>
                    <p className="text-left first-letter:ml-10 mt-4 font-playfair text-sm md:text-lg tracking-[0.1em] leading-[183%] fade-scroll text-xs md:text-sm">
                        This is how I approach my life and studies, and I believe it is what brings me fulfillment and happiness. Although I face challenges along the way, I am confident in my abilities to overcome them and succeed.
                    </p>
                    <p className="text-left first-letter:ml-10 mt-4 font-playfair text-sm md:text-lg tracking-[0.1em] leading-[183%] fade-scroll text-xs md:text-sm">
                        This is how I approach my life and studies, and I believe it is what brings me fulfillment and happiness. Although I face challenges along the way, I am confident in my abilities to overcome them and succeed.
                    </p>
                    <p className="text-left first-letter:ml-10 mt-4 font-playfair text-sm md:text-lg tracking-[0.1em] leading-[183%] fade-scroll text-xs md:text-sm">
                        This is how I approach my life and studies, and I believe it is what brings me fulfillment and happiness. Although I face challenges along the way, I am confident in my abilities to overcome them and succeed.
                    </p>
                    <p className="text-left first-letter:ml-10 mt-4 font-playfair text-sm md:text-lg tracking-[0.1em] leading-[183%] fade-scroll text-xs md:text-sm">
                        This is how I approach my life and studies, and I believe it is what brings me fulfillment and happiness. Although I face challenges along the way, I am confident in my abilities to overcome them and succeed.
                    </p>
                </div>
            </div>
            <div className="w-full md:w-1/2 mx-auto mt-[0%] flex flex-col items-center md:items-start space-y-4 fixed bottom-0 md:relative md:bottom-auto bg-[#1E1E1E] md:bg-transparent p-4 md:p-0">
                <div className="flex space-x-2">
                    <button className="p-2 text-white rounded relative group">
                        <img src="src/assets/Settings.svg" alt="Icon" className="w-6 h-6 group-hover:opacity-0" />
                        <img src="src/assets/Settings-After.svg" alt="Icon Hover" className="w-6 h-6 absolute top-2 left-2 opacity-0 group-hover:opacity-100" />
                    </button>
                    <button className="p-2 text-white rounded flex items-center space-x-2 bg-transparent group hover:bg-[#311F17] transition duration-300 text-sm md:text-base">
                        <img src="src/assets/Story.svg" alt="Icon 2" className="w-5 h-5 md:w-6 md:h-6" />
                        <span>Story</span>
                    </button>
                    <button className="p-2 text-white rounded flex items-center space-x-2 bg-transparent group hover:bg-[#311F17] transition duration-300 text-sm md:text-base">
                        <img src="src/assets/Do.svg" alt="Icon 3" className="w-5 h-5 md:w-6 md:h-6" />
                        <span>Do</span>
                    </button>
                    <button className="p-2 text-white rounded flex items-center space-x-2 bg-transparent group hover:bg-[#311F17] transition duration-300 text-sm md:text-base">
                        <img src="src/assets/Say.svg" alt="Icon 4" className="w-5 h-5 md:w-6 md:h-6" />
                        <span>Say</span>
                    </button>
                    <button className="p-2 text-white rounded flex items-center space-x-2 bg-transparent group hover:bg-[#311F17] transition duration-300 text-sm md:text-base">
                        <img src="src/assets/See.svg" alt="Icon 5" className="w-5 h-5 md:w-6 md:h-6" />
                        <span>See</span>
                    </button>
                </div>
                <div className="w-full flex items-center bg-[#311F17] rounded-2xl focus-within:outline-none">
                    <input 
                        type="text" 
                        className="w-full h-full p-4 rounded-l-2xl bg-transparent text-white font-playfair text-xl focus:outline-none" 
                        placeholder="Type your text here..." 
                    />
                    <button className="p-4 bg-transparent rounded-r-2xl relative group">
                        <img src="src/assets/Enter.svg" alt="Enter" className="h-6 group-hover:opacity-0" />
                        <img src="src/assets/Enter-After.svg" alt="Enter Hover" className="h-6 absolute top-4 left-4 opacity-0 group-hover:opacity-100" />
                    </button>
                </div>
            </div>

        </div>
        </>
    );
};

export default GameScreen;
