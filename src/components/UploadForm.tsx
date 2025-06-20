import React, { useState } from 'react';
import { Upload, ArrowLeft, Link, Check, FileVideo, Youtube, Users, Target, Sparkles, MessageSquare, Mail, Quote, AlertCircle, Globe, FileText, BarChart3, UserCheck, TrendingUp, CreditCard, User } from 'lucide-react';
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

  const personas = [
    'Marketing Teams',
    'Sales Teams', 
    'Finance Teams',
    'Executive Leadership',
    'Product Teams',
    'Customer Success'
  ];

  const funnelStages = [
    'Top of Funnel (Awareness)',
    'Middle of Funnel (Consideration)', 
    'Bottom of Funnel (Decision)'
  ];

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
      icon: <Target className="w-4 h-4" />, 
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

  const handleAssetToggle = (assetName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAssets: prev.selectedAssets.includes(assetName)
        ? prev.selectedAssets.filter(a => a !== assetName)
        : [...prev.selectedAssets, assetName]
    }));
  };

  const hasPaidAssets = formData.selectedAssets.some(asset => 
    !assetTypes.find(type => type.name === asset)?.isFree
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.persona || !formData.funnelStage || 
        (!formData.file && !formData.youtubeUrl) || formData.selectedAssets.length === 0) {
      return;
    }

    // If only free assets are selected, proceed directly
    if (!hasPaidAssets) {
      onSubmit(formData);
      return;
    }

    // For paid assets, show email capture
    setShowEmailCapture(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingAccount(true);

    try {
      let currentUser = user;

      // If user is not logged in, create account or sign in
      if (!currentUser) {
        try {
          // Try to sign up first
          await signUp(email, password);
          // Note: After signup, user might need email verification
          // For now, we'll proceed with the assumption they're logged in
        } catch (signUpError: any) {
          // If signup fails (user exists), try to sign in
          if (signUpError.message?.includes('already registered')) {
            await signIn(email, password);
          } else {
            throw signUpError;
          }
        }
      }

      // Create checkout session
      const { url, webinarRequestId } = await createCheckoutSession(
        formData,
        `${window.location.origin}/payment-success`,
        `${window.location.origin}/upload`
      );

      // Redirect to Stripe checkout
      window.location.href = url;
      
      // Also call the payment pending handler for state management
      onPaymentPending(webinarRequestId, formData);
      
    } catch (err) {
      console.error('Payment initiation error:', err);
      setIsCreatingAccount(false);
      // Show error message
    }
  };

  const isFormValid = formData.description && formData.persona && formData.funnelStage && 
                     (formData.file || formData.youtubeUrl) && formData.selectedAssets.length > 0;

  const freeAssets = assetTypes.filter(asset => asset.isFree);
  const paidAssets = assetTypes.filter(asset => !asset.isFree);

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

            {/* Webinar Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-4">
                What's your webinar about?
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., B2B lead generation strategies, customer retention tactics, product demo for enterprise teams..."
                rows={4}
                className="input-field resize-none"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Be specific - this helps us create more targeted content for your audience
              </p>
            </div>

            {/* Target Persona */}
            <div>
              <label htmlFor="persona" className="block text-sm font-semibold text-gray-900 mb-4">
                <Users className="w-4 h-4 inline mr-2" />
                Who's your target audience?
              </label>
              <select
                id="persona"
                value={formData.persona}
                onChange={(e) => setFormData(prev => ({ ...prev, persona: e.target.value }))}
                className="input-field"
                required
              >
                <option value="">Select your target audience...</option>
                {personas.map(persona => (
                  <option key={persona} value={persona}>{persona}</option>
                ))}
              </select>
            </div>

            {/* Funnel Stage */}
            <div>
              <label htmlFor="funnel-stage" className="block text-sm font-semibold text-gray-900 mb-4">
                <Target className="w-4 h-4 inline mr-2" />
                Where are they in your funnel?
              </label>
              <select
                id="funnel-stage"
                value={formData.funnelStage}
                onChange={(e) => setFormData(prev => ({ ...prev, funnelStage: e.target.value }))}
                className="input-field"
                required
              >
                <option value="">Select funnel stage...</option>
                {funnelStages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            {/* Asset Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-gray-900">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Which assets do you want?
                </label>
                <div className="text-sm text-gray-600">
                  <span className="text-success-600 font-medium">{freeAssets.length} Free</span>
                  {' • '}
                  <span className="text-blue-600 font-medium">{paidAssets.length} Premium ($4.99)</span>
                </div>
              </div>
              
              {/* Free Assets Section */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-success-700">Free Assets</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {freeAssets.map(asset => (
                    <label
                      key={asset.name}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.selectedAssets.includes(asset.name)
                          ? `border-blue-500 bg-blue-50 ${asset.color}`
                          : `border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50`
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedAssets.includes(asset.name)}
                        onChange={() => handleAssetToggle(asset.name)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-lg border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                        formData.selectedAssets.includes(asset.name)
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {formData.selectedAssets.includes(asset.name) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {asset.icon}
                          <span className="font-medium text-gray-900">{asset.name}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{asset.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Premium Assets Section */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-blue-700">Premium Assets</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">$4.99</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {paidAssets.map(asset => (
                    <label
                      key={asset.name}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.selectedAssets.includes(asset.name)
                          ? `border-blue-500 bg-blue-50 ${asset.color}`
                          : `border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50`
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedAssets.includes(asset.name)}
                        onChange={() => handleAssetToggle(asset.name)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-lg border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                        formData.selectedAssets.includes(asset.name)
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {formData.selectedAssets.includes(asset.name) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {asset.icon}
                          <span className="font-medium text-gray-900">{asset.name}</span>
                          <CreditCard className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{asset.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Email Asset Descriptions */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <div className="flex items-center space-x-2 mb-1">
                    <UserCheck className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Sales Outreach Emails</span>
                    <span className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded-full">Free</span>
                  </div>
                  <p className="text-xs text-red-700">Direct, value-focused emails for cold/warm prospects. Conversational tone with clear CTAs.</p>
                </div>
                <div className="bg-mint-50 p-3 rounded-lg border border-mint-100">
                  <div className="flex items-center space-x-2 mb-1">
                    <Mail className="w-4 h-4 text-mint-600" />
                    <span className="text-sm font-medium text-mint-800">Marketing Nurture Emails</span>
                    <CreditCard className="w-3 h-3 text-blue-500" />
                  </div>
                  <p className="text-xs text-mint-700">Educational, relationship-building emails for existing leads. Helpful tone with soft CTAs.</p>
                </div>
              </div>
            </div>

            {/* Payment Info - Only show if premium assets selected */}
            {hasPaidAssets && (
              <div className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">
                    Premium Assets: $4.99
                  </h3>
                </div>
                <div className="text-sm text-blue-800 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>All {formData.selectedAssets.length} selected assets included</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>Brand-styled visuals and quote cards</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>Professional one-pager and infographics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>Secure payment via Stripe</span>
                  </div>
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
                ) : hasPaidAssets ? (
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
                  Please fill in all fields and select at least one asset to continue
                </p>
              )}
            </div>
          </form>
        </div>

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