"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Plus, Edit, Trash, ChevronUp, ChevronDown, Eye, Sliders, Save, ChevronLeft } from "lucide-react"
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
  refreshTrigger?: number
}

const GamesList: React.FC<GamesListProps> = ({ refreshTrigger = 0 }) => {
  const [games, setGames] = useState<Game[]>([])
  const [searchTerm] = useState("")
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
  const [showBulkDeleteConfirmation, setShowBulkDeleteConfirmation] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editGameData, setEditGameData] = useState<Game | null>(null)
  const [isViewingGameDetails, setIsViewingGameDetails] = useState(false)
  const [viewedGameDetails, setViewedGameDetails] = useState<Game | null>(null)
  const [showEnlargedImage, setShowEnlargedImage] = useState(false)
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [isDeletingDetails, setIsDeletingDetails] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [deleteEnabled, setDeleteEnabled] = useState(false)

  const isMounted = useRef(true)

  const safelySetModalState = (
    modalToOpen: "edit" | "bulkDelete" | "new" | null,
    data: any = null,
  ) => {
    console.log(`Attempting to open modal: ${modalToOpen}`, data)

    setShowEditModal(false)
    setShowBulkDeleteConfirmation(false)
    setShowModal(false)

    console.log("All modals closed")

    if (modalToOpen === "edit" && data) {
      setEditGameData(data)
    }

    switch (modalToOpen) {
      case "edit":
        setShowEditModal(true)
        console.log("Edit modal opened")
        break
      case "bulkDelete":
        setShowBulkDeleteConfirmation(true)
        console.log("Bulk delete confirmation modal opened")
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

  const allSelected = games.length > 0 && selectedGames.length === games.length

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
      if (isMounted.current) {
        setGames(enrichedGames)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load game data")
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
      }
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
    const valA = a[sortConfig.key] ?? ""
    const valB = b[sortConfig.key] ?? ""
    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1
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
      setNewGame({ title: "", genre: "RPG", description: "", prompt: "" })
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
    safelySetModalState("bulkDelete")
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

  const confirmDelete = async (game: Game) => {
    console.log(`Initiating delete process for game: ${game.title} (ID: ${game.id})`)
    await viewGameDetails(game.id)
    if (isMounted.current) {
      setIsDeletingDetails(true)
      setDeleteConfirmText("")
      setDeleteEnabled(false)
    }
  }

  const handleDelete = async () => {
    if (!viewedGameDetails) {
      console.log("No viewed game details to delete, aborting")
      return
    }

    console.log(`Deleting game: ${viewedGameDetails.title} (ID: ${viewedGameDetails.id})`)

    try {
      const response = await axiosInstance.delete(`/api/games/${viewedGameDetails.id}`)
      console.log("Delete API response:", response)

      setGames((prevGames) => prevGames.filter((g) => g.id !== viewedGameDetails.id))

      toast.success(`Game "${viewedGameDetails.title}" deleted successfully`)

      setIsViewingGameDetails(false)
      setViewedGameDetails(null)
      setIsDeletingDetails(false)
      setDeleteConfirmText("")
      setDeleteEnabled(false)
    } catch (error: any) {
      console.error("Error deleting game:", error)
      const errorMessage = error.response?.data?.message || "Failed to delete game"
      toast.error(errorMessage)
    } finally {
      console.log("Delete operation completed")
    }
  }

  const TableHeader = ({ label, sortKey }: { label: string; sortKey: string }) => (
    <th
      className="sticky top-0 p-4 bg-[#3D2E22] font-cinzel text-center cursor-pointer hover:bg-[#534231] transition-colors group z-10"
      onClick={() => handleSort(sortKey)}
      aria-sort={sortConfig.key === sortKey ? (sortConfig.direction === "asc" ? "ascending" : "descending") : "none"}
    >
      <div className="flex items-center justify-center gap-2">
        <span className="text-[#F0E6DB]">{label}</span>
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
      </div>
    </th>
  )

  const AdvancedFilters = () => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="bg-[#2F2118] rounded-lg border border-[#6A4E32]/50 mb-6 p-6 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Start Date</label>
          <input
            type="date"
            className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
        </div>
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
            setTitleFilter("")
            setGenreFilter("all")
            setCreatorFilter("")
            setDateRange({ start: "", end: "" })
          }}
          className="px-4 py-2 bg-[#C0A080] hover:bg-[#D5B591] text-[#2F2118] rounded-lg transition-colors font-cinzel"
        >
          Reset Filters
        </button>
      </div>
    </motion.div>
  )

  const NewGameModal = () => (
    <Modal
      isOpen={showModal}
      onRequestClose={() => setShowModal(false)}
      className="modal-content bg-[#2F2118] p-8 rounded-xl max-w-2xl mx-4 my-8 outline-none"
      overlayClassName="modal-overlay fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50"
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
                required
                className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                value={newGame.genre}
                onChange={handleNewGameChange}
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
              <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Primary Prompt</label>
              <textarea
                name="prompt"
                className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none h-32 resize-none"
                value={newGame.prompt}
                onChange={handleNewGameChange}
                placeholder="Enter the initial prompt for the game..."
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
    const [isDeletingConfirm, setIsDeletingConfirm] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
      setDeleteEnabled(false)
    }, [])

    useEffect(() => {
      if (viewedGameDetails && deleteConfirmText === viewedGameDetails.title) {
        setDeleteEnabled(true)
      } else {
        setDeleteEnabled(false)
      }
    }, [deleteConfirmText, viewedGameDetails])

    const handleDeleteConfirm = async () => {
      setIsDeletingConfirm(true)
      await handleDelete()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && deleteEnabled) {
        handleDeleteConfirm()
      }
    }

    if (!viewedGameDetails) return null

    return (
      <div className="mt-8 border-t-2 border-red-800/50 pt-8 space-y-6">
        <div className="flex items-center gap-4">
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
              <label htmlFor="deleteConfirmInput" className="block text-base font-cinzel text-white mb-3">
                Type <span className="font-semibold text-red-300">{viewedGameDetails?.title}</span> to confirm:
              </label>
              <input
                id="deleteConfirmInput"
                ref={inputRef}
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-[#1E1512] text-[#F0E6DB] px-4 py-3 rounded-lg border-2 border-red-800/50 focus:ring-2 focus:ring-red-500 focus:outline-none text-lg"
                placeholder={`Type "${viewedGameDetails?.title}" here`}
                disabled={isDeletingConfirm}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-red-800/40">
            <button
              type="button"
              onClick={() => {
                setIsDeletingDetails(false)
                setDeleteConfirmText("")
                setDeleteEnabled(false)
              }}
              className="px-5 py-3 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors text-lg font-medium"
              disabled={isDeletingConfirm}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={!deleteEnabled || isDeletingConfirm}
              className={`px-5 py-3 rounded-lg transition-colors text-lg font-medium flex items-center gap-2 ${
                deleteEnabled && !isDeletingConfirm
                  ? "bg-red-700 hover:bg-red-800 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isDeletingConfirm ? (
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

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={backToGamesList}
            className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors flex items-center gap-2"
            disabled={isDeletingDetails}
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
                  className={`w-full aspect-[16/9] bg-[#1E1512] rounded-lg overflow-hidden border-2 border-[#6A4E32] relative transition-all duration-200 ${
                    !isDeletingDetails ? "cursor-zoom-in hover:opacity-95 hover:shadow-lg" : "opacity-70"
                  }`}
                  onClick={() => !isDeletingDetails && setShowEnlargedImage(true)}
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
                  {!isDeletingDetails && (
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
                  )}
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
                  <p className="text-xs text-[#8B7355]">Visibility</p>
                  <p className="text-[#F0E6DB]">{viewedGameDetails.private ? "Private" : "Public"}</p>
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
                      ` (ID: ${viewedGameDetails.UserId})`}
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
                  <div className="bg-[#3D2E22] p-3 rounded-md mt-1 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-[#6A4E32] scrollbar-track-transparent">
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
                  <div className="bg-[#3D2E22] p-3 rounded-md mt-1 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-[#6A4E32] scrollbar-track-transparent">
                    <p className="text-[#F0E6DB] text-sm whitespace-pre-wrap">
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
                  <div className="bg-[#3D2E22] p-3 rounded-md mt-1 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-[#6A4E32] scrollbar-track-transparent">
                    <p className="text-[#F0E6DB] text-sm whitespace-pre-wrap">
                      {viewedGameDetails.music_prompt_text || "No music prompt available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!isDeletingDetails && (
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
              onClick={() => {
                console.log("Opening delete confirmation view for:", viewedGameDetails.title)
                setDeleteConfirmText("")
                setDeleteEnabled(false)
                setIsDeletingDetails(true)
              }}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash className="w-4 h-4" />
              Delete Game
            </button>
          </div>
        )}

        {isDeletingDetails && <DeleteGameConfirmationView />}
      </div>
    )
  }

  const EditGameDetailView = () => {
    const [editForm, setEditForm] = useState<Game | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
      if (viewedGameDetails) {
        console.log("Initializing edit form with data:", viewedGameDetails)
        setEditForm(JSON.parse(JSON.stringify(viewedGameDetails)))
      } else {
        console.error("Cannot edit: viewedGameDetails is null.")
        backToGamesList()
      }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      console.log(`Field changed: ${name} = ${value}`)
      setEditForm((prev) => (prev ? { ...prev, [name]: value } : null))
    }

    const handleBooleanChange = (name: string, value: boolean) => {
      console.log(`Boolean field changed: ${name} = ${value}`)
      setEditForm((prev) => (prev ? { ...prev, [name]: value } : null))
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!editForm) {
        console.error("No edit form data available")
        toast.error("Cannot save: No game data loaded.")
        return
      }

      setIsSaving(true)
      console.log("Submitting edited game data:", editForm)

      try {
        const updatePayload: Partial<Game> = {
          title: editForm.title,
          genre: editForm.genre,
          description: editForm.description,
          private: editForm.private,
          slug: editForm.slug,
          subgenre: editForm.subgenre,
          primary_color: editForm.primary_color,
          prompt_name: editForm.prompt_name,
          prompt_model: editForm.prompt_model,
          prompt_text: editForm.prompt_text,
          image_prompt_name: editForm.image_prompt_name,
          image_prompt_model: editForm.image_prompt_model,
          image_prompt_text: editForm.image_prompt_text,
          music_prompt_text: editForm.music_prompt_text,
          tagline: editForm.tagline,
        }

        const response = await axiosInstance.put(`/api/games/${editForm.id}`, updatePayload)
        console.log("Edit API response:", response)

        setViewedGameDetails(response.data)

        setIsEditingDetails(false)

        setGames((prevGames) =>
          prevGames.map((g) => (g.id === response.data.id ? { ...g, ...response.data } : g)),
        )

        toast.success(`Game "${response.data.title}" updated successfully`)
      } catch (error) {
        console.error("Error updating game:", error)
        toast.error("Failed to update game")
      } finally {
        setIsSaving(false)
      }
    }

    if (!editForm) {
      return <Loader message="Loading editor..." />
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => {
              console.log("Canceling edit mode, returning to detail view")
              setIsEditingDetails(false)
            }}
            className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors flex items-center gap-2"
            disabled={isSaving}
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Game Details
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
                  disabled={isSaving}
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
                  disabled={isSaving}
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
                  disabled={isSaving}
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
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Visibility</label>
                <select
                  name="private"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                  value={editForm.private ? "true" : "false"}
                  onChange={(e) => handleBooleanChange("private", e.target.value === "true")}
                  disabled={isSaving}
                >
                  <option value="false">Public</option>
                  <option value="true">Private</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Description</label>
                <textarea
                  name="description"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none h-32 resize-none"
                  value={editForm.description || ""}
                  onChange={handleChange}
                  disabled={isSaving}
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
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Prompt Model</label>
                <select
                  name="prompt_model"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                  value={editForm.prompt_model || "gpt-3.5-turbo"}
                  onChange={handleChange}
                  disabled={isSaving}
                >
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Prompt Text</label>
                <textarea
                  name="prompt_text"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none h-32 resize-none"
                  value={editForm.prompt_text || ""}
                  onChange={handleChange}
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Image Prompt Text</label>
                <textarea
                  name="image_prompt_text"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none h-24 resize-none"
                  value={editForm.image_prompt_text || ""}
                  onChange={handleChange}
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Music Prompt Text</label>
                <textarea
                  name="music_prompt_text"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none h-24 resize-none"
                  value={editForm.music_prompt_text || ""}
                  onChange={handleChange}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-[#6A4E32]/50">
            <button
              type="button"
              onClick={() => {
                console.log("Canceling edit mode, returning to detail view")
                setIsEditingDetails(false)
              }}
              className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                isSaving
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "bg-[#C0A080] hover:bg-[#D5B591] text-[#2F2118]"
              }`}
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
    setIsEditingDetails(false)
    setIsDeletingDetails(false)
  }

  const viewGameDetails = async (gameId: number) => {
    console.log(`Fetching details for game ID: ${gameId}`)
    setIsLoading(true)
    setIsViewingGameDetails(true)
    setViewedGameDetails(null)
    setIsEditingDetails(false)
    setIsDeletingDetails(false)

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
        } catch (userError) {
          console.warn("Could not fetch creator information:", userError)
        }
      }

      if (isMounted.current) {
        setViewedGameDetails(gameData)
      }
    } catch (error) {
      console.error("Error fetching game details:", error)
      toast.error("Failed to load game details")
      if (isMounted.current) {
        setIsViewingGameDetails(false)
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }
  }

  const EnlargedImageModal = () => {
    if (!viewedGameDetails?.image_data || !showEnlargedImage) return null

    return (
      <div
        className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
        onClick={() => setShowEnlargedImage(false)}
      >
        <div className="relative max-w-7xl max-h-[95vh] w-full" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowEnlargedImage(false)}
            className="absolute -top-2 -right-2 md:top-4 md:right-4 text-white bg-black/60 hover:bg-black/80 rounded-full p-3 z-10"
            aria-label="Close enlarged image"
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
            alt={`Enlarged view of ${viewedGameDetails.title}`}
            className="max-w-full max-h-[90vh] object-contain mx-auto shadow-2xl rounded-lg"
            onError={(e) => {
              console.error("Error loading enlarged image")
              ;(e.target as HTMLImageElement).src = "/technical-difficulties.jpg"
            }}
          />
        </div>
      </div>
    )
  }

  const BulkDeleteConfirmationModal = () => {
    return (
      <Modal
        isOpen={showBulkDeleteConfirmation}
        onRequestClose={() => setShowBulkDeleteConfirmation(false)}
        className="modal-content bg-[#2F2118] p-6 rounded-xl max-w-md mx-4 outline-none"
        overlayClassName="modal-overlay fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50"
        ariaHideApp={false}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-red-400">
            <Trash className="w-6 h-6" />
            <h2 className="text-xl font-cinzel">Confirm Bulk Deletion</h2>
          </div>

          <p className="text-[#F0E6DB]">
            Are you sure you want to delete {selectedGames.length} selected games?
          </p>

          <div className="bg-red-900/20 p-3 rounded-lg border border-red-800/30">
            <p className="text-red-300 text-sm">
              <strong>Warning:</strong> This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-[#6A4E32]/50">
            <button
              onClick={() => setShowBulkDeleteConfirmation(false)}
              className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg flex items-center gap-2"
            >
              <Trash className="w-4 h-4" />
              Delete {selectedGames.length} Games
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  const openEditView = async (game: Game) => {
    console.log(`Opening edit view for game: ${game.title} (ID: ${game.id})`)
    await viewGameDetails(game.id)
    if (isMounted.current) {
      setIsEditingDetails(true)
    }
  }

  return (
    <div className="p-6 bg-[#2F2118] text-[#F0E6DB] min-h-screen" id="root">
      {isViewingGameDetails ? (
        isLoading ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
            <Loader message="Loading game details..." />
          </div>
        ) : isEditingDetails ? (
          <EditGameDetailView />
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
              <h1 className="text-3xl font-cinzel font-bold mb-2">Game Management</h1>
              <p className="text-[#8B7355]">Manage all game content and configurations</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <button
                onClick={() => safelySetModalState("new")}
                className="px-4 py-2 bg-[#C0A080] hover:bg-[#D5B591] text-[#2F2118] rounded-lg font-cinzel flex items-center gap-2 transition-all"
              >
                <Plus className="w-5 h-5" />
                New Game
              </button>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg flex items-center gap-2"
                aria-expanded={showAdvancedFilters}
              >
                <Sliders className="w-5 h-5" />
                Filters {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <AnimatePresence>{showAdvancedFilters && <AdvancedFilters />}</AnimatePresence>

          {isLoading ? (
            <Loader message="Loading games..." />
          ) : (
            <div className="rounded-xl overflow-hidden border border-[#6A4E32]/50 shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-[#3D2E22]">
                    <tr>
                      <th className="sticky top-0 p-4 w-12 bg-[#3D2E22] z-10">
                        <input
                          type="checkbox"
                          className="w-5 h-5 cursor-pointer accent-[#C0A080]"
                          onChange={toggleSelectAll}
                          checked={allSelected}
                          aria-label="Select all games"
                        />
                      </th>
                      <TableHeader label="Title" sortKey="title" />
                      <TableHeader label="Genre" sortKey="genre" />
                      <TableHeader label="Creator" sortKey="creator" />
                      <TableHeader label="Created" sortKey="createdAt" />
                      <th className="sticky top-0 p-4 bg-[#3D2E22] font-cinzel text-center z-10">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredGames.length > 0 ? (
                        filteredGames.map((game) => (
                          <motion.tr
                            key={game.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="group even:bg-[#2F2118]/80 odd:bg-[#3D2E22]/60 hover:bg-[#534231]/80 transition-colors"
                          >
                            <td className="p-4">
                              <input
                                type="checkbox"
                                checked={selectedGames.includes(game.id)}
                                onChange={() => handleSelectGame(game.id)}
                                className="w-5 h-5 cursor-pointer accent-[#C0A080]"
                                aria-label={`Select game ${game.title}`}
                              />
                            </td>
                            <td className="p-4 font-playfair max-w-xs truncate group-hover:text-[#C0A080] transition-colors">
                              {game.title}
                            </td>
                            <td className="p-4 font-playfair">{game.genre}</td>
                            <td className="p-4 font-playfair text-center">{game.creator}</td>
                            <td className="p-4 font-playfair">
                              {new Date(game.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => viewGameDetails(game.id)}
                                  className="p-2 hover:bg-[#6A4E32]/50 rounded-lg text-[#C0A080] focus:ring-2 focus:ring-[#C0A080] focus:outline-none transition-colors"
                                  title="View"
                                  aria-label={`View ${game.title}`}
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => openEditView(game)}
                                  className="p-2 hover:bg-[#6A4E32]/50 rounded-lg text-[#C0A080] focus:ring-2 focus:ring-[#C0A080] focus:outline-none transition-colors"
                                  title="Edit"
                                  aria-label={`Edit ${game.title}`}
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => confirmDelete(game)}
                                  className="p-2 hover:bg-[#6A4E32]/50 rounded-lg text-red-400 focus:ring-2 focus:ring-red-400 focus:outline-none transition-colors"
                                  title="Delete"
                                  aria-label={`Delete ${game.title}`}
                                >
                                  <Trash className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-[#8B7355]">
                            No games found matching your criteria.
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedGames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 right-4 bg-[#3D2E22] p-4 rounded-lg shadow-lg border border-[#6A4E32]/50 z-40"
            >
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
            </motion.div>
          )}

          <NewGameModal />
          <BulkDeleteConfirmationModal />
        </>
      )}
      <ToastContainer
        position="bottom-right"
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