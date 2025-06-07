import React, { useState } from 'react';
import { Copy, Download, RefreshCw, ArrowLeft, Mail, Share2, Check } from 'lucide-react';
import { GeneratedAsset } from '../App';

interface OutputViewProps {
  assets: GeneratedAsset[];
  onBack: () => void;
  onViewPricing: () => void;
}

const OutputView: React.FC<OutputViewProps> = ({ assets, onBack, onViewPricing }) => {
  const [copiedAsset, setCopiedAsset] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [showEmailCapture, setShowEmailCapture] = useState(false);

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
    setShowEmailCapture(true);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, this would send the email and assets
      console.log('Email submitted:', email);
      
      // Create downloadable content
      const content = assets.map(asset => 
        `${asset.type}: ${asset.title}\n\n${asset.content}\n\n---\n\n`
      ).join('');
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'webinar-marketing-assets.txt';
      a.click();
      
      setShowEmailCapture(false);
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'linkedin post':
        return '💼';
      case 'email snippet':
        return '📧';
      case 'quote card':
        return '💬';
      case 'sales snippet':
        return '🎯';
      default:
        return '📄';
    }
  };

  const getAssetGradient = (type: string) => {
    switch (type.toLowerCase()) {
      case 'linkedin post':
        return 'from-teal-500 to-cyan-500';
      case 'email snippet':
        return 'from-emerald-500 to-teal-500';
      case 'quote card':
        return 'from-violet-500 to-purple-500';
      case 'sales snippet':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const renderQuoteCard = (content: string) => (
    <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 text-white p-6 rounded-2xl shadow-2xl">
      <div className="text-4xl mb-4">"</div>
      <p className="text-lg font-medium leading-relaxed mb-4">{content}</p>
      <div className="text-sm opacity-80">— Your Webinar Insights</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Start over</span>
      </button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎉 Your Marketing Assets Are Ready!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {assets.length} campaign-ready assets generated from your webinar
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownloadAll}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 justify-center transform hover:scale-105"
          >
            <Download className="w-5 h-5" />
            <span>Download All Assets</span>
          </button>
          <button
            onClick={onViewPricing}
            className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 transition-all duration-300 flex items-center space-x-2 justify-center"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Unlock More Remixes</span>
          </button>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getAssetGradient(asset.type)} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg`}>
                    {getAssetIcon(asset.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{asset.type}</h3>
                    <p className="text-sm text-gray-600">{asset.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyToClipboard(asset.content, asset.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    copiedAsset === asset.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {copiedAsset === asset.id ? (
                    <>
                      <Check className="w-4 h-4 inline mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 inline mr-1" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {asset.type === 'Quote Card' ? (
                <div className="space-y-4">
                  {renderQuoteCard(asset.content)}
                  <p className="text-sm text-gray-600">
                    Share this visual quote on social media or use in presentations
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50/80 rounded-2xl p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-medium leading-relaxed">
                    {asset.content}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Usage Tips */}
      <div className="bg-gradient-to-r from-teal-100/50 via-violet-100/50 to-orange-100/50 rounded-3xl p-8 mb-16 backdrop-blur-sm border border-white/20">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          💡 How to Use Your Assets
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">LinkedIn Posts</h4>
            <p className="text-sm text-gray-600">Post 2-3 times per week with webinar insights</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Email Nurture</h4>
            <p className="text-sm text-gray-600">Send to webinar attendees and leads</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Copy className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Sales Snippets</h4>
            <p className="text-sm text-gray-600">Personalize for prospect outreach</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Repurpose</h4>
            <p className="text-sm text-gray-600">Adapt for different campaigns and channels</p>
          </div>
        </div>
      </div>

      {/* Email Capture Modal */}
      {showEmailCapture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl max-w-md w-full p-8 shadow-2xl border border-white/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Get Your Assets Delivered
            </h3>
            <p className="text-gray-600 mb-6">
              Enter your email to download all assets and get tips on using them effectively.
            </p>
            
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-4 transition-all duration-300"
                required
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg"
                >
                  Download Assets
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailCapture(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputView;