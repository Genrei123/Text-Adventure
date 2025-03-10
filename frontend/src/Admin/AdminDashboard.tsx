import React, { useEffect, useState } from 'react';
import { 
  ArrowLeftRight, Users, UserPlus, Activity, UserX, SortAsc, SortDesc, Search, Clock, Trash2, Plus, Home
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Paper, TextField, Button, Chip, FormControl, Select, MenuItem, InputLabel, CircularProgress, Checkbox, IconButton } from '@mui/material';
import MetricCard from './MetricCard';
import SidebarItem from './SidebarItem';
import BanForm from '../components/BanForm';
import BannedPlayersList from '../components/BannedPlayersList';
import { fetchDashboardStats, fetchPlayers, fetchGamesCount, fetchAllGames } from '../api/admin';
import axios from 'axios';
import { Player, Game } from '../types';

// Add this at the top of your AdminDashboard component file
const activeUsersData = [
  { time: '00:00', users: 400 },
  { time: '04:00', users: 800 },
  { time: '08:00', users: 600 },
  { time: '12:00', users: 1200 },
  { time: '16:00', users: 900 },
  { time: '20:00', users: 1500 },
];

// Add above your component declaration
const mockRecentGames = [
  {
    title: "Sample Game 1",
    excerpt: "This is a sample game description",
    created: "2 hours ago",
    status: "draft"
  },
  {
    title: "Sample Game 2",
    excerpt: "Another sample game description",
    created: "1 day ago",
    status: "published"
  }
];

// Define color maps
const statusColorMap = {
  "online": "#22C55E",
  "offline": "#6B7280"
};

const subscriptionColorMap = {
  "Free": "#4F46E5",
  "Basic": "#0EA5E9",
  "Pro": "#F59E0B",
  "Premium": "#8B5CF6"
};

const AdminDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({
    totalVerified: 0,
    activePlayers: 0,
    offlinePlayers: 0,
    activeGames: 0
  });
  const [players, setPlayers] = useState<Player[]>([]);
  const [recentGames, setRecentGames] = useState<Game[]>(mockRecentGames);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('username');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState<Array<{
    id: number;
    text: string;
    completed: boolean;
  }>>([]);
  const [error, setError] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashboardStats, gamesCount, gamesResponse] = await Promise.all([
          fetchDashboardStats(),
          fetchGamesCount(),
          fetchAllGames()
        ]);

        setStats({
          totalVerified: dashboardStats.emailVerifiedCount,
          activePlayers: dashboardStats.activePlayersCount,
          offlinePlayers: dashboardStats.offlinePlayersCount,
          activeGames: gamesCount.count
        });

        const playersData = await fetchPlayers({
          search: searchQuery,
          status: statusFilter,
          subscription: subscriptionFilter,
          sortBy,
          sortOrder,
          page: pagination.page,
          limit: pagination.limit
        });
        setPlayers(playersData.items);
        setPagination(prev => ({
          ...prev,
          total: playersData.total
        }));

        setGames(gamesResponse.games);

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchQuery, statusFilter, subscriptionFilter, sortBy, sortOrder, pagination.page, pagination.limit]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: newTask,
        completed: false
      }]);
      setNewTask('');
    }
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          <button onClick={toggleSidebar} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <SidebarItem
            icon={<Home className="w-5 h-5" />}
            label="Home"
            active={activeSection === 'dashboard'}
            onClick={() => setActiveSection('dashboard')}
            collapsed={sidebarCollapsed}
          />
          <SidebarItem
            icon={<Users className="w-5 h-5" />}
            label="Player Directory"
            active={activeSection === 'players'}
            onClick={() => setActiveSection('players')}
            collapsed={sidebarCollapsed}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
        
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                title="Total Verified" 
                value={stats.totalVerified} 
                percentChange={2.6} 
                icon={<UserPlus className="w-6 h-6" />}
              />
              <MetricCard 
                title="Active Players" 
                value={stats.activePlayers} 
                percentChange={2.6} 
                icon={<Users className="w-6 h-6" />}
              />
              <MetricCard 
                title="Offline Players" 
                value={stats.offlinePlayers} 
                icon={<UserX className="w-6 h-6" />}
              />
              <MetricCard 
                title="Active Games" 
                value={stats.activeGames}
                icon={<Activity className="w-6 h-6" />}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Paper className="p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Active Users (24h)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activeUsersData}>
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#6366f1" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Paper>

              <Paper className="p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Game Popularity</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-gray-400">Coming soon...</div>
                </div>
              </Paper>
            </div>

            {/* Recent Activities Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Paper className="p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Recently Created Games</h3>
                  <Button variant="text" color="primary">
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentGames.map((game, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{game.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{game.excerpt}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-400">
                            <Clock className="w-4 h-4 mr-1" />
                            {game.created}
                          </div>
                        </div>
                        <Chip 
                          label={game.status} 
                          size="small"
                          color={game.status === 'published' ? 'success' : 'warning'}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Paper>

              {/* Admin Tasks Section */}
              <Paper className="p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Admin Tasks</h3>
                <div className="flex gap-2 mb-4">
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Add new task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                  />
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleAddTask}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {tasks.map(task => (
                    <div 
                      key={task.id}
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Checkbox
                        checked={task.completed}
                        onChange={() => setTasks(tasks.map(t => 
                          t.id === task.id ? {...t, completed: !t.completed} : t
                        ))}
                        color="primary"
                      />
                      <span className={`flex-1 ml-2 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                        {task.text}
                      </span>
                      <IconButton onClick={() => handleDeleteTask(task.id)} color="error">
                        <Trash2 className="w-5 h-5" />
                      </IconButton>
                    </div>
                  ))}
                </div>
              </Paper>
            </div>
          </div>
        )}

        {activeSection === 'players' && (
          <div className="space-y-6">
            {/* Player Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                title="Total Verified" 
                value={stats.totalVerified} 
                percentChange={2.6} 
                icon={<UserPlus className="w-6 h-6" />}
              />
              <MetricCard 
                title="Active Players" 
                value={stats.activePlayers} 
                percentChange={2.6} 
                icon={<Users className="w-6 h-6" />}
              />
              <MetricCard 
                title="Offline Players" 
                value={stats.offlinePlayers} 
                icon={<UserX className="w-6 h-6" />}
              />
              <MetricCard 
                title="Active Games" 
                value={stats.activeGames}
                icon={<Activity className="w-6 h-6" />}
              />
            </div>

            {/* Search and Filter Controls */}
            <Paper className="p-4 rounded-xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {/* Search Input */}
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <Search className="w-4 h-4 mr-2 text-gray-400" />
                    ),
                  }}
                />

                {/* Existing filter controls */}
                <FormControl size="small" fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="offline">Offline</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel>Subscription</InputLabel>
                  <Select
                    value={subscriptionFilter}
                    onChange={(e) => setSubscriptionFilter(e.target.value)}
                    label="Subscription"
                  >
                    <MenuItem value="all">All Subscriptions</MenuItem>
                    <MenuItem value="Free">Free</MenuItem>
                    <MenuItem value="Basic">Basic</MenuItem>
                    <MenuItem value="Pro">Pro</MenuItem>
                    <MenuItem value="Premium">Premium</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                  >
                    <MenuItem value="lastActivity">Last Activity</MenuItem>
                    <MenuItem value="coinsBalance">Coins Balance</MenuItem>
                    <MenuItem value="registered">Registration Date</MenuItem>
                  </Select>
                </FormControl>

                <Button 
                  variant="outlined" 
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  startIcon={sortOrder === 'asc' ? <SortAsc /> : <SortDesc />}
                >
                  {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </Button>
              </div>
            </Paper>

            {/* Player List Table */}
            <Paper className="p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Player Directory</h3>
                <Button variant="text" color="primary">
                  Export Data
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded-lg">
                  <div className="col-span-3 font-medium">Username</div>
                  <div className="col-span-2 font-medium">Status</div>
                  <div className="col-span-2 font-medium">Subscription</div>
                  <div className="col-span-2 font-medium">Coins</div>
                  <div className="col-span-2 font-medium">Last Active</div>
                </div>

                {/* Table Body */}
                {loading && (
                  <div className="flex justify-center py-8">
                    <CircularProgress />
                  </div>
                )}

                {!loading && players.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No players found matching your criteria
                  </div>
                )}

                {players.map((player, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-center p-4 hover:bg-gray-50 rounded-lg transition-colors even:bg-gray-50">
                    <div className="col-span-3 font-medium flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full mr-2" 
                            style={{ backgroundColor: statusColorMap[player.status] }}></span>
                      {player.username}
                    </div>
                    <div className="col-span-2">
                      <Chip
                        label={player.status}
                        size="small"
                        className="uppercase font-medium text-xs"
                        style={{ 
                          backgroundColor: `${statusColorMap[player.status]}20`,
                          color: statusColorMap[player.status]
                        }}
                      />
                    </div>
                    <div className="col-span-2">
                      <Chip
                        label={player.subscription}
                        size="small"
                        className="font-medium"
                        style={{ 
                          backgroundColor: subscriptionColorMap[player.subscription],
                          color: 'white'
                        }}
                      />
                    </div>
                    <div className="col-span-2 font-medium text-indigo-600">
                      {player.coinsBalance.toLocaleString()}
                    </div>
                    <div className="col-span-2 text-sm text-gray-500">
                      {new Date(player.lastActivity).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  {`Showing ${((pagination.page - 1) * pagination.limit) + 1} - 
                  ${Math.min(pagination.page * pagination.limit, pagination.total)} 
                  of ${pagination.total}`}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    disabled={pagination.page === 1}
                    onClick={() => setPagination(prev => ({...prev, page: prev.page - 1}))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outlined"
                    disabled={pagination.page * pagination.limit >= pagination.total}
                    onClick={() => setPagination(prev => ({...prev, page: prev.page + 1}))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Paper>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
