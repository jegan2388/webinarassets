import React, { useState } from 'react';
import { Copy, Download, RefreshCw, ArrowLeft, Mail, Share2, Check, Sparkles, ExternalLink } from 'lucide-react';
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

  const getAssetColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'linkedin post':
        return 'border-blue-200 bg-blue-50';
      case 'email snippet':
        return 'border-mint-200 bg-mint-50';
      case 'quote card':
        return 'border-indigo-200 bg-indigo-50';
      case 'sales snippet':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const renderQuoteCard = (content: string) => (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-8 rounded-2xl shadow-2xl">
      <div className="text-6xl mb-4 opacity-50">"</div>
      <p className="text-lg font-medium leading-relaxed mb-6">{content}</p>
      <div className="text-sm opacity-80 font-medium">— Your Webinar Insights</div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Start over</span>
        </button>

        <div className="text-center mb-12 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-r from-success-500 to-mint-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            🎉 Your Marketing Assets Are Ready!
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            <span className="font-semibold text-blue-600">{assets.length} campaign-ready assets</span> generated from your webinar and tailored for your audience
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownloadAll}
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 justify-center"
            >
              <Download className="w-5 h-5" />
              <span>Download All Assets</span>
            </button>
            <button
              onClick={onViewPricing}
              className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2 justify-center"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Unlock More Remixes</span>
            </button>
          </div>
        </div>

        {/* Assets Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-16">
          {assets.map((asset) => (
            <div key={asset.id} className={`card p-6 border-2 ${getAssetColor(asset.type)} hover:shadow-lg transition-all duration-200`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getAssetIcon(asset.type)}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{asset.type}</h3>
                    <p className="text-sm text-gray-600">{asset.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyToClipboard(asset.content, asset.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    copiedAsset === asset.id
                      ? 'bg-gradient-to-r from-success-500 to-mint-500 text-white shadow-lg'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-sm'
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

              {asset.type === 'Quote Card' ? (
                <div className="space-y-4">
                  {renderQuoteCard(asset.content)}
                  <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200">
                    💡 <strong>Usage tip:</strong> Share this visual quote on social media, use in presentations, or include in email newsletters
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-medium leading-relaxed">
                    {asset.content}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Usage Tips */}
        <div className="card p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center">
            <Sparkles className="w-6 h-6 mr-2 text-blue-600" />
            How to Use Your Assets
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">LinkedIn Posts</h4>
              <p className="text-sm text-gray-600">Post 2-3 times per week with webinar insights to build thought leadership</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-mint-500 to-mint-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Email Nurture</h4>
              <p className="text-sm text-gray-600">Send to webinar attendees and leads in your nurture sequences</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Copy className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Sales Snippets</h4>
              <p className="text-sm text-gray-600">Personalize for prospect outreach and follow-up conversations</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Repurpose</h4>
              <p className="text-sm text-gray-600">Adapt for different campaigns, channels, and audience segments</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="card p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Want More Assets From This Webinar?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Unlock additional asset types, custom branding, and advanced AI features with our Pro plan
          </p>
          <button
            onClick={onViewPricing}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>View Pricing Plans</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Email Capture Modal */}
        {showEmailCapture && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full p-8 bg-white">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Get Your Assets Delivered
              </h3>
              <p className="text-gray-600 mb-6">
                Enter your email to download all assets and receive tips on using them effectively in your campaigns.
              </p>
              
              <form onSubmit={handleEmailSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-field mb-4"
                  required
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Download Assets
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEmailCapture(false)}
                    className="btn-secondary"
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