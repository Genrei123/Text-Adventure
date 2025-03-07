import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from '../../config/axiosConfig';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Carousel from "./components/Carousel";
import YourJourney from "./components/YourJourney";
import StartAdventure from "./components/StartAdventure";
import GameList from "./components/GameList";

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

  useEffect(() => {
    const fetchCarouselGames = async () => {
      try {
        const response = await axios.get<CarouselGame[]>('/game', {
          params: {
            order: 'createdAt',
            direction: 'DESC',
            limit: 5
          }
        });

        // Transform the response into carousel format
        const formattedCarousel = response.data.map(game => ({
          id: game.id,
          image_data: game.image_data || 'https://images.unsplash.com/photo-1601987077677-5346c0c57d3f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          title: game.title,
          description: game.tagline || game.description || 'Explore a new adventure',
          genre: game.genre
        }));

        setCarouselData(formattedCarousel);
      } catch (error) {
        console.error('Error fetching carousel games:', error);
        // Fallback to default carousel if fetch fails
        setCarouselData([
          {
            id: '1',
            image_data: "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=1200&h=800&fit=crop",
            title: "Medieval Fantasy",
            description: "Embark on an epic journey through enchanted realms",
          },
          // ... other default slides
        ]);
      }
    };

    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      setUsername(token);
    };

    fetchUserData();
    fetchCarouselGames();

    const params = new URLSearchParams(location.search);
    const usernameParam = params.get("username");
    if (usernameParam) {
      setUsername(decodeURIComponent(usernameParam));
      localStorage.setItem("username", usernameParam);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#E5D4B3] flex flex-col">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Main layout */}
      <div className="flex flex-col w-full h-full pt-16 z-100">
        {/* Just render Sidebar directly - it has its own positioning */}
        <Sidebar />

        {/* Main content */}
        <div className="w-full">
          {/* Carousel Section */}
          <div className="w-[95%] max-w-full mx-auto px-6 md:px-12 my-16">
            <Carousel slides={carouselData} />
          </div>

          {/* Your Journey Section */}
          <YourJourney setCard={setCard} />

          {/* Start Adventure Section */}
          <StartAdventure 
            onCreateStory={() => navigate("/game-creation")}
            onBrowse={() => navigate("/browse-stories")}
          />

          {/* Game List Section */}
          <GameList />

          {/* Link to Ban Test Page */}
          <div>
            <h1>Main Application</h1>
            <Link to="/ban-test">
              Go to Ban Test Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;