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
  Pagination,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Flag as FlagIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Report as ReportIcon,
  Block as BlockIcon,
  Person as PersonIcon,
  Movie as MovieIcon,
  Comment as CommentIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityIcon,
  Gavel as ModerationIcon,
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

const ReportCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 12,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
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

const ContentModeration = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);

  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    approvedReports: 0,
    rejectedReports: 0,
    highPriorityReports: 0,
    todayReports: 0,
  });

  // Fetch reports from backend
  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/moderation/reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setReports(data.data.reports || mockReports);
      } else {
        console.error('Failed to fetch reports');
        setReports(mockReports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  // Fetch moderation statistics
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/moderation/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      } else {
        console.error('Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, []);

  useEffect(() => {
    let filtered = reports;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedBy.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(report => report.status === filterStatus);
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(report => report.type === filterType);
    }

    setFilteredReports(filtered);
  }, [reports, searchTerm, filterStatus, filterType]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (event, report) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const handleDialogOpen = (type) => {
    setDialogType(type);
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogType('');
    setActionReason('');
    setSelectedReport(null);
  };

  const handleModerationAction = async () => {
    if (!selectedReport) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let response;
      
      if (dialogType === 'approved' || dialogType === 'rejected') {
        const action = dialogType === 'approved' ? 'approve' : 'reject';
        const endpoint = `http://localhost:5000/api/moderation/${action}/${selectedReport.type}/${selectedReport.contentId}`;
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reason: actionReason, moderatorNotes: actionReason })
        });
      } else {
        // Update report status
        response = await fetch(`http://localhost:5000/api/moderation/reports/${selectedReport.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: dialogType })
        });
      }
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: `Action completed successfully`,
          severity: 'success'
        });
        // Refresh reports
        fetchReports();
      } else {
        throw new Error('Action failed');
      }
    } catch (error) {
      console.error('Error performing action:', error);
      setSnackbar({
        open: true,
        message: 'Failed to perform action',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      handleDialogClose();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'movie': return <MovieIcon />;
      case 'comment': return <CommentIcon />;
      case 'user': return <PersonIcon />;
      default: return <ReportIcon />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ color: 'white', mb: 4, fontWeight: 600 }}>
        Content Moderation
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <StatsCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <ReportIcon sx={{ color: '#3b82f6', fontSize: 40, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {stats.totalReports}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Total Reports
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatsCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <ScheduleIcon sx={{ color: '#f59e0b', fontSize: 40, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {stats.pendingReports}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Pending
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatsCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <ApproveIcon sx={{ color: '#10b981', fontSize: 40, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {stats.approvedReports}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Approved
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatsCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <RejectIcon sx={{ color: '#ef4444', fontSize: 40, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {stats.rejectedReports}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Rejected
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatsCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <PriorityIcon sx={{ color: '#dc2626', fontSize: 40, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {stats.highPriorityReports}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                High Priority
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatsCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <ModerationIcon sx={{ color: '#8b5cf6', fontSize: 40, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                {stats.todayReports}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Today
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
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
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  }}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="movie">Movies</MenuItem>
                  <MenuItem value="comment">Comments</MenuItem>
                  <MenuItem value="user">Users</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                Filter
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <DataTable component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Content</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Reported By</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getTypeIcon(report.type)}
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                        {report.contentTitle}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        ID: {report.contentId}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={report.type}
                    size="small"
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={report.reportedBy.avatar}
                      sx={{ width: 32, height: 32, mr: 1 }}
                    >
                      {report.reportedBy.username[0].toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {report.reportedBy.username}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    {report.reason}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={report.priority}
                    size="small"
                    color={getPriorityColor(report.priority)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={report.status}
                    size="small"
                    color={getStatusColor(report.status)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {formatDate(report.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, report)}
                    sx={{ color: 'white' }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
          sx={{
            '& .MuiPaginationItem-root': {
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        />
      </Box>

      {/* Action Menu */}
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
        <MenuItem onClick={() => handleDialogOpen('view')} sx={{ color: 'white' }}>
          <ViewIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {selectedReport?.status === 'pending' && (
          <>
            <MenuItem onClick={() => handleDialogOpen('approved')} sx={{ color: 'white' }}>
              <ApproveIcon sx={{ mr: 1 }} />
              Approve
            </MenuItem>
            <MenuItem onClick={() => handleDialogOpen('rejected')} sx={{ color: 'white' }}>
              <RejectIcon sx={{ mr: 1 }} />
              Reject
            </MenuItem>
          </>
        )}
        <MenuItem onClick={() => handleDialogOpen('delete')} sx={{ color: 'white' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Report
        </MenuItem>
      </Menu>

      {/* Moderation Action Dialog */}
      <Dialog
        open={dialogOpen && (dialogType === 'approved' || dialogType === 'rejected')}
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
          {dialogType === 'approved' ? 'Approve Report' : 'Reject Report'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
            Please provide a reason for this moderation action:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter reason..."
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleModerationAction}
            variant="contained"
            disabled={loading || !actionReason.trim()}
            color={dialogType === 'approved' ? 'success' : 'error'}
          >
            {loading ? 'Processing...' : (dialogType === 'approved' ? 'Approve' : 'Reject')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        open={dialogOpen && dialogType === 'view'}
        onClose={handleDialogClose}
        maxWidth="md"
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
          Report Details
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Content Title:
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                    {selectedReport.contentTitle}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Content Type:
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                    {selectedReport.type}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Reported By:
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                    {selectedReport.reportedBy.username}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Priority:
                  </Typography>
                  <Chip
                    label={selectedReport.priority}
                    size="small"
                    color={getPriorityColor(selectedReport.priority)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Reason:
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                    {selectedReport.reason}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Description:
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                    {selectedReport.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Status:
                  </Typography>
                  <Chip
                    label={selectedReport.status}
                    size="small"
                    color={getStatusColor(selectedReport.status)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Reported Date:
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                    {formatDate(selectedReport.createdAt)}
                  </Typography>
                </Grid>
                {selectedReport.moderatedBy && (
                  <>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Moderated By:
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                        {selectedReport.moderatedBy.username}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Moderated Date:
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                        {formatDate(selectedReport.moderatedAt)}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="outlined">
            Close
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

export default ContentModeration;