import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  UserCheck, 
  Activity, 
  AlertTriangle,
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  LoadingSpinner,
} from '../components/ui';
import { analyticsService } from '../services';

const StatCard = ({ title, value, icon: Icon }) => (
  <Card>
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{value}</p>
        </div>
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const DashboardPage = () => {
  const { data: visitorsInside, isLoading: loadingVisitors } = useQuery({
    queryKey: ['visitors', 'inside'],
    queryFn: analyticsService.getVisitorsInside,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: studentsOutside, isLoading: loadingStudents } = useQuery({
    queryKey: ['students', 'outside'],
    queryFn: analyticsService.getStudentsOutside,
    refetchInterval: 30000,
  });

  const { data: studentLogs, isLoading: loadingStudentLogs } = useQuery({
    queryKey: ['logs', 'students'],
    queryFn: analyticsService.getStudentLogs,
    refetchInterval: 30000,
  });

  const { data: visitorLogs, isLoading: loadingVisitorLogs } = useQuery({
    queryKey: ['logs', 'visitors'],
    queryFn: analyticsService.getVisitorLogs,
    refetchInterval: 30000,
  });

  const isLoading = loadingVisitors || loadingStudents || loadingStudentLogs || loadingVisitorLogs;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const visitorsInsideCount = visitorsInside?.length || 0;
  const studentsOutsideCount = studentsOutside?.length || 0;
  const totalLogs = (studentLogs?.length || 0) + (visitorLogs?.length || 0);
  
  // Combine and sort logs by timestamp (most recent first)
  const combinedLogs = [
    ...(studentLogs || []),
    ...(visitorLogs || [])
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  const recentLogs = combinedLogs.slice(0, 5);

  const stats = {
    studentsOutside: studentsOutsideCount,
    visitorsInside: visitorsInsideCount,
    totalLogs: totalLogs,
    recentActivity: recentLogs.length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
          Overview of campus security system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Students Outside"
          value={stats.studentsOutside}
          icon={Users}
        />
        <StatCard
          title="Visitors Inside"
          value={stats.visitorsInside}
          icon={UserCheck}
        />
        <StatCard
          title="Total Logs"
          value={stats.totalLogs}
          icon={Activity}
        />
        <StatCard
          title="Recent Activity"
          value={stats.recentActivity}
          icon={AlertTriangle}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLogs.length > 0 ? (
                recentLogs.map((log, i) => {
                  const displayName = log.name || log.identifier || 'Unknown';
                  const initials = displayName.substring(0, 2).toUpperCase();
                  return (
                    <div key={log._id || i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                          {initials}
                        </div>
                        <div>
                          <p className="font-medium">{displayName}</p>
                          <p className="text-sm text-muted-foreground">
                            {log.direction || 'IN'} {log.purpose ? `- ${log.purpose}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'N/A'}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campus Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Current State</span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Open
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Security Level</span>
                <span className="text-muted-foreground">Normal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Last Updated</span>
                <span className="text-muted-foreground">2 minutes ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
