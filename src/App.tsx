import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import UploadForm from './components/UploadForm';
import ProcessingView from './components/ProcessingView';
import OutputView from './components/OutputView';
import PricingSection from './components/PricingSection';
import TranscriptionView from './components/TranscriptionView';
import PaymentPending from './components/PaymentPending';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import UserMenu from './components/UserMenu';
import { transcribeAudio } from './services/transcription';
import { generateMarketingAssets } from './services/assetGeneration';
import { extractBrandElements, BrandData } from './services/brandExtraction';
import { useAuth } from './hooks/useAuth';
import { createCheckoutSession } from './lib/stripe';

export interface ContentData {
  file?: File;
  description: string;
  persona: string;
  funnelStage: string;
  selectedAssets: string[];
  youtubeUrl?: string;
  companyWebsiteUrl?: string;
  textContent?: string;
  contentType: 'file' | 'link' | 'text';
}

export interface GeneratedAsset {
  id: string;
  type: string;
  title: string;
  content: string;
  preview?: string;
  imageUrl?: string;
}

function App() {
  const [currentStep, setCurrentStep] = useState<'landing' | 'upload' | 'payment_pending' | 'processing' | 'output' | 'pricing' | 'transcription' | 'dashboard'>('landing');
  const [contentData, setContentData] = useState<ContentData>({
    description: '',
    persona: '',
    funnelStage: '',
    selectedAssets: [],
    contentType: 'file'
  });
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [pendingContentRequestId, setPendingContentRequestId] = useState<string | null>(null);
  const [currentContentRequestId, setCurrentContentRequestId] = useState<string | null>(null);
  const [viewingContentRequest, setViewingContentRequest] = useState<any>(null);

  const { user, isProUser, loading: authLoading, subscriptionStatus, monthlyContentLimit, contentProcessedThisMonth } = useAuth();

  const handleStartUpload = () => {
    setCurrentStep('upload');
  };

  const handleViewDashboard = () => {
    setCurrentStep('dashboard');
  };

  const handlePaymentPending = (contentRequestId: string, formData: ContentData) => {
    setPendingContentRequestId(contentRequestId);
    setCurrentContentRequestId(contentRequestId);
    setContentData(formData);
    setCurrentStep('payment_pending');
  };

  const handlePaymentSuccess = async (formData: ContentData, contentRequestId?: string) => {
    setContentData(formData);
    setCurrentContentRequestId(contentRequestId || null);
    setCurrentStep('processing');
    setError(null);
    
    try {
      let transcript = '';
      let extractedBrandData: BrandData | null = null;
      
      // Step 0: Extract brand elements if website URL provided
      if (formData.companyWebsiteUrl) {
        setProcessingStep('Extracting brand elements from your website...');
        setProcessingProgress(5);
        
        extractedBrandData = await extractBrandElements(formData.companyWebsiteUrl);
        setBrandData(extractedBrandData);
        
        if (extractedBrandData.error) {
          console.warn('Brand extraction failed:', extractedBrandData.error);
          // Continue without brand data rather than failing completely
        }
      }
      
      // Step 1: Get transcript based on content type
      if (formData.contentType === 'text' && formData.textContent) {
        // Use text content directly as transcript
        transcript = formData.textContent;
        setProcessingStep('Processing your text content...');
        setProcessingProgress(25);
      } else if (formData.file) {
        setProcessingStep('Transcribing audio...');
        setProcessingProgress(15);
        
        const transcriptionResult = await transcribeAudio(formData.file);
        transcript = transcriptionResult.text;
        
        if (!transcript || transcript.trim().length < 100) {
          throw new Error('Transcript is too short or empty. Please ensure your audio is clear and contains speech.');
        }
      } else if (formData.youtubeUrl) {
        // For now, show error for video URLs - we'd need a backend service for this
        throw new Error('Video URL processing requires a backend service. Please upload a file or use text content instead.');
      } else {
        throw new Error('No content source provided.');
      }
      
      setProcessingStep('Analyzing content and generating assets...');
      setProcessingProgress(35);
      
      // Step 2: Generate marketing assets with brand data
      const assets = await generateMarketingAssets(
        transcript, 
        formData,
        extractedBrandData,
        (step, progress) => {
          setProcessingStep(step);
          setProcessingProgress(progress);
        }
      );
      
      if (assets.length === 0) {
        throw new Error('No assets were generated. Please try again or check your content.');
      }
      
      setGeneratedAssets(assets);
      setCurrentStep('output');
      
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      
      // Show error for a few seconds, then go back to upload
      setTimeout(() => {
        setCurrentStep('upload');
        setError(null);
      }, 5000);
    }
  };

  const handlePaymentFailed = () => {
    setCurrentStep('upload');
    setPendingContentRequestId(null);
    setError('Payment was cancelled or failed. Please try again.');
    
    // Clear error after a few seconds
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  const handleBackToLanding = () => {
    setCurrentStep('landing');
    setContentData({
      description: '',
      persona: '',
      funnelStage: '',
      selectedAssets: [],
      contentType: 'file'
    });
    setGeneratedAssets([]);
    setBrandData(null);
    setError(null);
    setProcessingStep('');
    setProcessingProgress(0);
    setPendingContentRequestId(null);
    setCurrentContentRequestId(null);
    setViewingContentRequest(null);
  };

  const handleViewPricing = () => {
    setCurrentStep('pricing');
  };

  const handleViewTranscription = () => {
    setCurrentStep('transcription');
  };

  const handleShowAuth = () => {
    setShowAuth(true);
  };

  const handleCloseAuth = () => {
    setShowAuth(false);
  };

  const handleViewAssets = (contentRequest: any) => {
    setViewingContentRequest(contentRequest);
    setContentData(contentRequest.form_data);
    setCurrentContentRequestId(contentRequest.id);
    
    // Mock assets for now - in production, these would be stored in the database
    const mockAssets: GeneratedAsset[] = [
      {
        id: 'linkedin-1',
        type: 'LinkedIn Posts',
        title: 'Engaging LinkedIn Post 1',
        content: `🚀 Just discovered a game-changing insight from our latest content on "${contentRequest.form_data.description}"

The biggest takeaway? Most teams are missing this one crucial step that could 3x their results.

Here's what we learned:
→ [Key insight from your content]
→ [Specific strategy mentioned]
→ [Actionable tip for implementation]

What's your experience with this? Drop a comment below! 👇

#Marketing #B2B #Strategy`
      },
      {
        id: 'sales-1',
        type: 'Sales Outreach Emails',
        title: 'Cold Prospect Outreach',
        content: `Subject: Quick question about your lead generation

Hi [Name],

I noticed you're focused on scaling [Company] and thought you'd find this interesting.

We just shared insights showing how companies like yours are increasing conversion rates by 40% using a simple automation tweak.

The key insight? Most teams are optimizing the wrong part of their funnel.

Worth a 15-minute conversation to share what we learned?

Best,
[Your name]`
      }
    ];

    // Add pro assets if this was a paid request
    if (contentRequest.amount_paid > 0) {
      mockAssets.push(
        {
          id: 'nurture-1',
          type: 'Marketing Nurture Emails',
          title: 'Educational Value Email',
          content: `Subject: 3 insights from our latest content you'll want to bookmark

Hi [Name],

Thanks for your interest in our recent content on "${contentRequest.form_data.description}".

Here are the 3 key takeaways that are already helping teams like yours:

• [Key insight 1 with brief explanation]
• [Key insight 2 with actionable tip]
• [Key insight 3 with implementation guide]

I've also attached a one-page summary you can share with your team.

Questions? Just reply to this email.

Best,
[Your name]`
        },
        {
          id: 'quote-1',
          type: 'Quote Cards',
          title: 'Insightful Quote 1',
          content: 'The biggest mistake teams make is optimizing for the wrong metrics. Focus on quality over quantity, and watch your conversion rates soar.'
        }
      );
    }

    setGeneratedAssets(mockAssets);
    setCurrentStep('output');
  };

  const handleUpgradeContent = async (contentRequest: any) => {
    try {
      const { url } = await createCheckoutSession(
        contentRequest.form_data,
        `${window.location.origin}/dashboard`,
        `${window.location.origin}/dashboard`,
        contentRequest.id
      );
      
      window.location.href = url;
    } catch (err) {
      console.error('Upgrade error:', err);
      setError('Failed to initiate upgrade. Please try again.');
    }
  };

  // Redirect authenticated users to dashboard instead of landing
  React.useEffect(() => {
    if (user && currentStep === 'landing') {
      setCurrentStep('dashboard');
    }
  }, [user, currentStep]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'landing':
        return (
          <LandingPage 
            onStartUpload={handleStartUpload} 
            onViewPricing={handleViewPricing} 
            onViewTranscription={handleViewTranscription}
            onShowAuth={handleShowAuth}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            onBack={handleBackToLanding}
            onViewAssets={handleViewAssets}
            onUpgradeContent={handleUpgradeContent}
            onRemixAgain={handleStartUpload}
          />
        );
      case 'upload':
        return (
          <UploadForm 
            onSubmit={handlePaymentSuccess} 
            onBack={user ? handleViewDashboard : handleBackToLanding} 
            onPaymentPending={handlePaymentPending}
            error={error} 
            isProUser={isProUser}
            subscriptionStatus={subscriptionStatus}
            monthlyContentLimit={monthlyContentLimit}
            contentProcessedThisMonth={contentProcessedThisMonth}
          />
        );
      case 'payment_pending':
        return (
          <PaymentPending
            contentRequestId={pendingContentRequestId!}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentFailed={handlePaymentFailed}
            onBack={user ? handleViewDashboard : handleBackToLanding}
          />
        );
      case 'processing':
        return (
          <ProcessingView 
            contentData={contentData} 
            currentStep={processingStep}
            progress={processingProgress}
          />
        );
      case 'output':
        return (
          <OutputView 
            assets={generatedAssets} 
            brandData={brandData} 
            onBack={user ? handleViewDashboard : handleBackToLanding} 
            onViewPricing={handleViewPricing}
            contentRequestId={currentContentRequestId}
            currentContentData={contentData}
          />
        );
      case 'pricing':
        return <PricingSection onBack={user ? handleViewDashboard : handleBackToLanding} />;
      case 'transcription':
        return <TranscriptionView onBack={user ? handleViewDashboard : handleBackToLanding} />;
      default:
        return user ? (
          <Dashboard
            onBack={handleBackToLanding}
            onViewAssets={handleViewAssets}
            onUpgradeContent={handleUpgradeContent}
            onRemixAgain={handleStartUpload}
          />
        ) : (
          <LandingPage 
            onStartUpload={handleStartUpload} 
            onViewPricing={handleViewPricing} 
            onViewTranscription={handleViewTranscription}
            onShowAuth={handleShowAuth}
          />
        );
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* User Menu - Show on all pages except landing */}
      {currentStep !== 'landing' && user && (
        <div className="absolute top-4 right-4 z-10">
          <UserMenu />
        </div>
      )}
      
      {/* Floating Help Button for Judges */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <div className="relative">
          <button className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
            <span className="text-lg font-bold">?</span>
          </button>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="font-semibold mb-1">ContentRemix Demo</div>
            <div className="text-xs text-gray-300">
              AI-powered tool that transforms any content (recordings, text, videos) into 7 campaign-ready marketing assets. 
              Upload → AI Analysis → Professional Assets in minutes.
            </div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
      
      {renderCurrentStep()}
      
      {/* Auth Modal */}
      {showAuth && <Auth onClose={handleCloseAuth} />}
    </div>
  );
}

export default App;