import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, UserCheck } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  LoadingSpinner,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Select,
} from '../components/ui';
import { analyticsService } from '../services';
import { formatDate } from '../utils/formatters';

export const CampusStatePage = () => {
  const [purposeFilter, setPurposeFilter] = useState('all');
  
  const { data: visitorsInside = [], isLoading: loadingVisitors } = useQuery({
    queryKey: ['visitors', 'inside'],
    queryFn: analyticsService.getVisitorsInside,
  });

  const { data: studentsOutside = [], isLoading: loadingStudents } = useQuery({
    queryKey: ['students', 'outside'],
    queryFn: analyticsService.getStudentsOutside,
  });

  const isLoading = loadingVisitors || loadingStudents;

  const filteredStudents = studentsOutside.filter(student => {
    if (purposeFilter === 'all') return true;
    return student.purpose?.toUpperCase() === purposeFilter;
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Campus State</h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
          View current campus occupancy and activity
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Visitors Inside */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <UserCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Visitors Inside Campus</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {visitorsInside.length} visitor{visitorsInside.length !== 1 ? 's' : ''} currently inside
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {visitorsInside.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Phone Number</TableHead>
                    <TableHead>Number of Guests</TableHead>
                    <TableHead>Entry Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitorsInside.map((visitor) => (
                    <TableRow key={visitor._id}>
                      <TableCell className="font-medium">{visitor.user_name || 'N/A'}</TableCell>
                      <TableCell>{visitor.phone_number || 'N/A'}</TableCell>
                      <TableCell>{visitor.number_of_visitors || 1}</TableCell>
                      <TableCell>{visitor.last_entry_time ? formatDate(visitor.last_entry_time) : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No visitors inside campus
              </p>
            )}
          </CardContent>
        </Card>

        {/* Students Outside */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle>Students Outside Campus</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} currently outside
                </p>
              </div>
              <Select
                value={purposeFilter}
                onChange={(e) => setPurposeFilter(e.target.value)}
                className="w-32"
              >
                <option value="all">All</option>
                <option value="HOME">Home</option>
                <option value="MARKET">Market</option>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredStudents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Identifier (Roll No)</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Exit Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell className="font-medium">{student.user_name || 'N/A'}</TableCell>
                      <TableCell>{student.identifier || 'N/A'}</TableCell>
                      <TableCell>{student.phone_number || 'N/A'}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          student.purpose === 'HOME' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {student.purpose || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>{student.last_exit_time ? formatDate(student.last_exit_time) : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                All students are inside campus
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
