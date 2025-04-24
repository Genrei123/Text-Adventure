import React, { useRef, useState, useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';
import LoadingBook from '../components/LoadingBook';
import Button from '../components/Button';
import AudioToggle from '../components/AudioToggle';
import Footer from '../components/Footer';
import bgMusic from '../assets/bgm_torch.mp3';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaGamepad, FaPenFancy, FaUserFriends, FaLaptopCode, FaBrain, FaServer, FaMobile, FaDatabase, FaRobot, FaArrowRight, FaGithub, FaNode, FaReact, FaChevronLeft, FaChevronRight, FaAngleDown, FaArrowUp } from 'react-icons/fa';
import { SiPostgresql, SiOpenai, SiRailway, SiVercel } from 'react-icons/si';

// Add global style for smooth scrolling
const GlobalStyle = styled.div`
    html {
        scroll-behavior: smooth;
    }

    body {
        overflow-x: hidden;
    }

    section {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }
`;

const StyledAudioToggle = styled(AudioToggle)`
    position: fixed !important;
    top: 30px !important;
    left: 30px !important;
    z-index: 9999 !important;
`;

// Smooth scroll utility function
const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
        // Get the section's top position
        const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
        
        // Animate scroll with better easing
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.5 } }
};

const slideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3
        }
    }
};

// Go to top button component
const GoToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show button when user scrolls down 300px
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    className="fixed bottom-8 right-8 bg-[#111]/80 p-4 rounded-full text-[#F1DC68] shadow-lg border border-[#F1DC68]/30 z-50"
                    onClick={scrollToTop}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ 
                        scale: 1.1, 
                        backgroundColor: 'rgba(178, 143, 76, 0.9)',
                        color: '#FFFFFF'
                    }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Scroll to top"
                >
                    <FaArrowUp className="text-2xl" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

const LandingPage: React.FC = () => {
    const contentRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [background, setBackground] = useState('/landingMain2.gif');
    const backgrounds = ['/landing1.gif', '/landing2.gif', '/landing3.gif'];
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const { navigateWithLoading } = useLoading();
    const [hasRated, setHasRated] = useState(false);
    const [audioInitialized, setAudioInitialized] = useState(false);

    // useEffect(() => {
    //     let index = 0;
    //     const interval = setInterval(() => {
    //         index = (index + 1) % backgrounds.length;
    //         setBackground(backgrounds[index]);
    //     }, 3500); // Slightly slower transitions for better visual impact
    //     return () => clearInterval(interval);
    // }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isInitialLoading && audioRef.current && !audioInitialized) {
            const playPromise = audioRef.current.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setAudioInitialized(true);
                        if (audioRef.current) {
                            audioRef.current.volume = 0.3;
                        }
                    })
                    .catch(error => {
                        console.log("Audio playback was prevented: ", error);
                        
                        const enableAudio = () => {
                            if (audioRef.current) {
                                audioRef.current.play()
                                    .then(() => {
                                        setAudioInitialized(true);
                                        if (audioRef.current) {
                                            audioRef.current.volume = 0.3;
                                        }
                                    })
                                    .catch(e => console.log("Still couldn't play audio: ", e));
                            }
                            document.removeEventListener('click', enableAudio);
                        };
                        
                        document.addEventListener('click', enableAudio);
                    });
            }
        }
    }, [isInitialLoading, audioInitialized]);

    const handleRate = () => {
        if (!hasRated) {
            setHasRated(true);
            alert('Thank you for rating!');
        } else {
            alert('You have already rated this game.');
        }
    };

    if (isInitialLoading) {
        return (
            <div className="fixed inset-0 bg-[#1E1E1E] flex items-center justify-center">
                <motion.div 
                    className="flex flex-col items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <LoadingBook message="Entering the Realm..." size="lg" />
                </motion.div>
            </div>
        );
    }

    return (
        <GlobalStyle>
            <div className="min-h-screen bg-[#1E1E1E] text-white flex flex-col">
                <audio 
                    ref={audioRef} 
                    src={bgMusic} 
                    loop 
                    preload="auto"
                />
                
                <StyledAudioToggle 
                    audioRef={audioRef} 
                    initialVolume={0.7} 
                    color="#F1DC68"
                    size="30px"
                />
                
                <HeroSection 
                    background={background} 
                    contentRef={contentRef} 
                    navigateWithLoading={navigateWithLoading} 
                />

                <IntroSection />

                <FeatureSection />

                <TestimonialsSection />

                <StatisticsSection />

                <HowItWorksSection />

                <TechnologiesSection />

                <CallToActionSection navigateWithLoading={navigateWithLoading} />

                <Footer />
                
                {/* Add Go to Top button */}
                <GoToTopButton />
            </div>
        </GlobalStyle>
    );
};

const HeroSection: React.FC<{
    background: string;
    contentRef: React.RefObject<HTMLDivElement>;
    navigateWithLoading: (path: string) => void;
}> = ({ background, contentRef, navigateWithLoading }) => {
    return (
        <section
            className="relative min-h-screen bg-cover bg-center bg-no-repeat flex justify-center items-center"
            style={{
                backgroundImage: `url(${background})`,
                backgroundAttachment: 'fixed', 
                backgroundSize: 'cover',
                transition: 'background-image 1s ease-in-out'
            }}
        >
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black to-transparent z-10"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent z-10"></div>

            <motion.div
                ref={contentRef}
                className="text-center flex flex-col justify-center items-center mx-[5%] z-20"
                initial="hidden"
                animate="visible"
                variants={staggerChildren}
            >
                <motion.img
                        src="/SageAI.png"
                        alt="logo"
                    className="w-[90%] md:w-[70%] lg:w-[60%] max-w-[500px] h-auto hover:scale-105 transition-transform duration-500"
                    variants={fadeIn}
                />
                
                <motion.h1
                    className="font-Medieval text-[120%] md:text-[150%] text-white uppercase mx-[10%] mt-8 mb-4"
                    style={{ 
                        textShadow: '2px 2px 4px #000000, 0 0 10px rgba(241, 220, 104, 0.5)', 
                        fontFamily: 'Medieval' 
                    }}
                    variants={slideUp}
                    >
                        where stories are guided by <br /> one's intuition and knowledge
                </motion.h1>
                
                <motion.div 
                    className="flex flex-col gap-8 mt-8"
                    variants={slideUp}
                >
                        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12">
                        <motion.div 
                            className="flex flex-col items-center"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                                <Button
                                    variant="main"
                                    size="custom"
                                    customSize={{
                                        width: 'w-[200px] md:w-[250px]',
                                        height: 'h-[65px] md:h-[85px]',
                                        fontSize: 'text-base md:text-lg',
                                        padding: 'px-4'
                                    }}
                                    onClick={() => navigateWithLoading('/login')}
                                >
                                    gates of realm
                                <br /> <span className="text-sm opacity-80">(login)</span>
                                </Button>
                        </motion.div>
                                
                        <motion.div 
                            className="flex flex-col items-center"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                                <Button
                                    variant="main"
                                    size="custom"
                                    customSize={{
                                        width: 'w-[200px] md:w-[250px]',
                                        height: 'h-[65px] md:h-[85px]',
                                        fontSize: 'text-base md:text-lg',
                                        padding: 'px-4'
                                    }}
                                    onClick={() => navigateWithLoading('/register')}
                                >
                                    enter the world
                                <br /> <span className="text-sm opacity-80">(register)</span>
                                </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
            
            {/* Fixed arrow centering */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
                <motion.div 
                    className="cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ delay: 2, duration: 1.5, repeat: Infinity }}
                    onClick={() => scrollToSection('intro-section')}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FaAngleDown className="text-[#F1DC68] text-3xl" />
                </motion.div>
            </div>
        </section>
    );
};

const IntroSection: React.FC = () => {
    return (
        <section 
            id="intro-section"
            className="flex justify-center items-center min-h-screen w-full bg-black z-20 relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-black opacity-90"></div>
            
            <motion.h1 
                className="font-cinzel text-[120%] md:text-[180%] text-[#F1DC68] text-center max-w-4xl px-6 leading-relaxed relative z-10"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                SAGE.AI is an AI-driven interactive storytelling platform where you embark on infinite adventures shaped entirely by your imagination.
            </motion.h1>
            
            {/* Fixed arrow centering */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
                <motion.div 
                    className="cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7, y: [0, 10, 0] }}
                    transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
                    onClick={() => scrollToSection('features-section')}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FaAngleDown className="text-[#F1DC68] text-3xl" />
                </motion.div>
            </div>
        </section>
    );
};

const FeatureSection: React.FC = () => {
    return (
        <section
            id="features-section"
            className="relative min-h-screen flex flex-col justify-center bg-cover bg-center bg-no-repeat z-20 py-20"
            style={{ backgroundImage: 'url(/LandingBG2.png)' }}
        >
            <div className="container mx-auto px-6 md:px-10 max-w-7xl">
                <div className="space-y-32 md:space-y-40">
                    <FeatureItem 
                        title="AI-Driven Story Telling"
                        content="No two adventures are alike. The AI continuously adapts to your input, creating an ever-evolving narrative that responds to your creativity and curiosity."
                        alignment="left"
                    />
                    
                    <FeatureItem 
                        title="Endless Possibilities"
                        content="From epic quests to intimate character moments, the AI weaves together unique storylines, offering countless narrative paths for you to explore in a world limited only by your imagination."
                        alignment="right"
                    />
                    
                    <FeatureItem 
                        title="AI as your Guide"
                        content="Let the AI be your sage—an intelligent guide that not only reacts to your choices but also leads you toward new discoveries, challenges, and hidden secrets within the story."
                        alignment="left"
                    />
                </div>
                
                {/* Fixed arrow centering */}
                <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
                    <motion.div 
                        className="cursor-pointer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7, y: [0, 10, 0] }}
                        transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
                        onClick={() => scrollToSection('testimonials-section')}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaAngleDown className="text-[#F1DC68] text-3xl" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const FeatureItem: React.FC<{
    title: string;
    content: string;
    alignment: 'left' | 'right';
}> = ({ title, content, alignment }) => {
    return (
        <motion.div 
            className={`flex flex-col ${alignment === 'right' ? 'md:items-end' : 'md:items-start'}`}
            initial={{ opacity: 0, y: 50, x: alignment === 'right' ? 50 : -50 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
        >
            <h2 
                className={`text-[#B28F4C] font-cinzel text-${alignment} text-[120%] md:text-[160%] mb-4`}
            >
                {title}
            </h2>
            
            <p 
                className={`text-white text-[100%] md:text-[120%] text-${alignment} ${alignment === 'right' ? 'md:w-[60%]' : 'md:w-[60%]'} font-Medieval leading-relaxed`}
            >
                {content}
            </p>
        </motion.div>
    );
};

const TestimonialsSection: React.FC = () => {
    const testimonials = [
        {
            text: "SAGE.AI created a story that responded perfectly to my choices. It felt like having my own personal Game Master crafting a unique adventure just for me.",
            author: "Alex T., Fantasy Enthusiast",
            rating: 5
        },
        {
            text: "The depth of storytelling is incredible. Each decision I made led to unexpected yet coherent plot developments that kept me engaged for hours.",
            author: "Samantha W., Writer",
            rating: 5
        },
        {
            text: "As a tabletop RPG player, I was skeptical, but SAGE.AI exceeded my expectations with rich worldbuilding and responsive narrative design.",
            author: "Marcus L., D&D Player",
            rating: 4
        }
    ];

    return (
        <section id="testimonials-section" className="min-h-screen flex flex-col justify-center bg-black relative z-10 py-10">
            <div className="absolute inset-0 bg-[url('/torch_before.png')] bg-repeat-x bg-top opacity-20"></div>
            <div className="container mx-auto px-6 md:px-10 flex flex-col justify-center h-full">
                <motion.h2 
                    className="text-[#B28F4C] font-cinzel text-center text-3xl md:text-4xl mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Tales from the Realm
                </motion.h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
                    {testimonials.map((testimonial, index) => (
                        <motion.div 
                            key={index} 
                            className="bg-[#1A1A1A] p-6 rounded-lg border border-[#3A3A3A] flex flex-col"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                        >
                            <div className="flex mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FaStar key={i} className="text-[#F1DC68] mr-1" />
                                ))}
                            </div>
                            <p className="text-white font-cinzel italic mb-4">{testimonial.text}</p>
                            <p className="text-[#B28F4C] font-cinzel mt-auto">{testimonial.author}</p>
                        </motion.div>
                    ))}
                </div>
                
                <motion.div 
                    className="mt-8 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <Button
                        variant="main"
                        size="custom"
                        customSize={{
                            width: 'w-[200px] md:w-[250px]',
                            height: 'h-[55px]',
                            fontSize: 'text-base',
                            padding: 'px-4'
                        }}
                        onClick={() => window.open('https://example.com/reviews', '_blank')}
                    >
                        Read More Tales
                    </Button>
                </motion.div>
                
                {/* Testimonials Arrow */}
                {/* <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
                    <motion.div 
                        className="cursor-pointer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7, y: [0, 10, 0] }}
                        transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
                        onClick={() => scrollToSection('stats-section')}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaAngleDown className="text-[#F1DC68] text-3xl" />
                    </motion.div>
                </div> */}
            </div>
        </section>
    );
};

const StatisticsSection: React.FC = () => {
    const stats = [
        { 
            icon: <FaStar className="text-[#F1DC68] text-4xl mb-4" />,
            number: "4.8", 
            label: "Average Rating",
            description: "From over 10,000 adventures"
        },
        { 
            icon: <FaGamepad className="text-[#F1DC68] text-4xl mb-4" />,
            number: "50,000+", 
            label: "Active Adventures",
            description: "Created by our community"
        },
        { 
            icon: <FaPenFancy className="text-[#F1DC68] text-4xl mb-4" />,
            number: "1M+", 
            label: "Story Choices Made",
            description: "Shaping unique narratives"
        },
        { 
            icon: <FaUserFriends className="text-[#F1DC68] text-4xl mb-4" />,
            number: "25,000+", 
            label: "Storytellers",
            description: "Across the realms"
        }
    ];
    
    return (
        <section id="stats-section" className="min-h-screen flex flex-col justify-center bg-gradient-to-b from-[#1E1E1E] to-[#121212] relative z-10 py-10">
            <div className="container mx-auto px-6 md:px-10">
                <motion.h2 
                    className="text-[#B28F4C] font-cinzel text-center text-3xl md:text-4xl mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    The Realm in Numbers
                </motion.h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {stats.map((stat, index) => (
                        <motion.div 
                            key={index} 
                            className="flex flex-col items-center text-center"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            {stat.icon}
                            <h3 className="text-[#F1DC68] font-cinzel text-3xl md:text-4xl font-bold mb-2">{stat.number}</h3>
                            <p className="text-white font-cinzel text-xl mb-2">{stat.label}</p>
                            <p className="text-gray-400 font-cinzel">{stat.description}</p>
                        </motion.div>
                    ))}
                </div>
                
                {/* Statistics Arrow */}
                {/* <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
                    <motion.div 
                        className="cursor-pointer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7, y: [0, 10, 0] }}
                        transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
                        onClick={() => scrollToSection('how-it-works-section')}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaAngleDown className="text-[#F1DC68] text-3xl" />
                    </motion.div>
                </div> */}
            </div>
        </section>
    );
};

const HowItWorksSection: React.FC = () => {
    const steps = [
        {
            number: "01",
            title: "Enter the World",
            description: "Sign up for SAGE.AI to gain access to endless adventures and storytelling possibilities."
        },
        {
            number: "02",
            title: "Choose Your Adventure",
            description: "Select from various themes or start from scratch to begin your unique narrative journey."
        },
        {
            number: "03",
            title: "Interact With the AI",
            description: "Input your decisions, ideas, and choices to guide the story in any direction you wish."
        },
        {
            number: "04",
            title: "Watch Your Story Unfold",
            description: "The AI adapts to your input, crafting personalized narratives that respond to your imagination."
        }
    ];

    return (
        <section id="how-it-works-section" className="min-h-screen flex flex-col justify-center bg-gradient-to-b from-[#121212] to-[#1E1E1E] relative z-10 py-10">
            <div className="container mx-auto px-6 md:px-10">
                <motion.h2 
                    className="text-[#B28F4C] font-cinzel text-center text-3xl md:text-4xl mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    How It Works
                </motion.h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div 
                            key={index} 
                            className="relative"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <div className="bg-[#2A2A2A] rounded-lg p-8 h-full border border-[#444] relative z-10">
                                <div className="text-[#F1DC68] font-medieval text-5xl opacity-50 mb-4">{step.number}</div>
                                <h3 className="text-white font-cinzel text-xl mb-3">{step.title}</h3>
                                <p className="text-gray-300">{step.description}</p>
                            </div>
                            
                            {index < steps.length - 1 && (
                                <motion.div 
                                    className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-20"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                                >
                                    <FaArrowRight className="text-[#B28F4C] text-2xl" />
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
                
                <motion.div 
                    className="mt-16 max-w-3xl mx-auto text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <p className="text-lg text-gray-300 font-Medieval">
                        Each adventure is unique and adapts to your decisions in real-time. Our advanced AI engine remembers your choices 
                        and builds upon them, creating a coherent and engaging narrative experience that's truly yours.
                    </p>
                </motion.div>
                
                {/* How It Works Arrow */}
                {/* <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
                    <motion.div 
                        className="cursor-pointer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7, y: [0, 10, 0] }}
                        transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
                        onClick={() => scrollToSection('tech-section')}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaAngleDown className="text-[#F1DC68] text-3xl" />
                    </motion.div>
                </div> */}
            </div>
        </section>
    );
};

const TechnologiesSection: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [autoRotate, setAutoRotate] = useState(true);
    const techCategories = [
        {
            title: "Core Technology Stack",
            technologies: [
                {
                    icon: <FaReact className="text-6xl text-[#61DAFB]" />,
                    name: "React-Vite",
                    description: "Frontend library for building user interfaces with Vite's rapid development environment"
                },
                {
                    icon: <SiPostgresql className="text-6xl text-[#336791]" />,
                    name: "PostgreSQL",
                    description: "Robust relational database for structured data storage"
                },
                {
                    icon: <FaNode className="text-6xl text-[#68A063]" />,
                    name: "Node.js",
                    description: "JavaScript runtime for building server-side applications"
                },
                {
                    icon: <FaGithub className="text-6xl text-white" />,
                    name: "GitHub",
                    description: "Version control and collaboration platform"
                }
            ]
        },
        {
            title: "Major Dependencies",
            technologies: [
                {
                    icon: <SiOpenai className="text-6xl text-[#10A37F]" />,
                    name: "OpenAI",
                    description: "Advanced AI models for natural language processing and generation"
                },
                {
                    icon: <img src="https://tooldirectory.ai/_next/image?url=https%3A%2F%2Fstriking-kindness-e0d93214bb.media.strapiapp.com%2FStable_Diffusion_logo_2b68efd6c7.png&w=1920&q=72" alt="Stable Diffusion" className="h-16 w-16 object-contain" />,
                    name: "Stable Diffusion",
                    description: "AI image generation technology for creating visual content"
                },
                {
                    icon: <motion.div className="flex items-center justify-center h-16 w-16">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 rounded-full border-4 border-[#F1DC68] border-t-transparent"
                        />
                    </motion.div>,
                    name: "Framer Motion",
                    description: "Animation library for creating fluid UI transitions"
                },
                {
                    icon: <div className="text-6xl font-bold text-blue-500">TW</div>,
                    name: "Tailwind CSS",
                    description: "Utility-first CSS framework for rapid UI development"
                }
            ]
        },
        {
            title: "Deployment & Infrastructure",
            technologies: [
                {
                    icon: <SiRailway className="text-6xl text-white" />,
                    name: "Railway",
                    description: "Infrastructure platform for deployment and hosting"
                },
                {
                    icon: <div className="text-6xl font-bold text-[#00E699]">NT</div>,
                    name: "NeonTech",
                    description: "Serverless PostgreSQL for scalable database solutions"
                },
                {
                    icon: <SiVercel className="text-6xl text-white" />,
                    name: "Vercel",
                    description: "Platform for frontend deployment and global content delivery"
                },
                {
                    icon: <FaServer className="text-6xl text-[#F1DC68]" />,
                    name: "WebSockets",
                    description: "Real-time communication protocol for interactive experiences"
                }
            ]
        }
    ];

    const nextPage = () => {
        setCurrentPage((prev) => (prev === techCategories.length - 1 ? 0 : prev + 1));
        resetTimer();
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev === 0 ? techCategories.length - 1 : prev - 1));
        resetTimer();
    };

    const goToPage = (index: number) => {
        setCurrentPage(index);
        resetTimer();
    };

    const resetTimer = () => {
        setAutoRotate(false);
        setTimeout(() => setAutoRotate(true), 100);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        
        if (autoRotate) {
            interval = setInterval(() => {
                setCurrentPage((prev) => (prev === techCategories.length - 1 ? 0 : prev + 1));
            }, 8000); // Auto-advance every 8 seconds
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRotate, techCategories.length]);
    
    return (
        <section id="tech-section" className="min-h-screen flex flex-col justify-center bg-black relative overflow-hidden py-10">
            <div className="absolute inset-0 bg-[url('/torch_before.png')] bg-repeat-x bg-top opacity-20"></div>
            
            <div className="container mx-auto px-6 md:px-10">
                <motion.h2 
                    className="text-[#B28F4C] font-cinzel text-center text-3xl md:text-4xl mb-6 relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Powered By These Technologies
                </motion.h2>
                
                <motion.p 
                    className="text-white font-cinzel text-lg max-w-3xl mx-auto text-center mb-12 relative z-10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    Our platform combines cutting-edge technologies to create a seamless,
                    immersive storytelling experience that pushes the boundaries of AI-driven narrative.
                </motion.p>
                
                <div className="relative max-w-5xl mx-auto">
                    {/* Navigation arrows for desktop */}
                    <div className="hidden md:block">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-30">
                            <motion.button 
                                onClick={prevPage}
                                className="bg-[#111]/80 text-[#F1DC68] p-4 rounded-full hover:bg-[#B28F4C] hover:text-white transition-colors duration-300 shadow-lg border border-[#F1DC68]/30"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaChevronLeft className="text-2xl" />
                            </motion.button>
                        </div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-30">
                            <motion.button 
                                onClick={nextPage}
                                className="bg-[#111]/80 text-[#F1DC68] p-4 rounded-full hover:bg-[#B28F4C] hover:text-white transition-colors duration-300 shadow-lg border border-[#F1DC68]/30"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaChevronRight className="text-2xl" />
                            </motion.button>
                        </div>
                    </div>
                    
                    <div className="relative overflow-hidden rounded-lg bg-[#1A1A1A]/80 border border-[#3A3A3A] shadow-2xl" style={{ minHeight: '500px' }}>
                        {/* Mobile navigation arrows */}
                        <div className="md:hidden absolute top-1/2 -translate-y-1/2 left-0 z-30">
                            <motion.button 
                                onClick={prevPage}
                                className="bg-[#111]/90 text-[#F1DC68] p-3 rounded-r-lg hover:bg-[#B28F4C] hover:text-white shadow-lg border-y border-r border-[#F1DC68]/30"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaChevronLeft className="text-xl" />
                            </motion.button>
                        </div>
                        <div className="md:hidden absolute top-1/2 -translate-y-1/2 right-0 z-30">
                            <motion.button 
                                onClick={nextPage}
                                className="bg-[#111]/90 text-[#F1DC68] p-3 rounded-l-lg hover:bg-[#B28F4C] hover:text-white shadow-lg border-y border-l border-[#F1DC68]/30"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaChevronRight className="text-xl" />
                            </motion.button>
                        </div>
                        
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPage}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
                                className="p-8 px-12"
                            >
                                <h3 className="text-2xl text-[#F1DC68] font-cinzel text-center mb-8">
                                    {techCategories[currentPage].title}
                                </h3>
                                
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                                    {techCategories[currentPage].technologies.map((tech, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex flex-col items-center text-center bg-[#222222]/80 p-4 rounded-lg border border-[#444] hover:border-[#F1DC68] transition-colors duration-300"
                                            whileHover={{ 
                                                y: -5, 
                                                boxShadow: "0 10px 25px -5px rgba(241, 220, 104, 0.3)",
                                                transition: { duration: 0.2 } 
                                            }}
                                        >
                                            <div className="mb-4 flex justify-center items-center h-20 w-20">
                                                {tech.icon}
                                            </div>
                                            <h4 className="text-white font-bold text-lg mb-2">{tech.name}</h4>
                                            <p className="text-gray-400 text-sm">{tech.description}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    
                    <div className="flex justify-center mt-6 space-x-2 relative z-10">
                        {techCategories.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToPage(index)}
                                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                                    currentPage === index ? "bg-[#F1DC68]" : "bg-gray-600"
                                } hover:bg-[#F1DC68]/70`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
                
                {/* Tech Section Arrow */}
                {/* <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
                    <motion.div 
                        className="cursor-pointer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7, y: [0, 10, 0] }}
                        transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
                        onClick={() => scrollToSection('cta-section')}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaAngleDown className="text-[#F1DC68] text-3xl" />
                    </motion.div>
                </div> */}
            </div>
        </section>
    );
};

const CallToActionSection: React.FC<{
    navigateWithLoading: (path: string) => void;
}> = ({ navigateWithLoading }) => {
    return (
        <section id="cta-section" className="min-h-screen flex flex-col justify-center bg-black relative overflow-hidden py-10">
            <div className="absolute inset-0 bg-[url('/torch_after.png')] bg-repeat-x bg-bottom opacity-30"></div>
            
            <div className="container mx-auto px-6 md:px-10 flex flex-col items-center text-center relative z-10">
                <motion.h2 
                    className="text-[#F1DC68] font-cinzel text-3xl md:text-5xl mb-6"
                    variants={slideUp}
                >
                    Begin Your Journey
                </motion.h2>
                
                <motion.p 
                    className="text-white font-cinzel text-xl md:text-2xl max-w-3xl mb-12"
                    variants={slideUp}
                >
                    Your adventure awaits in a world where every choice shapes your unique story. Unleash your imagination today and forge your own path through the realms of SAGE.AI.
                </motion.p>
                
                <motion.div 
                    className="flex flex-col md:flex-row gap-6"
                    variants={slideUp}
                >
                    <Button
                        variant="main"
                        size="custom"
                        customSize={{
                            width: 'w-[200px] md:w-[250px]',
                            height: 'h-[65px]',
                            fontSize: 'text-lg',
                            padding: 'px-4'
                        }}
                        onClick={() => navigateWithLoading('/register')}
                    >
                        Enter the World
                        <br /> <span className="text-sm opacity-80">(Create Account)</span>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default LandingPage;