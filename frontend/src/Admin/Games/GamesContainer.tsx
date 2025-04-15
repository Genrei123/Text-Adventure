"use client"

import { useState } from "react"
import GamesList from "./GamesList"
import GameDetails from "./GameDetail"

interface GamesContainerProps {
  initialView?: "list" | "details"
  initialGameId?: number
}

const GamesContainer = ({ initialView = "list", initialGameId }: GamesContainerProps) => {
  const [activeView, setActiveView] = useState<"list" | "details">(initialView)
  const [selectedGameId, setSelectedGameId] = useState<number | null>(initialGameId || null)
  const [refreshList, setRefreshList] = useState(0)

  const handleViewGame = (gameId: number) => {
    console.log(`Switching to details view for game ID: ${gameId}`)
    setSelectedGameId(gameId)
    setActiveView("details")
  }

  const handleBackToList = () => {
    console.log("Switching back to list view")
    setActiveView("list")
    setSelectedGameId(null)
  }

  const handleGameUpdated = () => {
    // Trigger a refresh of the games list when returning
    setRefreshList((prev) => prev + 1)
  }

  const handleGameDeleted = (gameId: number) => {
    // Trigger a refresh of the games list
    setRefreshList((prev) => prev + 1)
  }

  const handleStatusToggled = (gameId: number, newStatus: string) => {
    // Trigger a refresh of the games list
    setRefreshList((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-[#2F2118]">
      {activeView === "list" ? (
        <GamesList onViewGame={handleViewGame} refreshTrigger={refreshList} />
      ) : (
        <GameDetails
          gameId={selectedGameId!}
          onBack={handleBackToList}
          onGameUpdated={handleGameUpdated}
          onGameDeleted={handleGameDeleted}
          onStatusToggled={handleStatusToggled}
        />
      )}
    </div>
  )
}

export default GamesContainer
