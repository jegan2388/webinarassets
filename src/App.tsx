import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import UploadForm from './components/UploadForm';
import ProcessingView from './components/ProcessingView';
import OutputView from './components/OutputView';
import TranscriptionView from './components/TranscriptionView';
import { transcribeAudio } from './services/transcription';
import { generateMarketingAssets } from './services/assetGeneration';
import { extractBrandElements, BrandData } from './services/brandExtraction';

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
  const [currentStep, setCurrentStep] = useState<'landing' | 'upload' | 'processing' | 'output' | 'transcription'>('landing');
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

  const handleStartUpload = () => {
    setCurrentStep('upload');
  };

  const handleSubmit = async (formData: ContentData) => {
    setContentData(formData);
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
  };

  const handleViewTranscription = () => {
    setCurrentStep('transcription');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'landing':
        return (
          <LandingPage 
            onStartUpload={handleStartUpload} 
            onViewTranscription={handleViewTranscription}
          />
        );
      case 'upload':
        return (
          <UploadForm 
            onSubmit={handleSubmit} 
            onBack={handleBackToLanding} 
            error={error} 
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
            onBack={handleBackToLanding} 
          />
        );
      case 'transcription':
        return <TranscriptionView onBack={handleBackToLanding} />;
      default:
        return (
          <LandingPage 
            onStartUpload={handleStartUpload} 
            onViewTranscription={handleViewTranscription}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
    </div>
  );
}

export default App;