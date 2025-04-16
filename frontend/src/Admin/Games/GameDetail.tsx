"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Edit, Trash, Power, Save } from "lucide-react"
import axiosInstance from "../../../config/axiosConfig"
import { toast } from "react-toastify"
import Loader from "./Loader"

interface Game {
  id: number
  title: string
  genre: string
  description?: string
  createdAt: string
  status?: string
  UserId: number
  creator?: string
  private?: boolean
  image_data?: string
  slug?: string
  subgenre?: string
  updatedAt?: string
  primary_color?: string
  prompt_name?: string
  prompt_model?: string
  prompt_text?: string
  image_prompt_name?: string
  image_prompt_model?: string
  image_prompt_text?: string
  music_prompt_text?: string
  music_prompt_seed_image?: string
  tagline?: string
  [key: string]: any
}

interface GameDetailsProps {
  gameId: number
  onBack: () => void
  onGameUpdated?: () => void
  onGameDeleted?: (gameId: number) => void
  onStatusToggled?: (gameId: number, newStatus: string) => void
}

const GameDetails = ({ gameId, onBack, onGameUpdated, onGameDeleted, onStatusToggled }: GameDetailsProps) => {
  const [game, setGame] = useState<Game | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedGame, setEditedGame] = useState<Game | null>(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [deleteEnabled, setDeleteEnabled] = useState(false)
  const [showStatusConfirmation, setShowStatusConfirmation] = useState(false)

  useEffect(() => {
    fetchGameDetails()
  }, [gameId])

  useEffect(() => {
    if (game && confirmText === game.title) {
      setDeleteEnabled(true)
    } else {
      setDeleteEnabled(false)
    }
  }, [confirmText, game])

  const fetchGameDetails = async () => {
    setIsLoading(true)
    try {
      console.log(`Fetching game details for ID: ${gameId}`)
      const response = await axiosInstance.get(`/api/games/${gameId}`)
      console.log("Game details fetched successfully:", response.data)
      setGame(response.data)
      setEditedGame(response.data)
    } catch (error) {
      console.error("Error fetching game details:", error)
      toast.error("Failed to load game details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editedGame) return

    setIsLoading(true)
    try {
      const response = await axiosInstance.put(`/api/games/${editedGame.id}`, editedGame)
      console.log("Edit API response:", response)
      setGame(editedGame)
      setIsEditing(false)
      toast.success(`Game "${editedGame.title}" updated successfully`)
      if (onGameUpdated) onGameUpdated()
    } catch (error) {
      console.error("Error updating game:", error)
      toast.error("Failed to update game")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!game) return

    setIsLoading(true)
    try {
      await axiosInstance.delete(`/api/games/${game.id}`)
      toast.success(`Game "${game.title}" deleted successfully`)
      if (onGameDeleted) onGameDeleted(game.id)
      onBack() // Go back to the list after deletion
    } catch (error) {
      console.error("Error deleting game:", error)
      toast.error("Failed to delete game")
    } finally {
      setIsLoading(false)
      setShowDeleteConfirmation(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!game) return

    const newStatus = game.status === "active" ? "inactive" : "active"
    setIsLoading(true)
    try {
      await axiosInstance.put(`/api/games/${game.id}`, {
        ...game,
        status: newStatus,
      })

      // Update the local game object
      const updatedGame = { ...game, status: newStatus }
      setGame(updatedGame)

      toast.success(`Game "${game.title}" is now ${newStatus}`)
      if (onStatusToggled) onStatusToggled(game.id, newStatus)
    } catch (error) {
      console.error("Error toggling status:", error)
      toast.error("Failed to update game status")
    } finally {
      setIsLoading(false)
      setShowStatusConfirmation(false)
    }
  }

  if (isLoading && !game) {
    return (
      <div className="p-6 bg-[#2F2118] text-[#F0E6DB] min-h-screen">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </button>
        </div>
        <Loader message="Loading game details..." />
      </div>
    )
  }

  if (!game) {
    return (
      <div className="p-6 bg-[#2F2118] text-[#F0E6DB] min-h-screen">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </button>
        </div>
        <div className="bg-[#1E1512] p-8 rounded-lg text-center">
          <p className="text-xl">Game not found or failed to load</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-[#2F2118] text-[#F0E6DB] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </button>

        <div className="flex gap-2">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#C0A080] hover:bg-[#D5B591] text-[#2F2118] rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => setShowStatusConfirmation(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors"
              >
                <Power className="w-4 h-4" />
                {game.status === "active" ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => setShowDeleteConfirmation(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition-colors"
              >
                <Trash className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-cinzel font-bold mb-2">{game.title}</h1>
        <p className="text-[#8B7355]">Game Details</p>
      </div>

      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Basic info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                  value={editedGame?.title || ""}
                  onChange={(e) => setEditedGame({ ...editedGame!, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Slug</label>
                <input
                  type="text"
                  name="slug"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                  value={editedGame?.slug || ""}
                  onChange={(e) => setEditedGame({ ...editedGame!, slug: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Genre *</label>
                <select
                  name="genre"
                  required
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                  value={editedGame?.genre || ""}
                  onChange={(e) => setEditedGame({ ...editedGame!, genre: e.target.value })}
                >
                  <option value="RPG">RPG</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Horror">Horror</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Romance">Romance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Status</label>
                <select
                  name="status"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                  value={editedGame?.status || "active"}
                  onChange={(e) => setEditedGame({ ...editedGame!, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Right column - Content */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Description</label>
                <textarea
                  name="description"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none h-24"
                  value={editedGame?.description || ""}
                  onChange={(e) => setEditedGame({ ...editedGame!, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Visibility</label>
                <select
                  name="private"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                  value={editedGame?.private ? "true" : "false"}
                  onChange={(e) => setEditedGame({ ...editedGame!, private: e.target.value === "true" })}
                >
                  <option value="false">Public</option>
                  <option value="true">Private</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Prompt Text</label>
                <textarea
                  name="prompt_text"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none h-24"
                  value={editedGame?.prompt_text || ""}
                  onChange={(e) => setEditedGame({ ...editedGame!, prompt_text: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-[#6A4E32]/50">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#C0A080] hover:bg-[#D5B591] text-[#2F2118] rounded-lg transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Basic info and image */}
          <div className="space-y-4">
            {game.image_data && (
              <div className="mb-4">
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL || ""}${game.image_data}`}
                  alt={game.title}
                  className="w-full h-auto rounded-lg object-cover border-2 border-[#6A4E32]"
                  onError={(e) => {
                    console.error("Error loading image:", e)
                    // Use type assertion to access src property
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=300&width=500"
                  }}
                />
              </div>
            )}

            <div className="bg-[#1E1512] p-4 rounded-lg">
              <h3 className="font-cinzel text-[#C0A080] mb-2">Basic Information</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-[#8B7355]">ID</p>
                  <p className="text-[#F0E6DB]">{game.id}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Slug</p>
                  <p className="text-[#F0E6DB]">{game.slug}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Genre</p>
                  <p className="text-[#F0E6DB]">{game.genre}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Subgenre</p>
                  <p className="text-[#F0E6DB]">{game.subgenre || "None"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Status</p>
                  <p className="text-[#F0E6DB]">{game.status || "Active"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Visibility</p>
                  <p className="text-[#F0E6DB]">{game.private ? "Private" : "Public"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Created</p>
                  <p className="text-[#F0E6DB]">{new Date(game.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Updated</p>
                  <p className="text-[#F0E6DB]">{game.updatedAt ? new Date(game.updatedAt).toLocaleString() : "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Creator ID</p>
                  <p className="text-[#F0E6DB]">{game.UserId}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Creator</p>
                  <p className="text-[#F0E6DB]">{game.creator || "Unknown"}</p>
                </div>
                {game.primary_color && (
                  <div>
                    <p className="text-xs text-[#8B7355]">Primary Color</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-white"
                        style={{ backgroundColor: game.primary_color }}
                      ></div>
                      <p className="text-[#F0E6DB]">{game.primary_color}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#1E1512] p-4 rounded-lg">
              <h3 className="font-cinzel text-[#C0A080] mb-2">Description</h3>
              <p className="text-[#F0E6DB] whitespace-pre-wrap">{game.description || "No description available"}</p>
            </div>

            {game.tagline && (
              <div className="bg-[#1E1512] p-4 rounded-lg">
                <h3 className="font-cinzel text-[#C0A080] mb-2">Tagline</h3>
                <p className="text-[#F0E6DB] italic">"{game.tagline}"</p>
              </div>
            )}
          </div>

          {/* Right column - Prompt information */}
          <div className="space-y-4">
            <div className="bg-[#1E1512] p-4 rounded-lg">
              <h3 className="font-cinzel text-[#C0A080] mb-2">Prompt Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#8B7355]">Prompt Name</p>
                  <p className="text-[#F0E6DB]">{game.prompt_name || "Default"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Prompt Model</p>
                  <p className="text-[#F0E6DB]">{game.prompt_model || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Prompt Text</p>
                  <div className="bg-[#3D2E22] p-3 rounded-md mt-1 max-h-40 overflow-y-auto">
                    <p className="text-[#F0E6DB] text-sm whitespace-pre-wrap">
                      {game.prompt_text || "No prompt text available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1E1512] p-4 rounded-lg">
              <h3 className="font-cinzel text-[#C0A080] mb-2">Image Prompt Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#8B7355]">Image Prompt Name</p>
                  <p className="text-[#F0E6DB]">{game.image_prompt_name || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Image Prompt Model</p>
                  <p className="text-[#F0E6DB]">{game.image_prompt_model || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Image Prompt Text</p>
                  <div className="bg-[#3D2E22] p-3 rounded-md mt-1">
                    <p className="text-[#F0E6DB] text-sm">{game.image_prompt_text || "No image prompt available"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1E1512] p-4 rounded-lg">
              <h3 className="font-cinzel text-[#C0A080] mb-2">Music Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#8B7355]">Music Prompt Text</p>
                  <div className="bg-[#3D2E22] p-3 rounded-md mt-1">
                    <p className="text-[#F0E6DB] text-sm">{game.music_prompt_text || "No music prompt available"}</p>
                  </div>
                </div>
                {game.music_prompt_seed_image && (
                  <div>
                    <p className="text-xs text-[#8B7355]">Music Prompt Seed Image</p>
                    <p className="text-[#F0E6DB]">{game.music_prompt_seed_image}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
          <div className="bg-[#2F2118] p-6 rounded-xl max-w-md mx-4">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-red-400">
                <Trash className="w-6 h-6" />
                <h2 className="text-xl font-cinzel">Confirm Deletion</h2>
              </div>

              <div className="space-y-4">
                <p className="text-[#F0E6DB]">
                  Are you sure you want to delete the game <span className="font-semibold">{game.title}</span>?
                </p>

                <div className="bg-red-900/20 p-3 rounded-lg border border-red-800/30">
                  <p className="text-red-300 text-sm">
                    <strong>Warning:</strong> This action cannot be undone. All game data, including prompts, images,
                    and user progress will be permanently deleted.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-cinzel text-[#C0A080] mb-2">
                    Type <span className="font-semibold">{game.title}</span> to confirm:
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                    placeholder="Type game title here"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-[#6A4E32]/50">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={!deleteEnabled}
                  className={`px-4 py-2 ${
                    deleteEnabled
                      ? "bg-red-700 hover:bg-red-800 text-white"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  } rounded-lg transition-colors`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Toggle Confirmation Dialog */}
      {showStatusConfirmation && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
          <div className="bg-[#2F2118] p-6 rounded-xl max-w-md mx-4">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-[#C0A080]">
                <Power className="w-6 h-6" />
                <h2 className="text-xl font-cinzel">Confirm Status Change</h2>
              </div>

              <p className="text-[#F0E6DB]">
                Are you sure you want to change the status of <span className="font-semibold">{game.title}</span> from{" "}
                <span className="font-semibold">{game.status}</span> to{" "}
                <span className="font-semibold">{game.status === "active" ? "inactive" : "active"}</span>?
              </p>

              <div className="flex justify-end space-x-4 pt-4 border-t border-[#6A4E32]/50">
                <button
                  onClick={() => setShowStatusConfirmation(false)}
                  className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleToggleStatus}
                  className="px-4 py-2 bg-[#C0A080] hover:bg-[#D5B591] text-[#2F2118] rounded-lg transition-colors"
                >
                  {game.status === "active" ? "Deactivate" : "Activate"} Game
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameDetails
