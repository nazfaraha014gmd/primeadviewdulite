import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";

interface LandingHeroProps {
  onGetStarted?: () => void;
  onLogin?: () => void;
}

export default function LandingHero({ onGetStarted, onLogin }: LandingHeroProps) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-3 sm:px-6 py-3 sm:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-2xl font-display font-bold text-white">PrimeAdView</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:text-white bg-white/10 backdrop-blur-sm text-xs sm:text-base px-2 sm:px-4 py-1 sm:py-2" 
              onClick={onLogin}
              data-testid="button-login"
            >
              Login
            </Button>
            <Button 
              size="sm"
              className="bg-white text-primary hover:bg-white/90 text-xs sm:text-base px-2 sm:px-4 py-1 sm:py-2" 
              onClick={onGetStarted}
              data-testid="button-get-started"
            >
              Get Started
              <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Gradient */}
      <div className="flex-1 relative overflow-hidden">
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-blue-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 pt-20 sm:pt-28 md:pt-32 pb-8 sm:pb-16 md:pb-20 flex flex-col lg:flex-row items-center gap-6 md:gap-12">
          {/* Left Content */}
          <div className="flex-1 text-white space-y-4 sm:space-y-8">
            <div className="space-y-2 sm:space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full bg-success/20 backdrop-blur-sm border border-success/30">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-success" />
                <span className="text-xs font-medium text-success">Join 10,000+ Earners</span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                Earn Money by Watching Advertisements
              </h1>
              <p className="text-sm sm:text-lg md:text-xl text-blue-100 max-w-2xl">
                Start earning real money today with PrimeAdView. Simple signup, watch ads, and get paid instantly through multiple payment methods.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button 
                size="default" 
                className="bg-success hover:bg-success/90 text-white text-sm sm:text-lg px-4 sm:px-8 py-2 sm:py-3 w-full sm:w-auto"
                onClick={onGetStarted}
                data-testid="button-hero-get-started"
              >
                Start Earning Now
                <ArrowRight className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-5 sm:w-5" />
              </Button>
              <Button 
                size="default" 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 text-sm sm:text-lg px-4 sm:px-8 py-2 sm:py-3 w-full sm:w-auto"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-8 pt-2 sm:pt-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Shield className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-success" />
                <span className="text-xs sm:text-sm text-blue-100">Secure Payments</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <TrendingUp className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gold" />
                <span className="text-xs sm:text-sm text-blue-100">Daily Payouts</span>
              </div>
            </div>
          </div>

          {/* Right Content - Stats Card */}
          <div className="flex-1 w-full max-w-lg">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-8 border border-white/20">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <p className="text-blue-100 text-xs sm:text-sm mb-1 sm:mb-2">Total Earnings Paid</p>
                  <p className="text-2xl sm:text-4xl font-bold text-white">$2,450,000+</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                    <p className="text-blue-200 text-xs mb-1">Active Users</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">10,000+</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                    <p className="text-blue-200 text-xs mb-1">Ads Watched</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">5M+</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-success">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">+25% growth this month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-background py-10 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2 sm:mb-4">How It Works</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Start earning in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: "1", title: "Quick Signup", desc: "Register with just your email or phone number. No verification required." },
              { step: "2", title: "Choose Package", desc: "Select a package and deposit to activate your earning potential." },
              { step: "3", title: "Watch & Earn", desc: "Watch ads and earn money. Withdraw anytime via JazzCash, EasyPaisa, or card." }
            ].map((item) => (
              <div key={item.step} className="text-center space-y-3 sm:space-y-4 px-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-xl sm:text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
