"use client"

import type React from "react"
import { useState, useEffect } from "react"
import "tailwindcss/tailwind.css"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import YourComments from "../profile/components/YourComments.tsx"
import axiosInstance from "../../config/axiosConfig"
import { Calendar, Users, Tag, Star, MessageSquare, Heart, Award, Clock } from "lucide-react"

const GameDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [game, setGame] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("details")
  const [comment, setComment] = useState("")

  useEffect(() => {
    if (!id) {
      setError("Invalid game ID.")
      setLoading(false)
      return
    }

    axiosInstance
      .get(`/game/${id}`)
      .then((response) => {
        setGame(response.data)
        setLoading(false)
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Failed to fetch game details")
        setLoading(false)
      })
  }, [id])

  function handleClick(): void {
    navigate(`/game/${id}`)
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    try {
      let userId = 0
      const userData = localStorage.getItem("userData")
      if (userData) {
        try {
          const parsedData = JSON.parse(userData)
          if (parsedData.id) {
            userId = parsedData.id
          }
        } catch (error) {
          console.error("Error parsing userData from localStorage:", error)
        }
      }

      await axiosInstance.post(`/game/${id}/comments`, {
        content: comment,
        userId: userId,
      })

      setComment("")
      // Optionally, refresh comments or update the UI
    } catch (error) {
      console.error("Failed to submit comment", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-[#B39C7D] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#B39C7D]">Loading game details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
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
  }

  // Mock data for additional game details if not provided by API
  const gameDetails = {
    genre: game.genre || "Adventure, RPG",
    developer: game.developer || "Game Studio",
    releaseDate: game.releaseDate || "2023",
    platform: game.platform || "Web Browser",
    playTime: game.playTime || "10-15 hours",
    difficulty: game.difficulty || "Medium",
    ...game,
  }

  return (
    <div className="min-h-screen bg-gray-900 bg-cover bg-center bg-[url('/UserBG.svg')] text-white pb-16">
      <Navbar />
      <Sidebar />

      <div className="container mx-auto px-4 pt-24 md:pt-28">
        {/* Game Hero Section */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-[#634630] shadow-lg mb-8 h-[400px] md:h-[500px]">
          {/* Image with gradient overlay */}
          <div className="absolute inset-0">
            <img
              src={
                game.imageUrl || "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=1200&h=800&fit=crop"
              }
              alt={game.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          </div>

          {/* Game title and short description */}
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

              {/* Stats and Play Button */}
              <div className="flex flex-col items-end gap-4">
                <div className="flex items-center gap-6 bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-white">{game.rating || "4.5"}</span>
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

                <button
                  className="bg-[#B39C7D] hover:bg-[#8C7A5B] text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-lg"
                  onClick={handleClick}
                >
                  <span>Play Game</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-[#3A3A3A] mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-3 text-lg font-medium transition-all duration-200 ${
                activeTab === "details"
                  ? "text-[#B39C7D] border-b-2 border-[#B39C7D]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`px-6 py-3 text-lg font-medium transition-all duration-200 ${
                activeTab === "comments"
                  ? "text-[#B39C7D] border-b-2 border-[#B39C7D]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Comments
            </button>
          </div>
        </div>

        {/* Tab Content */}
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
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

              {/* Screenshots or additional content could go here */}
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

