import type React from "react"
import { useState, useEffect, useRef } from "react"
import "tailwindcss/tailwind.css"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import axiosInstance from "../../config/axiosConfig"
import { Calendar, Users, Tag, Star, MessageSquare, Heart, Award, Clock, Flag } from "lucide-react"
import LoadingScreen from '../components/LoadingScreen';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  Game?: {
    id: number;
    title: string;
    slug: string;
    image_data?: string;
    primary_color?: string;
  };
  User?: {
    id: number;
    username: string;
  };
  likes?: number;
}
import LastPlayedGame from "../websocket/LastPlayedGame.tsx"

const GameDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const commentsRef = useRef<HTMLDivElement>(null)

  const [game, setGame] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("details")
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const [initialCommentCount, setInitialCommentCount] = useState(0)
  const [newCommentsCount, setNewCommentsCount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fadeIn, setFadeIn] = useState(false) 
  const [fadeOut, setFadeOut] = useState(false)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [isRatingPopupOpen, setIsRatingPopupOpen] = useState(false)
  const [hasRated, setHasRated] = useState(false);
  const [showRateAgainPopup, setShowRateAgainPopup] = useState(false);
  const [tempRating, setTempRating] = useState<number | null>(null);
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) {
      navigate('/not-found')
      return
    }

    // Set loading state with fade-in animation when route changes
    setLoading(true)
    setFadeIn(false) // Make loading screen visible immediately

    const fetchGameDetails = async () => {
      try {
        const response = await axiosInstance.get(`/game/${id}`)
        setGame(response.data)
        
        // Start fade out animation before hiding the loading screen
        setFadeOut(true)
        setTimeout(() => {
          setLoading(false)
          setFadeOut(false) // Reset for next time
        }, 500) // Match the transition duration from LoadingScreen
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to fetch game details")
        setLoading(false)
      }
    }

    const fetchUserRating = async () => {
      try {
        let userId = 0
        const userData = localStorage.getItem("userData")
        if (userData) {
          const parsedData = JSON.parse(userData)
          if (parsedData.id) userId = parsedData.id
        }

        if (userId) {
          const response = await axiosInstance.get(`/game/${id}/ratings`)
          const ratings = response.data || []
          const userRatingData = ratings.find((rating: any) => rating.userId === userId)
          setUserRating(userRatingData ? userRatingData.score : null)
          setHasRated(!!userRatingData); // Set hasRated based on whether the user has rated
          if (userRatingData) {
            setIsRatingPopupOpen(true); // Show the rating popup if the user has rated
          }
        }
      } catch (error: any) {
        console.error("Failed to fetch user rating:", error)
        setUserRating(null)
      }
    }

    fetchGameDetails()
    fetchUserRating()
  }, [id])
  
  // Setup polling for new comments when the comments tab is active
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (activeTab === "comments" && id) {
      // Initial fetch
      fetchComments();
      
      // Set up polling interval to check for new comments every 30 seconds
      interval = setInterval(() => {
        checkForNewComments();
      }, 30000); // 30 seconds
    }
    
    // Cleanup function to clear interval when component unmounts or tab changes
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activeTab, id]);
  
  // Separate function to check for new comments without updating the UI immediately
  const checkForNewComments = async () => {
    try {
      const response = await axiosInstance.get(`/game/${id}/comments`);
      const latestComments = response.data;
      
      // Show notification if comment count increases from initial load
      if (latestComments.length > initialCommentCount) {
        setNewCommentsCount(latestComments.length - initialCommentCount);
      }
    } catch (error) {
      console.error("Failed to check for new comments", error);
    }
  };
  
  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/game/${id}/comments`)
      setComments(response.data)
      
      // Store initial comment count when first loaded
      if (initialCommentCount === 0) {
        setInitialCommentCount(response.data.length);
      }
      
      // Reset new comments counter when fetching comments
      setNewCommentsCount(0);
    } catch (error) {
      console.error("Failed to fetch comments", error)
      toast.error("Failed to load comments. Please try again later.");
    }
  }
  
  const refreshComments = () => {
    fetchComments()
    // No need to set newCommentsCount to 0 here as it's done in fetchComments
    // Scroll to the top of the comments section
    if (commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const validateComment = (text: string): boolean => {
    if (!text.trim()) {
      toast.warning("Comment cannot be empty.");
      return false;
    }
    
    if (text.length > 1000) {
      toast.warning("Comment is too long (maximum 1000 characters).");
      return false;
    }
    
    return true;
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateComment(comment)) {
      return;
    }
    
    setIsSubmitting(true);
    toast.info("Posting your comment...");

    try {
      let userId = 0;
      const userData = localStorage.getItem("userData");
      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          if (parsedData.id) {
            userId = parsedData.id;
          }
        } catch (error) {
          console.error("Error parsing userData from localStorage:", error);
          toast.error("You must be logged in to comment.");
          setIsSubmitting(false);
          return;
        }
      } else {
        toast.error("You must be logged in to comment.");
        setIsSubmitting(false);
        return;
      }

      await axiosInstance.post(`/game/${id}/comments`, {
        content: comment,
        userId: userId,
      });

      toast.success("Comment posted successfully!");
      setComment("");
      fetchComments(); // This already sets newCommentsCount to 0
    } catch (error: any) {
      console.error("Failed to submit comment", error);
      toast.error(error.response?.data?.message || "Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    try {
      const userData = localStorage.getItem("userData");
      if (!userData) {
        toast.warning("You must be logged in to like comments.");
        return;
      }
      
      const parsedData = JSON.parse(userData);
      const userId = parsedData.id;
      
      await axiosInstance.post(`/game/comments/${commentId}/like`, { userId });
      toast.success("You liked this comment!");
      
      // Update the UI optimistically
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes: (comment.likes || 0) + 1 } 
            : comment
        )
      );
    } catch (error) {
      console.error("Failed to like comment", error);
      toast.error("Failed to like comment. Please try again.");
    }
  };
  
  const handleReportComment = async (commentId: number) => {
    try {
      const userData = localStorage.getItem("userData");
      if (!userData) {
        toast.warning("You must be logged in to report comments.");
        return;
      }
      
      const parsedData = JSON.parse(userData);
      const userId = parsedData.id;
      
      await axiosInstance.post(`/game/comments/${commentId}/report`, { 
        userId,
        reason: "Inappropriate content" // Default reason
      });
      
      toast.success("Comment reported. Thank you for helping keep our community safe.");
    } catch (error) {
      console.error("Failed to report comment", error);
      toast.error("Failed to report comment. Please try again.");
    }
  };

  const handleRate = async (rating: number) => {
    if (hasRated) {
      setTempRating(rating);
      setShowRateAgainPopup(true);
      return;
    }

    await submitRating(rating);
    setIsRatingPopupOpen(true); // Show the rating popup after rating
  };

  const submitRating = async (rating: number) => {
    try {
      let userId = 0;
      const userData = localStorage.getItem("userData");
      if (!userData) {
        toast.warning("You must be logged in to rate games.");
        return;
      }
      
      const parsedData = JSON.parse(userData);
      userId = parsedData.id;
      
      const response = await axiosInstance.post(`/game/${id}/ratings`, {
        score: rating,
        userId: userId
      });
      
      setUserRating(rating);
      setHasRated(true); // Set hasRated to true after rating
      toast.success("Thank you for rating this game!");
      setIsRatingPopupOpen(false);
      
      // Optionally refresh game data to show updated average rating
      const gameResponse = await axiosInstance.get(`/game/${id}`);
      setGame(gameResponse.data);
    } catch (error: any) {
      console.error("Failed to submit rating", error);
      if (error.response) {
        // Server responded with a status other than 200 range
        toast.error(`Failed to submit rating: ${error.response.data.message || "Server error"}`);
      } else if (error.request) {
        // Request was made but no response received
        toast.error("Failed to submit rating: No response from server");
      } else {
        // Something else happened while setting up the request
        toast.error(`Failed to submit rating: ${error.message}`);
      }
    }
  };

  const confirmRateAgain = async () => {
    if (tempRating !== null) {
      await submitRating(tempRating);
    }
    setShowRateAgainPopup(false);
  };

  function handleClick(): void {
    navigate(`/game/${id}`)
  }

  const toggleRatingPopup = () => {
    if (hasRated) {
      setShowRateAgainPopup(true);
    } else {
      setIsRatingPopupOpen((prev) => !prev);
    }
  };

  if (loading) return <LoadingScreen fadeIn={fadeIn} fadeOut={fadeOut} />
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#3A3A3A] max-w-md">
        <h2 className="text-xl text-[#B39C7D] mb-2">Error</h2>
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-[#B39C7D] text-white px-4 py-2 rounded-lg hover:bg-[#8C7A5B] transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  )

  const gameDetails = {
    genre: game.genre || "Adventure, RPG",
    developer: game.userId || "Game Studio",
    releaseDate: game.releaseDate || "2025",
    platform: game.platform || "Web Browser",
    playTime: game.playTime || "10-15 hours",
    difficulty: game.difficulty || "Medium",
    ...game,
  }

  const getGameImage = () => {
    if (game.image_data) return `${import.meta.env.VITE_BACKEND_URL}${game.image_data}`
    return game.imageUrl || "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=1200&h=800&fit=crop"
  }

  return (
    <div className="min-h-screen bg-gray-900 bg-cover bg-center bg-[url('/UserBG.svg')] text-white pb-16">
      <Navbar />
      {/* <Sidebar /> */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ 
          position: "fixed", 
          zIndex: 9999,
          bottom: "20px",
          right: "20px"
        }}
      />
      <div className="container mx-auto px-4 pt-24 md:pt-28">
        <div className="relative rounded-2xl overflow-hidden border-2 border-[#634630] shadow-lg mb-8 h-[400px] md:h-[500px]">
          <div className="absolute inset-0">
            <img src={getGameImage()} alt={game.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl md:text-5xl font-bold font-cinzel text-[#C9B57B] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-2">
                  {game.title}
                </h1>
                <p className="text-lg text-white/90 max-w-2xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2 md:line-clamp-3">
                  {game.description}
                </p>
              </div>
              <div className="flex flex-col items-end gap-4">
                <div className="flex items-center gap-6 bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-white">{game.rating ? game.rating.toFixed(1) : 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <span>{game.commentsCount || 0}</span>
                  </div>
                  {/* <div className="flex items-center gap-1">
                    <Heart className="w-5 h-5 text-red-400" />
                    <span>{game.favorites || 0}</span>
                  </div> */}
                </div>
                <div className="flex flex-row items-center gap-4 relative">
                  <div className="relative" ref={popupRef}>
                    {/* <button
                      className="bg-[#B39C7D] hover:bg-[#8C7A5B] text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-lg md:order-1 order-1"
                      onClick={toggleRatingPopup}
                    >
                      
                      <span className="hidden md:inline">Rate Game</span>
                      <span className="md:hidden">Rate</span>
                    </button> */}
                    {!hasRated && isRatingPopupOpen && (
                      <div className="absolute bottom-full mb-2 right-0 bg-black/90 p-4 rounded-lg shadow-lg flex items-center gap-2 z-10">
                        <p className="text-white">You rated this game {userRating} stars.</p>
                        <button
                          onClick={() => setShowRateAgainPopup(true)}
                          className="bg-[#B39C7D] hover:bg-[#8C7A5B] text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                        >
                          Rate Again
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    className="bg-[#B39C7D] hover:bg-[#8C7A5B] text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-lg md:order-1 order-1"
                    onClick={handleClick}
                  >
                    <span>Play Game</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-b border-[#3A3A3A] mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-3 text-lg font-medium transition-all duration-200 ${
                activeTab === "details" ? "text-[#B39C7D] border-b-2 border-[#B39C7D]" : "text-white/70 hover:text-white"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`px-6 py-3 text-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === "comments"
                  ? "text-[#B39C7D] border-b-2 border-[#B39C7D]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Comments
              {comments.length > 0 && (
                <span className="bg-[#B39C7D] text-[#1E1E1E] px-2 py-0.5 rounded-full text-xs font-bold">
                  {initialCommentCount + newCommentsCount > initialCommentCount 
                    ? initialCommentCount + newCommentsCount 
                    : comments.length}
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="bg-[#1e1e1e]/80 rounded-xl p-6 shadow-lg border border-[#3A3A3A]">
          {activeTab === "details" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#B39C7D] mb-4 font-cinzel">About the Game</h2>
                <p className="text-white/90 leading-relaxed text-lg">{game.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* <h3 className="text-xl font-bold text-[#B39C7D] font-cinzel">Game Information</h3> */}
                  <div className="grid grid-cols-1 gap-4">
                    
                    <div className="flex items-start gap-3">
                      <br></br>
                      <br></br>
                      <div className="ml-5">
                        <h3 className="text-xl font-bold text-[#B39C7D] font-cinzel">Game Information</h3>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Tag className="w-5 h-5 text-[#B39C7D] mt-0.5" />
                      <div>
                        <h4 className="text-white/60 text-sm">Genre</h4>
                        <p className="text-white">{gameDetails.genre}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-[#B39C7D] mt-0.5" />
                      <div>
                        <h4 className="text-white/60 text-sm">Developer</h4>
                        <p className="text-white">{gameDetails.developer}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-[#B39C7D] mt-0.5" />
                      <div>
                        <h4 className="text-white/60 text-sm">Release Date</h4>
                        <p className="text-white">{gameDetails.releaseDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  {/* <h3 className="text-xl font-bold text-[#B39C7D] font-cinzel">Gameplay</h3> */}
                  <div className="grid grid-cols-1 gap-4">

                    <div className="flex items-start gap-3">
                    <br></br>
                    <br></br>
                      <div>
                        <div className="ml-5">
                          <h3 className="text-xl font-bold text-[#B39C7D] font-cinzel">Gameplay</h3>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-[#B39C7D] mt-0.5" />
                      <div>
                        <h4 className="text-white/60 text-sm">Difficulty</h4>
                        <p className="text-white">{gameDetails.difficulty}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#B39C7D] mt-0.5" />
                      <div>
                        <h4 className="text-white/60 text-sm">Average Play Time</h4>
                        <p className="text-white">{gameDetails.playTime}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 flex items-center justify-center text-[#B39C7D] mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="6" width="20" height="12" rx="2" />
                          <path d="M12 12h.01" />
                          <path d="M7 12h.01" />
                          <path d="M17 12h.01" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white/60 text-sm">Platform</h4>
                        <p className="text-white">{gameDetails.platform}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {game.screenshots && game.screenshots.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-[#B39C7D] mb-4 font-cinzel">Screenshots</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {game.screenshots.map((screenshot: string, index: number) => (
                      <img
                        key={index}
                        src={screenshot || "/placeholder.svg"}
                        alt={`${game.title} screenshot ${index + 1}`}
                        className="rounded-lg w-full h-48 object-cover border border-[#3A3A3A] hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === "comments" && (
            <div ref={commentsRef} className="max-w-full overflow-hidden">
              <h2 className="text-2xl font-bold text-[#B39C7D] mb-6 font-playfair">Comments</h2>

              {/* Comment submission form */}
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="mb-4">
                  <textarea
                    placeholder="Share your thoughts about this game..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-4 bg-[#2a1810]/80 border border-[#3a2a20] rounded-lg focus:outline-none focus:border-[#B39C7D] focus:ring-1 focus:ring-[#B39C7D] transition-all resize-none font-playfair"
                    rows={4}
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-end mt-2">
                    <p className="text-sm text-gray-400 font-playfair">
                      {comment.length}/1000 characters
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className={`bg-[#B39C7D] text-white px-6 py-2 rounded-lg hover:bg-[#8C7A5B] transition-colors font-medium font-playfair flex items-center gap-2 ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    disabled={isSubmitting || !comment.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        Posting...
                      </>
                    ) : (
                      'Post Comment'
                    )}
                  </button>
                </div>
              </form>

              {/* New comments notification */}
              {newCommentsCount > 0 && (
                <div 
                  className="mb-6 p-3 bg-[#B39C7D] text-[#1E1E1E] rounded-lg font-medium font-playfair text-center cursor-pointer hover:bg-[#C9B57B] transition-colors shadow-lg"
                  onClick={refreshComments}
                >
                  {newCommentsCount === 1 
                    ? "There's a new comment. Click to refresh." 
                    : `There are ${newCommentsCount} new comments. Click to refresh.`}
                </div>
              )}

              {/* Comments list */}
              <div className="space-y-4 max-w-full">
                {comments.length > 0 ? (
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="relative bg-[#2a1810]/80 rounded-lg p-5 shadow-lg border border-[#3a2a20] hover:border-[#B39C7D] transition-colors duration-300 overflow-hidden"
                      >
                        <div className="flex items-start mb-4">
                          <div className="w-10 h-10 rounded-full bg-[#634630] flex items-center justify-center text-[#C8A97E] font-bold text-xl mr-3">
                            {comment.User?.username.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <h4 className="text-[#C8A97E] font-medium font-playfair">{comment.User?.username || 'Anonymous'}</h4>
                                <span className="text-gray-400 text-xs">
                                  <span title={new Date(comment.createdAt).toLocaleString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric'
                                  })}>
                                    {(() => {
                                      const commentDate = new Date(comment.createdAt);
                                      const now = new Date();
                                      const diffTime = Math.abs(now.getTime() - commentDate.getTime());
                                      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                                      
                                      if (diffDays === 0) {
                                        return 'Today';
                                      } else if (diffDays === 1) {
                                        return 'Yesterday';
                                      } else {
                                        return `${diffDays} days ago`;
                                      }
                                    })()}
                                  </span>
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                <button 
                                  onClick={() => handleLikeComment(comment.id)}
                                  className="text-gray-400 hover:text-[#C8A97E] transition-colors p-1 rounded-full hover:bg-[#C8A97E]/10"
                                  title="Like this comment"
                                >
                                  <Heart className="h-5 w-5" />
                                  {(comment.likes && comment.likes > 0) && (
                                    <span className="text-xs ml-1">{comment.likes}</span>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleReportComment(comment.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-500/10"
                                  title="Report this comment"
                                >
                                  <Flag className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="pl-12 pr-4">
                          <p className="text-white/90 text-justify font-playfair break-words whitespace-pre-wrap max-w-full">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-64 bg-[#2a1810]/60 rounded-lg border border-[#3a2a20]">
                    <div className="text-[#B39C7D]/80 text-center">
                      <MessageSquare className="mx-auto mb-4 text-4xl text-[#B39C7D]" />
                      <p className="text-xl font-playfair mb-2">No comments yet</p>
                      <p className="text-gray-400 font-playfair">Be the first to share your thoughts on this game!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {showRateAgainPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#3A3A3A] max-w-md text-center">
            <h2 className="text-xl text-[#B39C7D] mb-4">Rate Again</h2>
            <p className="text-white mb-4">You have already rated this game. Would you like to rate it again?</p>
            <div className="flex justify-center gap-4 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setTempRating(star)}
                  className={`w-8 h-8 flex items-center justify-center ${
                    tempRating && tempRating >= star ? 'text-yellow-400' : 'text-gray-400'
                  } hover:text-yellow-400 transition-colors duration-200`}
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    className="w-6 h-6"
                    fill={tempRating && tempRating >= star ? 'currentColor' : 'none'}
                  />
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowRateAgainPopup(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRateAgain}
                className="bg-[#B39C7D] text-white px-4 py-2 rounded-lg hover:bg-[#8C7A5B] transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameDetails;
