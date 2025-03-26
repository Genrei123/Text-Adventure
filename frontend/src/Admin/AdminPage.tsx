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
  AlertTriangle,
  X,
  User,
  Filter,
  LogOut,
  Gamepad
} from 'lucide-react';
import AdminNavbar from "./Components/adminNavbar";
import MetricCard from './MetricCard';
import SidebarItem from './SidebarItem';
import axiosInstance from '../../config/axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import LoadingBook from '../components/LoadingBook';
import LoadingScreen from '../components/LoadingScreen';

import GamesList from './Games/GamesList';
import GameDetail from './Games/GameDetail';
import GameForm from './Games/GameForm';
import GameStats from './Games/GameStats';
// Configure axios instance to include the admin token in all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors for admin routes
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear admin data and redirect to login
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      toast.error('Your session has expired. Please log in again.');
      window.location.href = '/Admin/Login';
    }
    return Promise.reject(error);
  }
);

// Define interfaces for our data types
interface BannedPlayer {
  id: number;
  userId: number;
  username: string;
  reason: string;
  banType: 'temporary' | 'permanent' | 'reported';
  endDate?: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

interface ReportedPlayer {
  id: number;
  username: string;
  comment: string;
  createdAt: string;
  reportedContent?: string;
}

interface Player {
  id: number;
  username: string;
  email: string;
  subscription: string;
  createdAt: string;
  lastLogin?: Date;
  image_url?: string;
  model?: string;
  emailVerified?: boolean;
  totalCoins?: number;
  updatedAt?: string;
  subscriptionFetched?: boolean;
}

const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  // State for initial loading
  const [initialLoading, setInitialLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // State management
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard'); // Changed default to 'banned' instead of 'dashboard'
  const [activeTab, setActiveTab] = useState("banned"); // "banned" or "reported"
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "ascending",
  });
  const [playersPerPage, setPlayersPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Ban modal state
  const [showBanModal, setShowBanModal] = useState(false);
  const [playerToBan, setPlayerToBan] = useState<{ username: string, id: number } | null>(null);
  const [banReason, setBanReason] = useState("");
  const [banType, setBanType] = useState<'temporary' | 'permanent'>('temporary');
  const [banEndDate, setBanEndDate] = useState("");
  const [usernameSearch, setUsernameSearch] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: number, username: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Player list state
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [playerSearch, setPlayerSearch] = useState('');
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [playerSubscription, setPlayerSubscription] = useState<any>(null);

  // Subscription options
  const subscriptionOptions = [
    { value: 'all', label: 'All Subscriptions' },
    { value: 'Freedom Sword', label: 'Freedom Sword' },
    { value: "Adventurer's Entry", label: "Adventurer's Entry" },
    { value: "Hero's Journey", label: "Hero's Journey" },
    { value: "Legend's Legacy", label: "Legend's Legacy" }
  ];

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    registeredUsers: 0,
    registeredUsersChange: 0,
    activeUsers: 0,
    activeUsersChange: 0,
    totalPlayers: 0,
    totalPlayersChange: 0,
    storiesCreated: 0,
    storiesCreatedChange: 0,
  });

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  // Sample banned players data - will be replaced with API data
  const allBannedPlayers: BannedPlayer[] = [
    {
      id: 1,
      userId: 101,
      username: "Warriorph",
      reason: "N-Word",
      banType: "permanent",
      createdAt: "2023-10-15T14:30:00Z",
      updatedAt: "2023-10-15T14:30:00Z"
    },
    {
      id: 2,
      userId: 102,
      username: "ToxicPlayer42",
      reason: "Harassment",
      banType: "temporary",
      endDate: "2023-12-31T23:59:59Z",
      createdAt: "2023-10-16T09:15:00Z",
      updatedAt: "2023-10-16T09:15:00Z"
    },
    {
      id: 3,
      userId: 103,
      username: "SpamBot99",
      reason: "Spamming",
      banType: "temporary",
      endDate: "2023-11-30T23:59:59Z",
      comment: "Multiple warnings ignored",
      createdAt: "2023-10-17T11:45:00Z",
      updatedAt: "2023-10-17T11:45:00Z"
    }
  ];

  // Sample reported players
  const allReportedPlayers: ReportedPlayer[] = [
    {
      id: 1,
      username: "SuspiciousUser",
      comment: "Using offensive language in chat",
      createdAt: "2023-10-18T16:20:00Z"
    },
    {
      id: 2,
      username: "PotentialBot",
      comment: "Suspicious activity, possible bot account",
      createdAt: "2023-10-19T08:45:00Z"
    }
  ];

  const [bannedPlayers, setBannedPlayers] = useState<BannedPlayer[]>(allBannedPlayers);
  const [reportedPlayers, setReportedPlayers] = useState<ReportedPlayer[]>(allReportedPlayers);

  // Fetch banned players from API
  const fetchBannedPlayers = async () => {
    setIsLoading(true);
    try {
      // Fetch both permanent and temporary bans
      const [permanentResponse, temporaryResponse] = await Promise.all([
        axiosInstance.get('/bans/permanent'),
        axiosInstance.get('/bans/temporary')
      ]);

      // Combine the results
      const allBans = [...permanentResponse.data, ...temporaryResponse.data];
      setBannedPlayers(allBans);
    } catch (error) {
      console.error('Error fetching banned players:', error);
      toast.error('Failed to fetch banned players');
      // Fallback to sample data in case of error
      setBannedPlayers(allBannedPlayers);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch reported players from API
  const fetchReportedPlayers = async () => {
    setIsLoading(true);
    try {
      // Fetch all bans and filter for reported type
      const response = await axiosInstance.get('/bans');
      const reportedBans = response.data.filter((ban: BannedPlayer) => ban.banType === 'reported');

      // Map to ReportedPlayer format
      const reportedPlayers: ReportedPlayer[] = reportedBans.map((ban: BannedPlayer) => ({
        id: ban.id,
        username: ban.username,
        comment: ban.reason || 'No reason provided',
        createdAt: ban.createdAt,
        reportedContent: ban.comment || 'No comment content available'
      }));

      setReportedPlayers(reportedPlayers);
    } catch (error) {
      console.error('Error fetching reported players:', error);
      toast.error('Failed to fetch reported players');
      // Fallback to sample data in case of error
      setReportedPlayers(allReportedPlayers);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUserStr = localStorage.getItem('adminUser');

    if (!adminToken || !adminUserStr) {
      toast.error('You must be logged in as an admin to access this page.');
      navigate('/Admin/Login');
      return;
    }

    try {
      const adminUser = JSON.parse(adminUserStr);
      if (!adminUser || adminUser.admin !== true) {
        toast.error('You do not have admin privileges to access this page.');
        navigate('/Admin/Login');
      } else {
        // Start fade out sequence after authentication is confirmed
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setInitialLoading(false);
          }, 500);
        }, 1000);
      }
    } catch (error) {
      console.error('Error parsing admin user data:', error);
      toast.error('Authentication error. Please log in again.');
      navigate('/Admin/Login');
    }
  }, [navigate]);

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch users with emailVerified=true for registered users count
      const usersResponse = await axiosInstance.get('/admin/verified');

      // Fetch all users for total players count
      const allUsersResponse = await axiosInstance.get('/admin/users');

      // Fetch games count
      const gamesResponse = await axiosInstance.get('/api/metrics/games');

      // Calculate counts
      let registeredUsersCount = 0;
      let totalPlayersCount = 0;
      let gamesCount = 0;

      //Handle different response formats for registered users
      if (usersResponse.data && Array.isArray(usersResponse.data.items)) {
        registeredUsersCount = usersResponse.data.total || usersResponse.data.items.length;
      } else if (Array.isArray(usersResponse.data)) {
        registeredUsersCount = usersResponse.data.length;
      } else if (usersResponse.data && usersResponse.data.users) {
        registeredUsersCount = usersResponse.data.users.length;
      }

      // Handle different response formats for all users
      if (allUsersResponse.data && Array.isArray(allUsersResponse.data.items)) {
        totalPlayersCount = allUsersResponse.data.total || allUsersResponse.data.items.length;
      } else if (Array.isArray(allUsersResponse.data)) {
        totalPlayersCount = allUsersResponse.data.length;
      } else if (allUsersResponse.data && allUsersResponse.data.users) {
        totalPlayersCount = allUsersResponse.data.users.length;
      }

      // Get games count
      if (gamesResponse.data && gamesResponse.data.count) {
        gamesCount = gamesResponse.data.count;
      }

      // Calculate percentage changes (mock data for now)
      // In a real application, you would fetch historical data to calculate these
      const registeredUsersChange = 2.6;
      const totalPlayersChange = 1.8;
      const gamesCountChange = 3.2;

      setDashboardData({
        registeredUsers: registeredUsersCount,
        registeredUsersChange: registeredUsersChange,
        activeUsers: 0, // Not used anymore
        activeUsersChange: 0, // Not used anymore
        totalPlayers: totalPlayersCount,
        totalPlayersChange: totalPlayersChange,
        storiesCreated: gamesCount,
        storiesCreatedChange: gamesCountChange,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');

      // Fallback to sample data
      setDashboardData({
        registeredUsers: 11,
        registeredUsersChange: 2.6,
        activeUsers: 0, // Not used anymore
        activeUsersChange: 0, // Not used anymore
        totalPlayers: 13,
        totalPlayersChange: 0.2,
        storiesCreated: 5,
        storiesCreatedChange: -0.1,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch players from API
  const fetchPlayers = async () => {
    setIsLoading(true);
    try {
      // Use the admin users endpoint instead of /api/players
      const response = await axiosInstance.get('/admin/users', {
        params: {
          search: playerSearch,
          sortBy: sortConfig.key,
          sortOrder: sortConfig.direction === 'ascending' ? 'ASC' : 'DESC',
          page: currentPage,
          limit: playersPerPage
        }
      });

      // Handle different response formats
      let playerData = [];

      if (response.data && Array.isArray(response.data.items)) {
        // Format 1: { items: [...], total: number }
        playerData = response.data.items;
        setTotalPlayers(response.data.total || response.data.items.length);
      } else if (Array.isArray(response.data)) {
        // Format 2: Direct array of users
        playerData = response.data;
        setTotalPlayers(response.data.length);
      } else {
        // Format 3: Single object with users property
        playerData = response.data.users || [];
        setTotalPlayers(playerData.length);
      }

      // Map the data to our Player interface
      const mappedPlayers: Player[] = playerData.map((user: any) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        subscription: 'Freedom Sword', // Default value, will be updated with actual subscription
        createdAt: user.createdAt || user.created_At,
        updatedAt: user.updatedAt || user.updated_At,
        image_url: user.image_url,
        model: user.model,
        emailVerified: user.emailVerified,
        totalCoins: user.totalCoins,
        subscriptionFetched: false,
        lastLogin: user.lastLogin,
      }));

      setPlayers(mappedPlayers);
      setFilteredPlayers(mappedPlayers);

      // Fetch subscription data for each player
      fetchPlayerSubscriptions(mappedPlayers);
    } catch (error) {
      console.error('Error fetching players:', error);
      toast.error('Failed to fetch players. Please check the API endpoint.');
      setPlayers([]);
      setFilteredPlayers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch subscription data for all players
  const fetchPlayerSubscriptions = async (playersList: Player[]) => {
    const updatedPlayers = [...playersList];

    // Process players in batches to avoid too many simultaneous requests
    const batchSize = 5;
    for (let i = 0; i < playersList.length; i += batchSize) {
      const batch = playersList.slice(i, i + batchSize);

      // Create an array of promises for this batch
      const promises = batch.map(player =>
        axiosInstance.get(`/shop/subscription/user/${player.email}`)
          .then(response => {
            // Find the player index
            const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
            if (playerIndex === -1) return;

            // Mark as fetched regardless of result
            updatedPlayers[playerIndex].subscriptionFetched = true;

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
              // Get the most recent active subscription
              const activeSubscriptions = response.data.filter(
                (sub: any) => sub.status === 'active'
              );

              let subscription;
              if (activeSubscriptions.length > 0) {
                // Sort by startDate in descending order to get the most recent one
                const sortedSubscriptions = activeSubscriptions.sort(
                  (a: any, b: any) =>
                    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                );
                subscription = sortedSubscriptions[0];
              } else if (response.data.length > 0) {
                // If no active subscription, get the most recent one regardless of status
                const sortedSubscriptions = response.data.sort(
                  (a: any, b: any) =>
                    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                );
                subscription = sortedSubscriptions[0];
              }

              // Update the player's subscription if found
              if (subscription) {
                updatedPlayers[playerIndex].subscription = subscription.subscriptionType;
              }
            }
            // If no subscription data found, keep the default "Freedom Sword"
          })
          .catch(error => {
            console.error(`Error fetching subscription for ${player.email}:`, error);
            // Mark as fetched even on error
            const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
            if (playerIndex !== -1) {
              updatedPlayers[playerIndex].subscriptionFetched = true;
            }
          })
      );

      // Wait for all promises in this batch to resolve
      await Promise.all(promises);
    }

    // Update the players state with subscription data
    setPlayers(updatedPlayers);

    // Apply any active filters to the updated players
    const filtered = applyFilters(updatedPlayers);
    setFilteredPlayers(filtered);
  };

  // Apply filters to players
  const applyFilters = (playersList: Player[]) => {
    return playersList.filter(player => {
      // Apply subscription filter
      if (subscriptionFilter !== 'all' && player.subscription !== subscriptionFilter) {
        return false;
      }

      // Apply search filter
      if (playerSearch && !player.username.toLowerCase().includes(playerSearch.toLowerCase()) &&
        !player.email.toLowerCase().includes(playerSearch.toLowerCase())) {
        return false;
      }

      return true;
    });
  };

  // Load data when component mounts or section changes
  useEffect(() => {
    if (activeSection === 'banned') {
      if (activeTab === 'banned') {
        fetchBannedPlayers();
      } else if (activeTab === 'reported') {
        fetchReportedPlayers();
      }
    } else if (activeSection === 'players') {
      fetchPlayers();
    }
  }, [activeSection, activeTab]);

  // Fetch players when component mounts or section changes
  useEffect(() => {
    if (activeSection === 'players') {
      fetchPlayers();
    }
  }, [activeSection, currentPage, playersPerPage, sortConfig]);

  // Re-apply filters when search or filter changes
  useEffect(() => {
    if (players.length > 0) {
      const filtered = applyFilters(players);
      setFilteredPlayers(filtered);
    }
  }, [playerSearch, subscriptionFilter, players]);

  // Handle sorting when clicking on table headers
  const requestSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Apply search and sorting for banned players
  useEffect(() => {
    if (activeTab !== 'banned') return;

    // If we're still loading, don't apply search and sort
    if (isLoading) return;

    // Apply search
    if (searchTerm) {
      const filtered = bannedPlayers.filter((player) =>
        Object.values(player).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setBannedPlayers(filtered);
    } else {
      // If search term is cleared, fetch all banned players again
      fetchBannedPlayers();
    }
  }, [searchTerm, activeTab]);

  // Apply sorting for banned players
  const sortBannedPlayers = (players: BannedPlayer[]) => {
    return [...players].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  // Apply sorting when sort config changes
  useEffect(() => {
    if (activeTab === 'banned') {
      const sortedPlayers = sortBannedPlayers(bannedPlayers);
      setBannedPlayers(sortedPlayers);
    } else if (activeTab === 'reported') {
      const sortedPlayers = sortReportedPlayers(reportedPlayers);
      setReportedPlayers(sortedPlayers);
    }
  }, [sortConfig]);

  // Apply search and sorting for reported players
  useEffect(() => {
    if (activeTab !== 'reported') return;

    // If we're still loading, don't apply search and sort
    if (isLoading) return;

    // Apply search
    if (searchTerm) {
      const filtered = reportedPlayers.filter((player) =>
        Object.values(player).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setReportedPlayers(filtered);
    } else {
      // If search term is cleared, fetch all reported players again
      fetchReportedPlayers();
    }
  }, [searchTerm, activeTab]);

  // Apply sorting for reported players
  const sortReportedPlayers = (players: ReportedPlayer[]) => {
    return [...players].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  // Handle unban player
  const handleUnban = async (id: number, username: string) => {
    try {
      await axiosInstance.delete(`/bans/${id}`);
      setBannedPlayers(bannedPlayers.filter(player => player.id !== id));
      toast.success(`${username} has been unbanned!`);
    } catch (error) {
      console.error('Error unbanning player:', error);
      toast.error('Failed to unban player');
    }
  };

  // Search users by username
  const searchUsers = async (term: string) => {
    if (!term || term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axiosInstance.get('/bans/users/search', {
        params: { term }
      });

      if (Array.isArray(response.data)) {
        setSearchResults(response.data.map((user: any) => ({
          id: user.id,
          username: user.username
        })));
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle username search input change
  const handleUsernameSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setUsernameSearch(term);

    // Debounce the search to avoid too many API calls
    const handler = setTimeout(() => {
      searchUsers(term);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  };

  // Select user from search results
  const selectUser = (user: { id: number, username: string }) => {
    setPlayerToBan(user);
    setUsernameSearch(user.username);
    setSearchResults([]);
  };

  // Handle opening the ban modal
  const openBanModal = (username: string, id: number) => {
    setPlayerToBan({ username, id });
    setUsernameSearch(username);
    setShowBanModal(true);
    // Set default end date to 7 days from now
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 7);
    setBanEndDate(defaultEndDate.toISOString().split('T')[0]);
  };

  // Handle closing the ban modal
  const closeBanModal = () => {
    setShowBanModal(false);
    setPlayerToBan(null);
    setBanReason("");
    setBanType('temporary');
    setBanEndDate("");
    setUsernameSearch("");
    setSearchResults([]);
  };

  // Handle ban player
  const handleBanReported = async () => {
    // Check if we have a username (either from playerToBan or usernameSearch)
    if (!usernameSearch || !banReason) {
      toast.error('Please provide both username and reason for the ban');
      return;
    }

    try {
      let userToBan = playerToBan;

      // If the username search doesn't match the playerToBan username,
      // we need to search for the user by the new username
      if (!playerToBan || playerToBan.username !== usernameSearch) {
        // Search for the user by username
        const searchResponse = await axiosInstance.get('/bans/users/search', {
          params: { term: usernameSearch }
        });

        if (!searchResponse.data || searchResponse.data.length === 0) {
          toast.error('User not found. Please check the username.');
          return;
        }

        // Use the first matching user
        userToBan = {
          id: searchResponse.data[0].id,
          username: searchResponse.data[0].username
        };
      }

      // At this point, userToBan should never be null, but let's add a safety check
      if (!userToBan) {
        toast.error('Failed to identify user to ban');
        return;
      }

      // If we're banning from reported list, delete the report first
      if (activeTab === 'reported' && playerToBan) {
        await axiosInstance.delete(`/bans/${playerToBan.id}`);
      }

      // Create the ban
      const banData = {
        userId: userToBan.id,
        username: userToBan.username,
        reason: banReason,
        banType: banType,
        endDate: banType === 'temporary' ? banEndDate : null
      };

      await axiosInstance.post('/bans', banData);

      // Refresh banned players list
      fetchBannedPlayers();

      // If we're in the reported tab, remove from reported players list
      if (activeTab === 'reported' && playerToBan) {
        setReportedPlayers(reportedPlayers.filter(player => player.id !== playerToBan.id));
      }

      toast.success(`${userToBan.username} has been banned!`);
      closeBanModal();
    } catch (error) {
      console.error('Error banning player:', error);
      toast.error('Failed to ban player');
    }
  };

  // Handle dismiss report
  const handleDismissReport = async (id: number) => {
    try {
      await axiosInstance.delete(`/bans/${id}`);
      setReportedPlayers(reportedPlayers.filter(player => player.id !== id));
      toast.success(`Report has been dismissed!`);
    } catch (error) {
      console.error('Error dismissing report:', error);
      toast.error('Failed to dismiss report');
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

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate pagination for banned players
  const indexOfLastBannedPlayer = currentPage * playersPerPage;
  const indexOfFirstBannedPlayer = indexOfLastBannedPlayer - playersPerPage;
  const currentBannedPlayers = bannedPlayers.slice(indexOfFirstBannedPlayer, indexOfLastBannedPlayer);
  const totalBannedPages = Math.ceil(bannedPlayers.length / playersPerPage);

  // Calculate pagination for reported players
  const indexOfLastReportedPlayer = currentPage * playersPerPage;
  const indexOfFirstReportedPlayer = indexOfLastReportedPlayer - playersPerPage;
  const currentReportedPlayers = reportedPlayers.slice(indexOfFirstReportedPlayer, indexOfLastReportedPlayer);
  const totalReportedPages = Math.ceil(reportedPlayers.length / playersPerPage);

  // Calculate pagination for players
  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = filteredPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer);
  const totalPlayerPages = Math.ceil(filteredPlayers.length / playersPerPage);

  // Handle player search
  const handlePlayerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setPlayerSearch(searchTerm);

    // Apply filters to the current players list
    const filtered = applyFilters(players);
    setFilteredPlayers(filtered);
  };

  // Handle subscription filter change
  const handleSubscriptionFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = e.target.value;
    setSubscriptionFilter(filter);

    // Apply filters to the current players list
    const filtered = applyFilters(players);
    setFilteredPlayers(filtered);
  };

  // Fetch player subscription details for the modal
  const fetchPlayerSubscriptionForModal = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/shop/subscription/user/${email}`);

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Get the most recent active subscription
        const activeSubscriptions = response.data.filter(
          (sub: any) => sub.status === 'active'
        );

        if (activeSubscriptions.length > 0) {
          // Sort by startDate in descending order to get the most recent one
          const sortedSubscriptions = activeSubscriptions.sort(
            (a: any, b: any) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
          setPlayerSubscription(sortedSubscriptions[0]);
        } else {
          // If no active subscription, get the most recent one regardless of status
          const sortedSubscriptions = response.data.sort(
            (a: any, b: any) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
          setPlayerSubscription(sortedSubscriptions[0]);
        }
      } else {
        // No subscription data found
        setPlayerSubscription(null);
      }
    } catch (error) {
      console.error('Error fetching player subscription:', error);
      setPlayerSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  // View player details with subscription info
  const viewPlayerDetails = (player: Player) => {
    setSelectedPlayer(player);
    fetchPlayerSubscriptionForModal(player.email);
    setShowPlayerModal(true);
  };

  // Close player modal
  const closePlayerModal = () => {
    setShowPlayerModal(false);
    setSelectedPlayer(null);
  };

  // Ban player from player list
  const banPlayerFromList = (player: Player) => {
    setPlayerToBan({ username: player.username, id: player.id });
    setShowBanModal(true);
    // Set default end date to 7 days from now
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 7);
    setBanEndDate(defaultEndDate.toISOString().split('T')[0]);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    navigate('/Admin/Login');
  };

  // Calculate days remaining for temporary bans
  const calculateDaysRemaining = (endDate: string | undefined) => {
    if (!endDate) return 'N/A';
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = Math.abs(end.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Update the subscription display in the player list
  const getSubscriptionDisplay = (player: Player) => {
    // If the player has a subscription property, use it
    if (player.subscription && player.subscription !== 'Freedom Sword') {
      return player.subscription;
    }

    // Default to Freedom Sword (free tier)
    return 'Freedom Sword';
  };

  // Get subscription badge color
  const getSubscriptionBadgeColor = (subscription: string) => {
    switch (subscription) {
      case "Adventurer's Entry":
        return 'bg-green-800';
      case "Hero's Journey":
        return 'bg-blue-800';
      case "Legend's Legacy":
        return 'bg-purple-800';
      default:
        return 'bg-gray-700'; // Freedom Sword or unknown
    }
  };

  return (
    <>
      {initialLoading && <LoadingScreen fadeIn={fadeIn} fadeOut={fadeOut} />}

      <div className="flex flex-col h-screen overflow-hidden">
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
              <SidebarItem
                icon={<Gamepad className="w-5 h-5" />}
                label="Games"
                active={activeSection === 'games'}
                onClick={() => setActiveSection('games')}
                collapsed={sidebarCollapsed}
              />
            </div>

            {/* Logout button at the bottom of sidebar */}
            <div className="p-2 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                {!sidebarCollapsed && <span className="font-cinzel">Logout</span>}
              </button>
            </div>
          </div>

          {/* Main Content - combining both */}
          <div className="flex-1 overflow-auto bg-[#2F2118] p-6">

            {activeSection === 'dashboard' && (
              <>
                <h1 className="text-3xl font-bold text-white font-cinzel mb-8">Dashboard Overview</h1>

                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <LoadingBook message="Loading dashboard data..." size="md" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <MetricCard
                      title="Total Registered Users"
                      value={dashboardData.registeredUsers}
                      percentChange={dashboardData.registeredUsersChange}
                      icon={<UserPlus className="w-6 h-6" />}
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
                )}

                {/* Dashboard Players Table */}
                <div className="bg-[#1E1512] rounded-lg overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-white table-fixed">
                      <thead>
                        <tr className="bg-[#3D2E22] border-b border-[#2F2118]">
                          <th
                            className="py-4 px-6 font-cinzel cursor-pointer text-left w-1/5"
                            onClick={() => requestSort("username")}
                          >
                            Username {getSortIndicator("username")}
                          </th>
                          <th
                            className="py-4 px-6 font-cinzel cursor-pointer text-left w-1/5"
                            onClick={() => requestSort("email")}
                          >
                            Email {getSortIndicator("email")}
                          </th>
                          <th
                            className="py-4 px-6 font-cinzel cursor-pointer text-left w-1/5"
                            onClick={() => requestSort("subscription")}
                          >
                            Subscription {getSortIndicator("subscription")}
                          </th>
                          <th
                            className="py-4 px-6 font-cinzel cursor-pointer text-left w-1/5"
                            onClick={() => requestSort("coins")}
                          >
                            Coins {getSortIndicator("coins")}
                          </th>
                          <th className="py-4 px-6 font-cinzel text-left w-1/5">Last Login</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td colSpan={5} className="py-4 px-6 text-center">
                              <div className="flex justify-center">
                                <LoadingBook message="Loading players..." size="sm" />
                              </div>
                            </td>
                          </tr>
                        ) : filteredPlayers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-4 px-6 text-center">No players found</td>
                          </tr>
                        ) : (
                          currentPlayers.map((player) => (
                            <tr
                              key={player.id}
                              className="bg-[#6A4E32] border-b border-[#2F2118] hover:bg-[#412e19] transition-colors"
                            >
                              <td className="py-4 px-6 font-playfair text-left truncate">
                                {player.username}
                              </td>
                              <td className="py-4 px-6 font-playfair text-left truncate">
                                {player.email}
                              </td>
                              <td className="py-4 px-6 font-playfair text-left">
                                {player.subscriptionFetched ? (
                                  <span className={`px-2 py-1 rounded text-xs ${getSubscriptionBadgeColor(player.subscription)}`}>
                                    {player.subscription}
                                  </span>
                                ) : (
                                  <div className="flex items-center">
                                    <div className="animate-spin h-4 w-4 border-2 border-[#C0A080] border-t-transparent rounded-full mr-2"></div>
                                    <span className="text-xs">Loading...</span>
                                  </div>
                                )}
                              </td>
                              <td className="py-4 px-6 font-playfair text-left">
                                {player.totalCoins}
                                
                              </td>
                              <td className="py-4 px-6 font-playfair text-left">
                                {new Date(player.lastLogin? player.lastLogin : "").toDateString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination controls for players */}
                  <div className="p-4 bg-[#1E1512] border-t border-[#2F2118] flex flex-wrap items-center justify-between">
                    <div className="flex items-center space-x-2 text-white">
                      <span>Show</span>
                      <select
                        className="bg-[#1E1512] border border-[#6A4E32] rounded px-2 py-1"
                        value={playersPerPage}
                        onChange={(e) => {
                          setPlayersPerPage(Number(e.target.value));
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
                        Page {currentPage} of {totalPlayerPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPlayerPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPlayerPages}
                        className="px-3 py-1 bg-[#3D2E22] rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>

                    <div className="text-white">
                      Showing {indexOfFirstPlayer + 1} to{" "}
                      {Math.min(indexOfLastPlayer, filteredPlayers.length)} of{" "}
                      {filteredPlayers.length} entries
                    </div>
                  </div>
                </div>
              </>
            )}


            {activeSection === 'banned' && (
              <>
                <h1 className="text-white text-3xl font-cinzel mb-6">Banned Players</h1>

                {/* Combined controls row - Search bar, tabs, and filter controls inline */}
                <div className="flex flex-wrap items-center justify-between mb-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      className={`px-4 py-2 rounded-lg font-cinzel ${activeTab === "banned"
                        ? "bg-[#6A4E32] text-white"
                        : "bg-[#3D2E22] text-gray-300 hover:bg-[#4D3E32]"
                        }`}
                      onClick={() => {
                        setActiveTab("banned");
                        setSearchTerm("");
                        setCurrentPage(1);
                      }}
                    >
                      Banned Players
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg font-cinzel ${activeTab === "reported"
                        ? "bg-[#6A4E32] text-white"
                        : "bg-[#3D2E22] text-gray-300 hover:bg-[#4D3E32]"
                        }`}
                      onClick={() => {
                        setActiveTab("reported");
                        setSearchTerm("");
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
                        placeholder={`Search ${activeTab === "banned" ? "banned" : "reported"} players...`}
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                  </div>

                  {/* Add New Ban Button */}
                  <button
                    onClick={() => {
                      setPlayerToBan(null);
                      setShowBanModal(true);
                      // Set default end date to 7 days from now
                      const defaultEndDate = new Date();
                      defaultEndDate.setDate(defaultEndDate.getDate() + 7);
                      setBanEndDate(defaultEndDate.toISOString().split('T')[0]);
                    }}
                    className="px-4 py-2 bg-[#C0A080] hover:bg-[#D5B591] text-black rounded font-cinzel"
                  >
                    Add New Ban
                  </button>
                </div>

                {/* Banned Players Table */}
                {activeTab === "banned" && (
                  <div className="bg-[#1E1512] rounded-lg overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full text-white table-fixed">
                        <thead>
                          <tr className="bg-black">
                            <th
                              className="py-4 px-6 font-cinzel cursor-pointer text-left w-1/5"
                              onClick={() => requestSort("username")}
                            >
                              Username {getSortIndicator("username")}
                            </th>
                            <th
                              className="py-4 px-6 font-cinzel cursor-pointer text-left w-1/5"
                              onClick={() => requestSort("reason")}
                            >
                              Reason {getSortIndicator("reason")}
                            </th>
                            <th
                              className="py-4 px-6 font-cinzel cursor-pointer text-left w-1/5"
                              onClick={() => requestSort("banType")}
                            >
                              Ban Type {getSortIndicator("banType")}
                            </th>
                            <th
                              className="py-4 px-6 font-cinzel cursor-pointer text-left w-1/5"
                              onClick={() => requestSort("createdAt")}
                            >
                              Created At {getSortIndicator("createdAt")}
                            </th>
                            <th
                              className="py-4 px-6 font-cinzel cursor-pointer text-left w-1/5"
                              onClick={() => requestSort("endDate")}
                            >
                              Duration {getSortIndicator("endDate")}
                            </th>
                            <th className="py-4 px-6 font-cinzel text-left w-1/5">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? (
                            <tr>
                              <td colSpan={6} className="py-4 px-6 text-center">
                                <div className="flex justify-center">
                                  <LoadingBook message="Loading players..." size="sm" />
                                </div>
                              </td>
                            </tr>
                          ) : currentBannedPlayers.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-4 px-6 text-center">No banned players found</td>
                            </tr>
                          ) : (
                            currentBannedPlayers.map((player) => (
                              <tr
                                key={player.id}
                                className="bg-[#6A4E32] border-b border-[#2F2118] hover:bg-[#412e19] transition-colors"
                              >
                                <td className="py-4 px-6 font-playfair text-left truncate">
                                  {player.username}
                                </td>
                                <td className="py-4 px-6 font-playfair text-left truncate">
                                  {player.reason}
                                </td>
                                <td className="py-4 px-6 font-playfair text-left">
                                  {player.banType === 'permanent' ? 'Permanent' : 'Temporary'}
                                </td>
                                <td className="py-4 px-6 font-playfair text-left">
                                  {formatDate(player.createdAt)}
                                </td>
                                <td className="py-4 px-6 font-playfair text-left">
                                  {player.banType === 'permanent' ? (
                                    'Permanent'
                                  ) : player.endDate ? (
                                    <div className="relative group">
                                      <span>{formatDate(player.endDate)}</span>
                                      <div className="absolute z-10 invisible group-hover:visible bg-[#2A2A2A] text-white p-2 rounded shadow-lg -mt-1 ml-4">
                                        {calculateDaysRemaining(player.endDate)} days remaining
                                      </div>
                                    </div>
                                  ) : (
                                    'N/A'
                                  )}
                                </td>
                                <td className="py-4 px-6 font-playfair text-left">
                                  <button
                                    onClick={() => handleUnban(player.id, player.username)}
                                    className="px-3 py-1 bg-[#C0A080] hover:bg-[#D5B591] text-black rounded font-cinzel"
                                  >
                                    Unban
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination controls - styled to match the image */}
                    <div className="p-4 bg-[#1E1512] border-t border-[#2F2118] flex flex-wrap items-center justify-between">
                      <div className="flex items-center space-x-2 text-white">
                        <span>Show</span>
                        <select
                          className="bg-[#1E1512] border border-[#6A4E32] rounded px-2 py-1"
                          value={playersPerPage}
                          onChange={(e) => {
                            setPlayersPerPage(Number(e.target.value));
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
                          Page {currentPage} of {totalBannedPages}
                        </span>
                        <button
                          onClick={() =>
                            setCurrentPage(Math.min(totalBannedPages, currentPage + 1))
                          }
                          disabled={currentPage === totalBannedPages}
                          className="px-3 py-1 bg-[#3D2E22] rounded disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>

                      <div className="text-white">
                        Showing {indexOfFirstBannedPlayer + 1} to{" "}
                        {Math.min(indexOfLastBannedPlayer, bannedPlayers.length)} of{" "}
                        {bannedPlayers.length} entries
                      </div>
                    </div>
                  </div>
                )}

                {/* Reported Players Table */}
                {activeTab === "reported" && (
                  <div className="bg-[#1E1512] rounded-lg overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full text-white table-fixed">
                        <thead>
                          <tr className="bg-black">
                            <th
                              className="py-4 px-6 font-cinzel cursor-pointer text-left w-1/5"
                              onClick={() => requestSort("username")}
                            >
                              Username {getSortIndicator("username")}
                            </th>
                            <th
                              className="py-4 px-6 font-cinzel cursor-pointer text-left w-1/5"
                              onClick={() => requestSort("comment")}
                            >
                              Reason {getSortIndicator("comment")}
                            </th>
                            <th
                              className="py-4 px-6 font-cinzel cursor-pointer text-left w-2/5"
                              onClick={() => requestSort("reportedContent")}
                            >
                              Reported Content {getSortIndicator("reportedContent")}
                            </th>
                            <th
                              className="py-4 px-6 font-cinzel cursor-pointer text-left w-1/5"
                              onClick={() => requestSort("createdAt")}
                            >
                              Created At {getSortIndicator("createdAt")}
                            </th>
                            <th className="py-4 px-6 font-cinzel text-left w-1/5">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? (
                            <tr>
                              <td colSpan={5} className="py-4 px-6 text-center">
                                <div className="flex justify-center">
                                  <LoadingBook message="Loading reports..." size="sm" />
                                </div>
                              </td>
                            </tr>
                          ) : currentReportedPlayers.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-4 px-6 text-center">No reported players found</td>
                            </tr>
                          ) : (
                            currentReportedPlayers.map((player) => (
                              <tr
                                key={player.id}
                                className="bg-[#6A4E32] border-b border-[#2F2118] hover:bg-[#412e19] transition-colors"
                              >
                                <td className="py-4 px-6 font-playfair text-left truncate">
                                  {player.username}
                                </td>
                                <td className="py-4 px-6 font-playfair text-left truncate">
                                  {player.comment}
                                </td>
                                <td className="py-4 px-6 font-playfair text-left truncate">
                                  {player.reportedContent}
                                </td>
                                <td className="py-4 px-6 font-playfair text-left">
                                  {formatDate(player.createdAt)}
                                </td>
                                <td className="py-4 px-6 text-left">
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => openBanModal(player.username, player.id)}
                                      className="bg-[#C0A080] hover:bg-[#D5B591] text-black px-3 py-1 rounded font-cinzel text-sm"
                                    >
                                      Ban
                                    </button>
                                    <button
                                      onClick={() => handleDismissReport(player.id)}
                                      className="bg-[#3D2E22] hover:bg-[#4D3E32] text-white px-3 py-1 rounded font-cinzel text-sm"
                                    >
                                      Dismiss
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination controls for reported players */}
                    <div className="p-4 bg-[#1E1512] border-t border-[#2F2118] flex flex-wrap items-center justify-between">
                      <div className="flex items-center space-x-2 text-white">
                        <span>Show</span>
                        <select
                          className="bg-[#1E1512] border border-[#6A4E32] rounded px-2 py-1"
                          value={playersPerPage}
                          onChange={(e) => {
                            setPlayersPerPage(Number(e.target.value));
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
                          Page {currentPage} of {totalReportedPages}
                        </span>
                        <button
                          onClick={() =>
                            setCurrentPage(Math.min(totalReportedPages, currentPage + 1))
                          }
                          disabled={currentPage === totalReportedPages}
                          className="px-3 py-1 bg-[#3D2E22] rounded disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>

                      <div className="text-white">
                        Showing {indexOfFirstReportedPlayer + 1} to{" "}
                        {Math.min(indexOfLastReportedPlayer, reportedPlayers.length)} of{" "}
                        {reportedPlayers.length} entries
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeSection === 'players' && (
              <>
                <h1 className="text-white text-3xl font-cinzel mb-6">Player List</h1>

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
                        value={playerSearch}
                        onChange={handlePlayerSearch}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-gray-400" />
                      <select
                        className="bg-[#1E1512] text-white px-3 py-2 rounded border border-[#6A4E32] focus:ring-2 focus:ring-[#6A4E32] focus:outline-none"
                        value={subscriptionFilter}
                        onChange={handleSubscriptionFilterChange}
                      >
                        <option value="all">All Subscriptions</option>
                        {subscriptionOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Players Table */}
                <div className="bg-[#1E1512] rounded-lg overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-white table-fixed">
                      <thead>
                        <tr className="bg-[#3D2E22] border-b border-[#2F2118]">
                          <th
                            className="py-4 px-6 font-cinzel cursor-pointer text-left w-1/5"
                            onClick={() => requestSort("username")}
                          >
                            Username {getSortIndicator("username")}
                          </th>
                          <th
                            className="py-4 px-6 font-cinzel cursor-pointer text-left w-1/5"
                            onClick={() => requestSort("email")}
                          >
                            Email {getSortIndicator("email")}
                          </th>
                          <th
                            className="py-4 px-6 font-cinzel cursor-pointer text-left w-1/5"
                            onClick={() => requestSort("subscription")}
                          >
                            Subscription {getSortIndicator("subscription")}
                          </th>
                          <th
                            className="py-4 px-6 font-cinzel cursor-pointer text-left w-1/5"
                            onClick={() => requestSort("createdAt")}
                          >
                            Joined {getSortIndicator("createdAt")}
                          </th>
                          <th className="py-4 px-6 font-cinzel text-left w-1/5">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td colSpan={5} className="py-4 px-6 text-center">
                              <div className="flex justify-center">
                                <LoadingBook message="Loading players..." size="sm" />
                              </div>
                            </td>
                          </tr>
                        ) : filteredPlayers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-4 px-6 text-center">No players found</td>
                          </tr>
                        ) : (
                          currentPlayers.map((player) => (
                            <tr
                              key={player.id}
                              className="bg-[#6A4E32] border-b border-[#2F2118] hover:bg-[#412e19] transition-colors"
                            >
                              <td className="py-4 px-6 font-playfair text-left truncate">
                                {player.username}
                              </td>
                              <td className="py-4 px-6 font-playfair text-left truncate">
                                {player.email}
                              </td>
                              <td className="py-4 px-6 font-playfair text-left">
                                {player.subscriptionFetched ? (
                                  <span className={`px-2 py-1 rounded text-xs ${getSubscriptionBadgeColor(player.subscription)}`}>
                                    {player.subscription}
                                  </span>
                                ) : (
                                  <div className="flex items-center">
                                    <div className="animate-spin h-4 w-4 border-2 border-[#C0A080] border-t-transparent rounded-full mr-2"></div>
                                    <span className="text-xs">Loading...</span>
                                  </div>
                                )}
                              </td>
                              <td className="py-4 px-6 font-playfair text-left">
                                {formatDate(player.createdAt)}
                              </td>
                              <td className="py-4 px-6 font-playfair text-left">
                                <button
                                  onClick={() => viewPlayerDetails(player)}
                                  className="px-3 py-1 bg-[#C0A080] hover:bg-[#D5B591] text-black rounded font-cinzel mr-2"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => banPlayerFromList(player)}
                                  className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded font-cinzel"
                                >
                                  Ban
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination controls for players */}
                  <div className="p-4 bg-[#1E1512] border-t border-[#2F2118] flex flex-wrap items-center justify-between">
                    <div className="flex items-center space-x-2 text-white">
                      <span>Show</span>
                      <select
                        className="bg-[#1E1512] border border-[#6A4E32] rounded px-2 py-1"
                        value={playersPerPage}
                        onChange={(e) => {
                          setPlayersPerPage(Number(e.target.value));
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
                        Page {currentPage} of {totalPlayerPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPlayerPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPlayerPages}
                        className="px-3 py-1 bg-[#3D2E22] rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>

                    <div className="text-white">
                      Showing {indexOfFirstPlayer + 1} to{" "}
                      {Math.min(indexOfLastPlayer, filteredPlayers.length)} of{" "}
                      {filteredPlayers.length} entries
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === 'games' && (
              <GamesList />
            )}
          </div>
        </div>
      </div>

      {/* Ban Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2A2A2A] rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-cinzel text-white text-center w-full uppercase">
                {playerToBan ? `Ban Player: ${playerToBan.username}` : 'Add New Ban'}
              </h2>
              <button
                onClick={closeBanModal}
                className="text-gray-400 hover:text-white absolute right-6"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Always show username field, even if playerToBan is set */}
              <div>
                <label className="block text-sm font-cinzel text-white mb-2 uppercase">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    value={usernameSearch}
                    onChange={handleUsernameSearchChange}
                    className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
                    placeholder="Enter username to ban"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-2">
                      <div className="animate-spin h-4 w-4 border-2 border-[#C0A080] border-t-transparent rounded-full"></div>
                    </div>
                  )}

                  {searchResults.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-[#2A2A2A] border border-[#6A4E32] rounded-md shadow-lg max-h-60 overflow-auto">
                      {searchResults.map(user => (
                        <div
                          key={user.id}
                          className="px-4 py-2 hover:bg-[#3D2E22] cursor-pointer text-white"
                          onClick={() => selectUser(user)}
                        >
                          {user.username}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-cinzel text-white mb-2 uppercase">Reason for Ban</label>
                <input
                  type="text"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
                  placeholder="Enter reason for ban"
                />
              </div>

              <div>
                <label className="block text-sm font-cinzel text-white mb-2 uppercase">Ban Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center text-white">
                    <input
                      type="radio"
                      name="banType"
                      checked={banType === 'temporary'}
                      onChange={() => setBanType('temporary')}
                      className="mr-2"
                    />
                    Temporary
                  </label>
                  <label className="flex items-center text-white">
                    <input
                      type="radio"
                      name="banType"
                      checked={banType === 'permanent'}
                      onChange={() => setBanType('permanent')}
                      className="mr-2"
                    />
                    Permanent
                  </label>
                </div>
              </div>

              {banType === 'temporary' && (
                <div>
                  <label className="block text-sm font-cinzel text-white mb-2 uppercase">End Date</label>
                  <input
                    type="date"
                    value={banEndDate}
                    onChange={(e) => setBanEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}

              <div className="flex justify-between space-x-3 mt-6">
                <button
                  onClick={closeBanModal}
                  className="px-4 py-2 bg-[#3D2E22] text-white rounded font-cinzel uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBanReported}
                  disabled={!usernameSearch || !banReason}
                  className={`px-4 py-2 rounded font-cinzel uppercase ${usernameSearch && banReason
                    ? 'bg-[#C0A080] hover:bg-[#D5B591] text-black'
                    : 'bg-gray-500 cursor-not-allowed text-gray-300'
                    }`}
                >
                  Ban Player
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Player Details Modal */}
      {showPlayerModal && selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2A2A2A] rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-cinzel text-white text-center w-full uppercase">
                Player Details
              </h2>
              <button
                onClick={closePlayerModal}
                className="text-gray-400 hover:text-white absolute right-6"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-center mb-4">
                  {selectedPlayer.image_url ? (
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}${selectedPlayer.image_url}`}
                      alt={selectedPlayer.username}
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#B39C7D]"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-[#3D2E22] flex items-center justify-center border-4 border-[#B39C7D]">
                      <span className="text-4xl text-[#B39C7D]">{selectedPlayer.username.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-400">Username</p>
                  <p className="text-white font-semibold">{selectedPlayer.username}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white font-semibold">{selectedPlayer.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Model</p>
                  <p className="text-white font-semibold">{selectedPlayer.model || 'gpt-4'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Email Verified</p>
                  <p className="text-white font-semibold">
                    {selectedPlayer.emailVerified ? (
                      <span className="text-green-500">Yes</span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Total Coins</p>
                  <p className="text-white font-semibold">{selectedPlayer.totalCoins || 0}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Created At</p>
                  <p className="text-white font-semibold">{formatDate(selectedPlayer.createdAt)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Updated At</p>
                  <p className="text-white font-semibold">{formatDate(selectedPlayer.updatedAt || selectedPlayer.createdAt)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Subscription</p>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-24 bg-[#3D2E22] p-3 rounded">
                      <LoadingBook message="Loading subscription..." size="sm" />
                    </div>
                  ) : playerSubscription ? (
                    <div className="bg-[#3D2E22] p-3 rounded">
                      <p className="text-white font-semibold">{playerSubscription.subscriptionType}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-xs text-gray-400">Start Date</p>
                          <p className="text-white text-sm">{formatDate(playerSubscription.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">End Date</p>
                          <p className="text-white text-sm">{playerSubscription.endDate ? formatDate(playerSubscription.endDate) : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Status</p>
                          <p className={`text-sm ${playerSubscription.status === 'active' ? 'text-green-500' : 'text-yellow-500'}`}>
                            {playerSubscription.status.charAt(0).toUpperCase() + playerSubscription.status.slice(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#3D2E22] p-3 rounded">
                      <p className="text-white font-semibold">Freedom Sword</p>
                      <p className="text-sm text-gray-400 mt-1">No active subscription</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => banPlayerFromList(selectedPlayer)}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded font-cinzel"
              >
                Ban Player
              </button>
              <button
                onClick={closePlayerModal}
                className="px-4 py-2 bg-[#3D2E22] text-white rounded font-cinzel"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default AdminPage;