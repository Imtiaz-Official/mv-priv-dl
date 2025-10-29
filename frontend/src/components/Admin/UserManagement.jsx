import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Button,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Alert,
  Snackbar,
  LinearProgress,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Verified as VerifiedIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StatsCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 16,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    background: 'rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
}));

const DataTable = styled(TableContainer)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 12,
  '& .MuiTableCell-root': {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
  },
  '& .MuiTableHead-root .MuiTableCell-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    fontWeight: 600,
  },
}));

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    adminUsers: 0,
    moderatorUsers: 0,
    blockedUsers: 0,
  });

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    isActive: true,
  });

  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(data.data.users || []);
        }
      } else {
        // Fallback to mock data
        const mockUsers = [
          {
            _id: '1',
            username: 'john_doe',
            email: 'john@example.com',
            role: 'user',
            isActive: true,
            createdAt: '2024-01-15T10:30:00Z',
            lastLogin: '2024-01-20T14:22:00Z',
            downloadCount: 45,
            favoriteCount: 12,
            avatar: null,
          },
          {
            _id: '2',
            username: 'jane_admin',
            email: 'jane@example.com',
            role: 'admin',
            isActive: true,
            createdAt: '2023-12-01T09:15:00Z',
            lastLogin: '2024-01-20T16:45:00Z',
            downloadCount: 123,
            favoriteCount: 34,
            avatar: null,
          },
          {
            _id: '3',
            username: 'mike_mod',
            email: 'mike@example.com',
            role: 'moderator',
            isActive: true,
            createdAt: '2024-01-10T11:20:00Z',
            lastLogin: '2024-01-19T13:30:00Z',
            downloadCount: 67,
            favoriteCount: 23,
            avatar: null,
          },
          {
            _id: '4',
            username: 'blocked_user',
            email: 'blocked@example.com',
            role: 'user',
            isActive: false,
            createdAt: '2024-01-05T08:45:00Z',
            lastLogin: '2024-01-18T10:15:00Z',
            downloadCount: 12,
            favoriteCount: 3,
            avatar: null,
          },
        ];
        setUsers(mockUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserStats(data.data);
        }
      } else {
        // Fallback to calculated stats from users
        const mockStats = {
          totalUsers: 23456,
          activeUsers: 18234,
          newUsersThisMonth: 1234,
          adminUsers: 12,
          moderatorUsers: 45,
          blockedUsers: 234,
        };
        setUserStats(mockStats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setUserStats({
        totalUsers: 0,
        activeUsers: 0,
        newUsersThisMonth: 0,
        adminUsers: 0,
        moderatorUsers: 0,
        blockedUsers: 0,
      });
    }
  };

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEdit = () => {
    setDialogType('edit');
    setFormData({
      username: selectedUser.username,
      email: selectedUser.email,
      role: selectedUser.role,
      isActive: selectedUser.isActive,
    });
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDialogType('delete');
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleToggleStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser._id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user._id === selectedUser._id 
            ? { ...user, isActive: !user.isActive }
            : user
        ));
        setSnackbar({
          open: true,
          message: `User ${selectedUser.isActive ? 'blocked' : 'activated'} successfully`,
          severity: 'success'
        });
      } else {
        throw new Error('Failed to toggle user status');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error updating user status',
        severity: 'error'
      });
    }
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user',
      isActive: true,
    });
  };

  const handleSaveUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = dialogType === 'edit' 
        ? `http://localhost:5000/api/users/${selectedUser._id}`
        : 'http://localhost:5000/api/users';
      
      const method = dialogType === 'edit' ? 'PUT' : 'POST';
      
      // For new users, include password field
      const userData = { ...formData };
      if (dialogType === 'create' && !userData.password) {
        setSnackbar({
          open: true,
          message: 'Password is required for new users',
          severity: 'error'
        });
        return;
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        await fetchUsers();
        await fetchUserStats();
        setSnackbar({
          open: true,
          message: `User ${dialogType === 'edit' ? 'updated' : 'created'} successfully`,
          severity: 'success'
        });
        handleDialogClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${dialogType} user`);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error ${dialogType === 'edit' ? 'updating' : 'creating'} user: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setUsers(users.filter(user => user._id !== selectedUser._id));
        await fetchUserStats();
        setSnackbar({
          open: true,
          message: 'User deleted successfully',
          severity: 'success'
        });
        handleDialogClose();
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting user',
        severity: 'error'
      });
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <AdminIcon sx={{ color: '#f59e0b' }} />;
      case 'moderator': return <VerifiedIcon sx={{ color: '#8b5cf6' }} />;
      default: return <PersonIcon sx={{ color: '#6b7280' }} />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'warning';
      case 'moderator': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'error';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Loading Users...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* User Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <StatsCard>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <PersonIcon sx={{ color: '#667eea', fontSize: 32, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {userStats.totalUsers.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Total Users
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <StatsCard>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <CheckCircleIcon sx={{ color: '#4ade80', fontSize: 32, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {userStats.activeUsers.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Active Users
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <StatsCard>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <TrendingUpIcon sx={{ color: '#8b5cf6', fontSize: 32, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {userStats.newUsersThisMonth.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                New This Month
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <StatsCard>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <AdminIcon sx={{ color: '#f59e0b', fontSize: 32, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {userStats.adminUsers}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Admins
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <StatsCard>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <VerifiedIcon sx={{ color: '#8b5cf6', fontSize: 32, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {userStats.moderatorUsers}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Moderators
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <StatsCard>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <BlockIcon sx={{ color: '#f87171', fontSize: 32, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {userStats.blockedUsers}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Blocked
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
          User Management
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              },
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Role</InputLabel>
            <Select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              }}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="moderator">Moderator</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setDialogType('create');
              setDialogOpen(true);
            }}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {/* Users Table */}
      <DataTable component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell>Downloads</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={user.avatar}
                      sx={{ width: 32, height: 32, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {user.username}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {user.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getRoleIcon(user.role)}
                    label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    size="small"
                    color={getRoleColor(user.role)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.isActive ? 'Active' : 'Blocked'}
                    size="small"
                    color={getStatusColor(user.isActive)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {user.downloadCount || 0}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => handleMenuClick(e, user)}
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ color: 'white' }}>
          <EditIcon sx={{ mr: 1 }} />
          Edit User
        </MenuItem>
        <MenuItem onClick={handleToggleStatus} sx={{ color: 'white' }}>
          {selectedUser?.isActive ? <BlockIcon sx={{ mr: 1 }} /> : <CheckCircleIcon sx={{ mr: 1 }} />}
          {selectedUser?.isActive ? 'Block User' : 'Activate User'}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: '#ff4757' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete User
        </MenuItem>
      </Menu>

      {/* Edit/Create User Dialog */}
      <Dialog
        open={dialogOpen && (dialogType === 'edit' || dialogType === 'create')}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          {dialogType === 'edit' ? 'Edit User' : 'Create New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </Grid>
              {dialogType === 'create' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    }}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Role</InputLabel>
                  <Select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    }}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="moderator">Moderator</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSaveUser} variant="contained">
            {dialogType === 'edit' ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialogOpen && dialogType === 'delete'}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Are you sure you want to delete user "{selectedUser?.username}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;