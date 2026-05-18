import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Card } from '../components/ui/card';
import { Shield, Eye, Heart, Users } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl mb-6">About Reveal-It</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering consumers to make informed decisions about their health and beauty products through transparent ingredient analysis
          </p>
        </section>

        {/* Image Section */}
        <section className="mb-16">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1582719202047-76d3432ee323?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJvcmF0b3J5JTIwc2NpZW50aXN0JTIwYW5hbHl6aW5nJTIwc2FtcGxlc3xlbnwxfHx8fDE3NzU3NDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Laboratory analysis"
              className="w-full h-96 object-cover"
            />
          </div>
        </section>

        {/* Mission Cards */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl mb-2">Safety First</h3>
            <p className="text-gray-600 text-sm">
              We prioritize your health by analyzing every ingredient for potential risks
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl mb-2">Transparency</h3>
            <p className="text-gray-600 text-sm">
              Clear, honest information about what you're putting on your body
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl mb-2">Health Focus</h3>
            <p className="text-gray-600 text-sm">
              Promoting healthier choices for you and your loved ones
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl mb-2">Community</h3>
            <p className="text-gray-600 text-sm">
              Building a community of informed and health-conscious consumers
            </p>
          </Card>
        </section>

        {/* Content Sections */}
        <section className="space-y-12">
          <Card className="p-8">
            <h2 className="text-3xl mb-4">What We Do</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Reveal-It is a cutting-edge product analysis platform that helps consumers make informed decisions about healthcare and cosmetic products. Using our advanced scanning technology and comprehensive ingredient database, we provide instant safety insights for thousands of products.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Simply scan a barcode or search for a product, and we'll break down its ingredients, highlighting which ones are safe, which require caution, and which should be avoided altogether.
            </p>
          </Card>

          <Card className="p-8 bg-gradient-to-r from-indigo-50 to-blue-50">
            <h2 className="text-3xl mb-4">Why Ingredient Transparency Matters</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Many healthcare and cosmetic products contain ingredients that can be harmful to your health, cause allergic reactions, or have long-term effects that aren't immediately apparent. Manufacturers aren't always required to disclose the potential risks associated with these ingredients.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              That's where Reveal-It comes in. We believe everyone has the right to know exactly what they're putting on their skin and in their bodies. Our mission is to democratize access to ingredient safety information, making it easy and accessible for everyone.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Over 12,000 potentially harmful ingredients tracked</li>
              <li>Real-time safety scoring based on latest research</li>
              <li>Personalized recommendations for safer alternatives</li>
              <li>Regularly updated database with new scientific findings</li>
            </ul>
          </Card>

          <Card className="p-8">
            <h2 className="text-3xl mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to empower consumers worldwide to make safer, more informed choices about the products they use every day. We envision a future where ingredient transparency is the norm, not the exception, and where everyone has the tools they need to protect their health and well-being.
            </p>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
