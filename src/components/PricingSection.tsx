import React from 'react';
import { ArrowLeft, Check, Zap, Crown, Building, Sparkles } from 'lucide-react';

interface PricingSectionProps {
  onBack: () => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onBack }) => {
  const plans = [
    {
      name: 'Starter',
      icon: <Zap className="w-6 h-6" />,
      price: 'Free',
      description: 'Perfect for trying out the platform',
      features: [
        '1 free webinar remix',
        '4 asset types included',
        'Basic templates',
        'Email support'
      ],
      cta: 'Get Started Free',
      popular: false,
      color: 'border-gray-200 bg-white'
    },
    {
      name: 'Pro',
      icon: <Crown className="w-6 h-6" />,
      price: '$9',
      period: 'per webinar',
      description: 'Ideal for individual marketers and small teams',
      features: [
        'Unlimited asset generation',
        '6 asset types included',
        'Premium templates',
        'Custom branding',
        'Priority support',
        'Analytics dashboard'
      ],
      cta: 'Start Pro Trial',
      popular: true,
      color: 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50'
    },
    {
      name: 'Team',
      icon: <Building className="w-6 h-6" />,
      price: '$49',
      period: 'per month',
      description: 'Built for marketing teams and agencies',
      features: [
        'Up to 5 webinars per month',
        'All asset types + custom',
        'Team collaboration tools',
        'Brand kit management',
        'API access',
        'Dedicated success manager',
        'Advanced analytics',
        'White-label options'
      ],
      cta: 'Contact Sales',
      popular: false,
      color: 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50'
    }
  ];

  const faqs = [
    {
      question: "What file formats do you support?",
      answer: "We support MP4, MP3, WAV, and most common audio/video formats. You can also paste YouTube links directly."
    },
    {
      question: "How accurate is the AI transcription?",
      answer: "Our AI achieves 95%+ accuracy on clear audio. For best results, ensure good audio quality in your recordings."
    },
    {
      question: "Can I customize the generated assets?",
      answer: "Yes! All generated content can be edited, and Pro users get access to custom templates and branding options."
    },
    {
      question: "Is there a limit on webinar length?",
      answer: "Free plan supports up to 1-hour webinars. Pro and Team plans have no length restrictions."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to app</span>
        </button>

        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-100">
            <Sparkles className="w-4 h-4" />
            <span>Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your webinars into campaign-ready assets. Start free, scale as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative card p-8 border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? `${plan.color} shadow-xl scale-105` 
                  : `${plan.color} hover:scale-105`
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <div className={`w-12 h-12 ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-600'} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>
              
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-600">/{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-gradient-to-r from-success-500 to-mint-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="card p-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Webinars?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of marketers who've streamlined their content creation with AI-powered asset generation
          </p>
          <button
            onClick={onBack}
            className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Start Your Free Remix</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;