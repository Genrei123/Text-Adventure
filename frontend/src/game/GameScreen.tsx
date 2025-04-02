"use client";

import type React from "react";
import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";
import GameHeader from "../components/GameHeader";
import ActionButton from "./components/ActionButton";
import { motion } from "framer-motion";
import axios from "axios";

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
  model?: string;
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
  const [selectedModel, setSelectedModel] = useState("DALL-E 3");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const [coins, setCoins] = useState<number>(0);
  const [isCheckingCoins, setIsCheckingCoins] = useState<boolean>(false);
  const [showCoinStore, setShowCoinStore] = useState(false);
  const lastRefreshTimeRef = useRef<number>(0);
  const refreshInProgressRef = useRef<boolean>(false);
  const [gameSummary, setGameSummary] = useState<GameSummaryResponse | null>(null);
  const [showModelSelectionModal, setShowModelSelectionModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("OpenAI");
  const [selectedBaseModel, setSelectedBaseModel] = useState("DALL-E 3");
  const [selectedTrainedModel, setSelectedTrainedModel] = useState("");
  const [activeTab, setActiveTab] = useState("base");

  interface GameSummaryResponse {
    summary: string;
    imageUrl: string;
  }

  // Fetch coins when userId changes
  useEffect(() => {
    if (userId) {
      console.log("Calling fetchCoins with userId:", userId);
      fetchCoins();
    }
  }, [userId]);

  // Function to trigger coin refresh
  const triggerCoinRefresh = async (force = false, manualBalance?: number) => {
    if (manualBalance !== undefined) {
      setCoins(manualBalance);
      const coinUpdateEvent = new CustomEvent("coinUpdate", {
        detail: { newBalance: manualBalance },
      });
      window.dispatchEvent(coinUpdateEvent);
      return manualBalance;
    }

    if (refreshInProgressRef.current && !force) {
      return;
    }

    const now = Date.now();
    if (!force && now - lastRefreshTimeRef.current < 2000) {
      return;
    }

    try {
      refreshInProgressRef.current = true;

      const email =
        localStorage.getItem("email") ||
        (localStorage.getItem("userData") && JSON.parse(localStorage.getItem("userData") || "{}").email);

      if (!email) {
        console.error("Email not found in localStorage");
        return;
      }

      console.log("GameScreen: Refreshing coins at", new Date().toLocaleTimeString());
      const response = await axiosInstance.get(`/shop/coins?email=${encodeURIComponent(email)}`);
      console.log("GameScreen: Received updated coin balance:", response.data.coins);

      lastRefreshTimeRef.current = Date.now();

      const newBalance = response.data.coins || 0;
      setCoins(newBalance);

      const coinUpdateEvent = new CustomEvent("coinUpdate", {
        detail: { newBalance: newBalance },
      });
      window.dispatchEvent(coinUpdateEvent);

      return newBalance;
    } catch (error) {
      console.error("Error refreshing coins:", error);
    } finally {
      refreshInProgressRef.current = false;
    }
  };

  // Handle game summary generation
  const handleSummary = async () => {
    if (!userId || !gameId) {
      setError("User ID or Game ID not found. Please log in again.");
      return;
    }

    setError("");
    setSuccess("");
    setIsGeneratingImage(true);

    try {
      setShowEndStoryModal(true);

      const response = await axiosInstance.post("/openai/generateGameSummary", {
        gameId: Number.parseInt(gameId, 10),
        userId: userId,
      });

      setGameSummary(response.data);
      setSuccess("Summary generated successfully!");
    } catch (err) {
      console.error("Error generating summary:", err);
      setError("Summary generation failed. Please try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Fetch coins from the backend
  const fetchCoins = async () => {
    if (!userId) return;

    try {
      setIsCheckingCoins(true);
      const email =
        localStorage.getItem("email") ||
        (localStorage.getItem("userData") && JSON.parse(localStorage.getItem("userData") || "{}").email);

      if (!email) {
        console.error("Email not found in localStorage");
        return;
      }

      const response = await axiosInstance.get(`/shop/coins?email=${encodeURIComponent(email)}`);

      console.log("Full response from backend:", response);
      console.log("Fetched coins:", response.data.coins);

      setCoins(response.data.coins || 0);
    } catch (error) {
      console.error("Error fetching coins:", error);
    } finally {
      setIsCheckingCoins(false);
    }
  };

  // Fetch user ID from localStorage
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
      setIsLoadingMessages(true);
      try {
        const response = await axiosInstance.post("/ai/get-chat", {
          userId,
          gameId: Number.parseInt(gameId, 10),
        });

        if (response.data && Array.isArray(response.data)) {
          const formattedMessages = response.data.map((msg: any) => ({
            content: msg.content,
            isUser: msg.role === "user",
            timestamp: new Date(msg.createdAt).toLocaleTimeString(),
            image_url: msg.image_url || undefined,
          }));

          console.log("Fetched chat messages:", formattedMessages);
          setChatMessages(formattedMessages);
        } else {
          console.warn("No chat messages returned or invalid format", response.data);
          setChatMessages([]);
        }
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    Promise.all([fetchGameDetails(), fetchChatMessages()]).catch((err) =>
      console.error("Error in initial data fetch:", err)
    );
  }, [userId, gameId]);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Handle animation on component mount
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const backgroundVariants = {
    normal: { filter: "blur(50px)" },
    blurred: { filter: "blur(60px)", transition: { duration: 1.5, ease: "easeInOut" } },
  };

  // Handle Enter key press to submit message
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  // Handle form submission
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

    if (coins <= 0) {
      setError("You don't have enough coins to continue. Please purchase more.");
      return;
    }

    const payload = { userId, gameId: Number.parseInt(gameId, 10), message, action: selectedAction };
    const savedMessage = message;
    setMessage("");
    setIsWaitingForAI(true);

    try {
      const email =
        localStorage.getItem("email") ||
        (localStorage.getItem("userData") && JSON.parse(localStorage.getItem("userData") || "{}").email);

      if (!email) {
        console.error("Email not found in localStorage");
        setError("User email not found. Please log in again.");
        setIsWaitingForAI(false);
        return;
      }

      const displayMessage = `[${selectedAction}] ${savedMessage}`;
      const tempUserMessage = {
        content: displayMessage,
        isUser: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, tempUserMessage]);

      console.log("Sending to /ai/chat with payload:", payload);

      const response = await axiosInstance.post("/ai/chat", payload);
      console.log("AI response:", response.data);

      if (!response.data || !response.data.ai_response) {
        throw new Error("Invalid response format from AI service");
      }

      try {
        const deductResponse = await axiosInstance.post("/shop/deduct-coins", {
          email: email,
          userId: userId,
          messages: [
            { role: "System", content: response.data.ai_response.content },
            { role: "User", content: savedMessage },
          ],
        });

        console.log("Coin deduction details:", deductResponse.data);

        const coinsDeducted = deductResponse.data.coinsDeducted || 1;
        setCoins((prevCoins) => Math.max(0, prevCoins - coinsDeducted));
        await triggerCoinRefresh();
      } catch (deductError) {
        console.error("Error deducting coins (but message was sent):", deductError);
      }

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
    } catch (error) {
      console.error("Error in handleSubmit:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        console.error("Axios error details:", {
          status,
          data,
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        });

        if (status === 401) {
          setError("Authentication error. Please log in again.");
        } else if (status === 402) {
          setError("Not enough coins. Please purchase more.");
          setCoins(0);
        } else if (status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(`Failed to send message: ${data?.message || error.message}`);
        }
      } else {
        setError(`An unexpected error occurred: ${(error as Error).message}`);
      }

      setChatMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsWaitingForAI(false);
    }
  };

  // Get context from recent messages for image generation
  const getContextFromMessages = (): string => {
    const recentMessages = chatMessages.slice(-5);
    const cleanedContents = recentMessages.map((msg) => msg.content.replace(/^\[(Say|Do|See)\]\s+/i, ""));
    return cleanedContents.length === 0 && gameDetails?.description
      ? `Generate an image based on this game description: ${gameDetails.description}`
      : `Generate an image of the current scene in the story: ${cleanedContents.join(". ")}`;
  };

  // Open model selection modal
  const openModelSelectionModal = () => {
    setShowModelSelectionModal(true);
  };

  // Handle model selection
  const handleModelSelection = (provider: string, baseModel: string, trainedModel = "") => {
    setSelectedProvider(provider);
    setSelectedBaseModel(baseModel);
    setSelectedTrainedModel(trainedModel);

    if (trainedModel) {
      setSelectedModel(`${baseModel} - ${trainedModel}`);
    } else {
      setSelectedModel(baseModel);
    }

    setShowModelSelectionModal(false);
  };

  // Handle image generation
  const handleGenerateImage = async () => {
    if (isGeneratingImage) return;

    try {
      setIsGeneratingImage(true);
      setError("");

      const email =
        localStorage.getItem("email") ||
        (localStorage.getItem("userData") && JSON.parse(localStorage.getItem("userData") || "{}").email);

      if (!email) {
        console.error("Email not found in localStorage");
        setError("User email not found. Please log in again.");
        return;
      }

      if (coins <= 0) {
        setError("You don't have enough coins to generate an image. Please purchase more coins.");
        return;
      }

      const contextMessage = getContextFromMessages();

      /* let apiEndpoint;
      let modelParam;

      // If there's a reason why StabilityAI can be used despite the models, it's because of this line of code. LMAO!
      if (selectedProvider === "OpenAI") {
        apiEndpoint = "/openai/generate-image";
        modelParam = selectedBaseModel;
      } else {
        apiEndpoint = "/comfyui/generate";
        modelParam = selectedTrainedModel ? `${selectedBaseModel}-${selectedTrainedModel}` : selectedBaseModel;
      }*/

      // New API endpoint for image generation
      const apiEndpoint = "/generate-image"; 
      const modelParam = selectedTrainedModel ? `${selectedBaseModel}-${selectedTrainedModel}` : selectedBaseModel;

      const imagePrompt = contextMessage.substring(0, 997) + (contextMessage.length > 1000 ? "..." : "");

      const displayModelName = selectedTrainedModel
        ? `${selectedBaseModel} - ${selectedTrainedModel}`
        : selectedBaseModel;
      const userPromptMessage: ChatMessage = {
        content: `[Generate Image] Visualizing the current scene using ${displayModelName}...`,
        isUser: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, userPromptMessage]);

      const generatingMessage: ChatMessage = {
        content: `Generating image of the current scene with ${displayModelName}...`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, generatingMessage]);

      // DO NOT CHANGE
      const response = await axios.post(import.meta.env.VITE_SDXL_ENV + apiEndpoint, {
        userId,
        gameId,
        prompt: imagePrompt,
        model: modelParam,
        provider: selectedProvider,
      });

      console.log("Image generation response:", response.data);

      try {
        const deductResponse = await axiosInstance.post("/shop/deduct-coins", {
          email: email,
          userId: userId,
          messages: [
            { role: "System", content: "Coin deduction for image generation" },
            { role: "User", content: contextMessage.substring(0, 500) },
          ],
        });

        console.log("Coin deduction details for image:", deductResponse.data);

        const coinsDeducted = deductResponse.data.coinsDeducted || 1;
        setCoins((prevCoins) => Math.max(0, prevCoins - coinsDeducted));
        await triggerCoinRefresh();
      } catch (deductError) {
        console.error("Error deducting coins (but image was generated):", deductError);
      }

      if (response.data && response.data.imageUrl) {
        setChatMessages((prev) => {
          const messagesWithoutGenerating = prev.slice(0, -1);
          return [
            ...messagesWithoutGenerating,
            {
              content: `Here's a visualization of the current scene:`,
              isUser: false,
              timestamp: new Date().toLocaleTimeString(),
              image_url: response.data.imageUrl,
            },
          ];
        });

        try {
          await axios.post(import.meta.env.VITE_SDXL_ENV + "/ai/store-image", {
            userId,
            gameId,
            content: "Generated image for the current scene",
            image_url: response.data.imageUrl,
          });
        } catch (saveError) {
          console.error("Error saving image to chat history:", saveError);
        }
      } else {
        throw new Error("Failed to generate image");
      }
    } catch (error) {
      console.error("Error generating image:", error);

      setChatMessages((prev) => prev.slice(0, -1));

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        console.error("Image generation error details:", {
          status,
          data,
          url: error.config?.url,
          method: error.config?.method,
        });

        if (status === 401) {
          setError("Authentication error. Please log in again.");
        } else if (status === 402) {
          setError("Not enough coins to generate an image. Please purchase more.");
        } else {
          setError(`Image generation failed: ${data?.message || error.message}`);
        }
      } else {
        setError(`Failed to generate image: ${(error as Error).message}`);
      }
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Handle sharing to Facebook
  const handleShareToFacebook = () => {
    if (!gameSummary) {
      setError("Nothing to share yet. Please generate a summary first.");
      return;
    }

    const websiteUrl = "https://text-adventure-six.vercel.app/";
    const gameTitle = gameDetails?.title || "My Adventure";
    const summarySnippet = gameSummary.summary ? gameSummary.summary.split("\n")[0].substring(0, 100) + "..." : "";
    const shareText = `I just finished my adventure "${gameTitle}"! ${summarySnippet} Play your own adventure now!`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}"e=${encodeURIComponent(shareText)}`;

    window.open(facebookShareUrl, "_blank", "width=600,height=400");
  };

  // Render waiting bubble for AI response
  const renderWaitingBubble = () => {
    if (!isWaitingForAI) return null;

    return (
      <div className="mb-4 text-left">
        <div className="inline-block p-3 rounded-lg bg-[#634630] text-[#E5D4B3]">
          <div className="flex space-x-2">
            <div className="h-2 w-2 bg-[#E5D4B3] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="h-2 w-2 bg-[#E5D4B3] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            <div className="h-2 w-2 bg-[#E5D4B3] rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{new Date().toLocaleTimeString()}</p>
      </div>
    );
  };

  // Get image URL with proper base URL
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "";

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    const baseUrl = import.meta.env.VITE_SDXL_ENV || "";
    return `${baseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  };

  // Reset the game
  const resetGame = async () => {
    try {
      await axiosInstance.post("/ai/reset-chat", {
        userId: userId,
        gameId: gameId,
      });

      alert("Game reset successfully!");
      window.location.reload();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      {/* Animation overlay */}
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
        {/* Background image with blur effect */}
        <motion.div className="absolute inset-0" variants={backgroundVariants} initial="normal">
          <img src="./UserBG.svg" alt="Background" className="w-full h-full object-cover" />
        </motion.div>

        <div className="relative z-10">
          <div className="z-50">
            <GameHeader title={gameDetails?.title} />
          </div>
          <br />
          <br />
          <br />
        </div>

        {/* Chat container */}
        <div className="flex-grow flex justify-center items-start mt-[-5%] pt-4">
          <div
            ref={chatContainerRef}
            className="w-full md:w-1/2 p-4 rounded mt-1 mx-auto overflow-y-auto h-[calc(100vh-200px)] scrollbar-hide bg-[#1E1E1E]/50 backdrop-blur-sm text-white"
            style={{ scrollbarColor: "#634630 #1E1E1E" }}
          >
            {isLoadingMessages ? (
              <div className="flex justify-center items-center h-20">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 bg-[#E5D4B3] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="h-3 w-3 bg-[#E5D4B3] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  <div className="h-3 w-3 bg-[#E5D4B3] rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                </div>
              </div>
            ) : chatMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>Your adventure begins here. What would you like to do?</p>
              </div>
            ) : (
              <>
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`mb-4 ${msg.isUser ? "text-right" : "text-left"}`}>
                    <p
                      className={`inline-block p-2 rounded-lg ${msg.isUser ? "bg-[#311F17] text-white" : "bg-[#634630] text-[#E5D4B3]"}`}
                    >
                      {msg.content}
                    </p>
                    {msg.model && (
                      <div className={`mt-2 ${msg.isUser ? "text-right" : "text-left"}`}>
                        <img
                          src={getImageUrl(msg.model)}
                          alt="Generated"
                          className="max-w-full md:max-w-md lg:max-w-lg h-auto rounded-lg inline-block"
                          loading="lazy"
                          onError={(e) => {
                            console.error("Image load error:", e.currentTarget.src);
                            e.currentTarget.onerror = null;
                          }}
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
                  </div>
                ))}
                {renderWaitingBubble()}
              </>
            )}
          </div>
        </div>

        {/* Input area */}
        <div className="w-full md:w-1/2 mx-auto mt-[0%] flex flex-col items-center md:items-start space-y-4 fixed bottom-0 md:relative md:bottom-auto bg-[#1E1E1E] md:bg-transparent p-4 md:p-0">
          <div className="flex space-x-4 w-full justify-center md:justify-start mb-2">
            <ActionButton action="Do" isSelected={selectedAction === "Do"} onClick={() => setSelectedAction("Do")} />
            <ActionButton action="Say" isSelected={selectedAction === "Say"} onClick={() => setSelectedAction("Say")} />

            {/* Visualize Scene button with settings */}
            <div className="flex rounded-full overflow-hidden">
              <button
                onClick={handleGenerateImage}
                className={`px-2 py-1 md:px-4md:py-2 font-playfair text-xs md:text-base ${
                  isGeneratingImage
                    ? "bg-[#634630]/50 text-gray-400 cursor-not-allowed"
                    : "bg-[#634630] text-white hover:bg-[#311F17] transition-colors"
                }`}
                disabled={isGeneratingImage}
              >
                Visualize Scene
              </button>
              <button
                onClick={openModelSelectionModal}
                className={`px-2 py-1 md:px-2 ${isGeneratingImage? "bg-[#634630]/50 text-gray-400 cursor-not-allowed" : "bg-[#634630] text-white hover:bg-[#311F17] transition-colors"} border-l border-[#311F17]/30`}
                aria-label="Select model"
                disabled={isGeneratingImage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-settings"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
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

            <button
              onClick={() => resetGame()}
              className={`px-2 py-1 md:px-4 md:py-2 rounded-full font-playfair text-xs md:text-base bg-[${gameDetails?.primary_color || "#634630"}] text-red hover:bg-[#8E1616] transition-colors`}
            >
              Reset Story
            </button>
          </div>

          {/* Text input and submit button */}
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
              disabled={isWaitingForAI}
            />
            <button
              className={`p-4 bg-transparent rounded-r-2xl relative group self-start ${isWaitingForAI ? "cursor-not-allowed opacity-50" : ""}`}
              onClick={handleSubmit}
              disabled={isWaitingForAI}
            >
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
      </div>

      {/* Show Description Modal */}
      {showDescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1E1E1E] p-6 rounded-lg max-w-md w-full">
            <img
              src={gameDetails?.image_data || "/warhammer.jpg"}
              alt="Game Description"
              className="w-full h-48 object-cover rounded-lg"
            />
            <br />
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

      {/* Model Selection Modal */}
      {showModelSelectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1E1E1E] p-6 rounded-lg max-w-md w-full border border-[#634630] shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-[#E5D4B3]">Select Image Generation Model</h2>

            <div className="flex mb-4">
              <button
                onClick={() => setActiveTab("base")}
                className={`px-4 py-2 flex-1 ${activeTab === "base" ? "bg-[#634630] text-white" : "bg-[#311F17] text-[#E5D4B3]"} rounded-l-md`}
              >
                Base Models
              </button>
              <button
                onClick={() => setActiveTab("others")}
                className={`px-4 py-2 flex-1 ${activeTab === "others" ? "bg-[#634630] text-white" : "bg-[#311F17] text-[#E5D4B3]"} rounded-r-md`}
              >
                Others
              </button>
            </div>

            <div className="flex mb-4">
              <div className="w-1/3 pr-2">
                <h3 className="text-sm font-semibold mb-2 text-[#E5D4B3]">Provider</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedProvider("OpenAI")}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedProvider === "OpenAI" ? "bg-[#634630] text-white" : "bg-[#311F17] text-[#E5D4B3]"}`}
                  >
                    OpenAI
                  </button>
                  <button
                    onClick={() => setSelectedProvider("StabilityAI")}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedProvider === "StabilityAI" ? "bg-[#634630] text-white" : "bg-[#311F17] text-[#E5D4B3]"}`}
                  >
                    StabilityAI
                  </button>
                </div>
              </div>

              <div className="w-2/3 pl-2">
                <h3 className="text-sm font-semibold mb-2 text-[#E5D4B3]">
                  {activeTab === "base" ? "Available Models" : "Trained Models"}
                </h3>

                {activeTab === "base" && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedProvider === "OpenAI" && (
                      <>
                        <button
                          onClick={() => handleModelSelection("OpenAI", "DALL-E 2")}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedBaseModel === "DALL-E 2" && selectedProvider === "OpenAI" ? "bg-[#634630] text-white" : "bg-[#311F17] text-[#E5D4B3]"}`}
                        >
                          DALL-E 2
                        </button>
                        <button
                          onClick={() => handleModelSelection("OpenAI", "DALL-E 3")}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedBaseModel === "DALL-E 3" && selectedProvider === "OpenAI" ? "bg-[#634630] text-white" : "bg-[#311F17] text-[#E5D4B3]"}`}
                        >
                          DALL-E 3
                        </button>
                      </>
                    )}

                    {selectedProvider === "StabilityAI" && (
                      <>
                        <button
                          onClick={() => handleModelSelection("StabilityAI", "Stable Diffusion 1.5")}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedBaseModel === "Stable Diffusion 1.5" && selectedProvider === "StabilityAI" ? "bg-[#634630] text-white" : "bg-[#311F17] text-[#E5D4B3]"}`}
                        >
                          Stable Diffusion 1.5 (v1-5 pruned)
                        </button>
                        <button
                          onClick={() => handleModelSelection("StabilityAI", "Stable Diffusion 3.0")}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedBaseModel === "Stable Diffusion 3.0" && selectedProvider === "StabilityAI" ? "bg-[#634630] text-white" : "bg-[#311F17] text-[#E5D4B3]"}`}
                        >
                          Stable Diffusion 3.0
                        </button>
                        <button
                          onClick={() => handleModelSelection("StabilityAI", "Stable Diffusion XL")}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedBaseModel === "Stable Diffusion XL" && selectedProvider === "StabilityAI" ? "bg-[#634630] text-white" : "bg-[#311F17] text-[#E5D4B3]"}`}
                        >
                          Stable Diffusion XL
                        </button>
                      </>
                    )}
                  </div>
                )}

                {activeTab === "others" && selectedProvider === "StabilityAI" && (
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    <div>
                      <h4 className="text-xs font-semibold text-[#E5D4B3] mb-2 border-b border-[#634630]/30 pb-1">
                        Stable Diffusion 1.5
                      </h4>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleModelSelection("StabilityAI", "Stable Diffusion 1.5", "anythingelse")}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedBaseModel === "Stable Diffusion 1.5" && selectedTrainedModel === "anythingelse" ? "bg-[#634630] text-white" : "bg-[#311F17] text-[#E5D4B3]"}`}
                        >
                          anythingelseV4 (v4.5)
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-[#E5D4B3] mb-2 border-b border-[#634630]/30 pb-1">
                        Stable Diffusion XL
                      </h4>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleModelSelection("StabilityAI", "Stable Diffusion XL", "Animagine")}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedBaseModel === "Stable Diffusion XL" && selectedTrainedModel === "Animagine" ? "bg-[#634630] text-white" : "bg-[#311F17] text-[#E5D4B3]"}`}
                        >
                          Animagine XL 4.0
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-[#E5D4B3] mb-2 border-b border-[#634630]/30 pb-1">
                        NoobAI
                      </h4>
                      <div className="space-y-2">
                        <button
                          onClick={() =>
                            handleModelSelection("StabilityAI", "Stable Diffusion XL", "NoobAI-Base")
                          }
                          className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedBaseModel === "Stable Diffusion XL" && selectedTrainedModel === "NoobAI-Ikastrious" ? "bg-[#634630] text-white" : "bg-[#311F17] text-[#E5D4B3]"}`}
                        >
                          NoobaiXL (Base Model)
                        </button>
                        <button
                          onClick={() =>
                            handleModelSelection("StabilityAI", "Stable Diffusion XL", "NoobAI-Ikastrious")
                          }
                          className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedBaseModel === "Stable Diffusion XL" && selectedTrainedModel === "NoobAI-Ikastrious" ? "bg-[#634630] text-white" : "bg-[#311F17] text-[#E5D4B3]"}`}
                        >
                          Ikastrious (NoobAI-XL)
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-[#E5D4B3] mb-2 border-b border-[#634630]/30 pb-1">
                        Illustrious
                      </h4>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleModelSelection("StabilityAI", "Stable Diffusion XL", "Illustrious-coco")}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedBaseModel === "Stable Diffusion XL" && selectedTrainedModel === "Illustrious-coco" ? "bg-[#634630] text-white" : "bg-[#311F17] text-[#E5D4B3]"}`}
                        >
                          coco-Illustrious-XL
                        </button>
                        <button
                          onClick={() =>
                            handleModelSelection("StabilityAI", "Stable Diffusion XL", "Illustrious-Obsession")
                          }
                          className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedBaseModel === "Stable Diffusion XL" && selectedTrainedModel === "Illustrious-Obsession" ? "bg-[#634630] text-white" : "bg-[#311F17] text-[#E5D4B3]"}`}
                        >
                          Obsession-Illustrious-XL
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "others" && selectedProvider === "OpenAI" && (
                  <div className="p-3 text-sm text-[#E5D4B3] bg-[#311F17] rounded-md">
                    OpenAI does not have trained models available. For now.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowModelSelectionModal(false)}
                className="px-4 py-2 rounded-full font-playfair bg-[#311F17] text-white hover:bg-[#634630] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleGenerateImage();
                  setShowModelSelectionModal(false);
                }}
                className="px-4 py-2 rounded-full font-playfair bg-[#634630] text-white hover:bg-[#311F17] transition-colors"
              >
                Generate with{" "}
                {selectedTrainedModel ? `${selectedBaseModel} - ${selectedTrainedModel}` : selectedBaseModel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End Story Modal */}
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
              <div
                className="w-full bg-gray-700 rounded-lg flex items-center justify-center border-4 border-[#634630]"
                style={{ height: "30vh" }}
              >
                {gameSummary && gameSummary.imageUrl ? (
                  <img
                    src={getImageUrl(gameSummary.imageUrl)}
                    alt="Game Summary"
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      console.error("Summary image load error");
                      e.currentTarget.onerror = null;
                    }}
                  />
                ) : (
                  <div className="text-[#C9B57B] text-lg flex items-center justify-center">
                    {isGeneratingImage ? "Generating summary..." : "No summary available"}
                  </div>
                )}
              </div>
              <br />

              <div className="mt-4 text-[#E5D4B3]">
                <h2 className="text-xl font-bold mb-2 font-cinzel">Game Summary</h2>
                <div className="max-h-[25vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#634630] scrollbar-track-transparent mx-4 leading-loose text-base text-lg text-[#C9B57B]">
                  {gameSummary && gameSummary.summary ? (
                    <div>
                      {gameSummary.summary.split("\n").map((line, index) => (
                        <p key={index} className="mb-2">
                          {line.trim()}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p>{isGeneratingImage ? "Creating your adventure summary..." : "No summary available. Generate a summary to see your adventure recap."}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex space-x-3">
                <button
                  onClick={handleSummary}
                  disabled={isGeneratingImage}
                  className={`px-4 py-3 rounded-full font-playfair text-white ${isGeneratingImage ? "bg-gray-500 cursor-not-allowed" : "bg-[#634630] hover:bg-[#311F17]"} transition-colors`}
                >
                  {isGeneratingImage ? "Generating..." : "Generate Summary"}
                </button>
                <button
                  onClick={handleShareToFacebook}
                  disabled={!gameSummary || isGeneratingImage}
                  className={`px-4 py-3 rounded-full font-playfair text-white flex items-center ${!gameSummary || isGeneratingImage ? "bg-gray-500 cursor-not-allowed" : "bg-[#4267B2] hover:bg-[#365899]"} transition-colors`}
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
    </>
  );
};

export default GameScreen;