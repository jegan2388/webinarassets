import React from 'react';
import { Upload, Zap, Target, Mail, MessageSquare, Quote, TrendingUp, ArrowRight, Play } from 'lucide-react';

interface LandingPageProps {
  onStartUpload: () => void;
  onViewPricing: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartUpload, onViewPricing }) => {
  const features = [
    {
      icon: <MessageSquare className="w-6 h-6 text-teal-600" />,
      title: "LinkedIn Posts",
      description: "Engaging social content that drives awareness",
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      icon: <Mail className="w-6 h-6 text-emerald-600" />,
      title: "Nurture Emails",
      description: "Personalized email sequences for your funnel",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Quote className="w-6 h-6 text-violet-600" />,
      title: "Quote Visuals",
      description: "Share-worthy graphics with key insights",
      gradient: "from-violet-500 to-purple-500"
    },
    {
      icon: <Target className="w-6 h-6 text-coral-600" />,
      title: "Sales Snippets",
      description: "Ready-to-use outreach messages",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Upload Your Webinar",
      description: "Drop your video file or paste a YouTube link",
      color: "bg-gradient-to-r from-teal-500 to-cyan-500"
    },
    {
      number: "2",
      title: "Set Your Context",
      description: "Choose target persona and funnel stage",
      color: "bg-gradient-to-r from-violet-500 to-purple-500"
    },
    {
      number: "3",
      title: "Get Your Assets",
      description: "Download campaign-ready marketing materials",
      color: "bg-gradient-to-r from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <nav className="flex items-center justify-between py-6">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">WebinarRemix</span>
        </div>
        <button
          onClick={onViewPricing}
          className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          Pricing
        </button>
      </nav>

      {/* Hero Section */}
      <div className="text-center py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Turn Your Webinar into
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-violet-600 to-orange-600"> 6 Campaign-Ready Assets</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Upload once. Get LinkedIn posts, nurture emails, sales snippets, and visuals — all aligned to your GTM funnel.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={onStartUpload}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 group transform hover:scale-105"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Your Webinar</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 transition-all duration-300 flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Try With Demo Video</span>
            </button>
          </div>

          {/* Visual Flow Mockup */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-16 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-600">Upload Webinar</p>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-600">AI Processing</p>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-600">6 Ready Assets</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need for Your Next Campaign
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From social media to sales outreach, we've got every touchpoint covered
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 group hover:scale-105">
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-gradient-to-r from-teal-100/50 via-violet-100/50 to-orange-100/50 rounded-3xl my-16 backdrop-blur-sm border border-white/20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Get professional marketing assets in minutes, not hours
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 px-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 ${step.color} text-white rounded-full flex items-center justify-center text-lg font-bold mb-4 mx-auto shadow-lg`}>
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Transform Your Webinar Content?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Join hundreds of marketers who've streamlined their content creation
        </p>
        <button
          onClick={onStartUpload}
          className="bg-gradient-to-r from-teal-600 via-violet-600 to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-teal-700 hover:via-violet-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Get Started Free
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 py-8 mt-16">
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span>© 2024 WebinarRemix. Built for modern marketers.</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;