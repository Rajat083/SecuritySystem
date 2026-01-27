import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, AlertCircle } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Label,
} from '../components/ui';
import { visitorService } from '../services';
import { toast } from 'sonner';

const visitorEntrySchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  phone_number: z.string()
    .regex(/^[6-9]\d{9}$/, 'Phone number must be 10 digits starting with 6-9'),
  number_of_visitors: z.number()
    .int()
    .min(1, 'At least 1 visitor required')
    .max(20, 'Maximum 20 visitors allowed'),
  vehicle_number: z.string()
    .regex(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/, 'Invalid vehicle number (e.g., HP12AB1234)')
    .optional()
    .or(z.literal('')),
  gate_number: z.number()
    .int()
    .min(1, 'Gate number must be between 1-10')
    .max(10, 'Gate number must be between 1-10'),
});

export const VisitorEntryPage = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(visitorEntrySchema),
    defaultValues: {
      name: '',
      phone_number: '',
      number_of_visitors: 1,
      vehicle_number: '',
      gate_number: 1,
    },
  });

  const entryMutation = useMutation({
    mutationFn: visitorService.recordEntry,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['visitors']);
      queryClient.invalidateQueries(['logs', 'visitors']);
      queryClient.invalidateQueries(['visitors', 'inside']);
      
      if (data.status === 'entered') {
        toast.success(`Visitor entered successfully. ID: ${data.visitor_id}`, {
          duration: 5000,
        });
        reset();
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to record entry');
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      gate_number: parseInt(data.gate_number, 10),
      number_of_visitors: parseInt(data.number_of_visitors, 10),
    };

    // Remove vehicle_number if empty
    if (!payload.vehicle_number) {
      delete payload.vehicle_number;
    }

    entryMutation.mutate(payload);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Visitor Entry</h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">Record visitor entry into campus</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Visitor Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <Label htmlFor="number_of_visitors">Number of Visitors (1-20)</Label>
              <Input
                id="number_of_visitors"
                type="number"
                min="1"
                max="20"
                {...register('number_of_visitors', { valueAsNumber: true })}
                error={errors.number_of_visitors?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle_number">Vehicle Number (Optional)</Label>
              <Input
                id="vehicle_number"
                placeholder="HP12AB1234"
                {...register('vehicle_number')}
                error={errors.vehicle_number?.message}
              />
              <p className="text-xs text-muted-foreground">
                Format: 2 letters, 2 digits, 1-2 letters, 4 digits
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
              disabled={entryMutation.isPending}
            >
              {entryMutation.isPending ? 'Recording Entry...' : 'Record Entry'}
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
              <p className="font-medium">Visitor Entry Rules:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>A unique visitor ID will be generated for each entry</li>
                <li>This ID must be used for exit registration</li>
                <li>Vehicle number is optional but recommended for tracking</li>
                <li>Number of visitors includes the primary visitor</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
