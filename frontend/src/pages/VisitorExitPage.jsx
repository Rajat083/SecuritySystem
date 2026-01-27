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
} from '../components/ui';
import { visitorService } from '../services';
import { toast } from 'sonner';

const visitorExitSchema = z.object({
  visitor_id: z.string().min(1, 'Visitor ID is required'),
  gate_number: z.number()
    .int()
    .min(1, 'Gate number must be between 1-10')
    .max(10, 'Gate number must be between 1-10'),
});

export const VisitorExitPage = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(visitorExitSchema),
    defaultValues: {
      visitor_id: '',
      gate_number: 1,
    },
  });

  const exitMutation = useMutation({
    mutationFn: ({ visitor_id, gate_number }) => 
      visitorService.recordExit(visitor_id, gate_number),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['visitors']);
      queryClient.invalidateQueries(['logs', 'visitors']);
      queryClient.invalidateQueries(['visitors', 'inside']);
      
      if (data.status === 'exited') {
        toast.success('Visitor exited successfully');
        reset();
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to record exit');
    },
  });

  const onSubmit = (data) => {
    exitMutation.mutate({
      visitor_id: data.visitor_id,
      gate_number: parseInt(data.gate_number, 10),
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Visitor Exit</h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">Record visitor exit from campus</p>
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
              <Label htmlFor="visitor_id">Visitor ID</Label>
              <Input
                id="visitor_id"
                placeholder="Enter visitor ID from entry"
                {...register('visitor_id')}
                error={errors.visitor_id?.message}
              />
              <p className="text-xs text-muted-foreground">
                This is the ID that was generated during entry
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
              <p className="font-medium">Visitor Exit Rules:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Visitor must currently be inside campus</li>
                <li>Use the visitor ID provided during entry</li>
                <li>All visitors in the group will be marked as exited</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
