import React, { useState } from 'react';
import { Upload, ArrowLeft, Check, FileVideo, Youtube, Sparkles, MessageSquare, Mail, Quote, AlertCircle, Globe, FileText, BarChart3, UserCheck, TrendingUp, CreditCard, User, Crown } from 'lucide-react';
import { WebinarData } from '../App';
import { createCheckoutSession } from '../lib/stripe';
import { useAuth } from '../hooks/useAuth';

interface UploadFormProps {
  onSubmit: (data: WebinarData) => void;
  onBack: () => void;
  onPaymentPending: (webinarRequestId: string, formData: WebinarData) => void;
  error?: string | null;
  isProUser: boolean;
}

const UploadForm: React.FC<UploadFormProps> = ({ onSubmit, onBack, onPaymentPending, error, isProUser }) => {
  const { user, signUp, signIn } = useAuth();
  const [formData, setFormData] = useState<WebinarData>({
    description: '',
    persona: '',
    funnelStage: '',
    selectedAssets: ['LinkedIn Posts', 'Sales Outreach Emails'] // Default free assets
  });
  const [uploadType, setUploadType] = useState<'file' | 'youtube'>('file');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [assetTier, setAssetTier] = useState<'free' | 'pro'>('free');
  const [combinedDescription, setCombinedDescription] = useState('');
  const [showProSummary, setShowProSummary] = useState(false);

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

  const handleFileUpload = (file: File) => {
    if (file && (file.type.startsWith('video/') || file.type.startsWith('audio/'))) {
      setFormData(prev => ({ ...prev, file }));
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
    
    if (!combinedDescription || (!formData.file && !formData.youtubeUrl)) {
      return;
    }

    // Parse the combined description
    const { persona, funnelStage } = parseDescription(combinedDescription);
    const updatedFormData = {
      ...formData,
      description: combinedDescription,
      persona,
      funnelStage
    };

    // If only free assets are selected, proceed directly
    if (assetTier === 'free') {
      onSubmit(updatedFormData);
      return;
    }

    // For paid assets, show pro summary first
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
      const { url, webinarRequestId } = await createCheckoutSession(
        formData,
        `${window.location.origin}/payment-success`,
        `${window.location.origin}/upload`
      );

      window.location.href = url;
      onPaymentPending(webinarRequestId, formData);
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

      const { url, webinarRequestId } = await createCheckoutSession(
        formData,
        `${window.location.origin}/payment-success`,
        `${window.location.origin}/upload`
      );

      window.location.href = url;
      onPaymentPending(webinarRequestId, formData);
      
    } catch (err) {
      console.error('Payment initiation error:', err);
      setIsCreatingAccount(false);
    }
  };

  const isFormValid = combinedDescription && (formData.file || formData.youtubeUrl);

  const freeAssets = assetTypes.filter(asset => asset.isFree);
  const proAssets = assetTypes.filter(asset => !asset.isFree);

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
              Upload Your Webinar
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tell us about your content and we'll create targeted marketing assets that resonate with your audience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Upload Type Toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                How would you like to upload your webinar?
              </label>
              <div className="grid grid-cols-2 gap-3">
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
                  <div className="text-sm text-gray-600">MP4, MP3, or other formats</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType('youtube')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    uploadType === 'youtube'
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <Youtube className="w-5 h-5 mb-2" />
                  <div className="font-medium">YouTube Link</div>
                  <div className="text-sm text-gray-600">Coming soon - use file upload</div>
                </button>
              </div>
            </div>

            {/* File Upload or YouTube URL */}
            {uploadType === 'file' ? (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Upload your webinar recording
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
                        {(formData.file.size / (1024 * 1024)).toFixed(1)} MB • Ready to process
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        Drop your webinar file here
                      </p>
                      <p className="text-gray-500 mb-6">or click to browse your files</p>
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
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="youtube-url" className="block text-sm font-semibold text-gray-900 mb-4">
                  YouTube URL (Coming Soon)
                </label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    id="youtube-url"
                    value={formData.youtubeUrl || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                    placeholder="YouTube processing coming soon - please use file upload"
                    className="input-field pl-12"
                    disabled
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  YouTube URL processing requires backend integration. Please upload a file for now.
                </p>
              </div>
            )}

            {/* Combined Description */}
            <div>
              <label htmlFor="combined-description" className="block text-sm font-semibold text-gray-900 mb-4">
                Tell us about your webinar and who it's for
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
                Include your webinar topic, target audience, and key takeaways. Our AI will automatically categorize this for optimal asset generation.
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

            {/* Asset Tier Selection */}
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
                      <h3 className="font-semibold text-gray-900">Remix into Free Assets</h3>
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
                      $4.99
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
                        <span>Remix into Full Campaign Kit</span>
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
                ) : assetTier === 'pro' ? (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Continue to Payment ($4.99)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Free Assets</span>
                  </>
                )}
              </button>
              {!isFormValid && (
                <p className="text-sm text-gray-500 text-center mt-3">
                  Please fill in all required fields to continue
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
                  Full Campaign Kit - $4.99
                </h3>
                <div className="inline-flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium border border-red-200">
                  <span>🔥 50% off today!</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-gray-900">What's included:</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Check className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">4x more assets than free version</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                    <Check className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm text-gray-700">Branded quote visuals with your colors</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-mint-50 rounded-lg">
                    <Check className="w-5 h-5 text-mint-600" />
                    <span className="text-sm text-gray-700">Professional nurture email sequences</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Check className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-700">One-pager recap & infographics</span>
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
                      <span>Pay $4.99</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowProSummary(false)}
                  className="btn-secondary"
                >
                  Back
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
                Create Account & Pay
              </h3>
              <p className="text-gray-600 mb-6">
                Create an account to securely process your payment and access your premium assets.
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
                        <span>Pay $4.99</span>
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
                By continuing, you agree to create an account and proceed with secure payment via Stripe.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;