import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Carousel from "./components/Carousel";
import YourJourney from "./components/YourJourney";
import StartAdventure from "./components/StartAdventure";
import GameList from "./components/GameList";
import { useLoading } from '../context/LoadingContext';
import LoadingScreen from "../components/LoadingScreen";
import NihGameCard from "./components/NihGameCard";

interface HomepageProps {
  onLogout: () => void;
}

interface CarouselGame {
  id: string;
  title: string;
  description: string;
  image_data: string;
  genre?: string;
  tagline?: string;
}

const Homepage: React.FC<HomepageProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState<string | null>(null);
  const [card, setCard] = useState<string | null>(null);
  const [carouselData, setCarouselData] = useState<CarouselGame[]>([]);
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { navigateWithLoading } = useLoading();

  useEffect(() => {
    let isMounted = true;
    const initializeHomepage = async () => {
      try {
        // Fetch carousel games
        const response = await axiosInstance.get<CarouselGame[]>('/game', {
          params: {
            order: 'createdAt',
            direction: 'DESC',
            limit: 5
          }
        });

        if (isMounted) {
          const formattedCarousel = response.data.map(game => ({
            id: game.id,
            image_data: import.meta.env.VITE_BACKEND_URL + game.image_data || 'https://images.unsplash.com/photo-1601987077677-5346c0c57d3f?q=80&w=1200',
            title: game.title,
            description: game.description || 'Explore a new adventure',
            genre: game.genre
          }));
  
          setCarouselData(formattedCarousel);
        }

        // Fetch user data
        const token = localStorage.getItem('token');
        if (token) {
          setUsername(token);
        }

        // Check URL params
        const params = new URLSearchParams(location.search);
        const usernameParam = params.get("username");
        if (usernameParam) {
          setUsername(decodeURIComponent(usernameParam));
          localStorage.setItem("username", usernameParam);
        }

        setUsername(localStorage.getItem("username"));

      } catch (error) {
        console.error('Error initializing homepage:', error);
      } finally {
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setIsInitialLoading(false);
          }, 500);
        }, 2000);
      }
    };

    initializeHomepage();

    return () => {
      isMounted = false;
    }
  }, [location.search]);

  const handleLogout = async () => {
    setFadeIn(true);
    setTimeout(async () => {
      await onLogout();
      navigateWithLoading('/login');
    }, 500);
  };

  if (isInitialLoading) {
    return <LoadingScreen fadeIn={fadeIn} fadeOut={fadeOut} />;
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#E5D4B3] flex flex-col">
      <div className="sticky top-0 left-0 right-0 z-50">
      <Navbar onLogout={handleLogout} />
      </div>

      {/* <div className="flex flex-col w-full h-full pt-16 z-100"> */}
        {/* <Sidebar /> */}

        <div className="w-full">
          {/* Carousel Section */}
            <div className="w-[95%] max-w-full mx-auto px-6 md:px-12 my-10">
              <Carousel slides={carouselData} />
            </div>

          {/* <YourJourney setCard={setCard} /> */}

          <StartAdventure 
            onCreateStory={() => navigateWithLoading("/game-creation")}
            onBrowse={() => navigateWithLoading("/browse-stories")}
          />
          
          <NihGameCard />
          <GameList />

          {/* <div>
            <h1>Main Application</h1>
            <button onClick={() => navigateWithLoading('/ban-test')}>
              Go to Ban Test Page
            </button>
          </div> */}
        </div>
      </div>
    // </div>
  );
};

export default Homepage;