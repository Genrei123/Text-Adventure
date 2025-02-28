import React, { useState } from 'react';
import { 
  ArrowLeftRight, Users, UserPlus, BookOpen, 
  BarChart3, Ban, Plus, CheckCircle, AlertCircle, Clock, Trash2, Wifi, WifiOff, UserCheck, UserX, SortAsc, SortDesc
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Paper, TextField, Button, Chip, Checkbox, IconButton, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import MetricCard from './MetricCard';
import SidebarItem from './SidebarItem';
import BanForm from '../components/BanForm';
import BannedPlayersList from '../components/BannedPlayersList';

// Mock data
const activeUsersData = [
  { time: '00:00', users: 400 },
  { time: '04:00', users: 800 },
  { time: '08:00', users: 600 },
  { time: '12:00', users: 1200 },
  { time: '16:00', users: 900 },
  { time: '20:00', users: 1500 },
];

const recentGames = [
  {
    title: "The Future of Renewable Energy",
    excerpt: "Innovations and Challenges Ahead...",
    created: "32 minutes ago",
    status: "draft",
  },
  {
    title: "AI in Modern Healthcare",
    excerpt: "Exploring the Impact of Artificial Intelligence...",
    created: "1 day ago",
    status: "published",
  },
];

const initialTasks = [
  { id: 1, text: "Prepare Monthly Financial Report", completed: false },
  { id: 2, text: "Review Player Ban Appeals", completed: true },
  { id: 3, text: "Update Game Content Schedule", completed: false },
];

const playerStats = {
  totalRegistered: 4876,
  activePlayers: 2345,
  offlinePlayers: 2531,
  activeSessions: 1892,
};

const playerList = [
  {
    username: "PP_Namias",
    subscription: "Premium",
    status: "online",
    registered: "2025-03-01",
    lastActivity: "2025-03-20T14:30:00",
    coinsBalance: 2450
  },
  {
    username: "Catchers",
    subscription: "Basic",
    status: "offline",
    registered: "2025-02-14",
    lastActivity: "2025-03-18T10:00:00",
    coinsBalance: 1200
  },
  {
    username: "PP_Namias99",
    subscription: "Pro",
    status: "online",
    registered: "2025-03-01",
    lastActivity: "2025-03-19T16:45:00",
    coinsBalance: 3000
  },
  {
    username: "Zyciann",
    subscription: "Free",
    status: "offline",
    registered: "2025-02-25",
    lastActivity: "2025-03-17T08:30:00",
    coinsBalance: 500
  },
  {
    username: "warriorph",
    subscription: "Premium",
    status: "offline",
    registered: "2025-02-25",
    lastActivity: "2025-03-15T14:00:00",
    coinsBalance: 1500
  },
  {
    username: "caps_002",
    subscription: "Basic",
    status: "offline",
    registered: "2025-02-25",
    lastActivity: "2025-03-14T09:00:00",
    coinsBalance: 800
  },
  {
    username: "mika76",
    subscription: "Pro",
    status: "offline",
    registered: "2025-02-25",
    lastActivity: "2025-03-13T11:30:00",
    coinsBalance: 2200
  },
  {
    username: "NANyopo",
    subscription: "Free",
    status: "offline",
    registered: "2025-02-26",
    lastActivity: "2025-03-12T07:45:00",
    coinsBalance: 600
  },
];

const AdminDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState(initialTasks);
  const [bans, setBans] = useState([]);
  const [sortBy, setSortBy] = useState('lastActivity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleBan = (newBan) => {
    setBans([...bans, newBan]);
  };

  const handleUnban = (banId) => {
    setBans(bans.filter(ban => ban.id !== banId));
  };

  const filteredPlayers = playerList
    .filter(player => 
      (statusFilter === 'all' || player.status === statusFilter) &&
      (subscriptionFilter === 'all' || player.subscription === subscriptionFilter)
    )
    .sort((a, b) => {
      const modifier = sortOrder === 'asc' ? 1 : -1;
      switch(sortBy) {
        case 'lastActivity':
          return (new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime()) * modifier;
        case 'coinsBalance':
          return (a.coinsBalance - b.coinsBalance) * modifier;
        case 'registered':
          return (new Date(a.registered).getTime() - new Date(b.registered).getTime()) * modifier;
        default:
          return 0;
      }
    });

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

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
        
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                title="Total Registered Users" 
                value={30000} 
                percentChange={2.6} 
                period="last 7 days"
                icon={<UserPlus className="w-6 h-6" />}
              />
              <MetricCard 
                title="Total Active Users" 
                value={18765} 
                percentChange={2.6} 
                period="last 7 days"
                icon={<Users className="w-6 h-6" />}
              />
              <MetricCard 
                title="Total Players" 
                value={4876} 
                percentChange={0.2} 
                period="last 7 days"
                icon={<Users className="w-6 h-6" />}
              />
              <MetricCard 
                title="Stories Created" 
                value={678} 
                percentChange={-0.1} 
                period="last 7 days"
                icon={<BookOpen className="w-6 h-6" />}
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

        {activeSection === 'banned' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Paper className="p-6 rounded-xl shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Ban a Player</h2>
              <BanForm onBan={handleBan} />
            </Paper>
            <Paper className="p-6 rounded-xl shadow-sm">
              <BannedPlayersList bans={bans} onUnban={handleUnban} />
            </Paper>
          </div>
        )}

        {activeSection === 'players' && (
          <div className="space-y-6">
            {/* Player Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                title="Total Registered" 
                value={playerStats.totalRegistered}
                icon={<UserPlus className="w-6 h-6" />}
              />
              <MetricCard 
                title="Active Players" 
                value={playerStats.activePlayers}
                percentChange={2.6}
                icon={<UserCheck className="w-6 h-6" />}
              />
              <MetricCard 
                title="Offline Players" 
                value={playerStats.offlinePlayers}
                icon={<UserX className="w-6 h-6" />}
              />
              <MetricCard 
                title="Active Sessions" 
                value={playerStats.activeSessions}
                icon={<Wifi className="w-6 h-6" />}
              />
            </div>

            {/* Filter/Sort Controls */}
            <Paper className="p-4 rounded-xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
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
                  <div className="col-span-4 font-medium">Username</div>
                  <div className="col-span-2 font-medium">Status</div>
                  <div className="col-span-2 font-medium">Subscription</div>
                  <div className="col-span-2 font-medium">Coins</div>
                  <div className="col-span-2 font-medium">Last Active</div>
                </div>

                {/* Table Body */}
                {filteredPlayers.map((player, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="col-span-4 font-medium">{player.username}</div>
                    <div className="col-span-2">
                      <Chip
                        label={player.status}
                        size="small"
                        color={player.status === 'online' ? 'success' : 'default'}
                        icon={player.status === 'online' ? 
                          <Wifi className="w-4 h-4" /> : 
                          <WifiOff className="w-4 h-4" />}
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
                    <div className="col-span-2 text-sm text-gray-500">
                      {player.coinsBalance}
                    </div>
                    <div className="col-span-2 text-sm text-gray-500">
                      {new Date(player.lastActivity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </Paper>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
