import React, { useState } from 'react';
import { Upload, ArrowLeft, Check, FileVideo, MessageSquare, Mail, Quote, AlertCircle, Globe, FileText, UserCheck, TrendingUp, Brain, Video, Twitter, ArrowRight, Info, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
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
    selectedAssets: ['LinkedIn Posts', 'Sales Outreach Emails', 'Marketing Nurture Emails', 'Quote Cards'],
    contentType: 'file'
  });
  const [uploadType, setUploadType] = useState<'file' | 'text'>('file');
  const [isDragging, setIsDragging] = useState(false);
  const [combinedDescription, setCombinedDescription] = useState('');
  const [articleUrl, setArticleUrl] = useState('');

  // Progressive disclosure state
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Increased file size limit to 100MB
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

  // Step definitions with descriptions
  const steps = [
    { number: 1, title: 'Upload', description: 'Choose content type' },
    { number: 2, title: 'Describe', description: 'Tell us about your content' },
    { number: 3, title: 'Select', description: 'Pick marketing assets' },
    { number: 4, title: 'Generate', description: 'Optional brand settings' }
  ];

  const assetTypes = [
    { 
      name: 'LinkedIn Posts', 
      icon: <MessageSquare className="w-4 h-4" />, 
      color: 'border-emerald-200 bg-emerald-50',
      description: 'Engaging social content for thought leadership',
      availableFor: ['file', 'text']
    },
    { 
      name: 'Sales Outreach Emails', 
      icon: <UserCheck className="w-4 h-4" />, 
      color: 'border-orange-200 bg-orange-50',
      description: 'Direct, value-focused emails for prospects',
      availableFor: ['file', 'text']
    },
    { 
      name: 'Marketing Nurture Emails', 
      icon: <Mail className="w-4 h-4" />, 
      color: 'border-purple-200 bg-purple-50',
      description: 'Educational, relationship-building emails',
      availableFor: ['file', 'text']
    },
    { 
      name: 'Quote Cards', 
      icon: <Quote className="w-4 h-4" />, 
      color: 'border-teal-200 bg-teal-50',
      description: 'Share-worthy graphics with key insights',
      availableFor: ['file', 'text']
    },
    { 
      name: 'Video Repurposing Ideas', 
      icon: <Video className="w-4 h-4" />, 
      color: 'border-cyan-200 bg-cyan-50',
      description: 'Short video clips and social media snippets (30-60 seconds)',
      availableFor: ['file'] // Only available for webinars/recordings
    },
    { 
      name: 'Twitter Thread', 
      icon: <Twitter className="w-4 h-4" />, 
      color: 'border-blue-200 bg-blue-50',
      description: 'Engaging Twitter thread that breaks down your blog content',
      availableFor: ['text'] // Only available for blog content
    }
  ];

  // Filter assets based on content type
  const availableAssets = assetTypes.filter(asset => 
    asset.availableFor.includes(uploadType)
  );

  // Step validation functions
  const isStep1Valid = () => {
    return uploadType && (
      (uploadType === 'file' && formData.file) ||
      (uploadType === 'text' && isValidUrl(articleUrl))
    );
  };

  const isStep2Valid = () => {
    return combinedDescription.trim().length > 0;
  };

  const isStep3Valid = () => {
    return formData.selectedAssets.length > 0;
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

  const handleUploadTypeChange = (newType: 'file' | 'text') => {
    setUploadType(newType);
    
    // Update selected assets to only include those available for the new content type
    const newAvailableAssets = assetTypes.filter(asset => 
      asset.availableFor.includes(newType)
    );
    
    const updatedSelectedAssets = formData.selectedAssets.filter(selected =>
      newAvailableAssets.some(asset => asset.name === selected)
    );
    
    // If no assets remain selected, select the first few available ones
    if (updatedSelectedAssets.length === 0) {
      const defaultAssets = newAvailableAssets.slice(0, 4).map(asset => asset.name);
      setFormData(prev => ({ ...prev, selectedAssets: defaultAssets }));
    } else {
      setFormData(prev => ({ ...prev, selectedAssets: updatedSelectedAssets }));
    }
  };

  const handleAssetToggle = (assetName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAssets: prev.selectedAssets.includes(assetName)
        ? prev.selectedAssets.filter(asset => asset !== assetName)
        : [...prev.selectedAssets, assetName]
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1 && isStep1Valid()) {
      setCompletedSteps(prev => [...prev, 1]);
      setCurrentStep(2);
    } else if (currentStep === 2 && isStep2Valid()) {
      setCompletedSteps(prev => [...prev, 2]);
      setCurrentStep(3);
    } else if (currentStep === 3 && isStep3Valid()) {
      setCompletedSteps(prev => [...prev, 3]);
      setCurrentStep(4);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step <= currentStep || completedSteps.includes(step - 1)) {
      setCurrentStep(step);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!combinedDescription || (!formData.file && !articleUrl)) {
      return;
    }

    // Parse the combined description
    const { persona, funnelStage } = parseDescription(combinedDescription);
    const updatedFormData = {
      ...formData,
      description: combinedDescription,
      persona,
      funnelStage,
      textContent: uploadType === 'text' && articleUrl ? articleUrl : undefined,
      contentType: uploadType
    };

    onSubmit(updatedFormData);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderTooltip = (content: string, id: string) => (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(id)}
        onMouseLeave={() => setShowTooltip(null)}
        className="ml-2 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {showTooltip === id && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </div>
  );

  const renderStepIndicator = () => (
    <div className="mb-8">
      {/* Desktop Step Indicator */}
      <div className="hidden md:flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <button
              type="button"
              onClick={() => goToStep(step.number)}
              className={`flex flex-col items-center transition-all duration-200 ${
                step.number <= currentStep || completedSteps.includes(step.number - 1)
                  ? 'cursor-pointer'
                  : 'cursor-not-allowed'
              }`}
              disabled={step.number > currentStep && !completedSteps.includes(step.number - 1)}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 mb-2 ${
                step.number === currentStep
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : completedSteps.includes(step.number)
                  ? 'bg-emerald-500 text-white'
                  : step.number < currentStep
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {completedSteps.includes(step.number) ? <Check className="w-5 h-5" /> : step.number}
              </div>
              <div className="text-center">
                <div className={`text-sm font-semibold ${
                  step.number === currentStep
                    ? 'text-emerald-700'
                    : completedSteps.includes(step.number)
                    ? 'text-emerald-600'
                    : 'text-slate-600'
                }`}>
                  {step.title}
                </div>
                <div className={`text-xs ${
                  step.number === currentStep
                    ? 'text-emerald-600'
                    : completedSteps.includes(step.number)
                    ? 'text-emerald-500'
                    : 'text-slate-500'
                }`}>
                  {step.description}
                </div>
              </div>
            </button>
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 mx-4 rounded transition-all duration-200 ${
                completedSteps.includes(step.number) ? 'bg-emerald-500' : 'bg-slate-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile Step Indicator */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-slate-600">
            Step {currentStep} of {steps.length}
          </div>
          <div className="text-sm text-slate-500">
            {Math.round((currentStep / steps.length) * 100)}% Complete
          </div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-slate-900">
            {steps[currentStep - 1].title}
          </div>
          <div className="text-sm text-slate-600">
            {steps[currentStep - 1].description}
          </div>
        </div>
      </div>
    </div>
  );

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
              Let's Create Your Marketing Assets
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Just a few steps to turn your content into campaign-ready materials
            </p>
          </div>

          {/* Enhanced Step Indicator */}
          {renderStepIndicator()}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Content Type & Upload */}
            <div className={`transition-all duration-300 ${
              currentStep === 1 ? 'opacity-100' : currentStep > 1 ? 'opacity-60' : 'opacity-30'
            }`}>
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  1. What content do you have?
                </h2>
                {completedSteps.includes(1) && (
                  <Check className="w-5 h-5 text-emerald-600 ml-2" />
                )}
              </div>

              {currentStep >= 1 && (
                <div className="space-y-6">
                  {/* Upload Type Toggle */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-4">
                      Choose your content type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleUploadTypeChange('file')}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          uploadType === 'file'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                            : 'border-slate-200 hover:border-slate-300 bg-white/60'
                        }`}
                      >
                        <FileVideo className="w-5 h-5 mb-2" />
                        <div className="font-medium">Upload Audio or Video</div>
                        <div className="text-sm text-slate-600">MP4, MP3, WAV, M4A (up to 100MB)</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUploadTypeChange('text')}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          uploadType === 'text'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                            : 'border-slate-200 hover:border-slate-300 bg-white/60'
                        }`}
                      >
                        <FileText className="w-5 h-5 mb-2" />
                        <div className="font-medium">Paste Article or Blog URL</div>
                        <div className="text-sm text-slate-600">Medium, LinkedIn, blog posts</div>
                      </button>
                    </div>
                  </div>

                  {/* Content Input Based on Type */}
                  {uploadType === 'file' ? (
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-4">
                        Upload your recording
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
                              Drag & drop your file here
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
                  ) : (
                    <div>
                      <label htmlFor="article-url" className="block text-sm font-semibold text-slate-900 mb-4">
                        <FileText className="w-4 h-4 inline mr-2" />
                        Paste your Article or Blog URL
                        {renderTooltip("Paste the URL of any publicly accessible blog post or article. We support Medium, Substack, LinkedIn Articles, and most blog platforms.", "article-url-help")}
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="url"
                          id="article-url"
                          value={articleUrl}
                          onChange={(e) => setArticleUrl(e.target.value)}
                          placeholder="https://medium.com/@author/article"
                          className="w-full px-4 py-3 pl-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/60"
                          required
                        />
                      </div>
                      {articleUrl && (
                        <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-purple-600" />
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
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={!isStep1Valid()}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <span>Next: Tell us about it</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 2: Content Description */}
            {currentStep >= 2 && (
              <div className={`transition-all duration-300 ${
                currentStep === 2 ? 'opacity-100' : currentStep > 2 ? 'opacity-60' : 'opacity-30'
              }`}>
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-900">
                    2. Tell us about it
                  </h2>
                  {completedSteps.includes(2) && (
                    <Check className="w-5 h-5 text-emerald-600 ml-2" />
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="combined-description" className="block text-sm font-semibold text-slate-900 mb-4">
                      Describe your content and who it's for
                      {renderTooltip("Include your content topic, target audience, and key takeaways. This helps us create better, more targeted assets.", "description-help")}
                    </label>
                    <textarea
                      id="combined-description"
                      value={combinedDescription}
                      onChange={(e) => setCombinedDescription(e.target.value)}
                      placeholder="e.g., This is a marketing webinar for small business owners about increasing email open rates. We covered 5 proven strategies that can boost engagement by 40%..."
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/60 resize-none"
                      required
                    />
                    <p className="text-sm text-slate-500 mt-2">
                      Include your content topic, target audience, and key takeaways. Our AI will use this to create better assets.
                    </p>
                  </div>

                  {currentStep === 2 && (
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="bg-white/60 backdrop-blur-sm border-2 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={!isStep2Valid()}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <span>Next: What do you need?</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Asset Selection */}
            {currentStep >= 3 && (
              <div className={`transition-all duration-300 ${
                currentStep === 3 ? 'opacity-100' : currentStep > 3 ? 'opacity-60' : 'opacity-30'
              }`}>
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-900">
                    3. What do you need?
                  </h2>
                  {completedSteps.includes(3) && (
                    <Check className="w-5 h-5 text-emerald-600 ml-2" />
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-4">
                      <TrendingUp className="w-4 h-4 inline mr-2" />
                      Choose the marketing assets you want
                      {uploadType === 'text' && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Includes Twitter Thread for blogs!
                        </span>
                      )}
                      {uploadType === 'file' && (
                        <span className="ml-2 text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                          Includes Video Repurposing for webinars!
                        </span>
                      )}
                      {renderTooltip("Choose the types of marketing assets you need. Each asset is optimized for different stages of your marketing funnel and various platforms.", "assets-help")}
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableAssets.map((asset) => (
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
                                {asset.name === 'Twitter Thread' && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                    Blog Only
                                  </span>
                                )}
                                {asset.name === 'Video Repurposing Ideas' && (
                                  <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                                    Webinar Only
                                  </span>
                                )}
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

                  {currentStep === 3 && (
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="bg-white/60 backdrop-blur-sm border-2 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={!isStep3Valid()}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <span>Next: Add your brand (optional)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Optional Settings & Submit */}
            {currentStep >= 4 && (
              <div className="transition-all duration-300 opacity-100">
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-900">
                    4. Add your brand (optional)
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Company Website URL */}
                  <div>
                    <label htmlFor="company-website" className="block text-sm font-semibold text-slate-900 mb-4">
                      <Globe className="w-4 h-4 inline mr-2" />
                      Company Website (Optional)
                      {renderTooltip("We'll extract your brand colors and logo to create branded quote cards and visuals. This helps maintain brand consistency across all generated assets.", "website-help")}
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
                  <div className="flex justify-between pt-6">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="bg-white/60 backdrop-blur-sm border-2 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-lg py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center space-x-2"
                    >
                      <TrendingUp className="w-5 h-5" />
                      <span>Generate My Assets</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;