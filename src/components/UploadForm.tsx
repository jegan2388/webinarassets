import React, { useState } from 'react';
import { Upload, ArrowLeft, Check, FileVideo, Sparkles, MessageSquare, Mail, Quote, AlertCircle, Globe, FileText, BarChart3, UserCheck, TrendingUp, Link, Video, ExternalLink, Brain } from 'lucide-react';
import { ContentData } from '../App';

interface UploadFormProps {
  onSubmit: (data: ContentData) => void;
  onBack: () => void;
  error?: string | null;
}

const UploadForm: React.FC<UploadFormProps> = ({ 
  onSubmit, 
  onBack, 
  error
}) => {
  const [formData, setFormData] = useState<ContentData>({
    description: '',
    persona: '',
    funnelStage: '',
    selectedAssets: ['LinkedIn Posts', 'Sales Outreach Emails', 'Marketing Nurture Emails', 'Quote Cards', 'One-Pager Recap', 'Visual Infographic'], // Removed Sales Snippets
    contentType: 'file'
  });
  const [uploadType, setUploadType] = useState<'file' | 'link' | 'text'>('file');
  const [isDragging, setIsDragging] = useState(false);
  const [combinedDescription, setCombinedDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [articleUrl, setArticleUrl] = useState('');

  // Increased file size limit to 100MB
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

  const assetTypes = [
    { 
      name: 'LinkedIn Posts', 
      icon: <MessageSquare className="w-4 h-4" />, 
      color: 'border-emerald-200 bg-emerald-50',
      description: 'Engaging social content for thought leadership'
    },
    { 
      name: 'Sales Outreach Emails', 
      icon: <UserCheck className="w-4 h-4" />, 
      color: 'border-orange-200 bg-orange-50',
      description: 'Direct, value-focused emails for prospects'
    },
    { 
      name: 'Marketing Nurture Emails', 
      icon: <Mail className="w-4 h-4" />, 
      color: 'border-purple-200 bg-purple-50',
      description: 'Educational, relationship-building emails'
    },
    { 
      name: 'Quote Cards', 
      icon: <Quote className="w-4 h-4" />, 
      color: 'border-teal-200 bg-teal-50',
      description: 'Share-worthy graphics with key insights'
    },
    { 
      name: 'One-Pager Recap', 
      icon: <FileText className="w-4 h-4" />, 
      color: 'border-indigo-200 bg-indigo-50',
      description: 'Professional summary document'
    },
    { 
      name: 'Visual Infographic', 
      icon: <BarChart3 className="w-4 h-4" />, 
      color: 'border-cyan-200 bg-cyan-50',
      description: 'Professional visual content'
    }
  ];

  // Detect video platform from URL
  const detectVideoPlatform = (url: string): string => {
    if (!url) return 'Unknown';
    
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      return 'YouTube';
    } else if (lowerUrl.includes('vimeo.com')) {
      return 'Vimeo';
    } else if (lowerUrl.includes('hubspot.com') || lowerUrl.includes('hs-sites.com')) {
      return 'HubSpot';
    } else if (lowerUrl.includes('wistia.com') || lowerUrl.includes('wi.st')) {
      return 'Wistia';
    } else if (lowerUrl.includes('loom.com')) {
      return 'Loom';
    } else if (lowerUrl.includes('zoom.us')) {
      return 'Zoom';
    } else if (lowerUrl.includes('teams.microsoft.com')) {
      return 'Microsoft Teams';
    } else if (lowerUrl.includes('webex.com')) {
      return 'Webex';
    } else if (lowerUrl.includes('gotomeeting.com')) {
      return 'GoToMeeting';
    } else if (lowerUrl.includes('brightcove.com')) {
      return 'Brightcove';
    } else if (lowerUrl.includes('kaltura.com')) {
      return 'Kaltura';
    } else if (lowerUrl.includes('vidyard.com')) {
      return 'Vidyard';
    } else if (lowerUrl.includes('twitch.tv')) {
      return 'Twitch';
    } else if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) {
      return 'Facebook';
    } else if (lowerUrl.includes('linkedin.com')) {
      return 'LinkedIn';
    } else if (lowerUrl.includes('dailymotion.com')) {
      return 'Dailymotion';
    } else if (lowerUrl.includes('streamable.com')) {
      return 'Streamable';
    }
    
    return 'Video Platform';
  };

  // Detect content platform from URL
  const detectContentPlatform = (url: string): string => {
    if (!url) return 'Unknown';
    
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('medium.com')) {
      return 'Medium';
    } else if (lowerUrl.includes('substack.com')) {
      return 'Substack';
    } else if (lowerUrl.includes('linkedin.com/pulse') || lowerUrl.includes('linkedin.com/posts')) {
      return 'LinkedIn Article';
    } else if (lowerUrl.includes('hubspot.com/blog') || lowerUrl.includes('blog.hubspot.com')) {
      return 'HubSpot Blog';
    } else if (lowerUrl.includes('wordpress.com') || lowerUrl.includes('wp.com')) {
      return 'WordPress';
    } else if (lowerUrl.includes('ghost.org') || lowerUrl.includes('ghost.io')) {
      return 'Ghost';
    } else if (lowerUrl.includes('notion.so') || lowerUrl.includes('notion.site')) {
      return 'Notion';
    } else if (lowerUrl.includes('dev.to')) {
      return 'Dev.to';
    } else if (lowerUrl.includes('hashnode.com')) {
      return 'Hashnode';
    } else if (lowerUrl.includes('webflow.com')) {
      return 'Webflow';
    } else if (lowerUrl.includes('squarespace.com')) {
      return 'Squarespace';
    } else if (lowerUrl.includes('wix.com')) {
      return 'Wix';
    } else if (lowerUrl.includes('github.com') && lowerUrl.includes('readme')) {
      return 'GitHub README';
    } else if (lowerUrl.includes('docs.google.com')) {
      return 'Google Docs';
    }
    
    return 'Blog/Article';
  };

  // Validate URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleFileUpload = (file: File) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      alert(`File too large. Please upload files smaller than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
      return;
    }

    if (file && (file.type.startsWith('video/') || file.type.startsWith('audio/'))) {
      setFormData(prev => ({ ...prev, file, contentType: 'file' }));
    } else {
      alert('Please upload a valid audio or video file.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleAssetToggle = (assetName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAssets: prev.selectedAssets.includes(assetName)
        ? prev.selectedAssets.filter(asset => asset !== assetName)
        : [...prev.selectedAssets, assetName]
    }));
  };

  // Parse combined description to extract persona and funnel stage (simplified)
  const parseDescription = (description: string) => {
    // Simple keyword matching - in production, you'd use GPT for this
    const lowerDesc = description.toLowerCase();
    
    let persona = 'Marketing Teams';
    if (lowerDesc.includes('sales') || lowerDesc.includes('prospect')) persona = 'Sales Teams';
    else if (lowerDesc.includes('executive') || lowerDesc.includes('leadership')) persona = 'Executive Leadership';
    else if (lowerDesc.includes('product') || lowerDesc.includes('development')) persona = 'Product Teams';
    else if (lowerDesc.includes('finance') || lowerDesc.includes('budget')) persona = 'Finance Teams';
    else if (lowerDesc.includes('customer success') || lowerDesc.includes('support')) persona = 'Customer Success';

    let funnelStage = 'Middle of Funnel (Consideration)';
    if (lowerDesc.includes('awareness') || lowerDesc.includes('introduction') || lowerDesc.includes('overview')) {
      funnelStage = 'Top of Funnel (Awareness)';
    } else if (lowerDesc.includes('decision') || lowerDesc.includes('purchase') || lowerDesc.includes('buy')) {
      funnelStage = 'Bottom of Funnel (Decision)';
    }

    return { persona, funnelStage };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!combinedDescription || (!formData.file && !videoUrl && !articleUrl)) {
      return;
    }

    // Parse the combined description
    const { persona, funnelStage } = parseDescription(combinedDescription);
    const updatedFormData = {
      ...formData,
      description: combinedDescription,
      persona,
      funnelStage,
      youtubeUrl: uploadType === 'link' && videoUrl ? videoUrl : undefined,
      textContent: uploadType === 'text' && articleUrl ? articleUrl : undefined,
      contentType: uploadType
    };

    onSubmit(updatedFormData);
  };

  const isFormValid = combinedDescription && (
    (uploadType === 'file' && formData.file) ||
    (uploadType === 'link' && isValidUrl(videoUrl)) ||
    (uploadType === 'text' && isValidUrl(articleUrl))
  ) && formData.selectedAssets.length > 0;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-emerald-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to home</span>
        </button>

        {/* Error Message */}
        {error && (
          <div className="bg-white/60 backdrop-blur-sm p-6 border-red-200 bg-red-50 mb-8 rounded-2xl border-2">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900">Processing Failed</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/60 backdrop-blur-sm p-8 lg:p-12 rounded-3xl border border-white/20 shadow-xl">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
              Upload Your Content
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Transform any content into targeted marketing assets that resonate with your audience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Upload Type Toggle */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-4">
                What type of content do you want to remix?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setUploadType('file')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    uploadType === 'file'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 hover:border-slate-300 bg-white/60'
                  }`}
                >
                  <FileVideo className="w-5 h-5 mb-2" />
                  <div className="font-medium">Upload File</div>
                  <div className="text-sm text-slate-600">MP4, MP3, WAV, M4A (up to 100MB)</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType('link')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    uploadType === 'link'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 hover:border-slate-300 bg-white/60'
                  }`}
                >
                  <Video className="w-5 h-5 mb-2" />
                  <div className="font-medium">Video Link</div>
                  <div className="text-sm text-slate-600">YouTube, Vimeo, HubSpot, etc.</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType('text')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    uploadType === 'text'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 hover:border-slate-300 bg-white/60'
                  }`}
                >
                  <ExternalLink className="w-5 h-5 mb-2" />
                  <div className="font-medium">Article/Blog Link</div>
                  <div className="text-sm text-slate-600">Medium, LinkedIn, blog posts</div>
                </button>
              </div>
            </div>

            {/* Content Input Based on Type */}
            {uploadType === 'file' ? (
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-4">
                  Upload your content recording
                  <span className="text-sm font-normal text-slate-600 ml-2">
                    (Maximum file size: {formatFileSize(MAX_FILE_SIZE)})
                  </span>
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    isDragging
                      ? 'border-emerald-400 bg-emerald-50'
                      : formData.file
                      ? 'border-emerald-400 bg-emerald-50'
                      : 'border-slate-300 hover:border-slate-400 bg-white/60'
                  }`}
                >
                  {formData.file ? (
                    <div className="text-emerald-700">
                      <Check className="w-12 h-12 mx-auto mb-3" />
                      <p className="font-semibold text-lg">{formData.file.name}</p>
                      <p className="text-sm text-slate-600 mt-1">
                        {formatFileSize(formData.file.size)} • Ready to process
                      </p>
                      {formData.file.size > MAX_FILE_SIZE && (
                        <p className="text-red-600 text-sm mt-2">
                          ⚠️ File exceeds {formatFileSize(MAX_FILE_SIZE)} limit
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-slate-700 mb-2">
                        Drop your content file here
                      </p>
                      <p className="text-slate-500 mb-6">
                        or click to browse your files
                      </p>
                      <input
                        type="file"
                        accept="video/*,audio/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer inline-flex items-center space-x-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Choose File</span>
                      </label>
                      <p className="text-xs text-slate-500 mt-4">
                        Supported formats: MP4, MP3, WAV, M4A, WebM, MOV, AVI
                        <br />
                        Maximum file size: {formatFileSize(MAX_FILE_SIZE)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : uploadType === 'link' ? (
              <div>
                <label htmlFor="video-url" className="block text-sm font-semibold text-slate-900 mb-4">
                  <Video className="w-4 h-4 inline mr-2" />
                  Video URL
                </label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    id="video-url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or any video platform URL"
                    className="w-full px-4 py-3 pl-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/60"
                  />
                </div>
                {videoUrl && (
                  <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-900">
                        Detected: {detectVideoPlatform(videoUrl)}
                      </span>
                      {isValidUrl(videoUrl) ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    {!isValidUrl(videoUrl) && (
                      <p className="text-red-600 text-xs mt-1">Please enter a valid URL</p>
                    )}
                  </div>
                )}
                <p className="text-sm text-slate-500 mt-2">
                  <strong>Supported platforms:</strong> YouTube, Vimeo, HubSpot, Wistia, Loom, Zoom, Microsoft Teams, Webex, GoToMeeting, Brightcove, Kaltura, Vidyard, and more.
                </p>
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-900">Note:</span>
                  </div>
                  <p className="text-yellow-800 text-xs mt-1">
                    Video link processing requires backend integration. For now, please use file upload for best results.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="article-url" className="block text-sm font-semibold text-slate-900 mb-4">
                  <ExternalLink className="w-4 h-4 inline mr-2" />
                  Article or Blog Post URL
                </label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    id="article-url"
                    value={articleUrl}
                    onChange={(e) => setArticleUrl(e.target.value)}
                    placeholder="https://medium.com/@author/article or any blog post URL"
                    className="w-full px-4 py-3 pl-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/60"
                    required
                  />
                </div>
                {articleUrl && (
                  <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2">
                      <ExternalLink className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">
                        Detected: {detectContentPlatform(articleUrl)}
                      </span>
                      {isValidUrl(articleUrl) ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    {!isValidUrl(articleUrl) && (
                      <p className="text-red-600 text-xs mt-1">Please enter a valid URL</p>
                    )}
                  </div>
                )}
                <p className="text-sm text-slate-500 mt-2">
                  <strong>Supported platforms:</strong> Medium, Substack, LinkedIn Articles, HubSpot Blog, WordPress, Ghost, Notion, Dev.to, Hashnode, and most blog platforms.
                </p>
                <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-900">How it works:</span>
                  </div>
                  <p className="text-emerald-800 text-xs mt-1">
                    We'll extract the text content from your article/blog post and use it to generate marketing assets. Make sure the URL is publicly accessible.
                  </p>
                </div>
              </div>
            )}

            {/* Combined Description */}
            <div>
              <label htmlFor="combined-description" className="block text-sm font-semibold text-slate-900 mb-4">
                Tell us about your content and who it's for
              </label>
              <textarea
                id="combined-description"
                value={combinedDescription}
                onChange={(e) => setCombinedDescription(e.target.value)}
                placeholder="e.g., This is a B2B lead generation webinar for marketing teams showing how to increase conversion rates by 40% using our new automation platform. We covered advanced strategies for nurturing prospects in the consideration stage..."
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/60 resize-none"
                required
              />
              <p className="text-sm text-slate-500 mt-2">
                Include your content topic, target audience, and key takeaways. Our AI will automatically categorize this for optimal asset generation.
              </p>
            </div>

            {/* Company Website URL */}
            <div>
              <label htmlFor="company-website" className="block text-sm font-semibold text-slate-900 mb-4">
                <Globe className="w-4 h-4 inline mr-2" />
                Company Website (Optional)
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="url"
                  id="company-website"
                  value={formData.companyWebsiteUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyWebsiteUrl: e.target.value }))}
                  placeholder="https://yourcompany.com"
                  className="w-full px-4 py-3 pl-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/60"
                />
              </div>
              <p className="text-sm text-slate-500 mt-2">
                We'll extract your brand colors and logo to create branded quote cards and visuals
              </p>
            </div>

            {/* Asset Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-4">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Select the marketing assets you want to generate
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assetTypes.map((asset) => (
                  <label
                    key={asset.name}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.selectedAssets.includes(asset.name)
                        ? `${asset.color} border-current`
                        : 'border-slate-200 hover:border-slate-300 bg-white/60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedAssets.includes(asset.name)}
                      onChange={() => handleAssetToggle(asset.name)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        formData.selectedAssets.includes(asset.name)
                          ? 'border-emerald-600 bg-emerald-600'
                          : 'border-slate-300'
                      }`}>
                        {formData.selectedAssets.includes(asset.name) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {asset.icon}
                          <span className="font-medium text-slate-900">{asset.name}</span>
                        </div>
                        <p className="text-sm text-slate-600">{asset.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              
              {formData.selectedAssets.length === 0 && (
                <p className="text-sm text-red-600 mt-2">Please select at least one asset type</p>
              )}
            </div>

            {/* API Key Notice */}
            {!import.meta.env.VITE_OPENAI_API_KEY && (
              <div className="bg-white/60 backdrop-blur-sm p-6 border-yellow-200 bg-yellow-50 rounded-2xl border-2">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-yellow-900">API Key Required</h3>
                    <p className="text-yellow-700 text-sm mt-1">
                      Add your OpenAI API key to the environment variables to enable asset generation.
                      Create a <code>.env</code> file with: <code>VITE_OPENAI_API_KEY=your_key_here</code>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-lg py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Generate Marketing Assets</span>
              </button>
              {!isFormValid && (
                <p className="text-sm text-slate-500 text-center mt-3">
                  Please fill in all required fields and select at least one asset type
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;