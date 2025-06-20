import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import UploadForm from './components/UploadForm';
import ProcessingView from './components/ProcessingView';
import OutputView from './components/OutputView';
import PricingSection from './components/PricingSection';
import TranscriptionView from './components/TranscriptionView';
import { transcribeAudio } from './services/transcription';
import { generateMarketingAssets } from './services/assetGeneration';
import { extractBrandElements, BrandData } from './services/brandExtraction';

export interface WebinarData {
  file?: File;
  description: string;
  persona: string;
  funnelStage: string;
  selectedAssets: string[];
  youtubeUrl?: string;
  companyWebsiteUrl?: string;
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
  const [currentStep, setCurrentStep] = useState<'landing' | 'upload' | 'processing' | 'output' | 'pricing' | 'transcription'>('landing');
  const [webinarData, setWebinarData] = useState<WebinarData>({
    description: '',
    persona: '',
    funnelStage: '',
    selectedAssets: []
  });
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isProUser, setIsProUser] = useState<boolean>(false); // New state for Pro subscription

  const handleStartUpload = () => {
    setCurrentStep('upload');
  };

  const handleFormSubmit = async (data: WebinarData) => {
    setWebinarData(data);
    setCurrentStep('processing');
    setError(null);
    
    try {
      let transcript = '';
      let extractedBrandData: BrandData | null = null;
      
      // Step 0: Extract brand elements if website URL provided
      if (data.companyWebsiteUrl) {
        setProcessingStep('Extracting brand elements from your website...');
        setProcessingProgress(5);
        
        extractedBrandData = await extractBrandElements(data.companyWebsiteUrl);
        setBrandData(extractedBrandData);
        
        if (extractedBrandData.error) {
          console.warn('Brand extraction failed:', extractedBrandData.error);
          // Continue without brand data rather than failing completely
        }
      }
      
      // Step 1: Get transcript
      if (data.file) {
        setProcessingStep('Transcribing audio...');
        setProcessingProgress(15);
        
        const transcriptionResult = await transcribeAudio(data.file);
        transcript = transcriptionResult.text;
        
        if (!transcript || transcript.trim().length < 100) {
          throw new Error('Transcript is too short or empty. Please ensure your audio is clear and contains speech.');
        }
      } else if (data.youtubeUrl) {
        // For now, show error for YouTube - we'd need a backend service for this
        throw new Error('YouTube URL processing requires a backend service. Please upload a file instead.');
      } else {
        throw new Error('No audio source provided.');
      }
      
      setProcessingStep('Analyzing content and generating assets...');
      setProcessingProgress(35);
      
      // Step 2: Generate marketing assets with brand data
      const assets = await generateMarketingAssets(
        transcript, 
        data,
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

  const handleBackToLanding = () => {
    setCurrentStep('landing');
    setWebinarData({
      description: '',
      persona: '',
      funnelStage: '',
      selectedAssets: []
    });
    setGeneratedAssets([]);
    setBrandData(null);
    setError(null);
    setProcessingStep('');
    setProcessingProgress(0);
  };

  const handleViewPricing = () => {
    setCurrentStep('pricing');
  };

  const handleViewTranscription = () => {
    setCurrentStep('transcription');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'landing':
        return <LandingPage onStartUpload={handleStartUpload} onViewPricing={handleViewPricing} onViewTranscription={handleViewTranscription} />;
      case 'upload':
        return <UploadForm onSubmit={handleFormSubmit} onBack={handleBackToLanding} error={error} isProUser={isProUser} />;
      case 'processing':
        return (
          <ProcessingView 
            webinarData={webinarData} 
            currentStep={processingStep}
            progress={processingProgress}
          />
        );
      case 'output':
        return <OutputView assets={generatedAssets} brandData={brandData} onBack={handleBackToLanding} onViewPricing={handleViewPricing} />;
      case 'pricing':
        return <PricingSection onBack={handleBackToLanding} />;
      case 'transcription':
        return <TranscriptionView onBack={handleBackToLanding} />;
      default:
        return <LandingPage onStartUpload={handleStartUpload} onViewPricing={handleViewPricing} onViewTranscription={handleViewTranscription} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentStep()}
    </div>
  );
}

export default App;