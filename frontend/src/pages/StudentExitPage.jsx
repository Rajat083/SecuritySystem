import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserMinus, AlertCircle } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Label,
  Select,
} from '../components/ui';
import { studentService } from '../services';
import { toast } from 'sonner';

const studentExitSchema = z.object({
  roll_number: z.string()
    .length(8, 'Roll number must be exactly 8 characters')
    .regex(/^[1-9]{2}[A-Za-z]{3}[0-9]{2}[1-9]{1}$/, 'Invalid roll number format (e.g., 21BCS123)'),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  phone_number: z.string()
    .regex(/^[6-9]\d{9}$/, 'Phone number must be 10 digits starting with 6-9'),
  purpose: z.enum(['MARKET', 'HOME'], {
    required_error: 'Please select a purpose',
  }),
  return_by: z.string().optional(),
  gate_number: z.number()
    .int()
    .min(1, 'Gate number must be between 1-10')
    .max(10, 'Gate number must be between 1-10'),
});

export const StudentExitPage = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentExitSchema),
    defaultValues: {
      roll_number: '',
      name: '',
      phone_number: '',
      purpose: 'HOME',
      return_by: '',
      gate_number: 1,
    },
  });

  const purpose = watch('purpose');

  const exitMutation = useMutation({
    mutationFn: studentService.recordExit,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['students']);
      queryClient.invalidateQueries(['logs', 'students']);
      queryClient.invalidateQueries(['students', 'outside']);
      
      if (data.status === 'exit_recorded') {
        toast.success(`Student ${data.roll_number} exited successfully`, {
          duration: 4000,
          position: 'top-center',
        });
        reset();
      } else if (data.status === 'exit_denied') {
        toast.error(`Exit denied: ${data.message}`);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to record exit');
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      gate_number: parseInt(data.gate_number, 10),
    };

    // Convert return_by to ISO datetime if provided
    if (data.return_by) {
      payload.return_by = new Date(data.return_by).toISOString();
    } else {
      delete payload.return_by;
    }

    exitMutation.mutate(payload);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Student Exit</h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">Record student exit from campus</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <UserMinus className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Exit Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roll_number">Roll Number</Label>
              <Input
                id="roll_number"
                placeholder="21BCS123"
                {...register('roll_number')}
                error={errors.roll_number?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register('name')}
                error={errors.name?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                placeholder="9876543210"
                {...register('phone_number')}
                error={errors.phone_number?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of Exit</Label>
              <Select
                id="purpose"
                {...register('purpose')}
                error={errors.purpose?.message}
              >
                <option value="MARKET">Market</option>
                <option value="HOME">Home</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="return_by">Expected Return Time (Optional)</Label>
              <Input
                id="return_by"
                type="datetime-local"
                {...register('return_by')}
                error={errors.return_by?.message}
              />
              <p className="text-xs text-muted-foreground">
                If specified, late returns will be flagged as violations
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gate_number">Gate Number (1-10)</Label>
              <Input
                id="gate_number"
                type="number"
                min="1"
                max="10"
                {...register('gate_number', { valueAsNumber: true })}
                error={errors.gate_number?.message}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={exitMutation.isPending}
            >
              {exitMutation.isPending ? 'Recording Exit...' : 'Record Exit'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="max-w-2xl bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm text-blue-900 dark:text-blue-200">
              <p className="font-medium">Exit Rules:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Student must currently be inside campus</li>
                <li>Return time helps track late returns as violations</li>
                <li>Purpose is recorded for audit and analysis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
