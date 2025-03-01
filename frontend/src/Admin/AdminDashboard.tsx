import React, { useEffect, useState } from 'react';
import { 
  ArrowLeftRight, Users, UserPlus, Activity, UserX, SortAsc, SortDesc, Search
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Paper, TextField, Button, Chip, FormControl, Select, MenuItem, InputLabel, CircularProgress } from '@mui/material';
import MetricCard from './MetricCard';
import SidebarItem from './SidebarItem';
import BanForm from '../components/BanForm';
import BannedPlayersList from '../components/BannedPlayersList';
import { fetchDashboardStats, fetchPlayers, fetchGamesCount } from '../api/admin';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalVerified: 0,
    activePlayers: 0,
    offlinePlayers: 0,
    activeGames: 0
  });
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastActivity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashboardStats, gamesCount] = await Promise.all([
          fetchDashboardStats(),
          fetchGamesCount()
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

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchQuery, statusFilter, subscriptionFilter, sortBy, sortOrder, pagination.page]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!sidebarCollapsed && <h2 className="text-xl font-bold truncate">Admin Panel</h2>}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-2 space-y-1">
          <SidebarItem 
            icon={<Activity className="w-5 h-5" />} 
            label="Dashboard" 
            active={activeSection === 'dashboard'} 
            onClick={() => setActiveSection('dashboard')}
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
                  <div key={index} className="grid grid-cols-12 gap-4 items-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="col-span-3 font-medium">{player.username}</div>
                    <div className="col-span-2">
                      <Chip
                        label={player.status}
                        size="small"
                        color={player.status === 'online' ? 'success' : 'default'}
                      />
                    </div>
                    <div className="col-span-2">
                      <Chip
                        label={player.subscription}
                        size="small"
                        color={
                          player.subscription === 'Premium' ? 'primary' :
                          player.subscription === 'Pro' ? 'secondary' : 'default'
                        }
                      />
                    </div>
                    <div className="col-span-2 font-medium">
                      {player.coinsBalance.toLocaleString()}
                    </div>
                    <div className="col-span-2 text-sm text-gray-500">
                      {new Date(player.lastActivity).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} - 
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
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
