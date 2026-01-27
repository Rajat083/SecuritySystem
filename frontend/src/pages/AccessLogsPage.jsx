import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Download } from 'lucide-react';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  LoadingSpinner,
  Select,
} from '../components/ui';
import { accessLogService } from '../services';
import { formatDate } from '../utils/formatters';

export const AccessLogsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [purposeFilter, setPurposeFilter] = useState('all');

  const { data: studentLogs = [], isLoading: loadingStudents } = useQuery({
    queryKey: ['logs', 'students'],
    queryFn: accessLogService.getStudentLogs,
  });

  const { data: visitorLogs = [], isLoading: loadingVisitors } = useQuery({
    queryKey: ['logs', 'visitors'],
    queryFn: accessLogService.getVisitorLogs,
  });

  const isLoading = loadingStudents || loadingVisitors;

  // Combine and filter logs
  const allLogs = [
    ...studentLogs.map(log => ({ ...log, user_type: 'student' })),
    ...visitorLogs.map(log => ({ ...log, user_type: 'visitor' }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const filteredLogs = allLogs.filter(log => {
    const matchesSearch = searchQuery === '' || 
      log.identifier?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.direction?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.purpose?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
      log.user_type === filterType ||
      (filterType === 'entry' && log.direction === 'IN') ||
      (filterType === 'exit' && log.direction === 'OUT');
    
    const matchesPurpose = purposeFilter === 'all' ||
      (log.user_type === 'student' && log.purpose?.toUpperCase() === purposeFilter);
    
    return matchesSearch && matchesFilter && matchesPurpose;
  });

  const handleExport = async () => {
    try {
      // Export filtered logs as CSV
      const csv = [
        ['Identifier', 'Name', 'Type', 'Direction', 'Purpose', 'Timestamp'],
        ...filteredLogs.map(log => [
          log.identifier || 'N/A',
          log.name || 'N/A',
          log.user_type || 'N/A',
          log.direction || 'N/A',
          log.purpose || 'N/A',
          log.timestamp || 'N/A'
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `access-logs-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Access Logs</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">View and manage access records</p>
        </div>
        <Button onClick={handleExport} className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="student">Students</option>
              <option value="visitor">Visitors</option>
              <option value="entry">Entry</option>
              <option value="exit">Exit</option>
            </Select>
            <Select value={purposeFilter} onChange={(e) => setPurposeFilter(e.target.value)}>
              <option value="all">All Purposes</option>
              <option value="HOME">Home</option>
              <option value="MARKET">Market</option>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Identifier</TableHead>
                  <TableHead className="hidden sm:table-cell">Name</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead className="hidden lg:table-cell">Purpose</TableHead>
                  <TableHead className="hidden xl:table-cell">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log._id}>
                      <TableCell className="font-medium">{log.identifier || 'N/A'}</TableCell>
                      <TableCell className="hidden sm:table-cell">{log.name || 'N/A'}</TableCell>
                      <TableCell className="capitalize hidden md:table-cell">{log.user_type}</TableCell>
                      <TableCell className="capitalize">{log.direction || 'N/A'}</TableCell>
                      <TableCell className="text-sm hidden lg:table-cell">{log.purpose || '-'}</TableCell>
                      <TableCell className="hidden xl:table-cell">{formatDate(log.timestamp)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No logs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
