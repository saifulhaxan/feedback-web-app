import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Card, CardContent, Typography, Grid, Chip, Avatar, LinearProgress, IconButton, Tooltip } from '@mui/material';
import { 
  FaPlay, 
  FaPause, 
  FaStop, 
  FaSync, 
  FaChartLine, 
  FaUsers, 
  FaTasks, 
  FaBell,
  FaDownload,
  FaCog,
  FaClock,
  FaChartBar
} from 'react-icons/fa';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { 
  getMonitoringGroupProgress,
  getGroupProjectsProgress,
  getGroupMembersProgress,
  getGroupPerformanceSummary,
  exportGroupProgressReport
} from '../../api/monitoringApi';
import { 
  getProjectProgressDetail,
  resumeProjectProgress,
  pauseProjectProgress
} from '../../api/projectApi';

const MonitoringGroupProgress = ({ groupId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const intervalRef = useRef(null);

  // Queries
  const { data: groupProgress, isLoading: progressLoading, refetch: refetchProgress } = useQuery({
    queryKey: ['monitoringGroupProgress', groupId],
    queryFn: () => getMonitoringGroupProgress(groupId),
    refetchInterval: refreshInterval,
    enabled: !!groupId
  });

  const { data: projectsProgress, isLoading: projectsLoading, refetch: refetchProjects } = useQuery({
    queryKey: ['groupProjectsProgress', groupId],
    queryFn: () => getGroupProjectsProgress(groupId),
    refetchInterval: refreshInterval,
    enabled: !!groupId
  });

  const { data: membersProgress, isLoading: membersLoading, refetch: refetchMembers } = useQuery({
    queryKey: ['groupMembersProgress', groupId],
    queryFn: () => getGroupMembersProgress(groupId),
    refetchInterval: refreshInterval,
    enabled: !!groupId
  });

  const { data: performanceSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ['groupPerformanceSummary', groupId],
    queryFn: () => getGroupPerformanceSummary(groupId),
    refetchInterval: refreshInterval,
    enabled: !!groupId
  });

  // Mutations
  const resumeProjectMutation = useMutation({
    mutationFn: (projectId) => resumeProjectProgress(projectId),
    onSuccess: () => {
      toast.success('Project resumed successfully');
      refetchProjects();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to resume project');
    }
  });

  const pauseProjectMutation = useMutation({
    mutationFn: (projectId) => pauseProjectProgress(projectId),
    onSuccess: () => {
      toast.success('Project paused successfully');
      refetchProjects();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to pause project');
    }
  });

  const exportReportMutation = useMutation({
    mutationFn: (format) => exportGroupProgressReport(groupId, format),
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `monitoring-group-${groupId}-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Report exported successfully');
    },
    onError: (error) => {
      toast.error('Failed to export report');
    }
  });

  // Auto-refresh setup
  useEffect(() => {
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        setLastUpdateTime(new Date());
        refetchProgress();
        refetchProjects();
        refetchMembers();
      }, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval, refetchProgress, refetchProjects, refetchMembers]);

  const handleProjectAction = (projectId, action) => {
    if (action === 'resume') {
      resumeProjectMutation.mutate(projectId);
    } else if (action === 'pause') {
      pauseProjectMutation.mutate(projectId);
    }
  };

  const handleExportReport = (format) => {
    exportReportMutation.mutate(format);
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'warning';
    return 'error';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'in progress': return 'primary';
      case 'paused': return 'warning';
      case 'not started': return 'default';
      default: return 'default';
    }
  };

  if (progressLoading || projectsLoading || membersLoading || summaryLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading monitoring group progress...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Monitoring Group Progress
        </Typography>
                 <Box display="flex" gap={1}>
           <Tooltip title="Refresh">
             <IconButton onClick={() => {
               refetchProgress();
               refetchProjects();
               refetchMembers();
             }}>
               <FaSync />
             </IconButton>
           </Tooltip>
           <Tooltip title="Export Report">
             <IconButton onClick={() => handleExportReport('pdf')}>
               <FaDownload />
             </IconButton>
           </Tooltip>
           <Tooltip title="Settings">
             <IconButton>
               <FaCog />
             </IconButton>
           </Tooltip>
         </Box>
      </Box>

             {/* Navigation Tabs */}
       <Box display="flex" gap={1} mb={3}>
         <Button
           variant={activeTab === 'overview' ? 'contained' : 'outlined'}
           onClick={() => setActiveTab('overview')}
           startIcon={<FaChartBar />}
         >
           Overview
         </Button>
         <Button
           variant={activeTab === 'projects' ? 'contained' : 'outlined'}
           onClick={() => setActiveTab('projects')}
           startIcon={<FaTasks />}
         >
           Projects
         </Button>
         <Button
           variant={activeTab === 'members' ? 'contained' : 'outlined'}
           onClick={() => setActiveTab('members')}
           startIcon={<FaUsers />}
         >
           Members
         </Button>
         <Button
           variant={activeTab === 'timeline' ? 'contained' : 'outlined'}
           onClick={() => setActiveTab('timeline')}
           startIcon={<FaClock />}
         >
           Timeline
         </Button>
       </Box>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <Grid container spacing={3}>
          {/* Group Summary Cards */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                                     <Box>
                     <Typography color="textSecondary" gutterBottom>
                       Total Projects
                     </Typography>
                     <Typography variant="h4">
                       {groupProgress?.totalProjects || 0}
                     </Typography>
                   </Box>
                   <FaTasks color="primary" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                                     <Box>
                     <Typography color="textSecondary" gutterBottom>
                       Active Projects
                     </Typography>
                     <Typography variant="h4">
                       {groupProgress?.activeProjects || 0}
                     </Typography>
                   </Box>
                   <FaPlay color="success" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                                     <Box>
                     <Typography color="textSecondary" gutterBottom>
                       Group Progress
                     </Typography>
                     <Typography variant="h4">
                       {groupProgress?.overallProgress || 0}%
                     </Typography>
                   </Box>
                   <FaChartLine color="primary" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                                     <Box>
                     <Typography color="textSecondary" gutterBottom>
                       Members
                     </Typography>
                     <Typography variant="h4">
                       {groupProgress?.totalMembers || 0}
                     </Typography>
                   </Box>
                   <FaUsers color="primary" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Overall Progress */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Overall Group Progress
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={groupProgress?.overallProgress || 0}
                  color={getProgressColor(groupProgress?.overallProgress || 0)}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="textSecondary" mt={1}>
                  Last updated: {lastUpdateTime.toLocaleTimeString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Performance Summary */}
          {performanceSummary && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">
                        Average Completion Time
                      </Typography>
                      <Typography variant="h6">
                        {performanceSummary.avgCompletionTime || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">
                        Success Rate
                      </Typography>
                      <Typography variant="h6">
                        {performanceSummary.successRate || 0}%
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">
                        Active Members
                      </Typography>
                      <Typography variant="h6">
                        {performanceSummary.activeMembers || 0}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <Grid container spacing={3}>
          {projectsProgress?.projects?.map((project) => (
            <Grid item xs={12} md={6} key={project.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {project.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" mb={1}>
                        {project.problem}
                      </Typography>
                      <Chip
                        label={project.status}
                        color={getStatusColor(project.status)}
                        size="small"
                      />
                    </Box>
                    <Box display="flex" gap={1}>
                                             {project.status === 'In Progress' && (
                         <Tooltip title="Pause Project">
                           <IconButton
                             size="small"
                             onClick={() => handleProjectAction(project.id, 'pause')}
                             disabled={pauseProjectMutation.isLoading}
                           >
                             <FaPause />
                           </IconButton>
                         </Tooltip>
                       )}
                       {project.status === 'Paused' && (
                         <Tooltip title="Resume Project">
                           <IconButton
                             size="small"
                             onClick={() => handleProjectAction(project.id, 'resume')}
                             disabled={resumeProjectMutation.isLoading}
                           >
                             <FaPlay />
                           </IconButton>
                         </Tooltip>
                       )}
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" mb={1}>
                    Progress: {project.progress || 0}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress || 0}
                    color={getProgressColor(project.progress || 0)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Typography variant="body2" color="textSecondary">
                      Started: {new Date(project.startTime).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Due: {new Date(project.endTime).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <Grid container spacing={3}>
          {membersProgress?.members?.map((member) => (
            <Grid item xs={12} md={4} key={member.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar src={member.image} sx={{ mr: 2 }}>
                      {member.firstname?.[0]}{member.lastname?.[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {member.firstname} {member.lastname}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {member.title}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" mb={1}>
                    Assigned Projects: {member.assignedProjects || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mb={1}>
                    Completed: {member.completedProjects || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mb={1}>
                    Average Progress: {member.avgProgress || 0}%
                  </Typography>
                  
                  <LinearProgress
                    variant="determinate"
                    value={member.avgProgress || 0}
                    color={getProgressColor(member.avgProgress || 0)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Group Activity Timeline
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Timeline feature coming soon...
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default MonitoringGroupProgress;
