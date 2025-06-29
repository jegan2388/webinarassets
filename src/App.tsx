import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import UploadForm from './components/UploadForm';
import ProcessingView from './components/ProcessingView';
import EmailCaptureView from './components/EmailCaptureView';
import OutputView from './components/OutputView';
import { transcribeAudio } from './services/transcription';
import { generateMarketingAssets } from './services/assetGeneration';
import { supabase } from './lib/supabase';
import OpenAI from 'openai';

export interface ContentData {
  file?: File;
  description: string;
  persona: string;
  funnelStage: string;
  selectedAssets: string[];
  youtubeUrl?: string;
  textContent?: string;
  contentType: 'file' | 'text';
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
  const [currentStep, setCurrentStep] = useState<'landing' | 'upload' | 'processing' | 'emailCapture' | 'output'>('landing');
  const [contentData, setContentData] = useState<ContentData>({
    description: '',
    persona: '',
    funnelStage: '',
    selectedAssets: [],
    contentType: 'file'
  });
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [currentWebinarRequestId, setCurrentWebinarRequestId] = useState<string | null>(null);
  const [openAITokenUsage, setOpenAITokenUsage] = useState<OpenAI.CompletionUsage | null>(null);

  const handleStartUpload = () => {
    setCurrentStep('upload');
  };

  const handleSubmit = async (formData: ContentData) => {
    setContentData(formData);
    setCurrentStep('processing');
    setError(null);
    
    try {
      let transcript = '';
      
      // Check if user is authenticated before creating webinar request
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (user && !authError) {
          // User is authenticated, create webinar request record
          const { data: webinarRequest, error: insertError } = await supabase
            .from('webinar_requests')
            .insert({
              user_id: user.id,
              form_data: formData,
              payment_status: 'completed', // For free tier, mark as completed
              subscription_tier: 'free',
              content_type: formData.contentType,
              amount_paid: 0
            })
            .select()
            .single();

          if (insertError) {
            console.warn('Could not create webinar request record:', insertError);
            // Continue without database tracking for demo purposes
          } else {
            setCurrentWebinarRequestId(webinarRequest.id);
          }
        } else {
          console.log('No authenticated user found, continuing in demo mode without database tracking');
          // Continue without database tracking for unauthenticated users
        }
      } catch (dbError) {
        console.warn('Database not available, continuing in demo mode:', dbError);
        // Continue without database for demo purposes
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
      } else {
        throw new Error('No content source provided.');
      }
      
      setProcessingStep('Analyzing content and generating assets...');
      setProcessingProgress(35);
      
      // Step 2: Generate marketing assets
      const { assets, tokenUsage } = await generateMarketingAssets(
        transcript, 
        formData,
        null, // No brand data
        (step, progress) => {
          setProcessingStep(step);
          setProcessingProgress(progress);
        }
      );
      
      if (assets.length === 0) {
        throw new Error('No assets were generated. Please try again or check your content.');
      }
      
      setGeneratedAssets(assets);
      setOpenAITokenUsage(tokenUsage);
      
      // Update the webinar request with generated assets and transcript (only if we have a request ID)
      if (currentWebinarRequestId) {
        try {
          await supabase
            .from('webinar_requests')
            .update({
              assets_json: assets,
              transcript: transcript,
              processed_at: new Date().toISOString()
            })
            .eq('id', currentWebinarRequestId);
        } catch (updateError) {
          console.warn('Could not update webinar request with assets:', updateError);
          // Continue anyway since assets are generated
        }
      }
      
      // Instead of going directly to output, go to email capture
      setCurrentStep('emailCapture');
      
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

  const handleEmailSubmit = async (email: string) => {
    setUserEmail(email);
    
    // Store the email in the database if we have a webinar request ID
    if (currentWebinarRequestId) {
      try {
        await supabase
          .from('webinar_requests')
          .update({
            delivery_email: email
          })
          .eq('id', currentWebinarRequestId);
        
        console.log('Email stored successfully for webinar request:', currentWebinarRequestId);
      } catch (error) {
        console.warn('Could not store email in database:', error);
        // Continue anyway since the email is captured in state
      }
    }
    
    setCurrentStep('output');
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
    setError(null);
    setProcessingStep('');
    setProcessingProgress(0);
    setUserEmail('');
    setCurrentWebinarRequestId(null);
    setOpenAITokenUsage(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'landing':
        return (
          <LandingPage 
            onStartUpload={handleStartUpload} 
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
      case 'emailCapture':
        return (
          <EmailCaptureView
            assets={generatedAssets}
            contentData={contentData}
            onEmailSubmit={handleEmailSubmit}
            onBack={handleBackToLanding}
          />
        );
      case 'output':
        return (
          <OutputView 
            assets={generatedAssets} 
            onBack={handleBackToLanding}
            userEmail={userEmail}
            openAITokenUsage={openAITokenUsage}
          />
        );
      default:
        return (
          <LandingPage 
            onStartUpload={handleStartUpload} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Help Button for Judges */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <div className="relative">
          <button className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
            <span className="text-lg font-bold">?</span>
          </button>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="font-semibold mb-1">ContentRemix Demo</div>
            <div className="text-xs text-gray-300">
              Transform any content (recordings, text) into campaign-ready marketing assets. 
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