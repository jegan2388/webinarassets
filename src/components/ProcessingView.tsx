import React, { useEffect, useState } from 'react';
import { Zap, Brain, FileText, MessageSquare, Mail, Quote, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { WebinarData } from '../App';

interface ProcessingViewProps {
  webinarData: WebinarData;
  currentStep?: string;
  progress?: number;
}

const ProcessingView: React.FC<ProcessingViewProps> = ({ 
  webinarData, 
  currentStep = '', 
  progress = 0 
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  const steps = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Transcribing Audio",
      description: "Converting your webinar to text using advanced AI",
      status: "Analyzing audio patterns and speech recognition..."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Analyzing Content",
      description: "Understanding key themes, insights, and messaging",
      status: "Extracting valuable insights and key takeaways..."
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Creating LinkedIn Posts",
      description: "Crafting engaging social media content",
      status: "Writing compelling posts for professional networks..."
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Writing Email Copy",
      description: "Generating personalized email sequences",
      status: "Crafting nurture emails for your funnel stage..."
    },
    {
      icon: <Quote className="w-6 h-6" />,
      title: "Finalizing Assets",
      description: "Creating shareable visual content and sales snippets",
      status: "Generating quote cards and sales materials..."
    }
  ];

  // Smooth progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress(prev => {
        if (prev < progress) {
          return Math.min(prev + 1, progress);
        }
        return prev;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [progress]);

  // Determine current step index based on progress
  const getCurrentStepIndex = () => {
    if (progress < 20) return 0;
    if (progress < 40) return 1;
    if (progress < 60) return 2;
    if (progress < 80) return 3;
    return 4;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse-soft">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Remixing Your Webinar Into Campaign Magic...
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Our AI is analyzing <span className="font-semibold text-blue-600">"{webinarData.description}"</span> for <span className="font-semibold text-indigo-600">{webinarData.persona.toLowerCase()}</span> teams
          </p>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Processing Progress</span>
              <span className="text-sm font-bold text-blue-600">{displayProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out shadow-lg"
                style={{ width: `${displayProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Current Step Status */}
          {currentStep && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-center space-x-3">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-blue-800 font-medium">{currentStep}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Processing Steps */}
        <div className="space-y-4 mb-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`card p-6 transition-all duration-500 border-2 ${
                index < currentStepIndex
                  ? 'border-success-200 bg-gradient-to-r from-success-50 to-mint-50 shadow-lg'
                  : index === currentStepIndex
                  ? 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg animate-pulse-soft'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center mr-6 transition-all duration-500 shadow-lg ${
                    index < currentStepIndex
                      ? 'bg-gradient-to-r from-success-500 to-mint-500 text-white'
                      : index === currentStepIndex
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index === currentStepIndex ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-1">{step.description}</p>
                  {index === currentStepIndex && (
                    <p className="text-sm text-blue-600 font-medium animate-pulse">
                      {currentStep || step.status}
                    </p>
                  )}
                </div>
                {index < currentStepIndex && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-gradient-to-r from-success-500 to-mint-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Assets Preview */}
        <div className="card p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 mb-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center flex items-center justify-center">
            <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
            Generating Your Selected Assets
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {webinarData.selectedAssets.map((asset, index) => (
              <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                <div className="text-2xl mb-2">
                  {asset.includes('LinkedIn') ? '💼' : 
                   asset.includes('Email') ? '📧' : 
                   asset.includes('Quote') ? '💬' : 
                   asset.includes('Sales') ? '🎯' : '📄'}
                </div>
                <p className="text-sm font-medium text-gray-900">{asset}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Facts */}
        <div className="card p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center flex items-center justify-center">
            <Brain className="w-5 h-5 mr-2 text-indigo-600" />
            While you wait...
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">73%</p>
              <p className="text-sm text-gray-600">of marketers say AI saves them 2+ hours per week on content creation</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">6x</p>
              <p className="text-sm text-gray-600">faster content creation with AI assistance compared to manual methods</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">94%</p>
              <p className="text-sm text-gray-600">report improved content consistency across marketing channels</p>
            </div>
          </div>
        </div>

        {/* API Key Warning */}
        {!import.meta.env.VITE_OPENAI_API_KEY && (
          <div className="card p-6 border-red-200 bg-red-50 mt-8">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900">API Key Missing</h3>
                <p className="text-red-700 text-sm mt-1">
                  OpenAI API key not configured. Processing will fail without proper API access.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingView;