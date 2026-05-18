import { Card } from '../components/ui/card';
import { Shield, Search, TrendingUp } from 'lucide-react';

export function WelcomeSection() {
  return (
    <section className="mb-12">
      <Card className="p-8 bg-gradient-to-br from-indigo-50 to-blue-50">
        <h2 className="text-3xl mb-6 text-center">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white p-4 rounded-2xl inline-block mb-4 shadow-md">
              <Search className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl mb-2">1. Scan or Search</h3>
            <p className="text-gray-600">
              Use your camera to scan a product barcode or search by name
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white p-4 rounded-2xl inline-block mb-4 shadow-md">
              <Shield className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl mb-2">2. Analyze Ingredients</h3>
            <p className="text-gray-600">
              Get instant safety insights on all ingredients in the product
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white p-4 rounded-2xl inline-block mb-4 shadow-md">
              <TrendingUp className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl mb-2">3. Choose Wisely</h3>
            <p className="text-gray-600">
              Make informed decisions with our safety score and recommendations
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}
