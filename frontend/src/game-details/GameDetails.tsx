import type React from "react"
import { useState, useEffect, useRef } from "react"
import "tailwindcss/tailwind.css"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import YourComments from "../profile/components/YourComments.tsx"
import axiosInstance from "../../config/axiosConfig"
import { Calendar, Users, Tag, Star, MessageSquare, Heart, Award, Clock } from "lucide-react"
import LoadingScreen from '../components/LoadingScreen';

const GameDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [game, setGame] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("details")
  const [comment, setComment] = useState("")
  const [fadeIn, setFadeIn] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [isRatingPopupOpen, setIsRatingPopupOpen] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) {
      setError("Invalid game ID.")
      setLoading(false)
      return
    }

    const fetchGameDetails = async () => {
      try {
        const response = await axiosInstance.get(`/game/${id}`)
        setGame(response.data)
        setTimeout(() => setLoading(false), 2000) // Minimum loading time
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
        }
      } catch (error: any) {
        console.error("Failed to fetch user rating:", error)
        setUserRating(null)
      }
    }

    fetchGameDetails()
    fetchUserRating()
  }, [id])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsRatingPopupOpen(false)
      }
    }

    if (isRatingPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isRatingPopupOpen])

  const handleClick = () => navigate(`/game/${id}`)

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    try {
      let userId = 0
      const userData = localStorage.getItem("userData")
      if (userData) {
        const parsedData = JSON.parse(userData)
        if (parsedData.id) userId = parsedData.id
      }

      await axiosInstance.post(`/game/${id}/comments`, { content: comment, userId })
      setComment("")
    } catch (error) {
      console.error("Failed to submit comment:", error)
    }
  }

  const handleRate = async (rating: number) => {
    setIsRatingPopupOpen(false)
    try {
      let userId = 0
      const userData = localStorage.getItem("userData")
      if (userData) {
        const parsedData = JSON.parse(userData)
        if (parsedData.id) userId = parsedData.id
      }
  
      const response = await axiosInstance.post(`/game/${id}/ratings`, {
        score: rating,
        userId,
      })
  
      setUserRating(response.data.score)
      console.log("Rating submitted:", response.data)
  
      const gameResponse = await axiosInstance.get(`/game/${id}`)
      console.log("Updated game data:", gameResponse.data) // Debug
      setGame(gameResponse.data)
    } catch (error) {
      console.error("Failed to submit rating:", error)
      setGame((prevGame: any) => {
        const currentRatings = prevGame.rating ? prevGame.rating * (prevGame.ratingCount || 1) : 0
        const newRatingCount = (prevGame.ratingCount || 1) + 1
        const newAverage = (currentRatings + rating) / newRatingCount
        console.log("Fallback rating:", newAverage) // Debug
        return { ...prevGame, rating: newAverage, ratingCount: newRatingCount }
      })
    }
  }

  const toggleRatingPopup = () => setIsRatingPopupOpen((prev) => !prev)

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
    developer: game.developer || "Game Studio",
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
      <Sidebar />
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
                  <div className="flex items-center gap-1">
                    <Heart className="w-5 h-5 text-red-400" />
                    <span>{game.favorites || 0}</span>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-4 relative">
                  <div className="relative" ref={popupRef}>
                    <button
                      className="bg-[#B39C7D] hover:bg-[#8C7A5B] text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-lg md:order-1 order-1"
                      onClick={toggleRatingPopup}
                    >
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="hidden md:inline">Rate Game</span>
                      <span className="md:hidden">Rate</span>
                    </button>
                    {isRatingPopupOpen && (
                      <div className="absolute bottom-full mb-2 right-0 bg-black/90 p-4 rounded-lg shadow-lg flex items-center gap-2 z-10">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRate(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(null)}
                            className={`w-8 h-8 flex items-center justify-center ${
                              (hoveredRating && hoveredRating >= star) || (userRating && userRating >= star && !hoveredRating)
                                ? 'text-yellow-400'
                                : 'text-gray-400'
                            } hover:text-yellow-400 transition-colors duration-200`}
                            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                          >
                            <Star
                              className="w-6 h-6"
                              fill={
                                (hoveredRating && hoveredRating >= star) || (userRating && userRating >= star && !hoveredRating)
                                  ? 'currentColor'
                                  : 'none'
                              }
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    className="bg-[#B39C7D] hover:bg-[#8C7A5B] text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-lg md:order-2 order-2"
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
              className={`px-6 py-3 text-lg font-medium transition-all duration-200 ${
                activeTab === "comments" ? "text-[#B39C7D] border-b-2 border-[#B39C7D]" : "text-white/70 hover:text-white"
              }`}
            >
              Comments
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
                  <h3 className="text-xl font-bold text-[#B39C7D] font-cinzel">Game Information</h3>
                  <div className="grid grid-cols-1 gap-4">
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
                  <h3 className="text-xl font-bold text-[#B39C7D] font-cinzel">Gameplay</h3>
                  <div className="grid grid-cols-1 gap-4">
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
            <div>
              <h2 className="text-2xl font-bold text-[#B39C7D] mb-6 font-cinzel">Comments</h2>
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="mb-4">
                  <textarea
                    placeholder="Share your thoughts about this game..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-4 bg-[#2a2a2a] text-white border border-[#3A3A3A] rounded-lg focus:outline-none focus:border-[#B39C7D] focus:ring-1 focus:ring-[#B39C7D] transition-all resize-none"
                    rows={4}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#B39C7D] text-white px-6 py-2 rounded-lg hover:bg-[#8C7A5B] transition-colors font-medium"
                    disabled={!comment.trim()}
                  >
                    Post Comment
                  </button>
                </div>
              </form>
              <div className="space-y-4">
                <YourComments />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GameDetails;