import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService, visitorService, accessLogService, campusStateService } from '../services';
import { QUERY_KEYS } from '../constants';
import { toast } from 'sonner';

/**
 * Hook for students data
 */
export const useStudents = (params = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.STUDENTS, params],
    queryFn: () => studentService.getAll(params),
  });
};

/**
 * Hook for creating student
 */
export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: studentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.STUDENTS);
      toast.success('Student created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create student');
    },
  });
};

/**
 * Hook for visitors data
 */
export const useVisitors = (params = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.VISITORS, params],
    queryFn: () => visitorService.getAll(params),
  });
};

/**
 * Hook for access logs
 */
export const useAccessLogs = (params = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ACCESS_LOGS, params],
    queryFn: () => accessLogService.getAll(params),
  });
};

/**
 * Hook for campus state
 */
export const useCampusState = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CAMPUS_STATE,
    queryFn: campusStateService.getCurrent,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

/**
 * Hook for updating campus state
 */
export const useUpdateCampusState = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: campusStateService.update,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.CAMPUS_STATE);
      toast.success('Campus state updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update campus state');
    },
  });
};
