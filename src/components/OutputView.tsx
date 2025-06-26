import React, { useState } from 'react';
import { Copy, Download, RefreshCw, ArrowLeft, Mail, Share2, Check, Sparkles, ExternalLink, Palette, FileText, BarChart3, UserCheck, TrendingUp, Zap, AlertCircle, Video, Clock, Play, Twitter } from 'lucide-react';
import { GeneratedAsset } from '../App';
import { BrandData } from '../services/brandExtraction';

interface OutputViewProps {
  assets: GeneratedAsset[];
  brandData?: BrandData | null;
  onBack: () => void;
}

const OutputView: React.FC<OutputViewProps> = ({ 
  assets, 
  brandData, 
  onBack
}) => {
  const [copiedAsset, setCopiedAsset] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  // Check if this is a demo (no API key)
  const isDemoMode = !import.meta.env.VITE_OPENAI_API_KEY;

  const handleCopyToClipboard = async (content: string, assetId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedAsset(assetId);
      setTimeout(() => setCopiedAsset(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleDownloadAll = () => {
    // Create downloadable content
    const content = assets.map(asset => 
      `${asset.type}: ${asset.title}\n\n${asset.content}\n\n---\n\n`
    ).join('');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content-marketing-assets.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      handleDownloadAll();
      setShowEmailCapture(false);
    }
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

  const getAssetColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'linkedin posts':
        return 'border-emerald-200 bg-emerald-50';
      case 'sales outreach emails':
        return 'border-orange-200 bg-orange-50';
      case 'marketing nurture emails':
        return 'border-purple-200 bg-purple-50';
      case 'quote cards':
        return 'border-teal-200 bg-teal-50';
      case 'video repurposing ideas':
        return 'border-cyan-200 bg-cyan-50';
      case 'twitter thread':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-slate-200 bg-slate-50';
    }
  };

  // Categorize assets by type
  const categorizedAssets = assets.reduce((acc, asset) => {
    const category = asset.type;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(asset);
    return acc;
  }, {} as Record<string, GeneratedAsset[]>);

  const renderQuoteCard = (content: string, asset: GeneratedAsset) => {
    const primaryColor = brandData?.primaryColor || '#059669';
    const secondaryColor = brandData?.secondaryColor || '#0d9488';
    
    const gradientStyle = {
      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
    };

    return (
      <div className="space-y-4">
        <div 
          className="text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden"
          style={gradientStyle}
        >
          {brandData?.logoUrl && brandData.logoUrl !== 'svg-logo-found' && (
            <div className="absolute top-4 right-4 opacity-20">
              <img 
                src={brandData.logoUrl} 
                alt="Company logo" 
                className="h-8 w-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="text-6xl mb-4 opacity-50">"</div>
          <p className="text-lg font-medium leading-relaxed mb-6" style={{ 
            fontFamily: brandData?.fontFamily || 'inherit' 
          }}>
            {content}
          </p>
          <div className="text-sm opacity-80 font-medium">
            — {brandData?.companyName || 'Your Content Insights'}
          </div>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-white/20">
          <div className="flex items-center space-x-2 mb-2">
            <Palette className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-slate-700">Brand-Styled Quote Card</span>
          </div>
          <p className="text-sm text-slate-600">
            💡 <strong>Usage tip:</strong> This quote card uses your brand colors
            {brandData?.companyName && ` and ${brandData.companyName} branding`}. 
            Perfect for social media, presentations, or email newsletters.
          </p>
        </div>
      </div>
    );
  };

  const renderVideoRepurposingIdeas = (content: string) => {
    return (
      <div className="space-y-4">
        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Video className="w-5 h-5 text-cyan-600" />
            <span className="text-lg font-semibold text-slate-900">Video Content Strategy</span>
          </div>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-slate-800 font-medium leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              {content}
            </pre>
          </div>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-white/20">
          <div className="flex items-center space-x-2 mb-2">
            <Play className="w-4 h-4 text-cyan-600" />
            <span className="text-sm font-medium text-slate-700">Video Repurposing Guide</span>
          </div>
          <p className="text-sm text-slate-600">
            🎬 <strong>Pro tip:</strong> These video ideas are optimized for 30-60 second clips perfect for LinkedIn, Instagram, TikTok, and YouTube Shorts. 
            Focus on the first 3 seconds to grab attention and always include a clear call-to-action.
          </p>
        </div>
      </div>
    );
  };

  const renderTwitterThread = (content: string) => {
    // Split the thread into individual tweets
    const tweets = content.split('\n\n').filter(tweet => tweet.trim());
    
    return (
      <div className="space-y-4">
        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Twitter className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-semibold text-slate-900">Twitter Thread</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {tweets.length} tweets
            </span>
          </div>
          
          <div className="space-y-3">
            {tweets.map((tweet, index) => (
              <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {tweet.trim()}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                      <span>{tweet.trim().length} characters</span>
                      {tweet.trim().length > 280 && (
                        <span className="text-red-600 font-medium">Over 280 chars</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-white/20">
          <div className="flex items-center space-x-2 mb-2">
            <Twitter className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Twitter Thread Guide</span>
          </div>
          <p className="text-sm text-slate-600">
            🐦 <strong>Pro tip:</strong> Post this as a thread on Twitter by copying each numbered section as a separate tweet. 
            Start with tweet 1, then reply to your own tweet with tweet 2, and so on. Include relevant hashtags and engage with replies!
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-emerald-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Want to remix more content?</span>
        </button>

        <div className="text-center mb-12 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            🎉 Your Marketing Assets Are Ready!
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            <span className="font-semibold text-emerald-600">{assets.length} campaign-ready assets</span> generated from your content
            {brandData?.companyName && (
              <span> and styled with <span className="font-semibold text-teal-600">{brandData.companyName}</span> branding</span>
            )}
          </p>
          
          {/* Demo Mode Notice */}
          {isDemoMode && (
            <div className="inline-flex items-center space-x-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-yellow-200">
              <AlertCircle className="w-4 h-4" />
              <span>Demo Mode - Sample assets generated for preview</span>
            </div>
          )}
          
          {/* Powered by AI Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-emerald-200">
            <Zap className="w-4 h-4" />
            <span>Powered by AI</span>
          </div>
          
          {/* Brand Data Summary */}
          {brandData && (brandData.primaryColor || brandData.companyName) && (
            <div className="bg-white/60 backdrop-blur-sm p-4 max-w-md mx-auto mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 rounded-2xl border">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Palette className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-emerald-900">Brand Elements Applied</span>
              </div>
              <div className="text-sm text-emerald-800">
                {brandData.companyName && <div>Company: {brandData.companyName}</div>}
                {brandData.primaryColor && (
                  <div className="flex items-center justify-center space-x-2 mt-1">
                    <span>Colors:</span>
                    <div 
                      className="w-4 h-4 rounded border border-emerald-300" 
                      style={{ backgroundColor: brandData.primaryColor }}
                    />
                    {brandData.secondaryColor && (
                      <div 
                        className="w-4 h-4 rounded border border-emerald-300" 
                        style={{ backgroundColor: brandData.secondaryColor }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownloadAll}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center space-x-2 justify-center"
            >
              <Download className="w-5 h-5" />
              <span>Download All Assets</span>
            </button>
            <button
              onClick={onBack}
              className="bg-white/60 backdrop-blur-sm border-2 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2 justify-center"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Create More Assets</span>
            </button>
          </div>
        </div>

        {/* Categorized Assets */}
        {Object.entries(categorizedAssets).map(([category, categoryAssets]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">{getAssetIcon(category)}</span>
              {category}
              <span className="ml-3 text-sm bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                {categoryAssets.length} asset{categoryAssets.length > 1 ? 's' : ''}
              </span>
              {category === 'Twitter Thread' && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Blog Only
                </span>
              )}
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {categoryAssets.map((asset) => (
                <div key={asset.id} className={`bg-white/60 backdrop-blur-sm p-6 border-2 ${getAssetColor(asset.type)} hover:shadow-lg transition-all duration-200 relative rounded-2xl`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getAssetIcon(asset.type)}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{asset.type}</h3>
                        <p className="text-sm text-slate-600">{asset.title}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyToClipboard(asset.content, asset.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                        copiedAsset === asset.id
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                          : 'bg-white/60 border border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      {copiedAsset === asset.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {asset.type === 'Quote Cards' ? (
                    renderQuoteCard(asset.content, asset)
                  ) : asset.type === 'Video Repurposing Ideas' ? (
                    renderVideoRepurposingIdeas(asset.content)
                  ) : asset.type === 'Twitter Thread' ? (
                    renderTwitterThread(asset.content)
                  ) : (
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <pre className="whitespace-pre-wrap text-sm text-slate-800 font-medium leading-relaxed">
                        {asset.content}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Usage Tips */}
        <div className="bg-white/60 backdrop-blur-sm p-8 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 mb-16 rounded-3xl border">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center flex items-center justify-center">
            <Sparkles className="w-6 h-6 mr-2 text-emerald-600" />
            How to Use Your Assets
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">LinkedIn Posts</h4>
              <p className="text-sm text-slate-600">Post 2-3 times per week with content insights to build thought leadership</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Sales Outreach</h4>
              <p className="text-sm text-slate-600">Direct, value-focused emails for cold and warm prospect outreach</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Nurture Emails</h4>
              <p className="text-sm text-slate-600">Educational, relationship-building emails for existing leads and prospects</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Twitter className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Twitter Threads</h4>
              <p className="text-sm text-slate-600">Break down complex topics into engaging, shareable Twitter content</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white/60 backdrop-blur-sm p-8 text-center rounded-3xl border border-white/20">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Want More Assets From Your Content?
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            {isDemoMode 
              ? "This was a demo with sample assets. Add your OpenAI API key to process real content and get personalized marketing materials."
              : "Upload more content to create additional marketing assets for your campaigns"
            }
          </p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] inline-flex items-center space-x-2"
          >
            <span>{isDemoMode ? "Try With Real Content" : "Create More Assets"}</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Email Capture Modal */}
        {showEmailCapture && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/60 backdrop-blur-sm max-w-md w-full p-8 bg-white rounded-3xl border border-white/20">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Get Your Assets Delivered
              </h3>
              <p className="text-slate-600 mb-6">
                Enter your email to download all assets and receive tips on using them effectively in your campaigns.
              </p>
              
              <form onSubmit={handleEmailSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/60 mb-4"
                  required
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Download Assets
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEmailCapture(false)}
                    className="bg-white/60 backdrop-blur-sm border-2 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputView;