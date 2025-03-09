import React, { useState, useEffect } from "react";
import Sidebar from "./Components/Sidebar";
import AdminNavbar from "./Components/adminNavbar";
import { ChevronUp, ChevronDown, Search } from "lucide-react";

// Define types for ban reasons and ban types
type BanReason = 'Spamming' | 'Server Rules' | 'Hacked' | 'Cheating' | 'Abusive Language' | 'Advertising';
type BanType = 'Temporary' | 'Permanent' | 'Reported';

interface BannedPlayer {
  id: number;
  userId: number;
  username: string;
  reason: BanReason;
  banType: BanType;
  endDate?: string;
  comment?: string;
  createdAt: string;
}

const AdminBanList: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'banned' | 'reported'>('banned');
  const [bannedPlayers, setBannedPlayers] = useState<BannedPlayer[]>([]);
  const [reportedPlayers, setReportedPlayers] = useState<BannedPlayer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "ascending",
  });
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Available ban reasons and types
  const banReasons: BanReason[] = [
    'Spamming',
    'Server Rules',
    'Hacked',
    'Cheating',
    'Abusive Language',
    'Advertising'
  ];

  const banTypes: BanType[] = [
    'Temporary',
    'Permanent',
    'Reported'
  ];

  // Fetch players based on active tab
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const endpoint = activeTab === 'banned' 
          ? `${import.meta.env.VITE_BACKEND_URL}/api/admin/bans?page=${currentPage}&limit=${entriesPerPage}&banType=ne:Reported`
          : `${import.meta.env.VITE_BACKEND_URL}/api/admin/bans/reported?page=${currentPage}&limit=${entriesPerPage}`;
        
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (activeTab === 'banned') {
          setBannedPlayers(data.bans);
          setTotalItems(data.total);
        } else {
          setReportedPlayers(data.reports);
          setTotalItems(data.total);
        }
      } catch (error) {
        console.error('Failed to fetch players:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [currentPage, entriesPerPage, activeTab]);

  // Handle sorting when clicking on table headers
  const requestSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
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

  // Handle unban/remove report
  const handleAction = async (id: number, action: 'unban' | 'proceed' | 'remove') => {
    try {
      if (action === 'unban' || action === 'remove') {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/bans/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          if (activeTab === 'banned') {
            setBannedPlayers(prev => prev.filter(player => player.id !== id));
          } else {
            setReportedPlayers(prev => prev.filter(player => player.id !== id));
          }
          setTotalItems(prev => prev - 1);
        }
      } else if (action === 'proceed') {
        const report = reportedPlayers.find(p => p.id === id);
        if (!report) return;

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/bans/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            banType: 'Temporary',
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          }),
        });

        if (response.ok) {
          setReportedPlayers(prev => prev.filter(player => player.id !== id));
          setTotalItems(prev => prev - 1);
        }
      }
    } catch (error) {
      console.error('Error handling action:', error);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalItems / entriesPerPage);
  const players = activeTab === 'banned' ? bannedPlayers : reportedPlayers;

  return (
    <div className="flex flex-col h-screen bg-[#2F2118] overflow-hidden">
      {/* Navbar */}
      <AdminNavbar />

      <div className="flex flex-1 pt-[56px]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto ml-0 md:ml-40 lg:ml-60 p-6">
          {/* Controls row */}
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Tab buttons */}
              <button
                className={`px-4 py-2 rounded-lg font-cinzel ${
                  activeTab === 'banned'
                    ? 'bg-[#6A4E32] text-white'
                    : 'bg-[#3D2E22] text-gray-300 hover:bg-[#4D3E32]'
                }`}
                onClick={() => {
                  setActiveTab('banned');
                  setCurrentPage(1);
                }}
              >
                Banned Players
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-cinzel ${
                  activeTab === 'reported'
                    ? 'bg-[#6A4E32] text-white'
                    : 'bg-[#3D2E22] text-gray-300 hover:bg-[#4D3E32]'
                }`}
                onClick={() => {
                  setActiveTab('reported');
                  setCurrentPage(1);
                }}
              >
                Reported Players
              </button>

              {/* Search bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-[#1E1512] text-white pl-10 pr-4 py-2 rounded border border-[#6A4E32] focus:ring-2 focus:ring-[#6A4E32] focus:outline-none"
                  placeholder={`Search ${activeTab === 'banned' ? 'banned' : 'reported'} players...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Players Table */}
          <div className="bg-[#1E1512] rounded-lg overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="bg-black">
                    <th
                      className="py-4 px-6 font-cinzel cursor-pointer text-left"
                      onClick={() => requestSort("userId")}
                    >
                      User ID {getSortIndicator("userId")}
                    </th>
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
                      Reason {getSortIndicator("reason")}
                    </th>
                    {activeTab === 'banned' && (
                      <th
                        className="py-4 px-6 font-cinzel cursor-pointer text-left"
                        onClick={() => requestSort("banType")}
                      >
                        Ban Type {getSortIndicator("banType")}
                      </th>
                    )}
                    <th
                      className="py-4 px-6 font-cinzel cursor-pointer text-left"
                      onClick={() => requestSort(activeTab === 'banned' ? "endDate" : "createdAt")}
                    >
                      {activeTab === 'banned' ? 'End Date' : 'Report Date'} {getSortIndicator(activeTab === 'banned' ? "endDate" : "createdAt")}
                    </th>
                    <th
                      className="py-4 px-6 font-cinzel cursor-pointer text-left"
                      onClick={() => requestSort("comment")}
                    >
                      Comment {getSortIndicator("comment")}
                    </th>
                    <th className="py-4 px-6 font-cinzel text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-4 px-6 text-center font-playfair">
                        Loading...
                      </td>
                    </tr>
                  ) : players.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-4 px-6 text-center font-playfair">
                        No {activeTab === 'banned' ? 'banned' : 'reported'} players found
                      </td>
                    </tr>
                  ) : (
                    players.map((player) => (
                      <tr
                        key={player.id}
                        className="bg-[#6A4E32] border-b border-[#2F2118] hover:bg-[#412e19] transition-colors"
                      >
                        <td className="py-4 px-6 font-playfair">{player.userId}</td>
                        <td className="py-4 px-6 font-playfair">{player.username}</td>
                        <td className="py-4 px-6 font-playfair">{player.reason}</td>
                        {activeTab === 'banned' && (
                          <td className="py-4 px-6 font-playfair">{player.banType}</td>
                        )}
                        <td className="py-4 px-6 font-playfair">
                          {activeTab === 'banned'
                            ? (player.endDate ? new Date(player.endDate).toLocaleDateString() : 'N/A')
                            : new Date(player.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 font-playfair">
                          {player.comment || 'No comment'}
                        </td>
                        <td className="py-4 px-6 text-center space-x-2">
                          {activeTab === 'banned' ? (
                            <button
                              onClick={() => handleAction(player.id, 'unban')}
                              className="bg-[#C0A080] hover:bg-[#D5B591] text-black px-4 py-1 rounded font-cinzel"
                            >
                              Unban
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleAction(player.id, 'proceed')}
                                className="bg-[#C0A080] hover:bg-[#D5B591] text-black px-4 py-1 rounded font-cinzel"
                              >
                                Proceed
                              </button>
                              <button
                                onClick={() => handleAction(player.id, 'remove')}
                                className="bg-[#8B0000] hover:bg-[#A00000] text-white px-4 py-1 rounded font-cinzel ml-2"
                              >
                                Remove
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
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
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-[#3D2E22] rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>

              <div className="text-white">
                Showing {((currentPage - 1) * entriesPerPage) + 1} to{" "}
                {Math.min(currentPage * entriesPerPage, totalItems)} of{" "}
                {totalItems} entries
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBanList;