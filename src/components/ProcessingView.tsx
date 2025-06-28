import React, { useEffect, useState } from 'react';
import { Zap, Brain, FileText, MessageSquare, Mail, Quote, Loader2, Sparkles, AlertCircle, Globe, Type } from 'lucide-react';
import { ContentData } from '../App';

interface ProcessingViewProps {
  contentData: ContentData;
  currentStep?: string;
  progress?: number;
}

const ProcessingView: React.FC<ProcessingViewProps> = ({ 
  contentData, 
  currentStep = '', 
  progress = 0 
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [previewAsset, setPreviewAsset] = useState<string | null>(null);

  // Determine if this is file (webinar/audio) or text (blog/article) content
  const isFileContent = contentData.contentType === 'file';
  const isTextContent = contentData.contentType === 'text';

  // Dynamic processing steps based on content type
  const getProcessingSteps = () => {
    const baseSteps = [
      // Step 1: Content Processing (different for file vs text)
      isFileContent ? {
        icon: <FileText className="w-6 h-6" />,
        title: "Transcribing Audio",
        description: "Converting your recording to text using advanced AI",
        status: "Listening to every word (even the 'ums')..."
      } : {
        icon: <Type className="w-6 h-6" />,
        title: "Extracting Text Content",
        description: "Analyzing your article/blog content for key insights",
        status: "Reading through your content and identifying key themes..."
      },
      
      // Step 2: Content Analysis (same for both)
      {
        icon: <Brain className="w-6 h-6" />,
        title: "Analyzing Content",
        description: "Understanding key themes, insights, and messaging",
        status: "Finding the golden nuggets in your content..."
      },
      
      // Step 3: Social Media Content (adapted for content type)
      {
        icon: <MessageSquare className="w-6 h-6" />,
        title: isFileContent ? "Writing Spicy Subject Lines" : "Crafting Engaging Social Posts",
        description: isFileContent ? "Crafting engaging social media content" : "Creating LinkedIn posts and social content",
        status: isFileContent 
          ? "Writing LinkedIn posts that actually get engagement..."
          : "Turning your insights into scroll-stopping social content..."
      },
      
      // Step 4: Email & Visual Content (adapted for content type)
      {
        icon: <Mail className="w-6 h-6" />,
        title: isFileContent ? "Designing Quote Cards Marketers Will Actually Use" : "Creating Email Sequences That Convert",
        description: isFileContent ? "Generating personalized email sequences" : "Building nurture sequences and sales emails",
        status: isFileContent
          ? "Creating visuals that don't look like stock photos..."
          : "Writing emails that people actually want to read..."
      },
      
      // Step 5: Final Polish (adapted for content type)
      {
        icon: <Quote className="w-6 h-6" />,
        title: "Unleashing the AI Creativity",
        description: isFileContent 
          ? "Creating shareable visual content and video clips"
          : "Generating quote cards and Twitter threads",
        status: "Putting the finishing touches on your campaign magic..."
      }
    ];

    return baseSteps;
  };

  const wittySteps = getProcessingSteps();

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

  // Show preview asset early with content-type specific preview
  useEffect(() => {
    if (progress > 30 && !previewAsset) {
      if (isFileContent) {
        // Mock LinkedIn post preview for webinar content
        const mockPost = `🚀 Just wrapped up an incredible session on "${contentData.description}"

The biggest takeaway? Most ${contentData.persona?.toLowerCase() || 'teams'} are missing this one crucial step that could 3x their results.

Here's what we covered:
→ [Key insight will be generated from your actual content]
→ [Specific strategy mentioned in your content]
→ [Actionable tip your audience can implement today]

What's your experience with this? Drop a comment below! 👇

#Marketing #B2B #Strategy`;
        
        setPreviewAsset(mockPost);
      } else {
        // Mock LinkedIn post preview for blog/article content
        const mockPost = `📝 Just published a deep dive on "${contentData.description}"

After researching this topic extensively, here's what surprised me most:

The conventional wisdom around this is completely backwards.

Most ${contentData.persona?.toLowerCase() || 'professionals'} focus on the wrong metrics entirely.

Here's what actually moves the needle:
→ [Quality insights from your article]
→ [Specific frameworks you mentioned]
→ [Actionable tips readers can implement today]

The full breakdown is in my latest article. What's been your experience?

#ThoughtLeadership #ContentStrategy #B2B #Marketing`;
        
        setPreviewAsset(mockPost);
      }
    }
  }, [progress, contentData, previewAsset, isFileContent]);

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
            Remixing Your {isFileContent ? 'Recording' : 'Article'} Into Campaign Magic...
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Our AI is analyzing <span className="font-semibold text-blue-600">"{contentData.description}"</span> for <span className="font-semibold text-indigo-600">{contentData.persona?.toLowerCase() || 'your audience'}</span>
          </p>

          {/* Content Type Indicator */}
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm text-slate-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
            {isFileContent ? (
              <>
                <FileText className="w-4 h-4" />
                <span>Processing Audio/Video Content</span>
              </>
            ) : (
              <>
                <Globe className="w-4 h-4" />
                <span>Processing Article/Blog Content</span>
              </>
            )}
          </div>

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

        {/* Preview Asset Box */}
        {previewAsset && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Preview: LinkedIn Post</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Generated Early!</span>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-medium leading-relaxed">
                  {previewAsset}
                </pre>
              </div>
              <p className="text-xs text-blue-700 mt-2">
                ✨ This is just a preview - your final assets will be customized with your actual content!
              </p>
            </div>
          </div>
        )}

        {/* Processing Steps */}
        <div className="space-y-4 mb-16">
          {wittySteps.map((step, index) => (
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
            {contentData.selectedAssets.map((asset, index) => (
              <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                <div className="text-2xl mb-2">
                  {asset.includes('LinkedIn') ? '💼' : 
                   asset.includes('Email') ? '📧' : 
                   asset.includes('Quote') ? '💬' : 
                   asset.includes('Sales') ? '🎯' : 
                   asset.includes('Video') ? '🎬' :
                   asset.includes('Twitter') ? '🐦' :
                   asset.includes('Infographic') ? '📊' : '📄'}
                </div>
                <p className="text-sm font-medium text-gray-900">{asset}</p>
                {/* Show content-type specific badges */}
                {asset.includes('Video') && isFileContent && (
                  <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full mt-1 inline-block">
                    Webinar Clips
                  </span>
                )}
                {asset.includes('Twitter') && isTextContent && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full mt-1 inline-block">
                    Blog Thread
                  </span>
                )}
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