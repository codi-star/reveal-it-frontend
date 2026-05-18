import { Card } from '../components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Product not found', onRetry }: ErrorStateProps) {
  return (
    <Card className="p-8 shadow-lg">
      <div className="flex flex-col items-center text-center">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <AlertCircle className="w-12 h-12 text-red-600" />
        </div>
        <h3 className="text-2xl mb-2">Oops!</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} className="bg-indigo-600 hover:bg-indigo-700">
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
}
