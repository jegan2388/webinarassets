import React, { useState } from 'react';
import { Copy, Download, RefreshCw, ArrowLeft, Mail, Share2, Check, Sparkles, ExternalLink, Palette, FileText, BarChart3, UserCheck, TrendingUp, Zap, AlertCircle } from 'lucide-react';
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
      case 'sales snippets':
        return '📞';
      case 'one-pager recap':
        return '📄';
      case 'visual infographic':
        return '📊';
      default:
        return '📄';
    }
  };

  const getAssetColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'linkedin posts':
        return 'border-blue-200 bg-blue-50';
      case 'sales outreach emails':
        return 'border-red-200 bg-red-50';
      case 'marketing nurture emails':
        return 'border-mint-200 bg-mint-50';
      case 'quote cards':
        return 'border-indigo-200 bg-indigo-50';
      case 'sales snippets':
        return 'border-orange-200 bg-orange-50';
      case 'one-pager recap':
        return 'border-purple-200 bg-purple-50';
      case 'visual infographic':
        return 'border-emerald-200 bg-emerald-50';
      default:
        return 'border-gray-200 bg-gray-50';
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
    const primaryColor = brandData?.primaryColor || '#4f46e5';
    const secondaryColor = brandData?.secondaryColor || '#7c3aed';
    
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
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Palette className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Brand-Styled Quote Card</span>
          </div>
          <p className="text-sm text-gray-600">
            💡 <strong>Usage tip:</strong> This quote card uses your brand colors
            {brandData?.companyName && ` and ${brandData.companyName} branding`}. 
            Perfect for social media, presentations, or email newsletters.
          </p>
        </div>
      </div>
    );
  };

  const renderOnePager = (content: string) => {
    try {
      const data = JSON.parse(content);
      const primaryColor = brandData?.primaryColor || '#2563eb';
      
      return (
        <div className="space-y-4">
          <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-lg">
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-100">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                style={{ backgroundColor: primaryColor }}
              >
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Content Session Recap
              </h2>
              <p className="text-gray-600">
                {brandData?.companyName || 'Professional'} Summary Document
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <div 
                  className="w-6 h-6 rounded-full mr-3"
                  style={{ backgroundColor: primaryColor }}
                ></div>
                Quick Session Overview
              </h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
                {data.overview || 'Session overview not available'}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <div 
                  className="w-6 h-6 rounded-full mr-3"
                  style={{ backgroundColor: primaryColor }}
                ></div>
                Key Quote from Content
              </h3>
              <blockquote 
                className="text-lg italic text-white p-6 rounded-xl shadow-lg relative"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="text-4xl opacity-30 absolute top-2 left-4">"</div>
                <p className="relative z-10 pl-6">
                  {data.quote || 'Key quote not available'}
                </p>
              </blockquote>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div 
                  className="w-6 h-6 rounded-full mr-3"
                  style={{ backgroundColor: primaryColor }}
                ></div>
                4 Key Takeaways
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(data.takeaways || []).map((takeaway: string, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {index + 1}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {takeaway}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <pre className="whitespace-pre-wrap text-sm text-gray-800 font-medium leading-relaxed">
            {content}
          </pre>
        </div>
      );
    }
  };

  const renderVisualInfographic = (asset: GeneratedAsset) => {
    try {
      const data = JSON.parse(asset.content);
      
      return (
        <div className="space-y-4">
          {data.imageUrl && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <span className="text-lg font-semibold text-gray-900">Professional Visual Infographic</span>
              </div>
              <img 
                src={data.imageUrl} 
                alt="Visual infographic" 
                className="w-full rounded-lg shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 text-emerald-600 mr-2" />
              Key Insights Featured
            </h4>
            <div className="space-y-3">
              {data.insights && data.insights.map((insight: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
            
            {data.error && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">Demo Mode</span>
                </div>
                <p className="text-yellow-800 text-xs mt-1">
                  Visual generation requires OpenAI API access. The key insights are provided above.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    } catch (error) {
      return (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <pre className="whitespace-pre-wrap text-sm text-gray-800 font-medium leading-relaxed">
            {asset.content}
          </pre>
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Want to remix more content?</span>
        </button>

        <div className="text-center mb-12 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-r from-success-500 to-mint-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            🎉 Your Marketing Assets Are Ready!
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            <span className="font-semibold text-blue-600">{assets.length} campaign-ready assets</span> generated from your content
            {brandData?.companyName && (
              <span> and styled with <span className="font-semibold text-indigo-600">{brandData.companyName}</span> branding</span>
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
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-blue-200">
            <Zap className="w-4 h-4" />
            <span>Powered by AI</span>
          </div>
          
          {/* Brand Data Summary */}
          {brandData && (brandData.primaryColor || brandData.companyName) && (
            <div className="card p-4 max-w-md mx-auto mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Palette className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Brand Elements Applied</span>
              </div>
              <div className="text-sm text-blue-800">
                {brandData.companyName && <div>Company: {brandData.companyName}</div>}
                {brandData.primaryColor && (
                  <div className="flex items-center justify-center space-x-2 mt-1">
                    <span>Colors:</span>
                    <div 
                      className="w-4 h-4 rounded border border-blue-300" 
                      style={{ backgroundColor: brandData.primaryColor }}
                    />
                    {brandData.secondaryColor && (
                      <div 
                        className="w-4 h-4 rounded border border-blue-300" 
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
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 justify-center"
            >
              <Download className="w-5 h-5" />
              <span>Download All Assets</span>
            </button>
            <button
              onClick={onBack}
              className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2 justify-center"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Create More Assets</span>
            </button>
          </div>
        </div>

        {/* Categorized Assets */}
        {Object.entries(categorizedAssets).map(([category, categoryAssets]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">{getAssetIcon(category)}</span>
              {category}
              <span className="ml-3 text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {categoryAssets.length} asset{categoryAssets.length > 1 ? 's' : ''}
              </span>
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {categoryAssets.map((asset) => (
                <div key={asset.id} className={`card p-6 border-2 ${getAssetColor(asset.type)} hover:shadow-lg transition-all duration-200 relative`}>
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

                  {asset.type === 'Quote Cards' ? (
                    renderQuoteCard(asset.content, asset)
                  ) : asset.type === 'One-Pager Recap' ? (
                    renderOnePager(asset.content)
                  ) : asset.type === 'Visual Infographic' ? (
                    renderVisualInfographic(asset)
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
          </div>
        ))}

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
              <p className="text-sm text-gray-600">Post 2-3 times per week with content insights to build thought leadership</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Sales Outreach</h4>
              <p className="text-sm text-gray-600">Direct, value-focused emails for cold and warm prospect outreach</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-mint-500 to-mint-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Nurture Emails</h4>
              <p className="text-sm text-gray-600">Educational, relationship-building emails for existing leads and prospects</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Infographics</h4>
              <p className="text-sm text-gray-600">Use in presentations, social media, and marketing materials</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="card p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Want More Assets From Your Content?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {isDemoMode 
              ? "This was a demo with sample assets. Add your OpenAI API key to process real content and get personalized marketing materials."
              : "Upload more content to create additional marketing assets for your campaigns"
            }
          </p>
          <button
            onClick={onBack}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>{isDemoMode ? "Try With Real Content" : "Create More Assets"}</span>
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