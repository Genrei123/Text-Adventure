import React, { useState, useEffect } from "react";
import Sidebar from "./Components/Sidebar";
import AdminNavbar from "./Components/adminNavbar";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import axiosInstance from "../../config/axiosConfig";
import { useNavigate } from "react-router-dom";

// Configure axios base URL and defaults
// Removed manual axios configuration since it's now handled by axiosInstance

interface Player {
  id: number;
  username: string;
  email: string;
  subscription: string;
  duration: string;
  expiry: string;
  createdAt: string;
  coins: string;
}

const AdminPlayerList: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "ascending",
  });
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [subscriptionFilter, setSubscriptionFilter] = useState("All");
  const [totalPlayers, setTotalPlayers] = useState(0);

  // Check admin status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (!token || !isAdmin) {
      navigate('/login');
    }
  }, [navigate]);

  // List of available subscription types
  const subscriptionTypes = [
    "All",
    "Freedom Sword",
    "Adventurer's Entry",
    "Hero's Journey",
    "Legend's Legacy",
  ];

  // Fetch players from the backend
  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const offset = (currentPage - 1) * entriesPerPage;
      
      const response = await axiosInstance.get('/admin/players', {
        params: {
          search: searchTerm || undefined,
          subscriptionType: subscriptionFilter === "All" ? undefined : subscriptionFilter,
          limit: entriesPerPage,
          offset: offset
        }
      });

      if (response.data && Array.isArray(response.data.players)) {
        setPlayers(response.data.players);
        setTotalPlayers(response.data.total || 0);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err: any) {
      console.error('Error fetching players:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch players. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch players when filters, search, or pagination changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchPlayers();
    }, 300); // Add debounce for search

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, subscriptionFilter, currentPage, entriesPerPage]);

  // Handle sorting when clicking on table headers
  const requestSort = (key: keyof Player) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    // Sort players locally
    const sortedPlayers = [...players].sort((a, b) => {
      if (direction === "ascending") {
        return String(a[key]) > String(b[key]) ? 1 : -1;
      }
      return String(a[key]) < String(b[key]) ? 1 : -1;
    });
    setPlayers(sortedPlayers);
  };

  // Get sort indicator for columns
  const getSortIndicator = (key: keyof Player) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="inline w-4 h-4" />
    ) : (
      <ChevronDown className="inline w-4 h-4" />
    );
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalPlayers / entriesPerPage);

  return (
    <div className="flex flex-col h-screen bg-[#2F2118] overflow-hidden">
      {/* Navbar */}
      <AdminNavbar />

      <div className="flex flex-1 pt-[56px]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area, scrollable */}
        <div className="flex-1 overflow-y-auto ml-0 md:ml-40 lg:ml-60 p-6">
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
                placeholder="Search players..."
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

          {/* Error message */}
          {error && (
            <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Table container with fixed header */}
          <div className="bg-[#1E1512] rounded-lg overflow-hidden shadow-lg flex flex-col">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A4E32]"></div>
              </div>
            ) : (
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
                          onClick={() => requestSort("expiry")}
                        >
                          Expiry {getSortIndicator("expiry")}
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
                      {players.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 font-playfair">
                            No players found
                          </td>
                        </tr>
                      ) : (
                        players.map((player) => (
                          <tr
                            key={player.id}
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
                              {player.expiry}
                            </td>
                            <td className="py-4 px-6 font-playfair">
                              {player.createdAt}
                            </td>
                            <td className="py-4 px-6 font-playfair">
                              {player.coins}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

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

              <div className="text-white">
                Showing {players.length > 0 ? ((currentPage - 1) * entriesPerPage) + 1 : 0} to{" "}
                {Math.min(currentPage * entriesPerPage, totalPlayers)} of{" "}
                {totalPlayers} entries
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPlayerList;
