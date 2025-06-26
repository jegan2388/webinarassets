import React from 'react';
import { Upload, Zap, Target, Mail, MessageSquare, Quote, TrendingUp, ArrowRight, Play, Sparkles, Users, Clock, FileAudio, FileText, Type, Link } from 'lucide-react';

interface LandingPageProps {
  onStartUpload: () => void;
  onViewTranscription: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartUpload, onViewTranscription }) => {
  const contentTypes = [
    {
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      title: "Audio & Video Files",
      description: "Webinars, podcasts, meetings, presentations",
      color: "bg-blue-50 border-blue-100",
      examples: "MP4, MP3, WAV, M4A files"
    },
    {
      icon: <Link className="w-6 h-6 text-red-600" />,
      title: "Video Links",
      description: "YouTube, Vimeo, HubSpot, Loom, Zoom recordings",
      color: "bg-red-50 border-red-100",
      examples: "Any video platform URL"
    },
    {
      icon: <Type className="w-6 h-6 text-mint-600" />,
      title: "Text Content",
      description: "Blog posts, articles, meeting notes, transcripts",
      color: "bg-mint-50 border-mint-100",
      examples: "Paste any text content"
    },
    {
      icon: <Quote className="w-6 h-6 text-indigo-600" />,
      title: "Quote Visuals",
      description: "Share-worthy graphics with key insights from your content",
      color: "bg-indigo-50 border-indigo-100",
      examples: "Branded visual quotes"
    }
  ];

  const stats = [
    { value: "7", label: "Marketing Assets", subtext: "Generated automatically" },
    { value: "3min", label: "Processing Time", subtext: "From upload to assets" },
    { value: "85%", label: "Time Saved", subtext: "vs manual creation" }
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
            <span className="text-xl font-bold text-gray-900">ContentRemix</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onViewTranscription}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white flex items-center space-x-2"
            >
              <FileAudio className="w-4 h-4" />
              <span>Transcriber</span>
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center py-16 lg:py-24">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-100">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Content Transformation</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Any Content into
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 block mt-2">
                7 Campaign-Ready Assets
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Upload recordings, paste text, or share video links. Get LinkedIn posts, sales emails, and more — crafted for B2B marketers who need results fast.
            </p>
            
            {/* Single Primary CTA */}
            <div className="flex flex-col items-center mb-12">
              <button
                onClick={onStartUpload}
                className="btn-primary text-xl px-12 py-5 flex items-center space-x-3 group shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                <Upload className="w-6 h-6" />
                <span>Start Free – No Sign Up Required</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Get instant access to AI-generated marketing assets
              </p>
            </div>

            {/* 30-second Video Demo Placeholder */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-video flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <p className="text-lg font-semibold">Watch 30-Second Demo</p>
                    <p className="text-sm opacity-80">See how any content becomes 7 marketing assets</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* 3-Step Visual */}
            <div className="card p-8 max-w-4xl mx-auto mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                How It Works
              </h3>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Upload</h4>
                  <p className="text-sm text-gray-600">Drop files, paste text, or share links</p>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-300 mx-4" />
                <div className="text-center flex-1">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Remix</h4>
                  <p className="text-sm text-gray-600">AI analyzes & creates</p>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-300 mx-4" />
                <div className="text-center flex-1">
                  <div className="w-16 h-16 bg-gradient-to-r from-mint-500 to-mint-600 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Download</h4>
                  <p className="text-sm text-gray-600">Get 7 ready assets</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.subtext}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Types Section */}
        <div className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Works With Any Content Type
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From recordings to text, transform any content into professional marketing assets
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contentTypes.map((type, index) => (
              <div key={index} className={`card p-6 group hover:scale-105 transition-all duration-200 border-2 ${type.color}`}>
                <div className="mb-4">
                  {type.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{type.description}</p>
                <p className="text-xs text-gray-500 italic">{type.examples}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials/Social Proof */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Content Creators
            </h2>
            <p className="text-lg text-gray-600">
              Join hundreds of marketers who've streamlined their content creation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="card p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">1,200+</div>
              <div className="text-sm text-gray-600">Content Pieces Processed</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-2xl font-bold text-mint-600 mb-2">8,400+</div>
              <div className="text-sm text-gray-600">Assets Generated</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-2">97%</div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
            </div>
          </div>

          {/* Mock Testimonials */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">SM</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah Martinez</p>
                  <p className="text-sm text-gray-600">Marketing Director, TechCorp</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Turned our 1-hour webinar into a month's worth of LinkedIn content. The AI actually gets our brand voice!"
              </p>
            </div>
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-mint-500 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">DJ</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">David Johnson</p>
                  <p className="text-sm text-gray-600">Content Manager, GrowthCo</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "I paste my blog posts and get instant social media content. It's like having a marketing team in my pocket."
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Content?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Stop spending hours creating marketing assets. Let AI do the heavy lifting while you focus on strategy.
            </p>
            <button
              onClick={onStartUpload}
              className="btn-primary text-xl px-12 py-5 inline-flex items-center space-x-3"
            >
              <span>Start Free – No Sign Up Required</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-8 mt-16">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span>© 2024 ContentRemix. Built for modern content creators.</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;