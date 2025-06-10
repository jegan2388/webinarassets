import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import UploadForm from './components/UploadForm';
import ProcessingView from './components/ProcessingView';
import OutputView from './components/OutputView';
import PricingSection from './components/PricingSection';
import TranscriptionView from './components/TranscriptionView';

export interface WebinarData {
  file?: File;
  description: string;
  persona: string;
  funnelStage: string;
  selectedAssets: string[];
  youtubeUrl?: string;
}

export interface GeneratedAsset {
  id: string;
  type: string;
  title: string;
  content: string;
  preview?: string;
}

function App() {
  const [currentStep, setCurrentStep] = useState<'landing' | 'upload' | 'processing' | 'output' | 'pricing' | 'transcription'>('transcription');
  const [webinarData, setWebinarData] = useState<WebinarData>({
    description: '',
    persona: '',
    funnelStage: '',
    selectedAssets: []
  });
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);

  const handleStartUpload = () => {
    setCurrentStep('upload');
  };

  const handleFormSubmit = (data: WebinarData) => {
    setWebinarData(data);
    setCurrentStep('processing');
    
    // Simulate AI processing
    setTimeout(() => {
      const mockAssets: GeneratedAsset[] = [
        {
          id: '1',
          type: 'LinkedIn Post',
          title: 'Engaging LinkedIn Post',
          content: `🚀 Just wrapped up an incredible webinar on ${data.description}!\n\nKey takeaways for ${data.persona} teams:\n• Strategic insights that drive results\n• Proven frameworks you can implement today\n• Real-world examples from industry leaders\n\nWhat resonated most with your team? Drop a comment below! 👇\n\n#${data.persona} #B2B #Growth`,
        },
        {
          id: '2',
          type: 'Email Snippet',
          title: 'Nurture Email',
          content: `Subject: The ${data.description} insights you requested\n\nHi [First Name],\n\nThanks for joining our recent webinar! As promised, here are the key insights we covered:\n\n1. Strategic approach to ${data.description.toLowerCase()}\n2. Framework for ${data.persona.toLowerCase()} teams\n3. Implementation roadmap\n\nReady to take the next step? Let's schedule a quick call to discuss how this applies to your specific situation.\n\nBest regards,\n[Your Name]`,
        },
        {
          id: '3',
          type: 'Quote Card',
          title: 'Visual Quote',
          content: `"The key to successful ${data.description.toLowerCase()} is understanding your ${data.persona.toLowerCase()} audience and meeting them where they are in their journey."`,
          preview: 'quote-card-preview'
        },
        {
          id: '4',
          type: 'Sales Snippet',
          title: 'Sales Outreach',
          content: `Hi [Prospect Name],\n\nI noticed you're focused on ${data.description.toLowerCase()} for ${data.persona.toLowerCase()} teams. We recently hosted a webinar on this exact topic and uncovered some fascinating insights.\n\nOne key finding: Companies that implement our framework see 40% faster results.\n\nWould you be interested in a 15-minute call to discuss how this could apply to [Company Name]?\n\nBest,\n[Your Name]`,
        }
      ];

      // Filter based on selected assets
      const filteredAssets = mockAssets.filter(asset => 
        data.selectedAssets.some(selected => 
          asset.type.toLowerCase().includes(selected.toLowerCase()) ||
          selected.toLowerCase().includes(asset.type.toLowerCase())
        )
      );

      setGeneratedAssets(filteredAssets.length > 0 ? filteredAssets : mockAssets);
      setCurrentStep('output');
    }, 3000);
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
  };

  const handleViewPricing = () => {
    setCurrentStep('pricing');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'landing':
        return <LandingPage onStartUpload={handleStartUpload} onViewPricing={handleViewPricing} />;
      case 'upload':
        return <UploadForm onSubmit={handleFormSubmit} onBack={handleBackToLanding} />;
      case 'processing':
        return <ProcessingView webinarData={webinarData} />;
      case 'output':
        return <OutputView assets={generatedAssets} onBack={handleBackToLanding} onViewPricing={handleViewPricing} />;
      case 'pricing':
        return <PricingSection onBack={handleBackToLanding} />;
      case 'transcription':
        return <TranscriptionView />;
      default:
        return <LandingPage onStartUpload={handleStartUpload} onViewPricing={handleViewPricing} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentStep()}
    </div>
  );
}

export default App;