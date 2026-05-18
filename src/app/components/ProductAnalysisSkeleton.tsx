import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';

export function ProductAnalysisSkeleton() {
  return (
    <Card className="p-6 shadow-lg">
      <Skeleton className="h-8 w-48 mb-6" />
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Side - Product Image and Name */}
        <div>
          <Skeleton className="aspect-square rounded-2xl mb-4" />
          <Skeleton className="h-6 w-3/4" />
        </div>

        {/* Right Side - Analysis */}
        <div className="space-y-6">
          {/* Ingredient Categories */}
          <div>
            <Skeleton className="h-6 w-40 mb-3" />
            <div className="space-y-4">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-28" />
                </div>
              </div>
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </div>

          {/* Visual Breakdown */}
          <div>
            <Skeleton className="h-6 w-36 mb-3" />
            <Skeleton className="h-8 w-full rounded-xl" />
          </div>

          {/* Safety Score */}
          <div>
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="flex flex-col items-center">
              <Skeleton className="w-48 h-48 rounded-full" />
              <Skeleton className="h-10 w-40 mt-4 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
