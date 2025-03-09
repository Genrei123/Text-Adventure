import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Users, 
  UserPlus, 
  BookOpen, 
  BarChart3, 
  Ban,
  ChevronUp,
  ChevronDown,
  Search,
  RefreshCw
} from 'lucide-react';
import Sidebar from './Components/Sidebar';
import AdminNavbar from "./Components/adminNavbar";
import MetricCard from './MetricCard';
import SidebarItem from './SidebarItem';
import axios from 'axios';

interface BannedPlayer {
  id: number;
  userId: number;
  reason: string;
  duration: string;
  User: {
    username: string;
  };
}

interface Player {
  id: number;
  username: string;
  email: string;
  status: string;
  subscription: string;
  createdAt: string;
}

interface ReportedPlayer {
  id: number;
  reportedUserId: number;
  reportedByUserId: number;
  reason: string;
  status: string; // 'pending', 'reviewed', 'dismissed'
  createdAt: string;
  reportedUser: {
    username: string;
  };
  reportedByUser: {
    username: string;
  };
}

const AdminBannedList: React.FC = () => {
  // State management
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState("banned"); // "banned" or "reported"
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "ascending",
  });
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const [bannedPlayers, setBannedPlayers] = useState<BannedPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [players, setPlayers] = useState<Player[]>([]);
  const [playerSearchTerm, setPlayerSearchTerm] = useState("");
  const [playerSortConfig, setPlayerSortConfig] = useState({
    key: "username",
    direction: "ascending",
  });
  const [playerStatus, setPlayerStatus] = useState("all");
  const [playerSubscription, setPlayerSubscription] = useState("all");
  const [playerPage, setPlayerPage] = useState(1);
  const [playerLimit, setPlayerLimit] = useState(10);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);

  const [reportedPlayers, setReportedPlayers] = useState<ReportedPlayer[]>([]);
  const [loadingReported, setLoadingReported] = useState(false);
  const [reportedError, setReportedError] = useState<string | null>(null);
  const [reportedPage, setReportedPage] = useState(1);
  const [reportedLimit, setReportedLimit] = useState(10);
  const [totalReported, setTotalReported] = useState(0);

  // Dashboard data from HEAD version
  const dashboardData = {
    registeredUsers: 234324,
    registeredUsersChange: 2.6,
    activeUsers: 18765,
    activeUsersChange: 2.6,
    totalPlayers: 4876,
    totalPlayersChange: 0.2,
    storiesCreated: 678,
    storiesCreatedChange: -0.1,
  };

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
    let filteredPlayers = [...bannedPlayers];

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

  // Add this useEffect to fetch banned players
  useEffect(() => {
    const fetchBannedPlayers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/bans');
        setBannedPlayers(response.data);
      } catch (err) {
        setError('Failed to fetch banned players');
        console.error('Error fetching banned players:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBannedPlayers();
  }, []);

  // Update the handleUnban function
  const handleUnban = async (userId: number) => {
    try {
      await axios.delete(`/api/admin/bans/${userId}`);
      setBannedPlayers(bannedPlayers.filter(player => player.userId !== userId));
      alert('Player has been unbanned successfully!');
    } catch (err) {
      console.error('Error unbanning player:', err);
      alert('Failed to unban player. Please try again.');
    }
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

  // Add this function to fetch players
  const fetchPlayers = async () => {
    try {
      setLoadingPlayers(true);
      const response = await axios.get('/api/admin/players', {
        params: {
          search: playerSearchTerm,
          status: playerStatus,
          subscription: playerSubscription,
          sortBy: playerSortConfig.key,
          sortOrder: playerSortConfig.direction === 'ascending' ? 'ASC' : 'DESC',
          page: playerPage,
          limit: playerLimit
        }
      });
      setPlayers(response.data.items);
      setTotalPlayers(response.data.total);
    } catch (err) {
      setPlayerError('Failed to fetch players');
      console.error('Error fetching players:', err);
    } finally {
      setLoadingPlayers(false);
    }
  };

  // Add this useEffect to fetch players when the section is active
  useEffect(() => {
    if (activeSection === 'players') {
      fetchPlayers();
    }
  }, [activeSection, playerPage, playerLimit, playerSortConfig, playerStatus, playerSubscription]);

  // Add this function to handle player search
  const handlePlayerSearch = () => {
    setPlayerPage(1); // Reset to first page
    fetchPlayers();
  };

  // Add this function to request sort for players
  const requestPlayerSort = (key: string) => {
    let direction = "ascending";
    if (playerSortConfig.key === key && playerSortConfig.direction === "ascending") {
      direction = "descending";
    }
    setPlayerSortConfig({ key, direction });
  };

  // Add this function to get sort indicator for player columns
  const getPlayerSortIndicator = (key: string) => {
    if (playerSortConfig.key !== key) return null;
    return playerSortConfig.direction === "ascending" ? (
      <ChevronUp className="inline w-4 h-4" />
    ) : (
      <ChevronDown className="inline w-4 h-4" />
    );
  };

  // Add this function to fetch reported players
  const fetchReportedPlayers = async () => {
    try {
      setLoadingReported(true);
      const response = await axios.get('/api/admin/reports', {
        params: {
          page: reportedPage,
          limit: reportedLimit
        }
      });
      setReportedPlayers(response.data.items || []);
      setTotalReported(response.data.total || 0);
    } catch (err) {
      setReportedError('Failed to fetch reported players');
      console.error('Error fetching reported players:', err);
    } finally {
      setLoadingReported(false);
    }
  };

  // Add this useEffect to fetch reported players when the tab is active
  useEffect(() => {
    if (activeSection === 'banned' && activeTab === 'reported') {
      fetchReportedPlayers();
    }
  }, [activeSection, activeTab, reportedPage, reportedLimit]);

  // Add this function to handle report actions
  const handleReportAction = async (reportId: number, action: 'dismiss' | 'ban') => {
    try {
      await axios.put(`/api/admin/reports/${reportId}`, { action });
      
      // Refresh the list after action
      fetchReportedPlayers();
      
      if (action === 'ban') {
        alert('User has been banned based on the report.');
      } else {
        alert('Report has been dismissed.');
      }
    } catch (err) {
      console.error(`Error ${action === 'ban' ? 'banning' : 'dismissing'} report:`, err);
      alert(`Failed to ${action === 'ban' ? 'ban' : 'dismiss'} report. Please try again.`);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar from main branch */}
      <AdminNavbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - merging both sidebar styles */}
        <div className={`bg-[#3D2E22] text-white transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            {!sidebarCollapsed && <h2 className="text-xl font-bold font-cinzel truncate">Admin Panel</h2>}
            <button 
              onClick={toggleSidebar}
              className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-2 space-y-1">
            <SidebarItem 
              icon={<BarChart3 className="w-5 h-5" />} 
              label="Dashboard" 
              active={activeSection === 'dashboard'} 
              onClick={() => setActiveSection('dashboard')}
              collapsed={sidebarCollapsed}
            />
            <SidebarItem 
              icon={<Ban className="w-5 h-5" />} 
              label="Banned Players" 
              active={activeSection === 'banned'} 
              onClick={() => setActiveSection('banned')}
              collapsed={sidebarCollapsed}
            />
            <SidebarItem 
              icon={<Users className="w-5 h-5" />} 
              label="Player List" 
              active={activeSection === 'players'} 
              onClick={() => setActiveSection('players')}
              collapsed={sidebarCollapsed}
            />
          </div>
        </div>

        {/* Main Content - combining both */}
        <div className="flex-1 overflow-hidden bg-[#2F2118] p-6">
          {activeSection === 'dashboard' && (
            <div className="h-full overflow-auto">
              <h1 className="text-3xl font-bold text-white font-cinzel mb-8">Dashboard Overview</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard 
                  title="Total Registered Users" 
                  value={dashboardData.registeredUsers} 
                  percentChange={dashboardData.registeredUsersChange} 
                  icon={<UserPlus className="w-6 h-6" />}
                />
                <MetricCard 
                  title="Total Active Users" 
                  value={dashboardData.activeUsers} 
                  percentChange={dashboardData.activeUsersChange} 
                  icon={<Users className="w-6 h-6" />}
                />
                <MetricCard 
                  title="Total Players" 
                  value={dashboardData.totalPlayers} 
                  percentChange={dashboardData.totalPlayersChange} 
                  icon={<Users className="w-6 h-6" />}
                />
                <MetricCard 
                  title="Stories Created" 
                  value={dashboardData.storiesCreated} 
                  percentChange={dashboardData.storiesCreatedChange} 
                  icon={<BookOpen className="w-6 h-6" />}
                />
              </div>
            </div>
          )}

          {activeSection === 'banned' && (
            <div className="h-full overflow-auto">
              {/* Combined controls row - Search bar, tabs, and filter controls inline */}
              <div className="flex flex-wrap items-center justify-between mb-6">
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
                  {/* <button
                    className={`px-4 py-2 rounded-lg font-cinzel ${
                      activeTab === "reported"
                        ? "bg-[#6A4E32] text-white"
                        : "bg-[#3D2E22] text-gray-300 hover:bg-[#4D3E32]"
                    }`}
                    onClick={() => setActiveTab("reported")}
                  >
                    Reported Players
                  </button> */}
                  
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
                        {loading && (
                          <tr>
                            <td colSpan={4} className="text-center py-4">
                              Loading banned players...
                            </td>
                          </tr>
                        )}
                        {error && (
                          <tr>
                            <td colSpan={4} className="text-center text-red-500 py-4">
                              {error}
                            </td>
                          </tr>
                        )}
                        {currentPlayers.map((player, index) => (
                          <tr
                            key={index}
                            className="bg-[#6A4E32] border-b border-[#2F2118] hover:bg-[#412e19] transition-colors"
                          >
                            <td className="py-4 px-6 font-playfair">
                              {player.User.username}
                            </td>
                            <td className="py-4 px-6 font-playfair">
                              {player.reason}
                            </td>
                            <td className="py-4 px-6 font-playfair">
                              {player.duration}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <button
                                onClick={() => handleUnban(player.userId)}
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
                <div className="bg-[#1E1512] rounded-lg overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-white">
                      <thead>
                        <tr className="bg-black">
                          <th className="py-4 px-6 font-cinzel text-left">Reported User</th>
                          <th className="py-4 px-6 font-cinzel text-left">Reported By</th>
                          <th className="py-4 px-6 font-cinzel text-left">Reason</th>
                          <th className="py-4 px-6 font-cinzel text-left">Status</th>
                          <th className="py-4 px-6 font-cinzel text-left">Date Reported</th>
                          <th className="py-4 px-6 font-cinzel text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingReported && (
                          <tr>
                            <td colSpan={6} className="text-center py-4">
                              Loading reported players...
                            </td>
                          </tr>
                        )}
                        {reportedError && (
                          <tr>
                            <td colSpan={6} className="text-center text-red-500 py-4">
                              {reportedError}
                            </td>
                          </tr>
                        )}
                        {!loadingReported && !reportedError && reportedPlayers.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center py-4">
                              No reported players found
                            </td>
                          </tr>
                        )}
                        {reportedPlayers.map((report) => (
                          <tr
                            key={report.id}
                            className="bg-[#6A4E32] border-b border-[#2F2118] hover:bg-[#412e19] transition-colors"
                          >
                            <td className="py-4 px-6 font-playfair">
                              {report.reportedUser.username}
                            </td>
                            <td className="py-4 px-6 font-playfair">
                              {report.reportedByUser.username}
                            </td>
                            <td className="py-4 px-6 font-playfair">
                              {report.reason}
                            </td>
                            <td className="py-4 px-6 font-playfair">
                              <span className={`px-2 py-1 rounded text-xs ${
                                report.status === 'pending' ? 'bg-yellow-800' : 
                                report.status === 'reviewed' ? 'bg-green-800' : 'bg-gray-800'
                              }`}>
                                {report.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-playfair">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <button
                                onClick={() => handleReportAction(report.id, 'ban')}
                                className="bg-red-800 hover:bg-red-700 text-white px-3 py-1 rounded font-cinzel mr-2"
                                disabled={report.status !== 'pending'}
                              >
                                Ban User
                              </button>
                              <button
                                onClick={() => handleReportAction(report.id, 'dismiss')}
                                className="bg-[#3D2E22] hover:bg-[#4D3E32] text-white px-3 py-1 rounded font-cinzel"
                                disabled={report.status !== 'pending'}
                              >
                                Dismiss
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination controls */}
                  <div className="p-4 bg-[#1E1512] border-t border-[#2F2118] flex flex-wrap items-center justify-between">
                    <div className="flex items-center space-x-2 text-white">
                      <span>Show</span>
                      <select
                        className="bg-[#1E1512] border border-[#6A4E32] rounded px-2 py-1"
                        value={reportedLimit}
                        onChange={(e) => {
                          setReportedLimit(Number(e.target.value));
                          setReportedPage(1);
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
                        onClick={() => setReportedPage(Math.max(1, reportedPage - 1))}
                        disabled={reportedPage === 1}
                        className="px-3 py-1 bg-[#3D2E22] rounded disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="bg-[#3D2E22] px-3 py-1 rounded">
                        Page {reportedPage} of {Math.ceil(totalReported / reportedLimit) || 1}
                      </span>
                      <button
                        onClick={() => setReportedPage(Math.min(Math.ceil(totalReported / reportedLimit), reportedPage + 1))}
                        disabled={reportedPage >= Math.ceil(totalReported / reportedLimit)}
                        className="px-3 py-1 bg-[#3D2E22] rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>

                    <div className="text-white">
                      Showing {(reportedPage - 1) * reportedLimit + 1} to{" "}
                      {Math.min(reportedPage * reportedLimit, totalReported)} of{" "}
                      {totalReported} entries
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'players' && (
            <div className="h-full overflow-auto">
              
              {/* Search and filter controls */}
              <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="bg-[#1E1512] text-white pl-10 pr-4 py-2 rounded border border-[#6A4E32] focus:ring-2 focus:ring-[#6A4E32] focus:outline-none"
                      placeholder="Search players..."
                      value={playerSearchTerm}
                      onChange={(e) => setPlayerSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePlayerSearch()}
                    />
                  </div>
                  <button
                    onClick={handlePlayerSearch}
                    className="bg-[#6A4E32] text-white px-4 py-2 rounded hover:bg-[#7A5E42]"
                  >
                    Search
                  </button>
                </div>
                
                <div className="flex items-center gap-4">
                  <select
                    className="bg-[#1E1512] text-white px-4 py-2 rounded border border-[#6A4E32]"
                    value={playerStatus}
                    onChange={(e) => setPlayerStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  
                  <select
                    className="bg-[#1E1512] text-white px-4 py-2 rounded border border-[#6A4E32]"
                    value={playerSubscription}
                    onChange={(e) => setPlayerSubscription(e.target.value)}
                  >
                    <option value="all">All Subscriptions</option>
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                  
                  <button
                    onClick={fetchPlayers}
                    className="bg-[#3D2E22] text-white p-2 rounded hover:bg-[#4D3E32]"
                    title="Refresh"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
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
                          onClick={() => requestPlayerSort("username")}
                        >
                          Username {getPlayerSortIndicator("username")}
                        </th>
                        <th
                          className="py-4 px-6 font-cinzel cursor-pointer text-left"
                          onClick={() => requestPlayerSort("email")}
                        >
                          Email {getPlayerSortIndicator("email")}
                        </th>
                        <th
                          className="py-4 px-6 font-cinzel cursor-pointer text-left"
                          onClick={() => requestPlayerSort("status")}
                        >
                          Status {getPlayerSortIndicator("status")}
                        </th>
                        <th
                          className="py-4 px-6 font-cinzel cursor-pointer text-left"
                          onClick={() => requestPlayerSort("subscription")}
                        >
                          Subscription {getPlayerSortIndicator("subscription")}
                        </th>
                        <th
                          className="py-4 px-6 font-cinzel cursor-pointer text-left"
                          onClick={() => requestPlayerSort("createdAt")}
                        >
                          Joined {getPlayerSortIndicator("createdAt")}
                        </th>
                        <th className="py-4 px-6 font-cinzel text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingPlayers && (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            Loading players...
                          </td>
                        </tr>
                      )}
                      {playerError && (
                        <tr>
                          <td colSpan={6} className="text-center text-red-500 py-4">
                            {playerError}
                          </td>
                        </tr>
                      )}
                      {!loadingPlayers && !playerError && players.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            No players found
                          </td>
                        </tr>
                      )}
                      {players.map((player) => (
                        <tr
                          key={player.id}
                          className="bg-[#6A4E32] border-b border-[#2F2118] hover:bg-[#412e19] transition-colors"
                        >
                          <td className="py-4 px-6 font-playfair">{player.username}</td>
                          <td className="py-4 px-6 font-playfair">{player.email}</td>
                          <td className="py-4 px-6 font-playfair">
                            <span className={`px-2 py-1 rounded text-xs ${
                              player.status === 'active' ? 'bg-green-800' : 
                              player.status === 'inactive' ? 'bg-gray-800' : 'bg-red-800'
                            }`}>
                              {player.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-playfair">
                            <span className={`px-2 py-1 rounded text-xs ${
                              player.subscription === 'premium' ? 'bg-yellow-800' : 'bg-blue-800'
                            }`}>
                              {player.subscription}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-playfair">
                            {new Date(player.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => alert(`View profile for ${player.username}`)}
                              className="bg-[#C0A080] hover:bg-[#D5B591] text-black px-3 py-1 rounded font-cinzel mr-2"
                            >
                              View
                            </button>
                            <button
                              onClick={() => alert(`Ban ${player.username}`)}
                              className="bg-red-800 hover:bg-red-700 text-white px-3 py-1 rounded font-cinzel"
                            >
                              Ban
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination controls */}
                <div className="p-4 bg-[#1E1512] border-t border-[#2F2118] flex flex-wrap items-center justify-between">
                  <div className="flex items-center space-x-2 text-white">
                    <span>Show</span>
                    <select
                      className="bg-[#1E1512] border border-[#6A4E32] rounded px-2 py-1"
                      value={playerLimit}
                      onChange={(e) => {
                        setPlayerLimit(Number(e.target.value));
                        setPlayerPage(1);
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
                      onClick={() => setPlayerPage(Math.max(1, playerPage - 1))}
                      disabled={playerPage === 1}
                      className="px-3 py-1 bg-[#3D2E22] rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="bg-[#3D2E22] px-3 py-1 rounded">
                      Page {playerPage} of {Math.ceil(totalPlayers / playerLimit) || 1}
                    </span>
                    <button
                      onClick={() => setPlayerPage(Math.min(Math.ceil(totalPlayers / playerLimit), playerPage + 1))}
                      disabled={playerPage >= Math.ceil(totalPlayers / playerLimit)}
                      className="px-3 py-1 bg-[#3D2E22] rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>

                  <div className="text-white">
                    Showing {(playerPage - 1) * playerLimit + 1} to{" "}
                    {Math.min(playerPage * playerLimit, totalPlayers)} of{" "}
                    {totalPlayers} entries
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBannedList;