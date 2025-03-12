import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";
import Sidebar from "../components/Sidebar";
import GameHeader from "../components/GameHeader";
import ActionButton from "./components/ActionButton";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import axios from 'axios';

interface GameDetails {
  title: string;
  description: string;
  primary_color?: string;
  image_data?: string;
}

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: string;
  image_url?: string;
}

const GameScreen: React.FC = () => {
  const { id: gameId } = useParams<{ id: string }>();
  const [userId, setUserId] = useState<number | null>(null);
  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showScroll, setShowScroll] = useState(false);
  const [selectedAction, setSelectedAction] = useState("Say");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showEndStoryModal, setShowEndStoryModal] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [selectedModel, setSelectedModel] = useState("DALL-E");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);
  interface GameSummaryResponse {
    summary: string;
    imageUrl: string;
  }

  // Update the state declaration
  const [gameSummary, setGameSummary] = useState<GameSummaryResponse | null>(null);

  // Update the handleSummary function
  const handleSummary = async () => {
    if (!userId || !gameId) {
      setError('User ID or Game ID not found. Please log in again.');
      return;
    }

    setError('');
    setSuccess('');
    setIsGeneratingImage(true);

    try {
      // Show loading state in the modal
      setShowEndStoryModal(true);

      const response = await axiosInstance.post("/openai/generateGameSummary", {
        gameId: parseInt(gameId, 10),
        userId: userId,
      });

      // Set the summary with the new structure
      setGameSummary(response.data);
      setSuccess('Summary generated successfully!');
    } catch (err) {
      console.error('Error generating summary:', err);
      setError('Summary generation failed. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch userId from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData.id) {
          setUserId(parsedData.id);
        }
      } catch (error) {
        console.error("Error parsing userData from localStorage:", error);
      }
    }
  }, []);

  // Fetch game details and chat messages
  useEffect(() => {
    if (!userId || !gameId) return;

    const fetchGameDetails = async () => {
      try {
        const response = await axiosInstance.get(`/game/${gameId}`);
        setGameDetails({
          title: response.data.title,
          description: response.data.description,
          primary_color: response.data.primary_color,
          image_data: response.data.image_data,
        });
      } catch (error) {
        console.error("Error fetching game details:", error);
        setError("Failed to load game details.");
      }
    };

    const fetchChatMessages = async () => {
      try {
        const response = await axiosInstance.post("/ai/get-chat", {
          userId,
          gameId: Number.parseInt(gameId, 10),
        });
        const formattedMessages = response.data.map((msg: any) => ({
          content: msg.content,
          isUser: msg.role === "user",
          timestamp: new Date(msg.createdAt).toLocaleTimeString(),
          image_url: msg.image_url || undefined,
        }));
        console.log("Fetched chat messages:", formattedMessages);
        setChatMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    fetchGameDetails();
    fetchChatMessages();
  }, [userId, gameId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Door animation setup
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const backgroundVariants = {
    normal: { filter: "blur(50px)" },
    blurred: { filter: "blur(60px)", transition: { duration: 1.5, ease: "easeInOut" } },
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    if (!userId || !gameId) {
      setError("User ID or Game ID not found. Please log in again.");
      return;
    }

    const payload = { userId, gameId: Number.parseInt(gameId, 10), message, action: selectedAction };
    setMessage("");

    try {
      const displayMessage = `[${selectedAction}] ${message}`;
      const tempUserMessage = { content: displayMessage, isUser: true, timestamp: new Date().toLocaleTimeString() };
      setChatMessages((prev) => [...prev, tempUserMessage]);

      const response = await axiosInstance.post("/ai/chat", payload);
      const aiResponse: ChatMessage = {
        content: response.data.ai_response.content || "This is a simulated AI response.",
        isUser: false,
        timestamp: response.data.ai_response.createdAt
          ? new Date(response.data.ai_response.createdAt).toLocaleTimeString()
          : new Date().toLocaleTimeString(),
        image_url: response.data.ai_response.image_url,
      };

      if (response.data.user_message && response.data.user_message.createdAt) {
        setChatMessages((prev) => {
          const updatedMessages = prev.slice(0, -1);
          return [
            ...updatedMessages,
            {
              content: `[${selectedAction}] ${response.data.user_message.content}`,
              isUser: true,
              timestamp: new Date(response.data.user_message.createdAt).toLocaleTimeString(),
              image_url: response.data.user_message.image_url,
            },
            aiResponse,
          ];
        });
      } else {
        setChatMessages((prev) => [...prev.slice(0, -1), tempUserMessage, aiResponse]);
      }

      setSuccess("Message sent successfully!");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const getContextFromMessages = (): string => {
    const recentMessages = chatMessages.slice(-5);
    const cleanedContents = recentMessages.map((msg) => msg.content.replace(/^\[(Say|Do|See)\]\s+/i, ""));
    return cleanedContents.length === 0 && gameDetails?.description
      ? `Generate an image based on this game description: ${gameDetails.description}`
      : `Generate an image of the current scene in the story: ${cleanedContents.join(". ")}`;
  };

  const handleGenerateImage = async () => {
    if (!userId || !gameId) {
      setError("User ID or Game ID not found. Please log in again.");
      return;
    }

    setError("");
    setSuccess("");
    setIsGeneratingImage(true);
    setShowModelDropdown(false);

    try {
      const contextMessage = getContextFromMessages();
      const imagePrompt = contextMessage.substring(0, 997) + (contextMessage.length > 1000 ? "..." : "");
      const userPromptMessage: ChatMessage = {
        content: `[Generate Image] Visualizing the current scene using ${selectedModel}...`,
        isUser: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, userPromptMessage]);

      const generatingMessage: ChatMessage = {
        content: `Generating image of the current scene with ${selectedModel}...`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, generatingMessage]);

      console.log("Sending request to /openai/generate-image with:", { prompt: imagePrompt, userId, gameId, model: selectedModel.toLowerCase() });
      const response = await axiosInstance.post("/openai/generate-image", {
        prompt: imagePrompt,
        userId,
        gameId: Number.parseInt(gameId, 10),
        model: selectedModel.toLowerCase(),
      });
      console.log("Response from /openai/generate-image:", response.data);

      setChatMessages((prev) => prev.slice(0, -1));

      const { imageUrl } = response.data;
      console.log("Image URL received:", imageUrl);

      await axiosInstance.post("/ai/store-image", {
        userId,
        gameId: Number.parseInt(gameId, 10),
        content: `Scene visualized with ${selectedModel}:`,
        image_url: imageUrl,
        role: "assistant",
      });
      console.log("Store-image response:", await axiosInstance.post("/ai/store-image", {
        userId,
        gameId: Number.parseInt(gameId, 10),
        content: `Scene visualized with ${selectedModel}:`,
        image_url: imageUrl,
        role: "assistant",
      }).catch(err => console.error("Store-image error:", err)));

      const imageResponse: ChatMessage = {
        content: `Scene visualized with ${selectedModel}:`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
        image_url: imageUrl,
      };
      setChatMessages((prev) => [...prev, imageResponse]);
      setSuccess("Scene visualized successfully!");
    } catch (err) {
      console.error("Error generating image:", err);
      setError("Image generation failed. Please try again.");
      setChatMessages((prev) => [
        ...prev.slice(0, -1),
        {
          content: `Failed to visualize the scene with ${selectedModel}. Please try again.`,
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const toggleModelDropdown = () => {
    setShowModelDropdown(!showModelDropdown);
  };

  const selectModel = (model: string) => {
    setSelectedModel(model);
    setShowModelDropdown(false);
  };

  const handleShareToFacebook = () => {
    if (!gameSummary) {
      setError('Nothing to share yet. Please generate a summary first.');
      return;
    }

    // The URL to your main website that you want to share
    const websiteUrl = "https://text-adventure-six.vercel.app/"; // Replace with your actual website URL

    // Prepare the text to share - include some content from the summary
    const gameTitle = gameDetails?.title || 'My Adventure';

    // Extract a brief snippet from the summary text (first 100 characters)
    const summarySnippet = gameSummary.summary
      ? gameSummary.summary.split('\n')[0].substring(0, 100) + "..."
      : "";

    // Create the message to share
    const shareText = `I just finished my adventure "${gameTitle}"! ${summarySnippet} Play your own adventure now!`;

    // Facebook sharing URL with pre-filled content and link to your website
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}&quote=${encodeURIComponent(shareText)}`;

    // Open the Facebook share dialog in a new window
    window.open(facebookShareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <>
      {isAnimating && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center">
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full bg-black"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            exit={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ transformOrigin: "left" }}
          />
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full bg-black"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            exit={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ transformOrigin: "right" }}
          />
        </div>
      )}

      <div className="min-h-screen bg-[#1E1E1E] text-[#E5D4B3] flex flex-col relative">
        <motion.div className="absolute inset-0" variants={backgroundVariants} initial="normal">
          <img src="./UserBG.svg" alt="Background" className="w-full h-full object-cover" />
        </motion.div>

        <div className="relative z-10">
          <div className="z-50">
            <GameHeader title={gameDetails?.title} />
            {/* <Sidebar /> */}
          </div>
          <br />
          <br />
          <br />
        </div>

        <div className="flex-grow flex justify-center items-start mt-[-5%] pt-4">
        <div
            ref={chatContainerRef}
            className="w-full md:w-1/2 p-4 rounded mt-1 mx-auto overflow-y-auto h-[calc(100vh-200px)] scrollbar-hide bg-[#1E1E1E]/50 backdrop-blur-sm text-white"
            style={{ scrollbarColor: "#634630 #1E1E1E" }}
          >
            {chatMessages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.isUser ? "text-right" : "text-left"}`}>
                <p
                  className={`inline-block p-2 rounded-lg ${msg.isUser ? "bg-[#311F17] text-white" : "bg-[#634630] text-[#E5D4B3]"}`}
                >
                  {msg.content}
                </p>
                {msg.image_url && (
                  <div className={`mt-2 ${msg.isUser ? "text-right" : "text-left"}`}>
                    <img
                      src={
                        import.meta.env.VITE_BACKEND_URL
                          ? `${import.meta.env.VITE_BACKEND_URL}${msg.image_url.startsWith('/') ? '' : '/'}${msg.image_url}`
                          : `/images${msg.image_url}` // Fallback for dev if VITE_BACKEND_URL is undefined
                      }
                      alt="Generated"
                      className="max-w-full h-auto rounded-lg inline-block"
                      onError={(e) => console.error("Image load error:", e.currentTarget.src)}
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 mx-auto mt-[0%] flex flex-col items-center md:items-start space-y-4 fixed bottom-0 md:relative md:bottom-auto bg-[#1E1E1E] md:bg-transparent p-4 md:p-0">
          <div className="flex space-x-4 w-full justify-center md:justify-start mb-2">
            <ActionButton action="Do" isSelected={selectedAction === "Do"} onClick={() => setSelectedAction("Do")} />
            <ActionButton action="Say" isSelected={selectedAction === "Say"} onClick={() => setSelectedAction("Say")} />

            <div className="relative" ref={modelDropdownRef}>
              <button
                onClick={toggleModelDropdown}
                className={`px-2 py-1 md:px-4 md:py-2 rounded-full font-playfair text-xs md:text-base flex items-center gap-1 ${isGeneratingImage ? "bg-[#634630]/50 text-gray-400 cursor-not-allowed" : `bg-[${gameDetails?.primary_color || "#634630"}] text-white hover:bg-[#311F17] transition-colors`}`}
                disabled={isGeneratingImage}
              >
                Visualize Scene
                {showModelDropdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {showModelDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-[#1E1E1E] border border-[#634630] rounded-md shadow-lg z-50">
                  <div className="p-1">
                    <button
                      onClick={() => selectModel("DALL-E")}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedModel === "DALL-E" ? "bg-[#634630] text-white" : "hover:bg-[#311F17] text-[#E5D4B3]"}`}
                    >
                      DALL-E
                    </button>
                    <button
                      onClick={() => selectModel("SDXL")}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedModel === "SDXL" ? "bg-[#634630] text-white" : "hover:bg-[#311F17] text-[#E5D4B3]"}`}
                    >
                      SDXL
                    </button>
                  </div>
                  <div className="border-t border-[#634630] p-1">
                    <button
                      onClick={handleGenerateImage}
                      disabled={isGeneratingImage}
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-[#311F17] text-[#E5D4B3]"
                    >
                      {isGeneratingImage ? "Generating..." : `Generate with ${selectedModel}`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowDescription(!showDescription)}
              className={`px-2 py-1 md:px-4 md:py-2 rounded-full font-playfair text-xs md:text-base bg-[${gameDetails?.primary_color || "#634630"}] text-white hover:bg-[#311F17] transition-colors`}
            >
              {showDescription ? "Hide Description" : "Show Description"}
            </button>

            <button
              onClick={() => setShowEndStoryModal(true)}
              className={`px-2 py-1 md:px-4 md:py-2 rounded-full font-playfair text-xs md:text-base bg-[${gameDetails?.primary_color || "#634630"}] text-red hover:bg-[#8E1616] transition-colors`}
            >
              End Story
            </button>
          </div>

          <div className="w-full flex items-start bg-[#311F17] rounded-2xl focus-within:outline-none">
            <textarea
              ref={textareaRef}
              className={`w-full p-4 rounded-l-2xl bg-transparent text-white font-playfair text-xl focus:outline-none resize-none min-h-[56px] max-h-48 ${showScroll ? "overflow-y-auto scrollbar-thin scrollbar-thumb-[#634630] scrollbar-track-transparent" : "overflow-y-hidden"}`}
              placeholder={`Type what you want to ${selectedAction.toLowerCase()}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ minHeight: "56px", height: `${Math.min(message.split("\n").length * 24 + 32, 192)}px` }}
            />
            <button className="p-4 bg-transparent rounded-r-2xl relative group self-start" onClick={handleSubmit}>
              <img src="/Enter.svg" alt="Enter" className="h-6 group-hover:opacity-0" />
              <img
                src="/Enter-after.svg"
                alt="Enter Hover"
                className="h-6 absolute top-4 left-4 opacity-0 group-hover:opacity-100"
              />
            </button>
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </div>

        {showDescription && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#1E1E1E] p-6 rounded-lg max-w-md w-full">
              <img src={gameDetails?.image_data || '/warhammer.jpg'} alt="Game Description" className="w-full h-48 object-cover rounded-lg" />
              <br></br>
              <h2 className="text-xl font-bold mb-4">Game Description</h2>
              <p className="text-sm italic" style={{ color: gameDetails?.primary_color || "#E5D4B3" }}>
                {gameDetails?.description}
              </p>
              <button
                onClick={() => setShowDescription(false)}
                className="mt-4 px-4 py-2 rounded-full font-playfair bg-[#634630] text-white hover:bg-[#311F17] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showEndStoryModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="p-6 rounded-lg animate-dark-glow"
              style={{
                width: "75vw",
                height: "80vh",
                backgroundColor: "#2F2118",
                border: "2px solid #1E1E1E",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                {/* Image placeholder */}
                <div
                  className="w-full bg-gray-700 rounded-lg flex items-center justify-center border-4 border-[#634630]"
                  style={{ height: '30vh' }}
                >
                  {gameSummary && gameSummary.imageUrl ? (
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}${gameSummary.imageUrl}`}
                      alt="Game Summary"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-[#C9B57B] text-lg flex items-center justify-center">
                      {isGeneratingImage ? 'Generating summary...' : 'No summary available'}
                    </div>
                  )}
                </div>
                <br></br>

                {/* Summary of the game */}
                <div className="mt-4 text-[#E5D4B3]">
                  <h2 className="text-xl font-bold mb-2 font-cinzel">Game Summary</h2>
                  <div className="max-h-[25vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#634630] scrollbar-track-transparent mx-4 leading-loose text-base text-lg text-[#C9B57B]">
                    {gameSummary && gameSummary.summary ? (
                      <div>
                        {/* Format the string with line breaks */}
                        {gameSummary.summary.split('\n').map((line, index) => (
                          <p key={index} className="mb-2">
                            {line.trim()}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p>{isGeneratingImage ? 'Creating your adventure summary...' : 'No summary available. Generate a summary to see your adventure recap.'}</p>
                    )}
                  </div>
                </div>
              </div>


              <div className="flex justify-between">
                <div className="flex space-x-3">
                  <button
                    onClick={handleSummary}
                    disabled={isGeneratingImage}
                    className={`px-4 py-3 rounded-full font-playfair text-white ${isGeneratingImage ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#634630] hover:bg-[#311F17]'} transition-colors`}
                  >
                    {isGeneratingImage ? 'Generating...' : 'Generate Summary'}
                  </button>
                  <button
                    onClick={handleShareToFacebook}
                    disabled={!gameSummary || isGeneratingImage}
                    className={`px-4 py-3 rounded-full font-playfair text-white flex items-center ${!gameSummary || isGeneratingImage ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#4267B2] hover:bg-[#365899]'} transition-colors`}
                  >
                    <span className="mr-2">Share to Facebook</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => setShowEndStoryModal(false)}
                  className="px-4 py-3 rounded-full font-playfair text-white bg-[#634630] hover:bg-[#311F17] transition-colors"
                >
                  Return to Game
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default GameScreen;