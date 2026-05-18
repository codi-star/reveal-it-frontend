import { Link } from 'react-router';
import { ScanBarcode, Home } from 'lucide-react';
import { Button } from '../components/ui/button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-indigo-100 p-6 rounded-3xl">
            <ScanBarcode className="w-16 h-16 text-indigo-600" />
          </div>
        </div>
        
        <h1 className="text-6xl mb-4">404</h1>
        <h2 className="text-3xl mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        
        <Link to="/home">
          <Button className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2 mx-auto">
            <Home className="w-4 h-4" />
            Go to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
