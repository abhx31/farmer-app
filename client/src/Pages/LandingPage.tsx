import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Users, Truck, Shield, Clock, Star, CheckCircle, ArrowRight, MapPin, Heart } from "lucide-react"
import { Link } from "react-router-dom"


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              HarvestHub
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-emerald-600">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10" />
        <div className="container mx-auto px-4 lg:px-6 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-6">
              <Badge className="bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 border-emerald-200">
                🌱 Fresh • Local • Community
              </Badge>
              <h1 className="text-4xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Fresh Produce
                </span>
                <br />
                <span className="text-gray-900">Direct from Farm to Community</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Connect your gated community with local farmers for bulk orders of the freshest produce. Save money,
                support local agriculture, and enjoy premium quality fruits and vegetables.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-4 text-lg"
                >
                  Start Your Community Order
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg"
                >
                  Join as a Farmer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
              Why Choose HarvestHub
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
              Revolutionizing Community
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}
                Food Access
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We bridge the gap between local farmers and communities, creating a sustainable ecosystem that benefits
              everyone involved.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Farm Fresh Quality</h3>
                <p className="text-gray-600">
                  Get the freshest produce directly from local farms, harvested at peak ripeness and delivered within 24
                  hours.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Bulk Orders</h3>
                <p className="text-gray-600">
                  Pool orders with your neighbors to unlock wholesale prices and reduce individual costs by up to 40%.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-pink-100/50 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Guarantee</h3>
                <p className="text-gray-600">
                  100% satisfaction guarantee with easy returns and refunds if you're not completely happy.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100/50 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Flexible Scheduling</h3>
                <p className="text-gray-600">
                  Choose weekly, bi-weekly, or monthly delivery schedules that work best for your community.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Support Local Farmers</h3>
                <p className="text-gray-600">
                  Directly support your local agricultural community and contribute to sustainable farming practices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200">
              Simple Process
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
              How
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}
                HarvestHub{" "}
              </span>
              Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Browse & Select</h3>
              <p className="text-gray-600">
                Explore fresh produce from verified local farmers in your area and select what your community needs.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Coordinate Orders</h3>
              <p className="text-gray-600">
                Rally your neighbors to reach minimum order quantities and unlock bulk pricing benefits.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Receive & Enjoy</h3>
              <p className="text-gray-600">
                Get your fresh produce delivered to your community pickup point and enjoy farm-fresh quality.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-white">
              Ready to Transform Your Community's Food Experience?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join thousands of communities already enjoying fresh, local produce at unbeatable prices. Start your
              journey with HarvestHub today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8">
                  Start Your Community
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="border-white text-emerald-600 hover:bg-white/10 px-8">
                  Join as a Farmer
                </Button>
              </Link>
            </div>

            <div className="pt-8">
              <p className="text-white/80 mb-4">Get started in less than 5 minutes</p>
              <div className="flex justify-center items-center space-x-8 text-white/70">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
