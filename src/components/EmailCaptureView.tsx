import React, { useState } from 'react';
import { Mail, ArrowLeft, Check, Sparkles, Gift, Download, Eye, Clock, Users, TrendingUp, Zap, AlertCircle, MessageSquare } from 'lucide-react';
import { GeneratedAsset, ContentData } from '../App';
import { BrandData } from '../services/brandExtraction';

interface EmailCaptureViewProps {
  assets: GeneratedAsset[];
  brandData?: BrandData | null;
  contentData: ContentData;
  onEmailSubmit: (email: string) => void;
  onBack: () => void;
}

const EmailCaptureView: React.FC<EmailCaptureViewProps> = ({
  assets,
  brandData,
  contentData,
  onEmailSubmit,
  onBack
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if this is a demo (no API key)
  const isDemoMode = !import.meta.env.VITE_OPENAI_API_KEY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    // Simulate a brief delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onEmailSubmit(email);
  };

  const getAssetIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'linkedin posts':
        return '💼';
      case 'sales outreach emails':
        return '🎯';
      case 'marketing nurture emails':
        return '📧';
      case 'quote cards':
        return '💬';
      case 'video repurposing ideas':
        return '🎬';
      case 'twitter thread':
        return '🐦';
      default:
        return '📄';
    }
  };

  // Find the first LinkedIn post to preview
  const linkedInPost = assets.find(asset => asset.type.toLowerCase().includes('linkedin'));

  // Group assets by type for display
  const assetCounts = assets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-emerald-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Start over</span>
        </button>

        <div className="text-center mb-12 animate-fade-in">
          {/* Success Animation */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse-soft">
              <Check className="w-12 h-12 text-white" />
            </div>
            {/* Floating sparkles */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
              <Sparkles className="w-6 h-6 text-emerald-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <div className="absolute top-4 right-1/4">
              <Sparkles className="w-4 h-4 text-teal-500 animate-bounce" style={{ animationDelay: '0.6s' }} />
            </div>
            <div className="absolute top-4 left-1/4">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-bounce" style={{ animationDelay: '1s' }} />
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            🎉 Your Assets Are Ready!
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            We've generated <span className="font-semibold text-emerald-600">{assets.length} professional marketing assets</span> from your content
            {brandData?.companyName && (
              <span>, complete with <span className="font-semibold text-teal-600">{brandData.companyName}</span> branding</span>
            )}
          </p>

          {/* Demo Mode Notice */}
          {isDemoMode && (
            <div className="inline-flex items-center space-x-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-yellow-200">
              <AlertCircle className="w-4 h-4" />
              <span>Demo Mode - Sample assets generated for preview</span>
            </div>
          )}
        </div>

        {/* LinkedIn Post Preview */}
        {linkedInPost && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-emerald-900">Sneak Peek: Your LinkedIn Post</span>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                  Ready to Post!
                </span>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-slate-200 mb-4">
                <pre className="whitespace-pre-wrap text-sm text-slate-800 font-medium leading-relaxed">
                  {linkedInPost.content.length > 300 
                    ? linkedInPost.content.substring(0, 300) + '...' 
                    : linkedInPost.content
                  }
                </pre>
              </div>
              
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <p className="text-sm text-emerald-800">
                  ✨ <strong>Based on your content about "{contentData.description}"</strong> - This is just one of your {assets.length} custom-tailored assets! Enter your email below to unlock everything.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Asset Preview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Object.entries(assetCounts).map(([assetType, count]) => (
            <div key={assetType} className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-3xl">{getAssetIcon(assetType)}</div>
                <div>
                  <h3 className="font-semibold text-slate-900">{assetType}</h3>
                  <p className="text-sm text-slate-600">{count} asset{count > 1 ? 's' : ''} ready</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-emerald-600">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Generated & Ready</span>
              </div>
            </div>
          ))}
        </div>

        {/* Value Proposition */}
        <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white/20 shadow-lg mb-12">
          <div className="text-center mb-8">
            <Gift className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              What You're Getting (Worth $200+ if hired out)
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Ready to Use</h4>
              <p className="text-sm text-slate-600">Copy-paste ready content for immediate deployment</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Saves Hours</h4>
              <p className="text-sm text-slate-600">What would take 4-6 hours, done in minutes</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Multi-Channel</h4>
              <p className="text-sm text-slate-600">LinkedIn, email, social media, and more</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Proven Results</h4>
              <p className="text-sm text-slate-600">Templates that drive engagement and conversions</p>
            </div>
          </div>
        </div>

        {/* Email Capture Form */}
        <div className="max-w-md mx-auto">
          <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white/20 shadow-xl">
            <div className="text-center mb-6">
              <Mail className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Get Instant Access
              </h3>
              <p className="text-slate-600">
                Enter your email to view and download all {assets.length} marketing assets
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/60 text-center text-lg"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <button
                type="submit"
                disabled={!email.trim() || isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-lg py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Preparing Your Assets...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>View My Assets</span>
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
                <Zap className="w-4 h-4" />
                <span>Instant access • No spam • Unsubscribe anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mt-12">
          <p className="text-sm text-slate-500 mb-4">
            Join 1,000+ marketers who've transformed their content workflow
          </p>
          <div className="flex items-center justify-center space-x-8 text-xs text-slate-400">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <span>Instant download</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
              <span>Professional quality</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailCaptureView;