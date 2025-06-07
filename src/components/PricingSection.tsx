import React from 'react';
import { ArrowLeft, Check, Zap, Crown, Building } from 'lucide-react';

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
      gradient: 'from-gray-600 to-gray-700',
      borderColor: 'border-gray-200'
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
      gradient: 'from-teal-600 via-violet-600 to-orange-600',
      borderColor: 'border-teal-500'
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
      gradient: 'from-violet-600 to-pink-600',
      borderColor: 'border-violet-200'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to app</span>
      </button>

      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transform your webinars into campaign-ready assets. Start free, scale as you grow.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative bg-white/80 backdrop-blur-sm rounded-3xl border-2 transition-all duration-300 hover:shadow-2xl ${
              plan.popular 
                ? `${plan.borderColor} shadow-2xl scale-105` 
                : `${plan.borderColor} hover:border-gray-300`
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-teal-600 via-violet-600 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${plan.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              </div>
              
              <div className="mb-4">
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-600">/{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                  plan.popular
                    ? `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-xl transform hover:scale-105`
                    : 'border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-gradient-to-r from-teal-100/50 via-violet-100/50 to-orange-100/50 rounded-3xl p-12 backdrop-blur-sm border border-white/20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              What file formats do you support?
            </h3>
            <p className="text-gray-600">
              We support MP4, MP3, WAV, and most common audio/video formats. You can also paste YouTube links directly.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How accurate is the AI transcription?
            </h3>
            <p className="text-gray-600">
              Our AI achieves 95%+ accuracy on clear audio. For best results, ensure good audio quality in your recordings.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Can I customize the generated assets?
            </h3>
            <p className="text-gray-600">
              Yes! All generated content can be edited, and Pro users get access to custom templates and branding options.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Is there a limit on webinar length?
            </h3>
            <p className="text-gray-600">
              Free plan supports up to 1-hour webinars. Pro and Team plans have no length restrictions.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Transform Your Webinars?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Join hundreds of marketers who've streamlined their content creation
        </p>
        <button
          onClick={onBack}
          className="bg-gradient-to-r from-teal-600 via-violet-600 to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-teal-700 hover:via-violet-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Start Your Free Remix
        </button>
      </div>
    </div>
  );
};

export default PricingSection;