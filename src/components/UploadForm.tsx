import React, { useState } from 'react';
import { Upload, ArrowLeft, Check, FileVideo, Youtube, Sparkles, MessageSquare, Mail, Quote, AlertCircle, Globe, FileText, BarChart3, UserCheck, TrendingUp, CreditCard, User, Crown, Link, Video, ExternalLink } from 'lucide-react';
import { ContentData } from '../App';
import { createCheckoutSession } from '../lib/stripe';
import { useAuth } from '../hooks/useAuth';

interface UploadFormProps {
  onSubmit: (data: ContentData) => void;
  onBack: () => void;
  onPaymentPending: (contentRequestId: string, formData: ContentData) => void;
  error?: string | null;
  isProUser: boolean;
  subscriptionStatus?: string;
  monthlyContentLimit?: number;
  contentProcessedThisMonth?: number;
}

const UploadForm: React.FC<UploadFormProps> = ({ 
  onSubmit, 
  onBack, 
  onPaymentPending, 
  error, 
  isProUser,
  subscriptionStatus = 'free',
  monthlyContentLimit = 1,
  contentProcessedThisMonth = 0
}) => {
  const { user, signUp, signIn } = useAuth();
  const [formData, setFormData] = useState<ContentData>({
    description: '',
    persona: '',
    funnelStage: '',
    selectedAssets: ['LinkedIn Posts', 'Sales Outreach Emails'], // Default free assets
    contentType: 'file'
  });
  const [uploadType, setUploadType] = useState<'file' | 'link' | 'text'>('file');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [assetTier, setAssetTier] = useState<'free' | 'pro'>('free');
  const [combinedDescription, setCombinedDescription] = useState('');
  const [showProSummary, setShowProSummary] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [articleUrl, setArticleUrl] = useState('');

  // Increased file size limit to 100MB
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

  const assetTypes = [
    { 
      name: 'LinkedIn Posts', 
      icon: <MessageSquare className="w-4 h-4" />, 
      color: 'border-blue-200 bg-blue-50',
      description: 'Engaging social content for thought leadership',
      isFree: true
    },
    { 
      name: 'Sales Outreach Emails', 
      icon: <UserCheck className="w-4 h-4" />, 
      color: 'border-red-200 bg-red-50',
      description: 'Direct, value-focused emails for prospects',
      isFree: true
    },
    { 
      name: 'Marketing Nurture Emails', 
      icon: <Mail className="w-4 h-4" />, 
      color: 'border-mint-200 bg-mint-50',
      description: 'Educational, relationship-building emails',
      isFree: false
    },
    { 
      name: 'Quote Cards', 
      icon: <Quote className="w-4 h-4" />, 
      color: 'border-indigo-200 bg-indigo-50',
      description: 'Share-worthy graphics with key insights',
      isFree: false
    },
    { 
      name: 'Sales Snippets', 
      icon: <TrendingUp className="w-4 h-4" />, 
      color: 'border-orange-200 bg-orange-50',
      description: 'Ready-to-use outreach messages',
      isFree: false
    },
    { 
      name: 'One-Pager Recap', 
      icon: <FileText className="w-4 h-4" />, 
      color: 'border-purple-200 bg-purple-50',
      description: 'Professional summary document',
      isFree: false
    },
    { 
      name: 'Visual Infographic', 
      icon: <BarChart3 className="w-4 h-4" />, 
      color: 'border-emerald-200 bg-emerald-50',
      description: 'Professional visual content',
      isFree: false
    }
  ];

  // Check if user has reached their monthly limit
  const hasReachedLimit = contentProcessedThisMonth >= monthlyContentLimit;
  const remainingContent = Math.max(0, monthlyContentLimit - contentProcessedThisMonth);

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

  const handleAssetTierChange = (tier: 'free' | 'pro') => {
    setAssetTier(tier);
    if (tier === 'free') {
      setFormData(prev => ({
        ...prev,
        selectedAssets: ['LinkedIn Posts', 'Sales Outreach Emails']
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedAssets: assetTypes.map(asset => asset.name)
      }));
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user has reached their monthly limit
    if (hasReachedLimit && !isProUser) {
      setShowProSummary(true);
      return;
    }
    
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

    // If only free assets are selected and user is within limits, proceed directly
    if (assetTier === 'free' && !hasReachedLimit) {
      onSubmit(updatedFormData);
      return;
    }

    // For paid assets or limit exceeded, show pro summary first
    setFormData(updatedFormData);
    setShowProSummary(true);
  };

  const handleProPayment = async () => {
    setShowProSummary(false);
    
    if (!user) {
      setShowEmailCapture(true);
      return;
    }

    // User is logged in, proceed to payment
    try {
      setIsProcessingPayment(true);
      const { url, contentRequestId } = await createCheckoutSession(
        formData,
        `${window.location.origin}/payment-success`,
        `${window.location.origin}/upload`
      );

      window.location.href = url;
      onPaymentPending(contentRequestId, formData);
    } catch (err) {
      console.error('Payment initiation error:', err);
      setIsProcessingPayment(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingAccount(true);

    try {
      let currentUser = user;

      if (!currentUser) {
        try {
          await signUp(email, password);
        } catch (signUpError: any) {
          if (signUpError.message?.includes('already registered')) {
            await signIn(email, password);
          } else {
            throw signUpError;
          }
        }
      }

      const { url, contentRequestId } = await createCheckoutSession(
        formData,
        `${window.location.origin}/payment-success`,
        `${window.location.origin}/upload`
      );

      window.location.href = url;
      onPaymentPending(contentRequestId, formData);
      
    } catch (err) {
      console.error('Payment initiation error:', err);
      setIsCreatingAccount(false);
    }
  };

  const isFormValid = combinedDescription && (
    (uploadType === 'file' && formData.file) ||
    (uploadType === 'link' && isValidUrl(videoUrl)) ||
    (uploadType === 'text' && isValidUrl(articleUrl))
  );

  const freeAssets = assetTypes.filter(asset => asset.isFree);
  const proAssets = assetTypes.filter(asset => !asset.isFree);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to home</span>
        </button>

        {/* Usage Limit Warning */}
        {hasReachedLimit && !isProUser && (
          <div className="card p-6 border-yellow-200 bg-yellow-50 mb-8">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900">Monthly Limit Reached</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  You've processed {contentProcessedThisMonth} of {monthlyContentLimit} content pieces this month. 
                  Upgrade to Pro for unlimited processing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Usage Status for Pro Users */}
        {isProUser && (
          <div className="card p-4 border-blue-200 bg-blue-50 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Pro Account</span>
              </div>
              <div className="text-sm text-blue-700">
                {contentProcessedThisMonth} of {monthlyContentLimit} used this month
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="card p-6 border-red-200 bg-red-50 mb-8">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900">Processing Failed</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="card p-8 lg:p-12">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Upload Your Content
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform any content into targeted marketing assets that resonate with your audience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Upload Type Toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                What type of content do you want to remix?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setUploadType('file')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    uploadType === 'file'
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <FileVideo className="w-5 h-5 mb-2" />
                  <div className="font-medium">Upload File</div>
                  <div className="text-sm text-gray-600">MP4, MP3, WAV, M4A (up to 100MB)</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType('link')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    uploadType === 'link'
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <Video className="w-5 h-5 mb-2" />
                  <div className="font-medium">Video Link</div>
                  <div className="text-sm text-gray-600">YouTube, Vimeo, HubSpot, etc.</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType('text')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    uploadType === 'text'
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <ExternalLink className="w-5 h-5 mb-2" />
                  <div className="font-medium">Article/Blog Link</div>
                  <div className="text-sm text-gray-600">Medium, LinkedIn, blog posts</div>
                </button>
              </div>
            </div>

            {/* Content Input Based on Type */}
            {uploadType === 'file' ? (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Upload your content recording
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    (Maximum file size: {formatFileSize(MAX_FILE_SIZE)})
                  </span>
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    isDragging
                      ? 'border-blue-400 bg-blue-50'
                      : formData.file
                      ? 'border-success-400 bg-success-50'
                      : 'border-gray-300 hover:border-gray-400 bg-white'
                  }`}
                >
                  {formData.file ? (
                    <div className="text-success-700">
                      <Check className="w-12 h-12 mx-auto mb-3" />
                      <p className="font-semibold text-lg">{formData.file.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
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
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        Drop your content file here
                      </p>
                      <p className="text-gray-500 mb-6">
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
                        className="btn-primary cursor-pointer inline-flex items-center space-x-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Choose File</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-4">
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
                <label htmlFor="video-url" className="block text-sm font-semibold text-gray-900 mb-4">
                  <Video className="w-4 h-4 inline mr-2" />
                  Video URL
                </label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    id="video-url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or any video platform URL"
                    className="input-field pl-12"
                  />
                </div>
                {videoUrl && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Detected: {detectVideoPlatform(videoUrl)}
                      </span>
                      {isValidUrl(videoUrl) ? (
                        <Check className="w-4 h-4 text-success-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    {!isValidUrl(videoUrl) && (
                      <p className="text-red-600 text-xs mt-1">Please enter a valid URL</p>
                    )}
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-2">
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
                <label htmlFor="article-url" className="block text-sm font-semibold text-gray-900 mb-4">
                  <ExternalLink className="w-4 h-4 inline mr-2" />
                  Article or Blog Post URL
                </label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    id="article-url"
                    value={articleUrl}
                    onChange={(e) => setArticleUrl(e.target.value)}
                    placeholder="https://medium.com/@author/article or any blog post URL"
                    className="input-field pl-12"
                    required
                  />
                </div>
                {articleUrl && (
                  <div className="mt-3 p-3 bg-mint-50 rounded-lg border border-mint-200">
                    <div className="flex items-center space-x-2">
                      <ExternalLink className="w-4 h-4 text-mint-600" />
                      <span className="text-sm font-medium text-mint-900">
                        Detected: {detectContentPlatform(articleUrl)}
                      </span>
                      {isValidUrl(articleUrl) ? (
                        <Check className="w-4 h-4 text-success-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    {!isValidUrl(articleUrl) && (
                      <p className="text-red-600 text-xs mt-1">Please enter a valid URL</p>
                    )}
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Supported platforms:</strong> Medium, Substack, LinkedIn Articles, HubSpot Blog, WordPress, Ghost, Notion, Dev.to, Hashnode, and most blog platforms.
                </p>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">How it works:</span>
                  </div>
                  <p className="text-blue-800 text-xs mt-1">
                    We'll extract the text content from your article/blog post and use it to generate marketing assets. Make sure the URL is publicly accessible.
                  </p>
                </div>
              </div>
            )}

            {/* Combined Description */}
            <div>
              <label htmlFor="combined-description" className="block text-sm font-semibold text-gray-900 mb-4">
                Tell us about your content and who it's for
              </label>
              <textarea
                id="combined-description"
                value={combinedDescription}
                onChange={(e) => setCombinedDescription(e.target.value)}
                placeholder="e.g., This is a B2B lead generation webinar for marketing teams showing how to increase conversion rates by 40% using our new automation platform. We covered advanced strategies for nurturing prospects in the consideration stage..."
                rows={4}
                className="input-field resize-none"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Include your content topic, target audience, and key takeaways. Our AI will automatically categorize this for optimal asset generation.
              </p>
            </div>

            {/* Company Website URL */}
            <div>
              <label htmlFor="company-website" className="block text-sm font-semibold text-gray-900 mb-4">
                <Globe className="w-4 h-4 inline mr-2" />
                Company Website (Optional)
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  id="company-website"
                  value={formData.companyWebsiteUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyWebsiteUrl: e.target.value }))}
                  placeholder="https://yourcompany.com"
                  className="input-field pl-12"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                We'll extract your brand colors and logo to create branded quote cards and visuals
              </p>
            </div>

            {/* Asset Tier Selection - Only show if user has remaining content or is Pro */}
            {(!hasReachedLimit || isProUser) && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Choose your asset package
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Free Assets */}
                  <label
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      assetTier === 'free'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="assetTier"
                      value="free"
                      checked={assetTier === 'free'}
                      onChange={() => handleAssetTierChange('free')}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        assetTier === 'free' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      }`}>
                        {assetTier === 'free' && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Free Assets</h3>
                        <p className="text-sm text-gray-600">Perfect for trying out the platform</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {freeAssets.map(asset => (
                        <div key={asset.name} className="flex items-center space-x-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-success-500" />
                          <span>{asset.name}</span>
                        </div>
                      ))}
                    </div>
                  </label>

                  {/* Pro Assets */}
                  <label
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 relative ${
                      assetTier === 'pro'
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="assetTier"
                      value="pro"
                      checked={assetTier === 'pro'}
                      onChange={() => handleAssetTierChange('pro')}
                      className="sr-only"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Pro Only
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        assetTier === 'pro' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      }`}>
                        {assetTier === 'pro' && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                          <span>Full Campaign Kit</span>
                          <Crown className="w-4 h-4 text-blue-600" />
                        </h3>
                        <p className="text-sm text-gray-600">Everything you need for a complete campaign</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-700 font-medium mb-2">Includes all free assets plus:</div>
                      {proAssets.map(asset => (
                        <div key={asset.name} className="flex items-center space-x-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-blue-600" />
                          <span>{asset.name}</span>
                        </div>
                      ))}
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* API Key Notice */}
            {!import.meta.env.VITE_OPENAI_API_KEY && (
              <div className="card p-6 border-yellow-200 bg-yellow-50">
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
                disabled={!isFormValid || isProcessingPayment}
                className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isProcessingPayment ? (
                  <>
                    <CreditCard className="w-5 h-5 animate-pulse" />
                    <span>Processing...</span>
                  </>
                ) : hasReachedLimit && !isProUser ? (
                  <>
                    <Crown className="w-5 h-5" />
                    <span>Upgrade to Continue</span>
                  </>
                ) : assetTier === 'pro' && !isProUser ? (
                  <>
                    <Crown className="w-5 h-5" />
                    <span>Upgrade to Pro</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Assets</span>
                  </>
                )}
              </button>
              {!isFormValid && (
                <p className="text-sm text-gray-500 text-center mt-3">
                  Please fill in all required fields to continue
                </p>
              )}
              {remainingContent > 0 && !isProUser && (
                <p className="text-sm text-gray-600 text-center mt-3">
                  {remainingContent} content piece{remainingContent !== 1 ? 's' : ''} remaining this month
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Pro Summary Modal */}
        {showProSummary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-lg w-full p-8 bg-white">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {hasReachedLimit ? 'Upgrade to Continue' : 'Upgrade to Pro - $39/month'}
                </h3>
                {hasReachedLimit && (
                  <div className="inline-flex items-center space-x-2 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium border border-yellow-200 mb-4">
                    <span>Monthly limit reached</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-gray-900">Pro subscription includes:</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Check className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">10 content remixes per month</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                    <Check className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm text-gray-700">All 7 asset types included</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-mint-50 rounded-lg">
                    <Check className="w-5 h-5 text-mint-600" />
                    <span className="text-sm text-gray-700">Branded visuals with your colors</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Check className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-700">Priority processing & support</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleProPayment}
                  disabled={isProcessingPayment}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <CreditCard className="w-4 h-4 animate-pulse" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Upgrade to Pro</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowProSummary(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Capture Modal - Only for premium assets */}
        {showEmailCapture && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full p-8 bg-white">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Create Account & Subscribe
              </h3>
              <p className="text-gray-600 mb-6">
                Create an account to subscribe to Pro and access unlimited content processing.
              </p>
              
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="input-field"
                    required
                    minLength={6}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={isCreatingAccount}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    {isCreatingAccount ? (
                      <>
                        <CreditCard className="w-4 h-4 animate-pulse" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Subscribe to Pro</span>
                      </>
                    )}
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
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                By continuing, you agree to create an account and subscribe to our Pro plan.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;