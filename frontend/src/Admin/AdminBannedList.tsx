import React, { useState, useEffect } from "react";
import Sidebar from "./Components/Sidebar";
import AdminNavbar from "./Components/adminNavbar";
import { ChevronUp, ChevronDown, Search } from "lucide-react";

const AdminBanList: React.FC = () => {
  // Sample banned players data (you would fetch this from your backend)
  const allBannedPlayers = [
    {
      username: "Warriorph",
      reason: "N-Word",
      duration: "Permanent",
    },
    {
      username: "Rensu",
      reason: "Racist",
      duration: "Permanent",
    },
    {
      username: "Dogginix",
      reason: "Kobold",
      duration: "0 Days 11 Hours",
    },
    {
      username: "Catchers",
      reason: "Rebellion",
      duration: "0 Days 11 Hours",
    },
    {
      username: "LostNousagi",
      reason: "N-Word",
      duration: "0 Days 11 Hours",
    },
    {
      username: "Nanyopo",
      reason: "Racist",
      duration: "0 Days 11 Hours",
    },
    {
      username: "Mark",
      reason: "Racist",
      duration: "0 Days 11 Hours",
    },
    {
      username: "Mikazuki",
      reason: "N-Word",
      duration: "0 Days 11 Hours",
    },
    // Adding more dummy data to show pagination
    {
      username: "NANeto",
      reason: "Racist",
      duration: "0 Days 8 Hours",
    },
    {
      username: "NANde?",
      reason: "N-Word",
      duration: "0 Days 6 Hours",
    },
    {
      username: "GIANt",
      reason: "Racism",
      duration: "0 Days 5 Hours",
    },
    {
      username: "Dante",
      reason: "N-Word",
      duration: "Permanent",
    },
    {
      username: "LostSausage",
      reason: "Kobold",
      duration: "0 Days 11 Hours",
    },
    {
      username: "NANny",
      reason: "Racist",
      duration: "0 Days 8 Hours",
    },
    {
      username: "MarkAcedo",
      reason: "N-Word",
      duration: "0 Days 6 Hours",
    },
    {
      username: "Mikakikukna",
      reason: "Racist",
      duration: "Permanent",
    },
  ];

  // Sample reported players (for the tab functionality)
  const allReportedPlayers = [
    // You can add sample reported players here if needed
  ];

  // State management
  const [bannedPlayers, setBannedPlayers] = useState(allBannedPlayers);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "ascending",
  });
  const [activeTab, setActiveTab] = useState("banned"); // "banned" or "reported"
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Handle sorting when clicking on table headers
  const requestSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Apply search and sorting
  useEffect(() => {
    let filteredPlayers = [...allBannedPlayers];

    // Apply search
    if (searchTerm) {
      filteredPlayers = filteredPlayers.filter((player) =>
        Object.values(player).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply sorting
    filteredPlayers.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setBannedPlayers(filteredPlayers);
  }, [searchTerm, sortConfig]);

  // Handle unban player
  const handleUnban = (username: string) => {
    // In a real application, you would call your API to unban the player
    // For this example, we'll just remove them from the local state
    setBannedPlayers(bannedPlayers.filter(player => player.username !== username));
    alert(`${username} has been unbanned!`);
  };

  // Get sort indicator for columns
  const getSortIndicator = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="inline w-4 h-4" />
    ) : (
      <ChevronDown className="inline w-4 h-4" />
    );
  };

  // Calculate pagination
  const indexOfLastPlayer = currentPage * entriesPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - entriesPerPage;
  const currentPlayers = bannedPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer);
  const totalPages = Math.ceil(bannedPlayers.length / entriesPerPage);

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <AdminNavbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar fixed on the left */}
        <div className="w-64 bg-[#3D2E22] h-full">
          <Sidebar />
        </div>

        {/* Main content area, scrollable */}
        <div className="flex-1 overflow-y-auto bg-[#2F2118] p-6">
          <h1 className="text-white text-3xl font-cinzel mb-6">Banned Players</h1>

          {/* Combined controls row - Search bar, tabs, and filter controls inline */}
          <div className="flex flex-wrap items-center justify-between mb-6">
            {/* Tab buttons and search bar combined */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                className={`px-4 py-2 rounded-lg font-cinzel ${
                  activeTab === "banned"
                    ? "bg-[#6A4E32] text-white"
                    : "bg-[#3D2E22] text-gray-300 hover:bg-[#4D3E32]"
                }`}
                onClick={() => setActiveTab("banned")}
              >
                Banned Players
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-cinzel ${
                  activeTab === "reported"
                    ? "bg-[#6A4E32] text-white"
                    : "bg-[#3D2E22] text-gray-300 hover:bg-[#4D3E32]"
                }`}
                onClick={() => setActiveTab("reported")}
              >
                Reported Players
              </button>
              
              {/* Search bar */}
              {activeTab === "banned" && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="bg-[#1E1512] text-white pl-10 pr-4 py-2 rounded border border-[#6A4E32] focus:ring-2 focus:ring-[#6A4E32] focus:outline-none"
                    placeholder="Search banned players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Banned Players Table */}
          {activeTab === "banned" && (
            <div className="bg-[#1E1512] rounded-lg overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="bg-black">
                      <th
                        className="py-4 px-6 font-cinzel cursor-pointer text-left"
                        onClick={() => requestSort("username")}
                      >
                        Username {getSortIndicator("username")}
                      </th>
                      <th
                        className="py-4 px-6 font-cinzel cursor-pointer text-left"
                        onClick={() => requestSort("reason")}
                      >
                        Reason for the Ban {getSortIndicator("reason")}
                      </th>
                      <th
                        className="py-4 px-6 font-cinzel cursor-pointer text-left"
                        onClick={() => requestSort("duration")}
                      >
                        Ban Duration {getSortIndicator("duration")}
                      </th>
                      <th className="py-4 px-6 font-cinzel text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPlayers.map((player, index) => (
                      <tr
                        key={index}
                        className="bg-[#6A4E32] border-b border-[#2F2118] hover:bg-[#412e19] transition-colors"
                      >
                        <td className="py-4 px-6 font-playfair">
                          {player.username}
                        </td>
                        <td className="py-4 px-6 font-playfair">
                          {player.reason}
                        </td>
                        <td className="py-4 px-6 font-playfair">
                          {player.duration}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleUnban(player.username)}
                            className="bg-[#C0A080] hover:bg-[#D5B591] text-black px-4 py-1 rounded font-cinzel"
                          >
                            Unban
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls - styled to match the image */}
              <div className="p-4 bg-[#1E1512] border-t border-[#2F2118] flex flex-wrap items-center justify-between">
                <div className="flex items-center space-x-2 text-white">
                  <span>Show</span>
                  <select
                    className="bg-[#1E1512] border border-[#6A4E32] rounded px-2 py-1"
                    value={entriesPerPage}
                    onChange={(e) => {
                      setEntriesPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span>entries</span>
                </div>

                <div className="flex items-center space-x-2 text-white">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-[#3D2E22] rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="bg-[#3D2E22] px-3 py-1 rounded">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-[#3D2E22] rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>

                <div className="text-white">
                  Showing {indexOfFirstPlayer + 1} to{" "}
                  {Math.min(indexOfLastPlayer, bannedPlayers.length)} of{" "}
                  {bannedPlayers.length} entries
                </div>
              </div>
            </div>
          )}

          {/* Reported Players Placeholder */}
          {activeTab === "reported" && (
            <div className="bg-[#1E1512] rounded-lg overflow-hidden shadow-lg p-6 text-white">
              <h2 className="text-xl font-cinzel mb-4">Reported Players</h2>
              {allReportedPlayers.length > 0 ? (
                <p>Reported players list would go here</p>
              ) : (
                <p>No players have been reported.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBanList;