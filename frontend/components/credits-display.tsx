'use client';

import { CreditCard } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CreditsDisplayProps {
  credits: number;
}

export function CreditsDisplay({ credits }: CreditsDisplayProps) {
  // Assuming a max of 5 credits based on your backend API_KEY_CREDITS
  const maxCredits = 5;
  const progressPercentage = (credits / maxCredits) * 100;

  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <span className="font-medium">API Credits Remaining</span>
        </div>
        <span className="font-bold text-lg">{credits}</span>
      </div>

      <Progress value={progressPercentage} className="h-2" />

      <p className="text-xs text-muted-foreground mt-2">
        {credits <= 1
          ? "Warning: You're running low on credits!"
          : `You have ${credits} out of ${maxCredits} credits remaining`}
      </p>
    </div>
  );
}
