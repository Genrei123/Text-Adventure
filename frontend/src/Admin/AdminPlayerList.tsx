import React, { useState, useEffect } from "react";
import Sidebar from "./Components/Sidebar";
import AdminNavbar from "./Components/adminNavbar";
import { ChevronUp, ChevronDown, Search } from "lucide-react";

const AdminPlayerList: React.FC = () => {
  // Sample player data (you would fetch this from your backend)
  const allPlayers = [
    {
      username: "Warriorph",
      email: "warriorph@example.com",
      subscription: "Freedom Sword",
      duration: "Free",
      expiration: "Free",
      createdAt: "01/01/2023",
      coins: "0",
    },
    {
      username: "Rensu",
      email: "rensu@example.com",
      subscription: "Adventurer's Entry",
      duration: "1 Month",
      expiration: "02/02/2025",
      createdAt: "05/15/2023",
      coins: "150",
    },
    {
      username: "Dogginix",
      email: "dogginix@example.com",
      subscription: "Hero's Journey",
      duration: "3 Months",
      expiration: "03/03/2025",
      createdAt: "07/22/2023",
      coins: "450",
    },
    {
      username: "Catchers",
      email: "catchers@example.com",
      subscription: "Legend's Legacy",
      duration: "6 Months",
      expiration: "04/04/2025",
      createdAt: "09/10/2023",
      coins: "1200",
    },
    {
      username: "LostNousagi",
      email: "lostnousagi@example.com",
      subscription: "Freedom Sword",
      duration: "Free",
      expiration: "Free",
      createdAt: "10/05/2023",
      coins: "0",
    },
    {
      username: "Nanyopo",
      email: "nanyopo@example.com",
      subscription: "Adventurer's Entry",
      duration: "1 Month",
      expiration: "02/02/2025",
      createdAt: "11/12/2023",
      coins: "75",
    },
    {
      username: "Mark",
      email: "mark@example.com",
      subscription: "Hero's Journey",
      duration: "3 Months",
      expiration: "03/03/2025",
      createdAt: "12/01/2023",
      coins: "320",
    },
    {
      username: "Mikazuki",
      email: "mikazuki@example.com",
      subscription: "Legend's Legacy",
      duration: "6 Months",
      expiration: "04/04/2025",
      createdAt: "01/15/2024",
      coins: "950",
    },
    {
      username: "NANeto",
      email: "naneto@example.com",
      subscription: "Freedom Sword",
      duration: "Free",
      expiration: "Free",
      createdAt: "02/20/2024",
      coins: "0",
    },
    {
      username: "NANde?",
      email: "nande@example.com",
      subscription: "Adventurer's Entry",
      duration: "1 Month",
      expiration: "02/02/2025",
      createdAt: "03/05/2024",
      coins: "100",
    },
    {
      username: "GIANt",
      email: "giant@example.com",
      subscription: "Hero's Journey",
      duration: "3 Months",
      expiration: "03/03/2025",
      createdAt: "03/15/2024",
      coins: "275",
    },
    {
      username: "Dante",
      email: "dante@example.com",
      subscription: "Legend's Legacy",
      duration: "6 Months",
      expiration: "04/04/2025",
      createdAt: "03/30/2024",
      coins: "800",
    },
    {
      username: "LostSausage",
      email: "lostsausage@example.com",
      subscription: "Freedom Sword",
      duration: "Free",
      expiration: "Free",
      createdAt: "04/10/2024",
      coins: "0",
    },
    {
      username: "NANny",
      email: "nanny@example.com",
      subscription: "Adventurer's Entry",
      duration: "1 Month",
      expiration: "02/02/2025",
      createdAt: "04/22/2024",
      coins: "125",
    },
    {
      username: "MarkAcedo",
      email: "markacedo@example.com",
      subscription: "Hero's Journey",
      duration: "3 Months",
      expiration: "03/03/2025",
      createdAt: "05/01/2024",
      coins: "350",
    },
    {
      username: "Mikakikukna",
      email: "mikakikukna@example.com",
      subscription: "Legend's Legacy",
      duration: "6 Months",
      expiration: "04/04/2025",
      createdAt: "05/15/2024",
      coins: "1050",
    },
  ];

  // State management
  const [players, setPlayers] = useState(allPlayers);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "ascending",
  });
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [subscriptionFilter, setSubscriptionFilter] = useState("All");

  // List of available subscription types
  const subscriptionTypes = [
    "All",
    "Freedom Sword",
    "Adventurer's Entry",
    "Hero's Journey",
    "Legend's Legacy",
  ];

  // Handle sorting when clicking on table headers
  const requestSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Apply search, filtering, and sorting
  useEffect(() => {
    let filteredPlayers = [...allPlayers];

    // Apply subscription filter
    if (subscriptionFilter !== "All") {
      filteredPlayers = filteredPlayers.filter(
        (player) => player.subscription === subscriptionFilter
      );
    }

    // Apply search
    if (searchTerm) {
      filteredPlayers = filteredPlayers.filter((player) =>
        Object.values(player).some((value) =>
          value.toLowerCase().includes(searchTerm.toLowerCase())
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

    setPlayers(filteredPlayers);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, sortConfig, subscriptionFilter]);

  // Calculate pagination
  const indexOfLastPlayer =
    entriesPerPage === -1 ? players.length : currentPage * entriesPerPage;
  const indexOfFirstPlayer =
    entriesPerPage === -1 ? 0 : indexOfLastPlayer - entriesPerPage;
  const currentPlayers = players.slice(indexOfFirstPlayer, indexOfLastPlayer);
  const totalPages =
    entriesPerPage === -1 ? 1 : Math.ceil(players.length / entriesPerPage);

  // Get sort indicator for columns
  const getSortIndicator = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="inline w-4 h-4" />
    ) : (
      <ChevronDown className="inline w-4 h-4" />
    );
  };

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
          <h1 className="text-white text-3xl font-cinzel mb-6">Player List</h1>

          {/* Search and filter controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Search bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-[#1E1512] text-white pl-10 pr-4 py-2 rounded border border-[#6A4E32] focus:ring-2 focus:ring-[#6A4E32] focus:outline-none"
                placeholder="Search Playaz..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Subscription filter */}
            <div>
              <select
                className="bg-[#1E1512] text-white px-4 py-2 rounded border border-[#6A4E32] focus:ring-2 focus:ring-[#6A4E32] focus:outline-none"
                value={subscriptionFilter}
                onChange={(e) => setSubscriptionFilter(e.target.value)}
              >
                {subscriptionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "All" ? "All Subscriptions" : type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table container with fixed header */}
          <div className="bg-[#1E1512] rounded-lg overflow-hidden shadow-lg flex flex-col">
            <div className="overflow-x-auto">
              <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                <table className="w-full text-white">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-black">
                      <th
                        className="py-4 px-6 font-cinzel cursor-pointer"
                        onClick={() => requestSort("username")}
                      >
                        Username {getSortIndicator("username")}
                      </th>
                      <th
                        className="py-4 px-6 font-cinzel cursor-pointer"
                        onClick={() => requestSort("email")}
                      >
                        Email {getSortIndicator("email")}
                      </th>
                      <th
                        className="py-4 px-6 font-cinzel cursor-pointer"
                        onClick={() => requestSort("subscription")}
                      >
                        Subscription {getSortIndicator("subscription")}
                      </th>
                      <th
                        className="py-4 px-6 font-cinzel cursor-pointer"
                        onClick={() => requestSort("duration")}
                      >
                        Duration {getSortIndicator("duration")}
                      </th>
                      <th
                        className="py-4 px-6 font-cinzel cursor-pointer"
                        onClick={() => requestSort("expiration")}
                      >
                        Expiry {getSortIndicator("expiration")}
                      </th>
                      <th
                        className="py-4 px-6 font-cinzel cursor-pointer"
                        onClick={() => requestSort("createdAt")}
                      >
                        Created At {getSortIndicator("createdAt")}
                      </th>
                      <th
                        className="py-4 px-6 font-cinzel cursor-pointer"
                        onClick={() => requestSort("coins")}
                      >
                        Coins {getSortIndicator("coins")}
                      </th>
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
                          {player.email}
                        </td>
                        <td className="py-4 px-6 font-playfair">
                          {player.subscription}
                        </td>
                        <td className="py-4 px-6 font-playfair">
                          {player.duration}
                        </td>
                        <td className="py-4 px-6 font-playfair">
                          {player.expiration}
                        </td>
                        <td className="py-4 px-6 font-playfair">
                          {player.createdAt}
                        </td>
                        <td className="py-4 px-6 font-playfair">
                          {player.coins}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination controls */}
            <div className="p-4 bg-[#1E1512] border-t border-[#2F2118] flex flex-wrap items-center justify-between">
              <div className="flex items-center space-x-2 text-white">
                <span>Show</span>
                <select
                  className="bg-[#3D2E22] border border-[#6A4E32] rounded px-2 py-1"
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
                  <option value={-1}>All</option>
                </select>
                <span>entries</span>
              </div>

              {entriesPerPage !== -1 && (
                <div className="flex items-center space-x-2 text-white">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-[#3D2E22] rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>
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
              )}

              <div className="text-white">
                Showing {indexOfFirstPlayer + 1} to{" "}
                {Math.min(indexOfLastPlayer, players.length)} of{" "}
                {players.length} entries
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPlayerList;
