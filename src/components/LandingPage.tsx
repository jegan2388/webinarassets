import React from 'react';
import { Upload, Zap, Target, Mail, MessageSquare, Quote, TrendingUp, ArrowRight, Play, Sparkles, Users, Clock, FileAudio, User, Crown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import UserMenu from './UserMenu';

interface LandingPageProps {
  onStartUpload: () => void;
  onViewPricing: () => void;
  onViewTranscription: () => void;
  onShowAuth: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartUpload, onViewPricing, onViewTranscription, onShowAuth }) => {
  const { user, isProUser } = useAuth();

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
      title: "LinkedIn Posts",
      description: "Engaging social content that drives awareness and thought leadership",
      color: "bg-blue-50 border-blue-100",
      isFree: true
    },
    {
      icon: <Mail className="w-6 h-6 text-red-600" />,
      title: "Sales Outreach",
      description: "Direct, value-focused emails for cold and warm prospects",
      color: "bg-red-50 border-red-100",
      isFree: true
    },
    {
      icon: <Mail className="w-6 h-6 text-mint-600" />,
      title: "Nurture Emails",
      description: "Educational, relationship-building email sequences",
      color: "bg-mint-50 border-mint-100",
      isFree: false
    },
    {
      icon: <Quote className="w-6 h-6 text-indigo-600" />,
      title: "Quote Visuals",
      description: "Share-worthy graphics with key insights from your webinar",
      color: "bg-indigo-50 border-indigo-100",
      isFree: false
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Upload Your Webinar",
      description: "Drop your video file or paste a YouTube link",
      icon: <Upload className="w-5 h-5" />
    },
    {
      number: "2",
      title: "Set Your Context",
      description: "Choose target persona and funnel stage",
      icon: <Users className="w-5 h-5" />
    },
    {
      number: "3",
      title: "Get Your Assets",
      description: "Download campaign-ready marketing materials",
      icon: <Sparkles className="w-5 h-5" />
    }
  ];

  const stats = [
    { value: "7", label: "Marketing Assets", subtext: "Generated automatically" },
    { value: "5min", label: "Processing Time", subtext: "From upload to assets" },
    { value: "73%", label: "Time Saved", subtext: "vs manual creation" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">WebinarRemix</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onViewTranscription}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white flex items-center space-x-2"
            >
              <FileAudio className="w-4 h-4" />
              <span>Transcriber</span>
            </button>
            <button
              onClick={onViewPricing}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white"
            >
              Pricing
            </button>
            {user ? (
              <UserMenu />
            ) : (
              <button
                onClick={onShowAuth}
                className="btn-primary flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center py-16 lg:py-24">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-100">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Content Generation</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Turn Your Webinar into
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 block mt-2">
                7 Campaign-Ready Assets
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Upload your webinar. Get LinkedIn posts, sales emails, and more — crafted for B2B marketers who need results fast.
            </p>
            
            {/* User Status Banner */}
            {user && (
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                isProUser 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200'
                  : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
              }`}>
                {isProUser ? (
                  <>
                    <Crown className="w-4 h-4" />
                    <span>Pro Account - All Features Unlocked</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    <span>Free Account - 2 Asset Types Available</span>
                  </>
                )}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={onStartUpload}
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Your Webinar</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={onViewTranscription}
                className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2"
              >
                <FileAudio className="w-5 h-5" />
                <span>Try Transcriber First</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.subtext}</div>
                </div>
              ))}
            </div>

            {/* Visual Flow */}
            <div className="card p-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Upload Webinar</p>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-300 mx-4" />
                <div className="text-center flex-1">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">AI Processing</p>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-300 mx-4" />
                <div className="text-center flex-1">
                  <div className="w-16 h-16 bg-gradient-to-r from-mint-500 to-mint-600 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">7 Ready Assets</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Your Next Campaign
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From social media to sales outreach, we've got every touchpoint covered with AI-generated content
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className={`card p-6 group hover:scale-105 transition-all duration-200 border-2 ${feature.color} relative`}>
                {!feature.isFree && (
                  <div className="absolute top-3 right-3">
                    <Crown className="w-4 h-4 text-blue-600" />
                  </div>
                )}
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                {!feature.isFree && (
                  <div className="mt-3">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Pro Feature</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="py-20">
          <div className="card p-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600">
                Get professional marketing assets in minutes, not hours
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4 mx-auto shadow-lg">
                    {step.number}
                  </div>
                  <div className="mb-3 flex justify-center text-blue-600">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Marketing Teams
            </h2>
            <p className="text-lg text-gray-600">
              Join hundreds of B2B marketers who've streamlined their content creation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-sm text-gray-600">Webinars Processed</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-2xl font-bold text-mint-600 mb-2">3,500+</div>
              <div className="text-sm text-gray-600">Assets Generated</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-2">95%</div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Webinar Content?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Stop spending hours creating marketing assets. Let AI do the heavy lifting while you focus on strategy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onStartUpload}
                className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
              >
                <span>Get Started {user ? (isProUser ? 'Pro' : 'Free') : 'Free'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              {!user && (
                <button
                  onClick={onShowAuth}
                  className="btn-secondary text-lg px-8 py-4 inline-flex items-center space-x-2"
                >
                  <User className="w-5 h-5" />
                  <span>Sign Up for Pro</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-8 mt-16">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span>© 2024 WebinarRemix. Built for modern B2B marketers.</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;