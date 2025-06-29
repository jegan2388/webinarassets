import React from 'react';
import { Upload, Target, Mail, MessageSquare, Quote, TrendingUp, ArrowRight, Users, Clock, FileText, Type, Brain, Lightbulb, Rocket } from 'lucide-react';

interface LandingPageProps {
  onStartUpload: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartUpload }) => {
  const contentTypes = [
    {
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
      title: "Audio & Video Files",
      description: "Webinars, podcasts, meetings, presentations",
      color: "bg-emerald-50 border-emerald-100",
      examples: "MP4, MP3, WAV, M4A files"
    },
    {
      icon: <Type className="w-6 h-6 text-purple-600" />,
      title: "Text Content",
      description: "Blog posts, articles, meeting notes, transcripts",
      color: "bg-purple-50 border-purple-100",
      examples: "Paste any text content"
    }
  ];

  const stats = [
    { value: "3min", label: "Processing Time", subtext: "From upload to assets" },
    { value: "85%", label: "Time Saved", subtext: "vs manual creation" },
    { value: "Multiple", label: "Asset Types", subtext: "Generated automatically" }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-emerald-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">ContentRemix</span>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center py-16 lg:py-24">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-200">
              <Lightbulb className="w-4 h-4" />
              <span>Smart Content Transformation</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Turn Your Content into Marketing Assets,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 block mt-2">
                Instantly.
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Effortlessly create social posts, emails, and more from your existing webinars, articles, and text. 
              No more starting from scratch—just upload and watch your content multiply.
            </p>
            
            {/* Single Primary CTA */}
            <div className="flex flex-col items-center mb-12">
              <button
                onClick={onStartUpload}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xl px-12 py-5 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center space-x-3 group"
              >
                <Rocket className="w-6 h-6" />
                <span>Start Creating – Free</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-sm text-slate-500 mt-3">
                No credit card needed. Get your first assets in minutes.
              </p>
            </div>

            {/* 3-Step Visual */}
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl max-w-4xl mx-auto mb-16 border border-white/20 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                How It Works
              </h3>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1">Add Your Content</h4>
                  <p className="text-sm text-slate-600">Drop files or paste text</p>
                </div>
                <ArrowRight className="w-6 h-6 text-slate-300 mx-4" />
                <div className="text-center flex-1">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1">AI Does the Work</h4>
                  <p className="text-sm text-slate-600">AI extracts key insights</p>
                </div>
                <ArrowRight className="w-6 h-6 text-slate-300 mx-4" />
                <div className="text-center flex-1">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1">Get Your Assets</h4>
                  <p className="text-sm text-slate-600">Campaign-ready materials</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-slate-700 mb-1">{stat.label}</div>
                  <div className="text-xs text-slate-500">{stat.subtext}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Types Section */}
        <div className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Works With Any Content Type
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From recordings to articles, transform any content into professional marketing assets
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {contentTypes.map((type, index) => (
              <div key={index} className={`bg-white/60 backdrop-blur-sm p-6 rounded-2xl group hover:scale-105 transition-all duration-200 border-2 ${type.color} shadow-lg hover:shadow-xl`}>
                <div className="mb-4">
                  {type.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{type.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">{type.description}</p>
                <p className="text-xs text-slate-500 italic">{type.examples}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Ready to Multiply Your Content?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Stop starting from zero. Transform what you already have into a complete marketing campaign.
            </p>
            <button
              onClick={onStartUpload}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xl px-12 py-5 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 inline-flex items-center space-x-3"
            >
              <span>Start Creating Now</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 py-8 mt-16">
          <div className="flex items-center justify-center space-x-2 text-slate-600">
            <div className="w-6 h-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span>© 2024 ContentRemix. Built for modern content creators.</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;