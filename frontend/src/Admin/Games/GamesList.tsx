"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Plus, Edit, Trash, ChevronUp, ChevronDown, Eye, Sliders, Save, ChevronLeft, Search, Image as ImageIcon, EyeOff, Users, Calendar } from "lucide-react"
import axiosInstance from "../../../config/axiosConfig"
import Modal from "react-modal"
import Loader from "./Loader"
import { motion, AnimatePresence } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"

interface Game {
  id: number
  title: string
  genre: string
  description?: string
  createdAt: string
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
  tagline?: string
  [key: string]: any
}

interface User {
  id: number
  username: string
}

interface GamesListProps {
  onViewGame?: (gameId: number) => void
  refreshTrigger?: number
}

const GamesList: React.FC<GamesListProps> = ({ onViewGame, refreshTrigger = 0 }) => {
  const [games, setGames] = useState<Game[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [genreFilter, setGenreFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "title",
    direction: "asc",
  })
  const [showModal, setShowModal] = useState(false)
  const [selectedGames, setSelectedGames] = useState<number[]>([])
  const [newGame, setNewGame] = useState({
    title: "",
    genre: "RPG",
    description: "",
    prompt: "",
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [titleFilter, setTitleFilter] = useState("")
  const [creatorFilter, setCreatorFilter] = useState("")
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null)
  const [showBulkDeleteConfirmation, setShowBulkDeleteConfirmation] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedGameDetails, setSelectedGameDetails] = useState<Game | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editGameData, setEditGameData] = useState<Game | null>(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [gameToToggleStatus, setGameToToggleStatus] = useState<Game | null>(null)
  const [isViewingGameDetails, setIsViewingGameDetails] = useState(false)
  const [viewedGameDetails, setViewedGameDetails] = useState<Game | null>(null)
  const [showEnlargedImage, setShowEnlargedImage] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [isDeletingDetails, setIsDeletingDetails] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [deleteEnabled, setDeleteEnabled] = useState(false)

  const isMounted = useRef(true)

  const safelySetModalState = (
    modalToOpen: "view" | "edit" | "delete" | "bulkDelete" | "status" | "new" | null,
    data: any = null,
  ) => {
    console.log(`Attempting to open modal: ${modalToOpen}`, data)

    setShowViewModal(false)
    setShowEditModal(false)
    setShowDeleteConfirmation(false)
    setShowBulkDeleteConfirmation(false)
    setShowStatusModal(false)
    setShowModal(false)

    console.log("All modals closed")

    if (modalToOpen === "view" && data) {
      setSelectedGameDetails(data)
    } else if (modalToOpen === "edit" && data) {
      setEditGameData(data)
    } else if (modalToOpen === "delete" && data) {
      setGameToDelete(data)
    } else if (modalToOpen === "status" && data) {
      setGameToToggleStatus(data)
    }

    switch (modalToOpen) {
      case "view":
        setShowViewModal(true)
        console.log("View modal opened")
        break
      case "edit":
        setShowEditModal(true)
        console.log("Edit modal opened")
        break
      case "delete":
        setShowDeleteConfirmation(true)
        console.log("Delete confirmation modal opened")
        break
      case "bulkDelete":
        setShowBulkDeleteConfirmation(true)
        console.log("Bulk delete confirmation modal opened")
        break
      case "status":
        setShowStatusModal(true)
        console.log("Status toggle modal opened")
        break
      case "new":
        setShowModal(true)
        console.log("New game modal opened")
        break
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      Modal.setAppElement("#root")
      console.log("Modal app element set to #root")
    }

    return () => {
      isMounted.current = false
      console.log("Component unmounting, isMounted set to false")
    }
  }, [])

  const allSelected = selectedGames.length === games.length

  const toggleSelectAll = () => {
    setSelectedGames(allSelected ? [] : games.map((game) => game.id))
  }

  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchGames()
    }
  }, [refreshTrigger])

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    console.log("Fetching games data")
    setIsLoading(true)

    try {
      const [gamesResponse, usersResponse] = await Promise.all([
        axiosInstance.get("/api/games/all"),
        axiosInstance.get("/admin/users"),
      ])

      console.log("Games data fetched:", gamesResponse.data)
      console.log("Users data fetched:", usersResponse.data)

      const userMap = new Map<number, string>()
      ;(usersResponse.data || []).forEach((user: User) => {
        userMap.set(user.id, user.username)
      })

      const enrichedGames = gamesResponse.data.map((game: Game) => ({
        ...game,
        creator: userMap.get(game.UserId) || "Unknown",
      }))

      console.log("Enriched games data:", enrichedGames)
      setGames(enrichedGames)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load game data")
    } finally {
      setIsLoading(false)
      console.log("Games fetch operation completed")
    }
  }

  const handleGenreFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGenreFilter(e.target.value)
  }

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const sortedGames = [...games].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1
    return 0
  })

  const filteredGames = sortedGames.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = genreFilter === "all" || game.genre === genreFilter
    const createdDate = new Date(game.createdAt)
    const matchesStartDate = !dateRange.start || createdDate >= new Date(dateRange.start)
    const matchesEndDate = !dateRange.end || createdDate <= new Date(dateRange.end)
    const matchesTitle = !titleFilter || game.title.toLowerCase().includes(titleFilter.toLowerCase())
    const matchesCreator =
      !creatorFilter || (game.creator && game.creator.toLowerCase().includes(creatorFilter.toLowerCase()))

    return matchesSearch && matchesGenre && matchesStartDate && matchesEndDate && matchesTitle && matchesCreator
  })

  const handleNewGameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewGame({ ...newGame, [name]: value })
  }

  const handleNewGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting new game:", newGame)

    try {
      const response = await axiosInstance.post("/api/games", newGame)
      console.log("New game API response:", response)

      setShowModal(false)
      fetchGames()
      toast.success(`Game "${newGame.title}" created successfully`)
    } catch (error) {
      console.error("Error creating game:", error)
      toast.error("Failed to create game")
    }
  }

  const handleSelectGame = (id: number) => {
    setSelectedGames((prev) => (prev.includes(id) ? prev.filter((gameId) => gameId !== id) : [...prev, id]))
  }

  const confirmBulkDelete = () => {
    console.log(`Confirming bulk deletion for ${selectedGames.length} games`)

    setShowViewModal(false)
    setShowEditModal(false)
    setShowDeleteConfirmation(false)
    setShowBulkDeleteConfirmation(false)
    setShowStatusModal(false)
    setShowModal(false)

    setTimeout(() => {
      if (isMounted.current) {
        setShowBulkDeleteConfirmation(true)
        console.log("Bulk delete confirmation modal opened")
      }
    }, 50)
  }

  const handleBulkDelete = async () => {
    console.log(`Bulk deleting ${selectedGames.length} games with IDs:`, selectedGames)

    try {
      const response = await axiosInstance.delete("/api/games/bulk-delete", { data: { ids: selectedGames } })
      console.log("Bulk delete API response:", response)

      setSelectedGames([])
      fetchGames()
      toast.success(`${selectedGames.length} games deleted successfully`)
    } catch (error) {
      console.error("Error deleting games:", error)
      toast.error("Failed to delete games")
    } finally {
      setShowBulkDeleteConfirmation(false)
      console.log("Bulk delete operation completed, modal closed")
    }
  }

  const confirmDelete = (game: Game) => {
    console.log(`Confirming deletion for game: ${game.title} (ID: ${game.id})`)

    setShowViewModal(false)
    setShowEditModal(false)
    setShowDeleteConfirmation(false)
    setShowBulkDeleteConfirmation(false)
    setShowStatusModal(false)
    setShowModal(false)

    setGameToDelete(game)

    setTimeout(() => {
      if (isMounted.current) {
        setShowDeleteConfirmation(true)
        console.log("Delete confirmation modal opened")
      }
    }, 100)
  }

  const handleDelete = async () => {
    if (!gameToDelete) {
      console.log("No game to delete, aborting")
      return
    }

    setIsDeleting(true)
    console.log(`Deleting game: ${gameToDelete.title} (ID: ${gameToDelete.id})`)

    try {
      const response = await axiosInstance.delete(`/api/games/${gameToDelete.id}`)
      console.log("Delete API response:", response)

      if (isViewingGameDetails && viewedGameDetails?.id === gameToDelete.id) {
        setIsViewingGameDetails(false)
        setViewedGameDetails(null)
      }

      fetchGames()
      toast.success(`Game "${gameToDelete.title}" deleted successfully`)
    } catch (error: any) {
      console.error("Error deleting game:", error)
      const errorMessage = error.response?.data?.message || "Failed to delete game"
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirmation(false)
      setGameToDelete(null)
      console.log("Delete operation completed, modal closed")
    }
  }

  const TableHeader = ({ label, sortKey, className = "" }: { label: string; sortKey?: string; className?: string }) => (
    <th
      className={`sticky top-0 p-4 bg-[#3D2E22] font-cinzel text-center transition-colors group ${sortKey ? 'cursor-pointer hover:bg-[#534231]' : ''} ${className}`}
      onClick={sortKey ? () => handleSort(sortKey) : undefined}
      aria-sort={sortKey && sortConfig.key === sortKey ? (sortConfig.direction === "asc" ? "ascending" : "descending") : "none"}
    >
      <div className="flex items-center justify-center gap-2">
        <span className="text-[#F0E6DB]">{label}</span>
        {sortKey && (
          <span
            className={`text-[#C0A080] transition-opacity ${
              sortConfig.key === sortKey ? "opacity-100" : "opacity-0 group-hover:opacity-50"
            }`}
          >
            {sortConfig.key === sortKey ? (
              sortConfig.direction === "asc" ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )
            ) : (
              <ChevronUp className="w-4 h-4 opacity-0" />
            )}
          </span>
        )}
      </div>
    </th>
  )

  const AdvancedFilters = () => (
    <div className="bg-[#2F2118] rounded-lg border border-[#6A4E32]/50 mb-6 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Title Filter */}
        <div>
          <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Title</label>
          <input
            type="text"
            className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
            placeholder="Filter by title..."
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
          />
        </div>

        {/* Genre Filter */}
        <div>
          <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Genre</label>
          <select
            className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
            value={genreFilter}
            onChange={handleGenreFilterChange}
          >
            <option value="all">All Genres</option>
            <option value="RPG">RPG</option>
            <option value="Adventure">Adventure</option>
            <option value="Horror">Horror</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Romance">Romance</option>
          </select>
        </div>

        {/* Creator Filter */}
        <div>
          <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Creator</label>
          <input
            type="text"
            className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
            placeholder="Filter by creator..."
            value={creatorFilter}
            onChange={(e) => setCreatorFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Start Date Filter */}
        <div>
          <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Start Date</label>
          <input
            type="date"
            className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
        </div>

        {/* End Date Filter */}
        <div>
          <label className="block text-sm font-cinzel text-[#C0A080] mb-2">End Date</label>
          <input
            type="date"
            className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => {
            setTitleFilter("");
            setGenreFilter("all");
            setCreatorFilter("");
            setDateRange({ start: "", end: "" });
            setSearchTerm("");
          }}
          className="px-4 py-2 bg-[#C0A080] hover:bg-[#D5B591] text-[#2F2118] rounded-lg transition-colors font-cinzel shadow-lg"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  )

  const NewGameModal = () => (
    <Modal
      isOpen={showModal}
      onRequestClose={() => setShowModal(false)}
      className="modal-content bg-[#2F2118] p-8 rounded-xl max-w-2xl mx-4"
      overlayClassName="modal-overlay fixed inset-0 bg-black/75 flex items-center justify-center"
      ariaHideApp={false}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-[#6A4E32]/50 pb-4">
          <h2 className="text-2xl font-cinzel text-[#F0E6DB]">Create New Game</h2>
          <button onClick={() => setShowModal(false)} className="text-[#8B7355] hover:text-[#C0A080] transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleNewGameSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Title *</label>
              <input
                type="text"
                name="title"
                required
                className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                value={newGame.title}
                onChange={handleNewGameChange}
              />
            </div>

            <div>
              <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Genre *</label>
              <select
                name="genre"
                className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                value={newGame.genre}
                onChange={handleNewGameChange}
              >
                <option value="RPG">RPG</option>
                <option value="Adventure">Adventure</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Action">Action</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Primary Prompt</label>
              <textarea
                name="prompt"
                className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none h-32"
                value={newGame.prompt}
                onChange={handleNewGameChange}
              />
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end space-x-4 border-t border-[#6A4E32]/50 pt-6">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-6 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#C0A080] hover:bg-[#D5B591] text-[#2F2118] rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Game
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )

  const DeleteGameConfirmationView = () => {
    const [isDeleting, setIsDeleting] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }

      setDeleteConfirmText("")
      setDeleteEnabled(false)
    }, [])

    useEffect(() => {
      if (viewedGameDetails && deleteConfirmText === viewedGameDetails.title) {
        setDeleteEnabled(true)
      } else {
        setDeleteEnabled(false)
      }
    }, [deleteConfirmText, viewedGameDetails])

    const handleDelete = async () => {
      if (!viewedGameDetails || !deleteEnabled) return

      setIsDeleting(true)
      console.log(`Deleting game: ${viewedGameDetails.title} (ID: ${viewedGameDetails.id})`)

      try {
        const response = await axiosInstance.delete(`/api/games/${viewedGameDetails.id}`)
        console.log("Delete API response:", response)

        setGames(games.filter((game) => game.id !== viewedGameDetails.id))

        setIsViewingGameDetails(false)
        setViewedGameDetails(null)
        setIsDeletingDetails(false)

        toast.success(`Game "${viewedGameDetails.title}" deleted successfully`)
      } catch (error: any) {
        console.error("Error deleting game:", error)
        const errorMessage = error.response?.data?.message || "Failed to delete game"
        toast.error(errorMessage)

        setIsDeleting(false)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && deleteEnabled) {
        handleDelete()
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => {
              console.log("Canceling deletion, returning to game detail view")
              setIsDeletingDetails(false)
            }}
            className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Game Details
          </button>
          <h1 className="text-3xl font-cinzel font-bold text-red-500">Delete Game</h1>
        </div>

        <div className="bg-red-900/20 p-6 rounded-xl border border-red-800/30 space-y-6">
          <div className="flex items-center gap-3 text-red-400">
            <Trash className="w-6 h-6" />
            <h2 className="text-xl font-cinzel">Confirm Deletion</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-[#1E1512] rounded-lg overflow-hidden border border-[#6A4E32]">
                {viewedGameDetails?.image_data ? (
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL || ""}${viewedGameDetails.image_data}`}
                    alt={viewedGameDetails?.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Error loading image thumbnail")
                      ;(e.target as HTMLImageElement).src = "/technical-difficulties.jpg"
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#2F2118]">
                    <Trash className="w-14 h-14 text-red-500/50" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-cinzel font-bold text-2xl">{viewedGameDetails?.title}</h3>
                <p className="text-[#8B7355] text-lg">
                  {viewedGameDetails?.genre} • Created by {viewedGameDetails?.creator || "Unknown"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[#F0E6DB] text-xl mb-2">Are you sure you want to permanently delete this game?</p>
              <p className="text-red-300 text-lg font-semibold">This action cannot be undone.</p>
            </div>

            <div className="bg-red-900/30 p-5 rounded-lg border border-red-800/40">
              <p className="text-red-300 text-base flex items-start gap-2">
                <span className="text-red-400 mt-1">⚠️</span>
                <span>
                  <strong className="text-red-200">Warning:</strong> All game data, including prompts, images, and user
                  progress will be permanently deleted. Users who have played this game will lose their progress and
                  history.
                </span>
              </p>
            </div>

            <div className="mt-4">
              <label className="block text-base font-cinzel text-white mb-3">
                Type <span className="font-semibold text-red-300">{viewedGameDetails?.title}</span> to confirm:
              </label>
              <input
                ref={inputRef}
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-[#1E1512] text-[#F0E6DB] px-4 py-3 rounded-lg border-2 border-red-800/50 focus:ring-2 focus:ring-red-500 focus:outline-none text-lg"
                placeholder={`Type "${viewedGameDetails?.title}" here`}
                disabled={isDeleting}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-red-800/40">
            <button
              type="button"
              onClick={() => setIsDeletingDetails(false)}
              className="px-5 py-3 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors text-lg font-medium"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={!deleteEnabled || isDeleting}
              className={`px-5 py-3 rounded-lg transition-colors text-lg font-medium flex items-center gap-2 ${
                deleteEnabled && !isDeleting
                  ? "bg-red-700 hover:bg-red-800 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isDeleting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="w-5 h-5" />
                  Permanently Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const GameDetailView = () => {
    if (!viewedGameDetails) return <Loader message="Loading game details..." />

    const handleDeleteClick = () => {
      console.log("Opening delete confirmation view for:", viewedGameDetails.title)
      setDeleteConfirmText("")
      setDeleteEnabled(false)
      setIsDeletingDetails(true)
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={backToGamesList}
            className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Game List
          </button>
          <h1 className="text-3xl font-cinzel font-bold">Game Details: {viewedGameDetails.title}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {viewedGameDetails.image_data && (
              <div className="mb-4">
                <div
                  className="w-full aspect-[16/9] bg-[#1E1512] rounded-lg overflow-hidden border-2 border-[#6A4E32] cursor-zoom-in relative hover:opacity-95 hover:shadow-lg transition-all duration-200"
                  onClick={() => {
                    console.log("Image clicked, opening enlarged view")
                    setShowEnlargedImage(true)
                  }}
                >
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL || ""}${viewedGameDetails.image_data}`}
                    alt={viewedGameDetails.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Error loading image, using custom fallback")
                      ;(e.target as HTMLImageElement).src = "/technical-difficulties.jpg"
                    }}
                  />
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-30 transition-opacity flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-100"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-[#1E1512] p-4 rounded-lg">
              <h3 className="font-cinzel text-[#C0A080] mb-2">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8B7355]">ID</p>
                  <p className="text-[#F0E6DB]">{viewedGameDetails.id}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Slug</p>
                  <p className="text-[#F0E6DB]">{viewedGameDetails.slug || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Genre</p>
                  <p className="text-[#F0E6DB]">{viewedGameDetails.genre}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Subgenre</p>
                  <p className="text-[#F0E6DB]">{viewedGameDetails.subgenre || "None"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Created</p>
                  <p className="text-[#F0E6DB]">{new Date(viewedGameDetails.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Updated</p>
                  <p className="text-[#F0E6DB]">
                    {viewedGameDetails.updatedAt ? new Date(viewedGameDetails.updatedAt).toLocaleString() : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Creator</p>
                  <p className="text-[#F0E6DB]">
                    {viewedGameDetails.creator || "Unknown"}
                    {(!viewedGameDetails.creator || viewedGameDetails.creator === "Unknown") &&
                      `(ID: ${viewedGameDetails.UserId})`}
                  </p>
                </div>
                {viewedGameDetails.primary_color && (
                  <div>
                    <p className="text-xs text-[#8B7355]">Primary Color</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-white"
                        style={{ backgroundColor: viewedGameDetails.primary_color }}
                      ></div>
                      <p className="text-[#F0E6DB]">{viewedGameDetails.primary_color}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#1E1512] p-4 rounded-lg">
              <h3 className="font-cinzel text-[#C0A080] mb-2">Description</h3>
              <p className="text-[#F0E6DB] whitespace-pre-wrap">
                {viewedGameDetails.description || "No description available"}
              </p>
            </div>

            {viewedGameDetails.tagline && (
              <div className="bg-[#1E1512] p-4 rounded-lg">
                <h3 className="font-cinzel text-[#C0A080] mb-2">Tagline</h3>
                <p className="text-[#F0E6DB] italic">"{viewedGameDetails.tagline}"</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-[#1E1512] p-4 rounded-lg">
              <h3 className="font-cinzel text-[#C0A080] mb-2">Prompt Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#8B7355]">Prompt Name</p>
                  <p className="text-[#F0E6DB]">{viewedGameDetails.prompt_name || "Default"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Prompt Model</p>
                  <p className="text-[#F0E6DB]">{viewedGameDetails.prompt_model || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Prompt Text</p>
                  <div className="bg-[#3D2E22] p-3 rounded-md mt-1 max-h-40 overflow-y-auto">
                    <p className="text-[#F0E6DB] text-sm whitespace-pre-wrap">
                      {viewedGameDetails.prompt_text || "No prompt text available"}
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
                  <p className="text-[#F0E6DB]">{viewedGameDetails.image_prompt_name || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Image Prompt Model</p>
                  <p className="text-[#F0E6DB]">{viewedGameDetails.image_prompt_model || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355]">Image Prompt Text</p>
                  <div className="bg-[#3D2E22] p-3 rounded-md mt-1">
                    <p className="text-[#F0E6DB] text-sm">
                      {viewedGameDetails.image_prompt_text || "No image prompt available"}
                    </p>
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
                    <p className="text-[#F0E6DB] text-sm">
                      {viewedGameDetails.music_prompt_text || "No music prompt available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-[#6A4E32]/50">
          <button
            onClick={() => {
              console.log("Activating edit mode for game:", viewedGameDetails.title)
              setIsEditingDetails(true)
            }}
            className="px-4 py-2 bg-[#C0A080] hover:bg-[#D5B591] text-[#2F2118] rounded-lg transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Game
          </button>
          <button
            onClick={handleDeleteClick}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash className="w-4 h-4" />
            Delete Game
          </button>
        </div>
      </div>
    )
  }

  const EditGameDetailView = () => {
    const [editForm, setEditForm] = useState<Game>(viewedGameDetails!)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
      if (viewedGameDetails) {
        console.log("Initializing edit form with data:", viewedGameDetails)
        setEditForm({ ...viewedGameDetails })
      }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      console.log(`Field changed: ${name} = ${value}`)
      setEditForm((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    const handleBooleanChange = (name: string, value: boolean) => {
      console.log(`Boolean field changed: ${name} = ${value}`)
      setEditForm((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!editForm) {
        console.error("No edit form data available")
        return
      }

      setIsSaving(true)
      console.log("Submitting edited game data:", editForm)

      try {
        const response = await axiosInstance.put(`/api/games/${editForm.id}`, editForm)
        console.log("Edit API response:", response)

        setViewedGameDetails(editForm)

        setIsEditingDetails(false)

        fetchGames()

        toast.success(`Game "${editForm.title}" updated successfully`)
      } catch (error) {
        console.error("Error updating game:", error)
        toast.error("Failed to update game")
      } finally {
        setIsSaving(false)
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => {
              console.log("Canceling edit mode, returning to game list")
              setIsEditingDetails(false)
              setIsViewingGameDetails(false)
              setViewedGameDetails(null)
            }}
            className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Game List
          </button>
          <h1 className="text-3xl font-cinzel font-bold">Edit Game: {editForm.title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {editForm.image_data && (
                <div className="mb-4">
                  <div className="w-full aspect-[16/9] bg-[#1E1512] rounded-lg overflow-hidden border-2 border-[#6A4E32]">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL || ""}${editForm.image_data}`}
                      alt={editForm.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Error loading image, using custom fallback")
                        ;(e.target as HTMLImageElement).src = "/technical-difficulties.jpg"
                      }}
                    />
                  </div>
                  <p className="text-xs text-[#8B7355] mt-2">Image preview (cannot be changed here)</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                  value={editForm.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Slug</label>
                <input
                  type="text"
                  name="slug"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                  value={editForm.slug || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Genre *</label>
                <select
                  name="genre"
                  required
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                  value={editForm.genre}
                  onChange={handleChange}
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
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Subgenre</label>
                <input
                  type="text"
                  name="subgenre"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                  value={editForm.subgenre || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Description</label>
                <textarea
                  name="description"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none h-32"
                  value={editForm.description || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Tagline</label>
                <input
                  type="text"
                  name="tagline"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                  value={editForm.tagline || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Prompt Model</label>
                <select
                  name="prompt_model"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                  value={editForm.prompt_model || "gpt-3.5-turbo"}
                  onChange={handleChange}
                >
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Prompt Text</label>
                <textarea
                  name="prompt_text"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none h-32"
                  value={editForm.prompt_text || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Image Prompt Text</label>
                <textarea
                  name="image_prompt_text"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none h-24"
                  value={editForm.image_prompt_text || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Music Prompt Text</label>
                <textarea
                  name="music_prompt_text"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none h-24"
                  value={editForm.music_prompt_text || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-[#6A4E32]/50">
            <button
              type="button"
              onClick={() => {
                console.log("Canceling edit mode, returning to game list")
                setIsEditingDetails(false)
                setIsViewingGameDetails(false)
                setViewedGameDetails(null)
              }}
              className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-[#C0A080] hover:bg-[#D5B591] text-[#2F2118] rounded-lg transition-colors flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#2F2118]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    )
  }

  const backToGamesList = () => {
    setIsViewingGameDetails(false)
    setViewedGameDetails(null)
  }

  const viewGameDetails = async (gameId: number) => {
    console.log(`Fetching details for game ID: ${gameId}`)
    setIsLoading(true)

    try {
      const response = await axiosInstance.get(`/api/games/${gameId}`)
      console.log("Game details fetched:", response.data)

      let gameData = response.data

      if (gameData.UserId && (!gameData.creator || gameData.creator === "Unknown")) {
        try {
          const userResponse = await axiosInstance.get(`/admin/users/${gameData.UserId}`)
          if (userResponse.data && userResponse.data.username) {
            gameData = { ...gameData, creator: userResponse.data.username }
          }
        } catch (error) {
          console.log("Could not fetch creator information:", error)
        }
      }

      setViewedGameDetails(gameData)
      setIsViewingGameDetails(true)
    } catch (error) {
      console.error("Error fetching game details:", error)
      toast.error("Failed to load game details")
    } finally {
      setIsLoading(false)
    }
  }

  const EnlargedImageModal = () => {
    if (!viewedGameDetails?.image_data || !showEnlargedImage) return null

    return (
      <div
        className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
        onClick={() => setShowEnlargedImage(false)}
      >
        <div className="relative max-w-7xl max-h-[95vh] w-full">
          <button
            onClick={() => setShowEnlargedImage(false)}
            className="absolute top-4 right-4 text-white bg-black/60 hover:bg-black/80 rounded-full p-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <img
            src={`${import.meta.env.VITE_BACKEND_URL || ""}${viewedGameDetails.image_data}`}
            alt={viewedGameDetails.title}
            className="max-w-full max-h-[90vh] object-contain mx-auto shadow-2xl"
            onError={(e) => {
              console.error("Error loading enlarged image")
              ;(e.target as HTMLImageElement).src = "/technical-difficulties.jpg"
            }}
          />
        </div>
      </div>
    )
  }

  const DeleteConfirmationModal = () => {
    if (!gameToDelete) return null

    return (
      <Modal
        isOpen={showDeleteConfirmation}
        onRequestClose={() => setShowDeleteConfirmation(false)}
        className="modal-content bg-[#2F2118] p-6 rounded-xl max-w-md mx-4"
        overlayClassName="modal-overlay fixed inset-0 bg-black/75 flex items-center justify-center"
        ariaHideApp={false}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-red-400">
            <Trash className="w-6 h-6" />
            <h2 className="text-xl font-cinzel">Confirm Deletion</h2>
          </div>

          <p className="text-[#F0E6DB]">
            Are you sure you want to delete <span className="font-semibold">{gameToDelete.title}</span>?
          </p>

          <div className="bg-red-900/20 p-3 rounded-lg border border-red-800/30">
            <p className="text-red-300 text-sm">
              <strong>Warning:</strong> This action cannot be undone. All data will be permanently deleted.
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-[#6A4E32]/50">
            <button
              onClick={() => setShowDeleteConfirmation(false)}
              className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg flex items-center gap-2"
            >
              <Trash className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  const BulkDeleteConfirmationModal = () => {
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [bulkDeleteConfirmText, setBulkDeleteConfirmText] = useState("");
    const [bulkDeleteEnabled, setBulkDeleteEnabled] = useState(false);

    useEffect(() => {
      const requiredText = `DELETE ${selectedGames.length} GAMES`;
      setBulkDeleteEnabled(bulkDeleteConfirmText === requiredText);
    }, [bulkDeleteConfirmText, selectedGames.length]);

    const handleAdminLogin = async () => {
      setIsAuthenticating(true);
      setLoginError("");

      try {
        const response = await axiosInstance.post("/auth/login", {
          email: adminEmail,
          password: adminPassword,
        });

        if (response.status === 200 && response.data.user.admin === true) {
          // Admin authentication successful, proceed with bulk delete
          setLoginError("");
          handleBulkDelete();
        } else {
          // Authentication failed
          setLoginError("Invalid admin credentials");
        }
      } catch (error: any) {
        console.error("Admin login failed:", error);
        setLoginError(error.response?.data?.message || "Failed to authenticate admin");
      } finally {
        setIsAuthenticating(false);
      }
    };

    return (
      <Modal
        isOpen={showBulkDeleteConfirmation}
        onRequestClose={() => setShowBulkDeleteConfirmation(false)}
        className="modal-content bg-[#2F2118] p-8 rounded-xl max-w-xl mx-4"
        overlayClassName="modal-overlay fixed inset-0 bg-black/75 flex items-center justify-center"
        ariaHideApp={false}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-red-400">
            <Trash className="w-8 h-8" />
            <h2 className="text-2xl font-cinzel">Confirm Bulk Deletion</h2>
          </div>

          <div className="bg-red-900/20 p-6 rounded-xl border border-red-800/30 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h3 className="font-cinzel font-bold text-xl mb-2">Dangerous Operation</h3>
                <p className="text-[#F0E6DB]">
                  You're about to delete {selectedGames.length} games permanently. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="bg-red-900/30 p-4 rounded-lg border border-red-800/40">
              <p className="text-red-300 text-sm flex items-start gap-2">
                <span className="text-red-400 mt-1">⚠️</span>
                <span>
                  <strong>Warning:</strong> All selected game data including images, prompts, and user progress will be
                  permanently removed. This may affect active users.
                </span>
              </p>
            </div>

            <div className="mt-4 space-y-4">
              <label className="block text-base font-cinzel text-white mb-3">
                Admin Email:
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-[#1E1512] text-[#F0E6DB] px-4 py-3 rounded-lg border-2 border-red-800/50 focus:ring-2 focus:ring-red-500 focus:outline-none text-lg"
                placeholder="Admin Email"
                autoComplete="email"
              />

              <label className="block text-base font-cinzel text-white mb-3">
                Admin Password:
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-[#1E1512] text-[#F0E6DB] px-4 py-3 rounded-lg border-2 border-red-800/50 focus:ring-2 focus:ring-red-500 focus:outline-none text-lg"
                placeholder="Admin Password"
                autoComplete="current-password"
              />

              {loginError && <p className="text-red-400">{loginError}</p>}
            </div>

            <div className="mt-4">
              <label className="block text-base font-cinzel text-white mb-3">
                Type <span className="font-semibold text-red-300">DELETE {selectedGames.length} GAMES</span> to confirm:
              </label>
              <input
                type="text"
                value={bulkDeleteConfirmText}
                onChange={(e) => setBulkDeleteConfirmText(e.target.value)}
                className="w-full bg-[#1E1512] text-[#F0E6DB] px-4 py-3 rounded-lg border-2 border-red-800/50 focus:ring-2 focus:ring-red-500 focus:outline-none text-lg"
                placeholder={`Type "DELETE ${selectedGames.length} GAMES" here`}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-[#6A4E32]/50">
            <button
              onClick={() => {
                setShowBulkDeleteConfirmation(false);
                setBulkDeleteConfirmText("");
                setLoginError("");
                setAdminEmail("");
                setAdminPassword("");
              }}
              className="px-5 py-3 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors text-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleAdminLogin}
              disabled={!bulkDeleteEnabled || isAuthenticating}
              className={`px-5 py-3 rounded-lg transition-colors text-lg font-medium flex items-center gap-2 ${
                bulkDeleteEnabled && !isAuthenticating
                  ? "bg-red-700 hover:bg-red-800 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Trash className="w-5 h-5" />
              {isAuthenticating ? "Authenticating..." : "Confirm Bulk Delete"}
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const openEditModal = async (game: Game) => {
    console.log(`Opening edit page for game: ${game.title} (ID: ${game.id})`)

    setIsLoading(true)

    try {
      const response = await axiosInstance.get(`/api/games/${game.id}`)
      console.log("Game details fetched for editing:", response.data)

      let gameData = response.data

      if (gameData.UserId && (!gameData.creator || gameData.creator === "Unknown")) {
        try {
          const userResponse = await axiosInstance.get(`/admin/users/${gameData.UserId}`)
          if (userResponse.data && userResponse.data.username) {
            gameData = {
              ...gameData,
              creator: userResponse.data.username,
            }
          }
        } catch (error) {
          console.log("Could not fetch creator information:", error)
        }
      }

      setViewedGameDetails(gameData)

      setIsViewingGameDetails(true)
      setIsEditingDetails(true)
    } catch (error) {
      console.error("Error fetching game details for editing:", error)
      toast.error("Failed to load game for editing")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editGameData) {
      console.log("No edit data available, aborting submission")
      return
    }

    console.log(`Submitting edit for game: ${editGameData.title} (ID: ${editGameData.id})`, editGameData)

    try {
      const response = await axiosInstance.put(`/api/games/${editGameData.id}`, editGameData)
      console.log("Edit API response:", response)

      fetchGames()
      toast.success(`Game "${editGameData.title}" updated successfully`)
      setShowEditModal(false)
    } catch (error) {
      console.error("Error updating game:", error)
      toast.error("Failed to update game")
    }
  }

  const EditGameModal = () => {
    if (!editGameData) return null

    return (
      <Modal
        isOpen={showEditModal}
        onRequestClose={() => setShowEditModal(false)}
        className="modal-content bg-[#2F2118] p-6 rounded-xl max-w-2xl mx-4"
        overlayClassName="modal-overlay fixed inset-0 bg-black/75 flex items-center justify-center"
        ariaHideApp={false}
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-[#6A4E32]/50 pb-4">
            <h2 className="text-2xl font-cinzel text-[#F0E6DB]">Edit Game: {editGameData.title}</h2>
            <button
              onClick={() => setShowEditModal(false)}
              className="text-[#8B7355] hover:text-[#C0A080] transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                    value={editGameData.title}
                    onChange={(e) => setEditGameData({ ...editGameData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                    value={editGameData.slug || ""}
                    onChange={(e) => setEditGameData({ ...editGameData, slug: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Genre *</label>
                  <select
                    name="genre"
                    required
                    className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                    value={editGameData.genre}
                    onChange={(e) => setEditGameData({ ...editGameData, genre: e.target.value })}
                  >
                    <option value="RPG">RPG</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Horror">Horror</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Romance">Romance</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Description</label>
                  <textarea
                    name="description"
                    className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none h-24"
                    value={editGameData.description || ""}
                    onChange={(e) => setEditGameData({ ...editGameData, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Prompt Text</label>
                  <textarea
                    name="prompt_text"
                    className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none h-24"
                    value={editGameData.prompt_text || ""}
                    onChange={(e) => setEditGameData({ ...editGameData, prompt_text: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4 border-t border-[#6A4E32]/50">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
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
        </div>
      </Modal>
    )
  }

  return (
    <div className="p-6 bg-[#2F2118] text-[#F0E6DB] min-h-screen" id="root">
      {isViewingGameDetails ? (
        isEditingDetails ? (
          <EditGameDetailView />
        ) : isDeletingDetails ? (
          <DeleteGameConfirmationView />
        ) : (
          <>
            <GameDetailView />
            {showEnlargedImage && <EnlargedImageModal />}
          </>
        )
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-cinzel font-bold mb-2">Game List</h1>
              <p className="text-[#8B7355]">Manage all game content and configurations</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 bg-[#1E1512] text-white pl-10 pr-4 py-2 rounded-lg border border-[#6A4E32] focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                />
              </div>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  showAdvancedFilters ? 'bg-[#6A4E32] text-white' : 'bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB]'
                }`}
              >
                <Sliders className="w-5 h-5" />
                Filters {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <AdvancedFilters />
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading ? (
            <Loader message="Loading games..." />
          ) : (
            <div className="rounded-xl overflow-hidden border border-[#6A4E32]/50 shadow-lg bg-[#2F2118]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-[#3D2E22]">
                    <tr>
                      <th className="sticky top-0 p-4 w-12 bg-[#3D2E22]">
                        <input
                          type="checkbox"
                          className="w-5 h-5 cursor-pointer accent-[#C0A080] bg-[#1E1512] border-[#6A4E32] rounded"
                          onChange={toggleSelectAll}
                          checked={!isLoading && games.length > 0 && allSelected}
                          disabled={isLoading || games.length === 0}
                        />
                      </th>
                      <TableHeader label="Image" className="w-20" />
                      <TableHeader label="Title" sortKey="title" />
                      <TableHeader label="Genre" sortKey="genre" />
                      <TableHeader label="Creator" sortKey="creator" />
                      <TableHeader label="Created" sortKey="createdAt" />
                      <th className="sticky top-0 p-4 bg-[#3D2E22] font-cinzel text-center w-32">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4D3E32]">
                    <AnimatePresence>
                      {filteredGames.map((game) => (
                        <motion.tr
                          key={game.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="group odd:bg-[#2F2118] even:bg-[#35261c] hover:bg-[#534231] transition-colors duration-150"
                        >
                          <td className="p-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedGames.includes(game.id)}
                              onChange={() => handleSelectGame(game.id)}
                              className="w-5 h-5 cursor-pointer accent-[#C0A080] bg-[#1E1512] border-[#6A4E32] rounded"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <div className="w-16 h-10 bg-[#1E1512] rounded overflow-hidden mx-auto border border-[#6A4E32]/50 flex items-center justify-center">
                              {game.image_data ? (
                                <img
                                  src={`${import.meta.env.VITE_BACKEND_URL || ""}${game.image_data}`}
                                  alt={game.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  onError={(e) => { (e.target as HTMLImageElement).src = "/technical-difficulties.jpg"; }}
                                />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-[#6A4E32]" />
                              )}
                            </div>
                          </td>
                          <td className="p-4 font-playfair text-base text-[#F0E6DB] max-w-xs truncate" title={game.title}>
                            {game.title}
                          </td>
                          <td className="p-4 font-playfair text-sm text-[#C0A080]">{game.genre}</td>
                          <td className="p-4 font-playfair text-sm text-[#A89070] flex items-center gap-2 justify-center">
                            <Users className="w-4 h-4 text-[#8B7355]" />
                            <span className="max-w-[120px] truncate">{game.creator || 'Unknown'}</span>
                            {game.private && (
                              <span title="Private">
                                <EyeOff className="w-4 h-4 text-red-400" />
                              </span>
                            )}
                          </td>
                          <td className="p-4 font-playfair text-sm text-[#A89070] text-center">
                            <div className="flex items-center gap-1 justify-center" title={new Date(game.createdAt).toLocaleString()}>
                              <Calendar className="w-4 h-4 text-[#8B7355]" />
                              {new Date(game.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </td>
                          <td className="p-4">
  <div className="flex items-center justify-center gap-2">
    <button
      onClick={() => viewGameDetails(game.id)}
      className="p-2 hover:bg-[#6A4E32]/30 rounded-md transition-colors"
      title="View details"
    >
      <Eye className="w-5 h-5 text-[#C0A080]" />
    </button>
  </div>
</td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              {filteredGames.length === 0 && !isLoading && (
                <div className="p-10 text-center text-[#8B7355] font-playfair">
                  <Search className="w-12 h-12 mx-auto mb-4 text-[#6A4E32]" />
                  <p className="text-lg">No games found matching your criteria.</p>
                  <p className="text-sm">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          )}

          {selectedGames.length > 0 && (
            <div className="fixed bottom-4 right-4 bg-[#3D2E22] p-4 rounded-lg shadow-lg border border-[#6A4E32]/50">
              <div className="flex items-center gap-4">
                <span className="text-[#F0E6DB]">
                  {selectedGames.length} {selectedGames.length === 1 ? "game" : "games"} selected
                </span>
                <button
                  onClick={confirmBulkDelete}
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg flex items-center gap-2"
                >
                  <Trash className="w-4 h-4" />
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          <NewGameModal />
          <DeleteConfirmationModal />
          <BulkDeleteConfirmationModal />
          <EditGameModal />
        </>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}

export default GamesList