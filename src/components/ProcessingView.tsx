import React, { useEffect, useState } from 'react';
import { Zap, Brain, FileText, MessageSquare, Mail, Quote } from 'lucide-react';
import { WebinarData } from '../App';

interface ProcessingViewProps {
  webinarData: WebinarData;
}

const ProcessingView: React.FC<ProcessingViewProps> = ({ webinarData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Transcribing Audio",
      description: "Converting your webinar to text using AI",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Analyzing Content",
      description: "Understanding key themes and insights",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Creating LinkedIn Posts",
      description: "Crafting engaging social media content",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Writing Email Copy",
      description: "Generating personalized email sequences",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Quote className="w-6 h-6" />,
      title: "Designing Quote Cards",
      description: "Creating shareable visual content",
      color: "from-cyan-500 to-blue-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return steps.length - 1;
        }
        return prev + 1;
      });
    }, 600);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [steps.length]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-r from-teal-500 via-violet-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <Zap className="w-10 h-10 text-white animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Remixing Your Webinar Into Campaign Magic...
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Our AI is analyzing "{webinarData.description}" for {webinarData.persona.toLowerCase()}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-8 shadow-inner">
          <div 
            className="bg-gradient-to-r from-teal-500 via-violet-500 to-orange-500 h-4 rounded-full transition-all duration-300 ease-out shadow-lg"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-lg font-medium text-gray-700">{progress}% Complete</p>
      </div>

      {/* Processing Steps */}
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center p-6 rounded-2xl border-2 transition-all duration-500 ${
              index <= currentStep
                ? 'border-emerald-200 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 shadow-lg'
                : index === currentStep + 1
                ? 'border-teal-200 bg-gradient-to-r from-teal-50/50 to-cyan-50/50 animate-pulse shadow-lg'
                : 'border-gray-200 bg-gray-50/50'
            }`}
          >
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center mr-6 transition-all duration-500 shadow-lg ${
                index <= currentStep
                  ? `bg-gradient-to-r from-emerald-500 to-teal-500 text-white`
                  : index === currentStep + 1
                  ? `bg-gradient-to-r ${step.color} text-white`
                  : 'bg-gray-300 text-gray-500'
              }`}
            >
              {step.icon}
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
            {index <= currentStep && (
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fun Facts */}
      <div className="mt-16 bg-gradient-to-r from-teal-100/50 via-violet-100/50 to-orange-100/50 rounded-3xl p-8 backdrop-blur-sm border border-white/20">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          💡 Did you know?
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">73%</p>
            <p className="text-sm text-gray-600">of marketers say AI saves them 2+ hours per week</p>
          </div>
          <div>
            <p className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">6x</p>
            <p className="text-sm text-gray-600">faster content creation with AI assistance</p>
          </div>
          <div>
            <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">94%</p>
            <p className="text-sm text-gray-600">report improved content consistency</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingView;