"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Plus, Edit, Trash, ChevronUp, ChevronDown, Eye, Power, Sliders, Save, ChevronLeft } from "lucide-react"
import axiosInstance from "../../../config/axiosConfig"
import Modal from "react-modal"
import StatusBadge from "./StatusBadge"
import Loader from "./Loader"
import { motion, AnimatePresence } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"

interface Game {
  id: number
  title: string
  genre: string
  description?: string
  createdAt: string
  status: string
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
  [key: string]: any // Add index signature to allow string indexing
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
    status: "active",
    prompt: "",
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [titleFilter, setTitleFilter] = useState("")
  const [descriptionFilter, setDescriptionFilter] = useState("")
  const [creatorFilter, setCreatorFilter] = useState("")
  const [privateFilter, setPrivateFilter] = useState("all")
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
    const matchesStatus = statusFilter === "all" || game.status === statusFilter
    const createdDate = new Date(game.createdAt)
    const matchesStartDate = !dateRange.start || createdDate >= new Date(dateRange.start)
    const matchesEndDate = !dateRange.end || createdDate <= new Date(dateRange.end)
    const matchesTitle = !titleFilter || game.title.toLowerCase().includes(titleFilter.toLowerCase())
    const matchesDescription =
      !descriptionFilter ||
      (game.description && game.description.toLowerCase().includes(descriptionFilter.toLowerCase()))
    const matchesCreator =
      !creatorFilter || (game.creator && game.creator.toLowerCase().includes(creatorFilter.toLowerCase()))
    const matchesPrivate =
      privateFilter === "all" ||
      (privateFilter === "private" && game.private === true) ||
      (privateFilter === "public" && game.private === false)

    return (
      matchesSearch &&
      matchesGenre &&
      matchesStatus &&
      matchesStartDate &&
      matchesEndDate &&
      matchesTitle &&
      matchesDescription &&
      matchesCreator &&
      matchesPrivate
    )
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

  const TableHeader = ({ label, sortKey }: { label: string; sortKey: string }) => (
    <th
      className="sticky top-0 p-4 bg-[#3D2E22] font-cinzel text-center cursor-pointer hover:bg-[#534231] transition-colors group"
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
    <div className="bg-[#2F2118] rounded-lg border border-[#6A4E32]/50 mb-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
          <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Description</label>
          <input
            type="text"
            className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
            placeholder="Filter by description..."
            value={descriptionFilter}
            onChange={(e) => setDescriptionFilter(e.target.value)}
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

        <div>
          <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Status</label>
          <select
            className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Visibility</label>
          <select
            className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
            value={privateFilter}
            onChange={(e) => setPrivateFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
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
            setDescriptionFilter("")
            setGenreFilter("all")
            setStatusFilter("all")
            setDateRange({ start: "", end: "" })
            setCreatorFilter("")
            setPrivateFilter("all")
          }}
          className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors"
        >
          Reset Filters
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
              <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Status *</label>
              <select
                name="status"
                className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                value={newGame.status}
                onChange={handleNewGameChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

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

  const DeleteConfirmationModal = () => {
    const [confirmText, setConfirmText] = useState("")
    const [deleteEnabled, setDeleteEnabled] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      setConfirmText("")
      setDeleteEnabled(false)
    }, [showDeleteConfirmation, gameToDelete])

    useEffect(() => {
      if (showDeleteConfirmation && inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus()
        }, 100)
      }
    }, [showDeleteConfirmation])

    useEffect(() => {
      if (gameToDelete && confirmText === gameToDelete.title) {
        setDeleteEnabled(true)
      } else {
        setDeleteEnabled(false)
      }
    }, [confirmText, gameToDelete])

    if (!gameToDelete) return null

    const closeModal = () => {
      console.log("Delete confirmation modal closed")
      setShowDeleteConfirmation(false)
      setConfirmText("")
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && deleteEnabled) {
        handleDelete()
      }
    }

    return (
      <Modal
        isOpen={showDeleteConfirmation}
        onRequestClose={closeModal}
        className="modal-content bg-[#2F2118] p-6 rounded-xl max-w-md mx-4"
        overlayClassName="modal-overlay fixed inset-0 bg-black/75 flex items-center justify-center"
        ariaHideApp={false}
        shouldCloseOnOverlayClick={!isDeleting}
        shouldCloseOnEsc={!isDeleting}
        shouldReturnFocusAfterClose={true}
        preventScroll={true}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-red-400">
            <Trash className="w-6 h-6" />
            <h2 className="text-xl font-cinzel">Confirm Deletion</h2>
          </div>

          <div className="space-y-4">
            <p className="text-[#F0E6DB]">
              Are you sure you want to delete the game <span className="font-semibold">{gameToDelete.title}</span>?
            </p>

            <div className="bg-red-900/20 p-3 rounded-lg border border-red-800/30">
              <p className="text-red-300 text-sm">
                <strong>Warning:</strong> This action cannot be undone. All game data, including prompts, images, and
                user progress will be permanently deleted.
              </p>
            </div>

            <div>
              <label className="block text-sm font-cinzel text-[#C0A080] mb-2">
                Type <span className="font-semibold">{gameToDelete.title}</span> to confirm:
              </label>
              <input
                ref={inputRef}
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                placeholder="Type game title here"
                disabled={isDeleting}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-[#6A4E32]/50">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={!deleteEnabled || isDeleting}
              className={`px-4 py-2 ${
                deleteEnabled && !isDeleting
                  ? "bg-red-700 hover:bg-red-800 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              } rounded-lg transition-colors flex items-center gap-2`}
            >
              {isDeleting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  <Trash className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  const BulkDeleteConfirmationModal = () => {
    const [confirmText, setConfirmText] = useState("")
    const [deleteEnabled, setDeleteEnabled] = useState(false)

    useEffect(() => {
      if (confirmText === "DELETE") {
        setDeleteEnabled(true)
      } else {
        setDeleteEnabled(false)
      }
    }, [confirmText])

    return (
      <Modal
        isOpen={showBulkDeleteConfirmation}
        onRequestClose={() => {
          console.log("Bulk delete confirmation modal closed by user")
          setShowBulkDeleteConfirmation(false)
          setConfirmText("")
        }}
        className="modal-content bg-[#2F2118] p-6 rounded-xl max-w-md mx-4"
        overlayClassName="modal-overlay fixed inset-0 bg-black/75 flex items-center justify-center"
        ariaHideApp={false}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-red-400">
            <Trash className="w-6 h-6" />
            <h2 className="text-xl font-cinzel">Confirm Bulk Deletion</h2>
          </div>

          <div className="space-y-4">
            <p className="text-[#F0E6DB]">
              Are you sure you want to delete <span className="font-semibold">{selectedGames.length} games</span>?
            </p>

            <div className="bg-red-900/20 p-3 rounded-lg border border-red-800/30">
              <p className="text-red-300 text-sm">
                <strong>Warning:</strong> This action cannot be undone. All game data, including prompts, images, and
                user progress will be permanently deleted for all selected games.
              </p>
            </div>

            <div>
              <label className="block text-sm font-cinzel text-[#C0A080] mb-2">
                Type <span className="font-semibold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                placeholder="Type DELETE here"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-[#6A4E32]/50">
            <button
              onClick={() => {
                console.log("Bulk delete confirmation modal cancelled by user")
                setShowBulkDeleteConfirmation(false)
                setConfirmText("")
              }}
              className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                console.log("Bulk delete confirmed by user")
                handleBulkDelete()
                setConfirmText("")
              }}
              disabled={!deleteEnabled}
              className={`px-4 py-2 ${
                deleteEnabled
                  ? "bg-red-700 hover:bg-red-800 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              } rounded-lg transition-colors`}
            >
              Delete {selectedGames.length} Games
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  const viewGameDetails = async (gameId: number) => {
    console.log(`Fetching details for game ID: ${gameId}`)
    setIsLoading(true)

    try {
      // Fetch the game details
      const response = await axiosInstance.get(`/api/games/${gameId}`)
      console.log("Game details fetched:", response.data)

      // Fetch the creator's username if not already included
      let gameData = response.data

      // If UserId exists but creator name is missing or "Unknown", fetch it
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
    } catch (error) {
      console.error("Error fetching game details:", error)
      toast.error("Failed to load game details")
    } finally {
      setIsLoading(false)
    }
  }

  const backToGamesList = () => {
    setIsViewingGameDetails(false)
    setViewedGameDetails(null)
  }

  const EnlargedImageModal = () => {
    if (!viewedGameDetails?.image_data || !showEnlargedImage) return null

    return (
      <div
        className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
        onClick={() => setShowEnlargedImage(false)}
      >
        <div
          className="relative max-w-7xl max-h-[95vh] w-full"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the container
        >
          <button
            onClick={() => setShowEnlargedImage(false)}
            className="absolute top-4 right-4 text-white bg-black/60 hover:bg-black/80 rounded-full p-3 transition-colors"
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
              console.error("Error loading enlarged image, using custom fallback")
              ;(e.target as HTMLImageElement).src = "/technical-difficulties.jpg"
            }}
          />
          <p className="text-center text-white/80 mt-4 text-lg font-cinzel">{viewedGameDetails.title}</p>
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
                  <p className="text-xs text-[#8B7355]">Status</p>
                  <p className="text-[#F0E6DB]">
                    <StatusBadge status={viewedGameDetails.status || "active"} />
                  </p>
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
            onClick={() => setIsEditingDetails(true)}
            className="px-4 py-2 bg-[#C0A080] hover:bg-[#D5B591] text-[#2F2118] rounded-lg transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Game
          </button>
          <button
            onClick={() => confirmToggleStatus(viewedGameDetails)}
            className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors flex items-center gap-2"
          >
            <Power className="w-4 h-4" />
            {viewedGameDetails.status === "active" ? "Deactivate" : "Activate"} Game
          </button>
          <button
            onClick={() => confirmDelete(viewedGameDetails)}
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
        setEditForm(viewedGameDetails)
      }
    }, [viewedGameDetails])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setEditForm((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    const handleBooleanChange = (name: string, value: boolean) => {
      setEditForm((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!editForm) return

      setIsSaving(true)
      try {
        await axiosInstance.put(`/api/games/${editForm.id}`, editForm)

        setViewedGameDetails(editForm)
        setIsEditingDetails(false)
        fetchGames() // Refresh the game list in the background
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
            onClick={() => setIsEditingDetails(false)}
            className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Cancel Editing
          </button>
          <h1 className="text-3xl font-cinzel font-bold">Edit Game: {editForm.title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
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

              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Status</label>
                <select
                  name="status"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                  value={editForm.status || "active"}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {viewedGameDetails?.image_data && (
                <div className="mb-4">
                  <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Current Image</label>
                  <div className="relative w-full h-32 bg-[#1E1512] rounded-lg overflow-hidden border border-[#6A4E32]">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL || ""}${viewedGameDetails.image_data}`}
                      alt={viewedGameDetails.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Error loading image, using custom fallback")
                        ;(e.target as HTMLImageElement).src = "/technical-difficulties.jpg"
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Description</label>
                <textarea
                  name="description"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none h-24"
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
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Prompt Text</label>
                <textarea
                  name="prompt_text"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none h-24"
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
                <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Visibility</label>
                <select
                  name="private"
                  className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                  value={editForm.private ? "true" : "false"}
                  onChange={(e) => handleBooleanChange("private", e.target.value === "true")}
                >
                  <option value="false">Public</option>
                  <option value="true">Private</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-[#6A4E32]/50">
            <button
              type="button"
              onClick={() => setIsEditingDetails(false)}
              className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#C0A080] hover:bg-[#D5B591] text-[#2F2118] rounded-lg transition-colors flex items-center gap-2"
              disabled={isSaving}
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

  const openEditModal = (game: Game) => {
    console.log(`Opening edit modal for game: ${game.title} (ID: ${game.id})`)
    safelySetModalState("edit", game)
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

  const confirmToggleStatus = (game: Game) => {
    console.log(`Opening status toggle modal for game: ${game.title} (ID: ${game.id})`)
    safelySetModalState("status", game)
  }

  const handleToggleStatusConfirm = async () => {
    if (!gameToToggleStatus) {
      console.log("No game selected for status toggle, aborting")
      return
    }

    const newStatus = gameToToggleStatus.status === "active" ? "inactive" : "active"
    console.log(
      `Toggling status for game: ${gameToToggleStatus.title} (ID: ${gameToToggleStatus.id}) from ${gameToToggleStatus.status} to ${newStatus}`,
    )

    try {
      const response = await axiosInstance.put(`/api/games/${gameToToggleStatus.id}`, {
        ...gameToToggleStatus,
        status: newStatus,
      })
      console.log("Status toggle API response:", response)

      fetchGames()
      toast.success(`Game "${gameToToggleStatus.title}" is now ${newStatus}`)
    } catch (error) {
      console.error("Error toggling status:", error)
      toast.error("Failed to update game status")
    } finally {
      setShowStatusModal(false)
      setGameToToggleStatus(null)
      console.log("Status toggle operation completed, modal closed")
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

                <div>
                  <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Status</label>
                  <select
                    name="status"
                    className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                    value={editGameData.status || "active"}
                    onChange={(e) => setEditGameData({ ...editGameData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
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
                  <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Visibility</label>
                  <select
                    name="private"
                    className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                    value={editGameData.private ? "true" : "false"}
                    onChange={(e) => setEditGameData({ ...editGameData, private: e.target.value === "true" })}
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

  const StatusToggleModal = () => {
    if (!gameToToggleStatus) return null

    return (
      <Modal
        isOpen={showStatusModal}
        onRequestClose={() => setShowStatusModal(false)}
        className="modal-content bg-[#2F2118] p-6 rounded-xl max-w-md mx-4"
        overlayClassName="modal-overlay fixed inset-0 bg-black/75 flex items-center justify-center"
        ariaHideApp={false}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-[#C0A080]">
            <Power className="w-6 h-6" />
            <h2 className="text-xl font-cinzel">Confirm Status Change</h2>
          </div>

          <p className="text-[#F0E6DB]">
            Are you sure you want to change the status of{" "}
            <span className="font-semibold">{gameToToggleStatus.title}</span> from{" "}
            <span className="font-semibold">{gameToToggleStatus.status}</span> to{" "}
            <span className="font-semibold">{gameToToggleStatus.status === "active" ? "inactive" : "active"}</span>?
          </p>

          <div className="flex justify-end space-x-4 pt-4 border-t border-[#6A4E32]/50">
            <button
              onClick={() => setShowStatusModal(false)}
              className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleToggleStatusConfirm}
              className="px-4 py-2 bg-[#C0A080] hover:bg-[#D5B591] text-[#2F2118] rounded-lg transition-colors"
            >
              {gameToToggleStatus.status === "active" ? "Deactivate" : "Activate"} Game
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <div className="p-6 bg-[#2F2118] text-[#F0E6DB] min-h-screen" id="root">
      {isViewingGameDetails ? (
        isEditingDetails ? (
          <EditGameDetailView />
        ) : (
          <>
            <GameDetailView />
            <EnlargedImageModal />
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
              >
                <Sliders className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>

          {showAdvancedFilters && <AdvancedFilters />}

          {isLoading ? (
            <Loader message="Loading games..." />
          ) : (
            <div className="rounded-xl overflow-hidden border border-[#6A4E32]/50 shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#3D2E22]">
                    <tr>
                      <th className="p-4 w-12">
                        <input
                          type="checkbox"
                          className="w-5 h-5 cursor-pointer accent-[#C0A080]"
                          onChange={toggleSelectAll}
                          checked={allSelected}
                        />
                      </th>
                      <TableHeader label="Title" sortKey="title" />
                      <TableHeader label="Genre" sortKey="genre" />
                      <TableHeader label="Players" sortKey="creator" />
                      <TableHeader label="Created" sortKey="createdAt" />
                      <TableHeader label="Status" sortKey="status" />
                      <th className="sticky top-0 p-4 bg-[#3D2E22] font-cinzel text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredGames.map((game) => (
                        <motion.tr
                          key={game.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="group even:bg-[#2F2118] odd:bg-[#3D2E22]/80 hover:bg-[#534231] transition-colors"
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedGames.includes(game.id)}
                              onChange={() => handleSelectGame(game.id)}
                              className="w-5 h-5 cursor-pointer accent-[#C0A080]"
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
                            <StatusBadge status={game.status} />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => viewGameDetails(game.id)}
                                className="p-2 hover:bg-[#6A4E32]/50 rounded-lg text-[#C0A080] focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                                title="View"
                                aria-label={`View ${game.title}`}
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => openEditModal(game)}
                                className="p-2 hover:bg-[#6A4E32]/50 rounded-lg text-[#C0A080] focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                                title="Edit"
                                aria-label={`Edit ${game.title}`}
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => confirmToggleStatus(game)}
                                className="p-2 hover:bg-[#6A4E32]/50 rounded-lg text-[#C0A080] focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                                title="Toggle Status"
                                aria-label={`Toggle status of ${game.title}`}
                              >
                                <Power className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => confirmDelete(game)}
                                className="p-2 hover:bg-red-900/20 rounded-lg text-red-400 focus:ring-2 focus:ring-red-400 focus:outline-none"
                                title="Delete"
                                aria-label={`Delete ${game.title}`}
                              >
                                <Trash className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {filteredGames.length === 0 && (
                <div className="p-8 text-center text-[#8B7355]">No games found matching your criteria</div>
              )}
            </div>
          )}

          <NewGameModal />
          <DeleteConfirmationModal />
          <BulkDeleteConfirmationModal />
          <StatusToggleModal />

          {selectedGames.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="fixed bottom-4 right-4 bg-[#3D2E22] p-4 rounded-lg shadow-xl flex gap-2 items-center"
            >
              <span className="text-sm text-[#C0A080]">{selectedGames.length} selected</span>
              <button
                onClick={confirmBulkDelete}
                className="px-3 py-1 bg-red-700/20 hover:bg-red-800/30 text-red-400 rounded flex items-center gap-1"
              >
                <Trash className="w-4 h-4" />
                Delete
              </button>
            </motion.div>
          )}
        </>
      )}
      <ToastContainer />
    </div>
  )
}

export default GamesList
