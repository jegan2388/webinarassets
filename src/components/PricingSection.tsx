import React from 'react';
import { ArrowLeft, Check, Zap, Crown, Building, Sparkles, CreditCard } from 'lucide-react';

interface PricingSectionProps {
  onBack: () => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onBack }) => {
  const plans = [
    {
      name: 'Pay Per Webinar',
      icon: <CreditCard className="w-6 h-6" />,
      price: '$4.99',
      period: 'per webinar',
      description: 'Perfect for occasional use and testing the platform',
      features: [
        'All 7 asset types included',
        'Brand-styled quote cards',
        'Professional infographics',
        'LinkedIn posts & email copy',
        'One-pager recap document',
        'Sales snippets & outreach',
        'Instant processing'
      ],
      cta: 'Upload Webinar',
      popular: true,
      color: 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50'
    },
    {
      name: 'Pro Account',
      icon: <Crown className="w-6 h-6" />,
      price: 'Coming Soon',
      period: '',
      description: 'Advanced features for power users and teams',
      features: [
        'Everything in Pay Per Webinar',
        'Bulk processing discounts',
        'Custom asset templates',
        'Team collaboration tools',
        'Priority support',
        'Advanced analytics',
        'API access',
        'White-label options'
      ],
      cta: 'Join Waitlist',
      popular: false,
      color: 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50'
    }
  ];

  const faqs = [
    {
      question: "What's included in the $4.99 payment?",
      answer: "You get all 7 asset types: LinkedIn posts, sales emails, nurture emails, quote cards, sales snippets, one-pager recap, and visual infographics - all generated from your single webinar."
    },
    {
      question: "How does the payment work?",
      answer: "It's a simple one-time payment of $4.99 per webinar. Upload your content, pay securely via Stripe, and get your assets generated immediately."
    },
    {
      question: "Can I customize the generated assets?",
      answer: "Yes! All generated content can be edited and customized. We also extract your brand colors and styling from your website if provided."
    },
    {
      question: "What file formats do you support?",
      answer: "We support MP4, MP3, WAV, M4A, and most common audio/video formats. Files must be under 25MB for processing."
    },
    {
      question: "How long does processing take?",
      answer: "Most webinars are processed within 2-5 minutes, depending on length and complexity. You'll see real-time progress updates."
    },
    {
      question: "Is there a refund policy?",
      answer: "Yes, if we're unable to generate quality assets from your webinar content, we offer a full refund within 24 hours of processing."
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
            Transform your webinars into campaign-ready assets. Pay only for what you use.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
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
                onClick={onBack}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
                disabled={plan.name === 'Pro Account'}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Value Proposition */}
        <div className="card p-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Pay-Per-Webinar?
            </h2>
            <p className="text-lg text-gray-600">
              No subscriptions, no commitments. Pay only when you need assets generated.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">No Monthly Fees</h4>
              <p className="text-sm text-gray-600">Only pay when you actually use the service. Perfect for occasional webinar creators.</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">All Features Included</h4>
              <p className="text-sm text-gray-600">Get access to all 7 asset types, brand styling, and professional templates with every payment.</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-mint-500 to-mint-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Instant Processing</h4>
              <p className="text-sm text-gray-600">Upload, pay, and get your assets within minutes. No waiting, no queues.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="card p-12 bg-white border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
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
            Ready to Transform Your Webinar?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload your webinar and get professional marketing assets in minutes for just $4.99
          </p>
          <button
            onClick={onBack}
            className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
          >
            <CreditCard className="w-5 h-5" />
            <span>Upload Your Webinar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;