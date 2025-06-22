import React from 'react';
import { ArrowLeft, Check, Zap, Crown, Building, Sparkles, CreditCard, Users, FileText, BarChart3 } from 'lucide-react';

interface PricingSectionProps {
  onBack: () => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onBack }) => {
  const plans = [
    {
      name: 'Free',
      icon: <FileText className="w-6 h-6" />,
      price: '$0',
      period: 'per month',
      description: 'Perfect for trying out the platform',
      features: [
        '1 content remix per month',
        '2 basic asset types (LinkedIn posts, sales emails)',
        'Basic transcription',
        'Standard processing speed',
        'Community support'
      ],
      cta: 'Get Started Free',
      popular: false,
      color: 'border-gray-200 bg-white',
      limits: '1 content piece/month'
    },
    {
      name: 'Pro',
      icon: <Crown className="w-6 h-6" />,
      price: '$39',
      period: 'per month',
      description: 'Everything you need for consistent content creation',
      features: [
        '10 content remixes per month',
        'All 7 asset types included',
        'Brand-styled quote cards & visuals',
        'Professional infographics',
        'Nurture email sequences',
        'Sales snippets & one-pagers',
        'Priority processing',
        'Email support'
      ],
      cta: 'Start Pro Trial',
      popular: true,
      color: 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50',
      limits: '10 content pieces/month'
    }
  ];

  const contentTypes = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: 'Audio & Video Files',
      description: 'Webinars, podcasts, meetings, presentations'
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Video Links',
      description: 'YouTube, Vimeo, HubSpot, Loom, Zoom recordings'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Text Content',
      description: 'Blog posts, articles, meeting notes, transcripts'
    }
  ];

  const assetTypes = [
    'LinkedIn Posts',
    'Sales Outreach Emails',
    'Marketing Nurture Emails',
    'Quote Cards & Visuals',
    'Sales Snippets',
    'One-Pager Recaps',
    'Visual Infographics'
  ];

  const faqs = [
    {
      question: "What counts as a 'content remix'?",
      answer: "One content remix = processing one piece of content (audio file, video link, or text document) to generate marketing assets. Each upload or text input counts as one remix."
    },
    {
      question: "What's included in the Pro plan?",
      answer: "Pro includes 10 content remixes per month, all 7 asset types, branded visuals with your company colors, priority processing, and email support."
    },
    {
      question: "Can I upgrade or downgrade anytime?",
      answer: "Yes! You can upgrade to Pro anytime. If you downgrade, you'll keep Pro features until your current billing period ends."
    },
    {
      question: "What file formats do you support?",
      answer: "We support MP4, MP3, WAV, M4A, WebM, MOV, AVI files up to 100MB. For video links, we support YouTube, Vimeo, HubSpot, Loom, Zoom, and many more platforms."
    },
    {
      question: "How long does processing take?",
      answer: "Most content is processed within 2-5 minutes. Pro users get priority processing for faster results during peak times."
    },
    {
      question: "Do unused remixes roll over?",
      answer: "No, unused remixes don't roll over to the next month. Your remix count resets at the beginning of each billing cycle."
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
            <span>Simple Monthly Pricing</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Any Content Into Marketing Assets
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From webinars to blog posts, turn your content into campaign-ready assets with AI
          </p>
        </div>

        {/* Content Types */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Works With Any Content Type
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contentTypes.map((type, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {type.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{type.title}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>
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
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{plan.limits}</p>
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
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Asset Types */}
        <div className="card p-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              7 Professional Asset Types
            </h2>
            <p className="text-lg text-gray-600">
              Every piece of content becomes a complete marketing campaign
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {assetTypes.map((asset, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-100">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium">{asset}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Value Proposition */}
        <div className="card p-12 bg-gradient-to-br from-mint-50 to-teal-50 border-mint-100 mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Monthly Subscriptions?
            </h2>
            <p className="text-lg text-gray-600">
              Predictable pricing for consistent content creation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-mint-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Predictable Costs</h4>
              <p className="text-sm text-gray-600">Know exactly what you'll spend each month. No surprise charges or per-use fees.</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Consistent Quality</h4>
              <p className="text-sm text-gray-600">Regular content creation with professional-grade assets every time.</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Scale Your Content</h4>
              <p className="text-sm text-gray-600">Process multiple pieces of content monthly to fuel your marketing campaigns.</p>
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
            Ready to Transform Your Content?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Start with our free plan and upgrade when you need more content processing power
          </p>
          <button
            onClick={onBack}
            className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;