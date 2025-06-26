import OpenAI from 'openai';
import { ContentData, GeneratedAsset } from '../App';
import { BrandData } from './brandExtraction';

// Initialize OpenAI client
const getOpenAIClient = (): OpenAI => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  console.log('Checking OpenAI API key:', apiKey ? 'Found' : 'Not found');
  console.log('Environment variables:', import.meta.env);
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please add your API key to continue.');
  }
  
  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Note: In production, this should be done server-side
  });
};

// Generate mock assets for demo purposes when API key is not available
const generateMockAssets = (contentData: ContentData): GeneratedAsset[] => {
  const mockAssets: GeneratedAsset[] = [];
  const isWebinar = contentData.contentType === 'file';
  const isBlog = contentData.contentType === 'text';

  // Always include free assets
  if (contentData.selectedAssets.some(asset => asset.toLowerCase().includes('linkedin posts'))) {
    if (isWebinar) {
      mockAssets.push(
        {
          id: 'linkedin-1',
          type: 'LinkedIn Posts',
          title: 'Engaging LinkedIn Post 1',
          content: `🚀 Just wrapped up an incredible session on "${contentData.description}"

The biggest takeaway? Most ${contentData.persona?.toLowerCase() || 'teams'} are missing this one crucial step that could 3x their results.

Here's what we covered:
→ Focus on quality over quantity in your approach
→ Leverage data-driven insights for better decisions  
→ Build authentic relationships with your audience

What's your experience with this? Drop a comment below! 👇

#Marketing #B2B #Strategy #ContentMarketing #Leadership`
        },
        {
          id: 'linkedin-2',
          type: 'LinkedIn Posts',
          title: 'Engaging LinkedIn Post 2',
          content: `💡 Here's a counterintuitive truth about ${contentData.description.toLowerCase()}:

Everyone thinks success comes from doing MORE.

But the real secret? Doing LESS, but doing it exceptionally well.

In our latest session, we found that companies focusing on 3 key areas instead of 10 saw:
• 40% better results
• 60% less stress
• 2x faster implementation

Sometimes the best strategy is subtraction, not addition.

What would you eliminate to get better results? 🤔

#Productivity #Strategy #BusinessGrowth #Focus`
        }
      );
    } else {
      mockAssets.push(
        {
          id: 'linkedin-1',
          type: 'LinkedIn Posts',
          title: 'Thought Leadership Post',
          content: `📝 Just published a deep dive on "${contentData.description}"

After researching this topic extensively, here's what surprised me most:

The conventional wisdom around this is completely backwards.

Most ${contentData.persona?.toLowerCase() || 'professionals'} focus on the wrong metrics entirely.

Here's what actually moves the needle:
→ Quality insights over quantity of content
→ Authentic engagement over vanity metrics
→ Long-term relationships over quick wins

The full breakdown is in my latest article. What's been your experience?

#ThoughtLeadership #ContentStrategy #B2B #Marketing`
        },
        {
          id: 'linkedin-2',
          type: 'LinkedIn Posts',
          title: 'Educational Post',
          content: `🎯 Key insight from my latest article on ${contentData.description.toLowerCase()}:

The biggest mistake I see ${contentData.persona?.toLowerCase() || 'teams'} make is trying to boil the ocean.

Instead of tackling everything at once, focus on these 3 fundamentals:

1. Master the basics before adding complexity
2. Measure what actually matters to your goals
3. Build systems that scale with your growth

Simple? Yes. Easy? Not always.

But this approach consistently delivers better results than trying to do everything at once.

What's one thing you'd focus on first? 💭

#Strategy #Focus #BusinessGrowth #Productivity`
        }
      );
    }
  }

  if (contentData.selectedAssets.some(asset => asset.toLowerCase().includes('sales outreach emails'))) {
    if (isWebinar) {
      mockAssets.push(
        {
          id: 'sales-cold-outreach',
          type: 'Sales Outreach Emails',
          title: 'Cold Prospect Outreach',
          content: `Subject: Quick question about your ${contentData.persona?.toLowerCase() || 'team'} strategy

Hi [Name],

I noticed you're focused on scaling [Company] and thought you'd find this interesting.

We just hosted a session showing how companies like yours are increasing results by 40% using a simple approach most teams overlook.

The key insight? Most ${contentData.persona?.toLowerCase() || 'teams'} are optimizing the wrong metrics.

Worth a 15-minute conversation to share what we learned?

Best,
[Your name]

P.S. Happy to send over the session recap first if that's more helpful.`
        },
        {
          id: 'sales-warm-followup',
          type: 'Sales Outreach Emails',
          title: 'Warm Follow-up Email',
          content: `Subject: Following up on ${contentData.description}

Hi [Name],

Thanks for your interest in our recent session on "${contentData.description}".

Since you engaged with the material, I thought you'd appreciate this quick insight:

The #1 mistake we see ${contentData.persona?.toLowerCase() || 'teams'} make is focusing on tactics before strategy. The companies that get this right see 2-3x better results.

I'd love to hear your thoughts on this. Are you seeing similar patterns in your work?

Best,
[Your name]`
        }
      );
    } else {
      mockAssets.push(
        {
          id: 'sales-cold-outreach',
          type: 'Sales Outreach Emails',
          title: 'Cold Prospect Outreach',
          content: `Subject: Thought you'd find this insight valuable

Hi [Name],

I noticed you're working on [relevant challenge] at [Company] and thought you'd find this interesting.

I just published research on "${contentData.description}" that reveals a counterintuitive approach most ${contentData.persona?.toLowerCase() || 'teams'} miss.

The key finding? The conventional wisdom is actually holding teams back.

Worth a quick call to share the specific insights that apply to your situation?

Best,
[Your name]

P.S. Happy to send the article first if you'd prefer to review it.`
        },
        {
          id: 'sales-warm-followup',
          type: 'Sales Outreach Emails',
          title: 'Content Follow-up',
          content: `Subject: Re: ${contentData.description}

Hi [Name],

Thanks for reading my article on "${contentData.description}".

Since you found it valuable, I thought you might be interested in how [similar company] applied these insights to achieve [specific result].

The approach is surprisingly simple, but the execution requires getting a few key details right.

Would you be open to a brief conversation about how this might apply to your situation at [Company]?

Best,
[Your name]`
        }
      );
    }
  }

  // Add other assets if selected
  if (contentData.selectedAssets.some(asset => asset.toLowerCase().includes('marketing nurture emails'))) {
    const emailType = isWebinar ? 'session' : 'article';
    mockAssets.push(
      {
        id: 'marketing-educational',
        type: 'Marketing Nurture Emails',
        title: 'Educational Value Email',
        content: `Subject: 3 insights from our ${emailType} on "${contentData.description}"

Hi [Name],

Thanks for your interest in our recent ${emailType} on "${contentData.description}".

Here are the 3 key takeaways that are already helping ${contentData.persona?.toLowerCase() || 'teams'} like yours:

• **Focus on fundamentals first** - Before adding complexity, master the basics that drive 80% of results
• **Measure what matters** - Track leading indicators, not just lagging metrics  
• **Build systems, not just processes** - Create repeatable frameworks that scale with your growth

I've also attached a one-page summary you can share with your team.

Questions? Just reply to this email.

Best,
[Your name]`
      },
      {
        id: 'marketing-resource',
        type: 'Marketing Nurture Emails',
        title: 'Resource Sharing Email',
        content: `Subject: Thought you'd find this helpful

Hi [Name],

After our conversation about "${contentData.description}", I remembered this resource that might be valuable for your ${contentData.persona?.toLowerCase() || 'team'}.

The key insight that resonates with most people: Success isn't about having all the answers—it's about asking better questions.

I've put together a simple framework that helps teams like yours identify the right priorities. Would you like me to send it over?

No strings attached—just thought it might be useful given what you're working on.

Best,
[Your name]`
      }
    );
  }

  if (contentData.selectedAssets.some(asset => asset.toLowerCase().includes('quote'))) {
    mockAssets.push(
      {
        id: 'quote-1',
        type: 'Quote Cards',
        title: 'Insightful Quote 1',
        content: 'The biggest mistake teams make is optimizing for the wrong metrics. Focus on quality over quantity, and watch your results soar.'
      },
      {
        id: 'quote-2',
        type: 'Quote Cards',
        title: 'Insightful Quote 2',
        content: 'Success isn\'t about having all the answers—it\'s about asking better questions and taking consistent action.'
      }
    );
  }

  if (contentData.selectedAssets.some(asset => asset.toLowerCase().includes('video repurposing'))) {
    const contentType = isWebinar ? 'webinar' : 'article content';
    mockAssets.push(
      {
        id: 'video-repurposing-1',
        type: 'Video Repurposing Ideas',
        title: 'Short Video Clips Strategy',
        content: `🎬 **Video Repurposing Strategy for "${contentData.description}"**

**5 Short Video Ideas (30-60 seconds each):**

**1. Hook Video (30 seconds)**
"The biggest mistake ${contentData.persona?.toLowerCase() || 'teams'} make with [topic]..."
→ Start with the most surprising insight
→ End with "Want to know what actually works?"

**2. Quick Tip Video (45 seconds)**
"Here's a 2-minute strategy that changed everything..."
→ Share one actionable takeaway
→ Show before/after or step-by-step

**3. Myth-Busting Video (60 seconds)**
"Everyone thinks [common belief], but here's the truth..."
→ Challenge conventional wisdom
→ Provide the real solution

**4. Behind-the-Scenes (30 seconds)**
"What we learned from analyzing 100+ ${contentData.persona?.toLowerCase() || 'companies'}..."
→ Share research insights
→ Make it feel exclusive

**5. Question & Answer (45 seconds)**
"Someone asked: 'What's the #1 thing to focus on?'"
→ Answer the most common question
→ Keep it conversational

**📱 Platform-Specific Tips:**
• **LinkedIn:** Professional tone, industry insights
• **Instagram/TikTok:** More casual, visual storytelling
• **Twitter:** Quick tips, thread-worthy content
• **YouTube Shorts:** Educational, how-to format

**🎯 Call-to-Action Ideas:**
• "Comment 'GUIDE' for the full framework"
• "Follow for more [industry] insights"
• "Save this for later reference"
• "Share with your team"`
      },
      {
        id: 'video-repurposing-2',
        type: 'Video Repurposing Ideas',
        title: 'Content Timestamps & Clips',
        content: `⏰ **Best Moments to Clip from Your ${contentType}:**

**High-Impact Timestamps:**

**🔥 Golden Nuggets (15-30 seconds):**
• Most surprising statistic or data point
• "Aha moment" revelations
• Contrarian takes that challenge industry norms
• Simple frameworks or formulas

**💡 Teaching Moments (30-45 seconds):**
• Step-by-step explanations
• Before/after comparisons
• Common mistakes and solutions
• Quick wins or immediate actions

**🎯 Engagement Hooks (20-30 seconds):**
• Questions that make people think
• "What if I told you..." statements
• Industry predictions or trends
• Personal stories or case studies

**📝 Clip Creation Checklist:**

✅ **Start Strong:** First 3 seconds grab attention
✅ **Clear Audio:** Ensure voice is crisp and clear
✅ **Visual Interest:** Add text overlays or graphics
✅ **Single Focus:** One key point per clip
✅ **Strong Ending:** Clear next step or CTA

**🎨 Visual Enhancement Ideas:**
• Add captions for accessibility
• Use brand colors for text overlays
• Include key statistics as graphics
• Create thumbnail with compelling text
• Add progress bars for longer clips

**📊 Performance Tracking:**
• Monitor which clips get most engagement
• Test different lengths (15s vs 30s vs 60s)
• A/B test different hooks and CTAs
• Track comments for content ideas

**🔄 Repurposing Strategy:**
• Create 5-7 clips from single ${contentType}
• Space releases over 2-3 weeks
• Cross-post on multiple platforms
• Use clips to drive traffic to full content`
      }
    );
  }

  return mockAssets;
};

// Extract key insights from content transcript
const extractInsights = async (transcript: string, description: string, contentType: 'file' | 'text'): Promise<string[]> => {
  const openai = getOpenAIClient();
  
  const contentTypeContext = contentType === 'text' ? 'blog post or article' : 'webinar or presentation';
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are an expert content strategist analyzing a ${contentTypeContext}. Extract the 5-7 most valuable, actionable insights from this content. Focus on:
        
        For ${contentTypeContext}:
        - Key takeaways that would be valuable to share
        - Actionable strategies or frameworks mentioned
        - Surprising statistics or data points
        - Memorable quotes or statements that reveal new perspectives or challenge assumptions
        - Practical tips that readers/attendees can implement immediately
        - Profound realizations or "aha!" moments
        - Statements that encapsulate core messages or key findings
        
        Prioritize insights that are:
        - Highly actionable and implementable
        - Thought-provoking or perspective-changing
        - Self-contained and make sense out of context
        - Backed by data or real examples when possible
        
        Return only the insights as a JSON array of strings, no additional text.`
      },
      {
        role: 'user',
        content: `Content Topic: ${description}\nContent Type: ${contentTypeContext}\n\nContent: ${transcript.slice(0, 8000)}` // Limit to avoid token limits
      }
    ],
    temperature: 0.3,
    max_tokens: 1000
  });

  try {
    const insights = JSON.parse(response.choices[0].message.content || '[]');
    return Array.isArray(insights) ? insights : [];
  } catch (error) {
    console.error('Failed to parse insights:', error);
    return [];
  }
};

// Generate LinkedIn posts with content-type awareness
const generateLinkedInPosts = async (
  insights: string[], 
  contentData: ContentData,
  brandData?: BrandData | null
): Promise<GeneratedAsset[]> => {
  const openai = getOpenAIClient();
  
  const posts: GeneratedAsset[] = [];
  const isWebinar = contentData.contentType === 'file';
  const isBlog = contentData.contentType === 'text';
  
  // Generate 2-3 different LinkedIn posts
  for (let i = 0; i < Math.min(3, insights.length); i++) {
    const insight = insights[i];
    
    const brandContext = brandData?.companyName 
      ? `Company: ${brandData.companyName}. ` 
      : '';
    
    const contentTypeContext = isWebinar 
      ? 'webinar/presentation session' 
      : 'article/blog post';
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a B2B marketing expert specializing in viral LinkedIn content. Create highly engaging LinkedIn posts that:
          
          CONTENT TYPE AWARENESS:
          ${isWebinar ? `
          - Reference the session/webinar naturally ("Just wrapped up an incredible session on...")
          - Use language that suggests live interaction and real-time insights
          - Mention "we covered" or "the session revealed" to indicate live content
          - Include phrases like "during the session" or "one attendee asked"
          ` : `
          - Reference the article/research naturally ("Just published a deep dive on...")
          - Use language that suggests thoughtful analysis and research
          - Mention "after researching" or "the article explores" to indicate written content
          - Include phrases like "in the full article" or "the research shows"
          `}
          
          HOOK REQUIREMENTS:
          - Start with a powerful, attention-grabbing hook (question, bold statement, surprising statistic, or contrarian take)
          - Use pattern interrupts like "Here's what nobody tells you about..." or "I used to believe... until..."
          - Create curiosity gaps that make people want to read more
          
          ENGAGEMENT TACTICS:
          - Ask direct questions to encourage comments and discussion
          - Use conversational, authentic tone - write like you're talking to a colleague
          - Include relevant emojis naturally (2-4 max) to break up text and add visual appeal
          - Use short paragraphs and bullet points for easy scanning
          - End with a clear call-to-action that invites engagement
          
          CONTENT STRUCTURE:
          - Keep posts between 150-250 words for optimal engagement
          - Lead with value, not promotion
          - Share personal insights or behind-the-scenes perspectives
          - Include 3-5 relevant hashtags for ${contentData.persona}
          - Make the value clear and immediately actionable
          
          TONE & STYLE:
          - Professional but conversational and relatable
          - Confident without being arrogant
          - Helpful and generous with insights
          - Match the sophistication level of ${contentData.funnelStage} audience
          
          AVOID:
          - Generic corporate speak
          - Overly promotional language
          - Long paragraphs or walls of text
          - Excessive hashtags or emojis`
        },
        {
          role: 'user',
          content: `${brandContext}Create a highly engaging LinkedIn post based on this insight from our ${contentTypeContext} "${contentData.description}" for ${contentData.persona}:

          Key Insight: ${insight}
          
          Funnel Stage: ${contentData.funnelStage}
          Target Audience: ${contentData.persona}
          Content Type: ${contentTypeContext}
          
          Make this post irresistible to read and share. Focus on creating genuine engagement and discussion.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const postContent = response.choices[0].message.content || '';

    posts.push({
      id: `linkedin-${i + 1}`,
      type: 'LinkedIn Posts',
      title: `Engaging LinkedIn Post ${i + 1}`,
      content: postContent
    });
  }
  
  return posts;
};

// Generate Sales Outreach Emails with improved best practices
const generateSalesOutreachEmails = async (
  insights: string[], 
  contentData: ContentData,
  brandData?: BrandData | null
): Promise<GeneratedAsset[]> => {
  const openai = getOpenAIClient();
  
  const emails: GeneratedAsset[] = [];
  const isWebinar = contentData.contentType === 'file';
  const isBlog = contentData.contentType === 'text';
  
  const brandContext = brandData?.companyName 
    ? `Company: ${brandData.companyName}. ` 
    : '';
  
  const contentTypeContext = isWebinar 
    ? 'session/webinar' 
    : 'article/research';
  
  // Cold outreach email
  const coldResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Create a cold sales outreach email following these strict best practices:

        SALES EMAIL BEST PRACTICES:
        - Keep it SHORT (60-80 words max) - busy prospects scan, don't read
        - Lead with VALUE, not your agenda
        - Use a compelling, curiosity-driven subject line (under 50 characters)
        - Make it about THEM, not you
        - Include ONE specific insight as immediate value
        - End with a low-commitment ask (15-min call, quick question)
        - Sound human and conversational, not corporate
        
        CONTENT TYPE AWARENESS:
        ${isWebinar ? `
        - Reference "session" or "webinar" naturally
        - Mention insights "we shared" or "came up during the session"
        - Use language suggesting live interaction and real-time learning
        ` : `
        - Reference "research" or "article" naturally  
        - Mention insights "we discovered" or "the research revealed"
        - Use language suggesting thoughtful analysis and investigation
        `}

        STRUCTURE:
        - Subject line: Curiosity-driven, specific, under 50 characters
        - Brief personal connection or relevant observation (1 sentence)
        - ONE valuable insight as immediate value (1-2 sentences)
        - Clear, specific ask for brief conversation (1 sentence)
        - Professional but warm sign-off
        
        TONE:
        - Direct and confident, not pushy
        - Conversational like talking to a peer
        - Assume they're busy - respect their time
        - Sound like a real person, not a sales bot
        
        AVOID:
        - "I hope this email finds you well" and other clichés
        - Long paragraphs or multiple asks
        - Being vague about the value you're offering
        - Sounding desperate or overly eager
        
        FORMAT: Subject: [subject line]\n\n[email body]`
      },
      {
        role: 'user',
        content: `${brandContext}Create a cold sales outreach email referencing our ${contentTypeContext} "${contentData.description}" for ${contentData.persona}.
        
        Key insight to include: ${insights[0]}
        Funnel stage: ${contentData.funnelStage}
        Content type: ${contentTypeContext}
        
        Make it feel personal, valuable, and impossible to ignore. Keep it SHORT and punchy.`
      }
    ],
    temperature: 0.7,
    max_tokens: 300
  });

  emails.push({
    id: 'sales-cold-outreach',
    type: 'Sales Outreach Emails',
    title: 'Cold Prospect Outreach',
    content: coldResponse.choices[0].message.content || ''
  });

  // Warm follow-up email
  const warmResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Create a warm sales follow-up email for someone who engaged with the content:

        WARM EMAIL BEST PRACTICES:
        - Even SHORTER than cold emails (40-60 words max)
        - Build on existing relationship/engagement
        - Reference their specific engagement with the content
        - Provide additional value based on their interest
        - Make the next step feel natural and beneficial
        - Use a subject line that references their engagement
        
        CONTENT TYPE AWARENESS:
        ${isWebinar ? `
        - Reference their "attendance" or "participation" in the session
        - Mention follow-up insights or additional session materials
        - Use language like "since you joined the session" or "following up on the webinar"
        ` : `
        - Reference their "reading" or "engagement" with the article
        - Mention related insights or additional research
        - Use language like "since you read the article" or "following up on the research"
        `}

        STRUCTURE:
        - Subject line: Reference their engagement, create urgency
        - Brief thanks for engaging (1 sentence)
        - Connect their engagement to specific next value (1-2 sentences)
        - Suggest logical next step (1 sentence)
        
        TONE:
        - Warm but professional
        - Appreciative but not overly grateful
        - Consultative, focused on their success
        - Natural conversation progression
        
        FORMAT: Subject: [subject line]\n\n[email body]`
      },
      {
        role: 'user',
        content: `${brandContext}Create a warm follow-up email for people who engaged with our ${contentTypeContext} "${contentData.description}".
        
        Key value they received: ${insights[0]}
        Target: ${contentData.persona}
        Stage: ${contentData.funnelStage}
        Content type: ${contentTypeContext}
        
        Make it feel like a natural next step in the conversation. Keep it VERY short.`
      }
    ],
    temperature: 0.6,
    max_tokens: 250
  });

  emails.push({
    id: 'sales-warm-followup',
    type: 'Sales Outreach Emails',
    title: 'Warm Engagement Follow-up',
    content: warmResponse.choices[0].message.content || ''
  });
  
  return emails;
};

// Generate Marketing Nurture Emails with non-pushy approach
const generateMarketingNurtureEmails = async (
  insights: string[], 
  contentData: ContentData,
  brandData?: BrandData | null
): Promise<GeneratedAsset[]> => {
  const openai = getOpenAIClient();
  
  const emails: GeneratedAsset[] = [];
  const isWebinar = contentData.contentType === 'file';
  const isBlog = contentData.contentType === 'text';
  
  const brandContext = brandData?.companyName 
    ? `Company: ${brandData.companyName}. ` 
    : '';
  
  const contentTypeContext = isWebinar 
    ? 'session/webinar' 
    : 'article/research';
  
  // Educational nurture email
  const educationalResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Create an educational marketing nurture email following these guidelines:

        NURTURE EMAIL BEST PRACTICES:
        - NEVER be pushy or sales-y - focus purely on education and value
        - Be generous with insights, ask for nothing in return
        - Sound like a helpful colleague sharing valuable information
        - Build trust through consistent value delivery
        - Use a warm, educational tone throughout
        - Make it about their success, not your offering
        
        CONTENT TYPE AWARENESS:
        ${isWebinar ? `
        - Reference the "session" or "webinar" they attended/showed interest in
        - Use language like "from our recent session" or "session attendees asked"
        - Mention additional insights that came up during or after the session
        ` : `
        - Reference the "article" or "research" they engaged with
        - Use language like "from our recent article" or "readers have been asking"
        - Mention additional insights from the research or related studies
        `}

        STRUCTURE (120-150 words max):
        - Subject line: Value-focused, educational angle
        - Warm greeting acknowledging their interest
        - 2-3 key takeaways with brief explanations
        - Soft resource offer (no pressure)
        - Helpful sign-off with open door for questions
        
        TONE:
        - Helpful, educational, and relationship-building
        - Generous with insights, not pushy
        - Friendly and approachable, like a helpful colleague
        - Focus on their success, not your offering
        - Sound like a helpful expert, not a salesperson
        
        SOFT CTA OPTIONS:
        - "Questions? Just reply to this email"
        - "I've attached a resource that might help"
        - "Feel free to reach out if you'd like to discuss"
        - NO hard sales language or pressure
        
        FORMAT: Subject: [subject line]\n\n[email body]`
      },
      {
        role: 'user',
        content: `${brandContext}Create an educational nurture email for leads interested in our ${contentTypeContext} "${contentData.description}" targeting ${contentData.persona}.
        
        Key insights to share:
        ${insights.slice(0, 3).map((insight, i) => `${i + 1}. ${insight}`).join('\n')}
        
        Funnel Stage: ${contentData.funnelStage}
        Content Type: ${contentTypeContext}
        
        Focus on building trust and providing value. Be helpful, not pushy.`
      }
    ],
    temperature: 0.6,
    max_tokens: 400
  });

  emails.push({
    id: 'marketing-educational',
    type: 'Marketing Nurture Emails',
    title: 'Educational Value Email',
    content: educationalResponse.choices[0].message.content || ''
  });

  // Resource sharing email
  const resourceResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Create a resource-sharing nurture email:

        RESOURCE SHARING BEST PRACTICES:
        - Frame as "thought you might find this helpful" - no pressure
        - Be genuinely helpful, like sharing with a colleague
        - Reference their specific challenges or interests
        - Offer multiple ways to engage (all low pressure)
        - End with genuine offer to help, no sales agenda
        
        CONTENT TYPE AWARENESS:
        ${isWebinar ? `
        - Reference insights from the session they attended/were interested in
        - Mention additional resources that complement the session content
        - Use language like "after the session" or "session follow-up"
        ` : `
        - Reference insights from the article they read/engaged with
        - Mention additional resources that complement the article
        - Use language like "after reading" or "article follow-up"
        `}

        STRUCTURE (100-120 words max):
        - Subject line: Resource/tool focused, helpful tone
        - Context about why you're sharing this
        - Brief recap of content value
        - Offer additional resources or tools (no pressure)
        - Gentle invitation to engage further
        
        TONE:
        - Supportive and resourceful
        - Positioned as sharing valuable tools/insights
        - Collaborative, like sharing with a colleague
        - No pressure, just helpful resources
        - Genuine desire to help them succeed
        
        FORMAT: Subject: [subject line]\n\n[email body]`
      },
      {
        role: 'user',
        content: `${brandContext}Create a resource-sharing email for people interested in our ${contentTypeContext} "${contentData.description}".
        
        Key insight to build on: ${insights[1] || insights[0]}
        Target: ${contentData.persona}
        Content Type: ${contentTypeContext}
        
        Focus on being helpful and building the relationship. No sales pressure.`
      }
    ],
    temperature: 0.6,
    max_tokens: 350
  });

  emails.push({
    id: 'marketing-resource',
    type: 'Marketing Nurture Emails',
    title: 'Resource Sharing Email',
    content: resourceResponse.choices[0].message.content || ''
  });
  
  return emails;
};

// Generate quote cards with brand-aware styling
const generateQuoteCards = async (
  insights: string[], 
  contentData: ContentData,
  brandData?: BrandData | null
): Promise<GeneratedAsset[]> => {
  const openai = getOpenAIClient();
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Extract 2-3 powerful, quotable statements from these insights that would work perfectly as visual quote cards. 
        
        CRITERIA FOR EXCEPTIONAL QUOTES:
        - Reveal a new perspective or challenge common assumptions
        - Provide profound realizations or "aha!" moments
        - Highly actionable with immediate practical value
        - Encapsulate core messages or key findings from the content
        - Self-contained and impactful out of context
        
        QUOTE CHARACTERISTICS:
        - Concise (under 40 words for visual impact)
        - Memorable and thought-provoking
        - Relevant and valuable to ${contentData.persona}
        - Shareable and discussion-worthy
        - Avoid generic advice - focus on unique insights
        
        PRIORITIZE QUOTES THAT:
        - Challenge conventional wisdom
        - Offer counterintuitive insights
        - Provide specific, actionable frameworks
        - Include compelling statistics or data points
        - Reveal insider knowledge or expert perspectives
        
        Return as JSON array of quote strings only. Focus on the most insightful and perspective-changing statements.`
      },
      {
        role: 'user',
        content: `Extract the most insightful, quotable statements from these content insights about "${contentData.description}" for ${contentData.persona}:
        
        ${insights.join('\n\n')}
        
        Focus on quotes that would make people stop scrolling and think "I never thought of it that way" or "This changes everything."`
      }
    ],
    temperature: 0.4,
    max_tokens: 400
  });

  try {
    const quotes = JSON.parse(response.choices[0].message.content || '[]');
    return quotes.map((quote: string, index: number) => ({
      id: `quote-${index + 1}`,
      type: 'Quote Cards',
      title: `Insightful Quote ${index + 1}`,
      content: quote,
      preview: 'quote-card-preview',
      brandData: brandData // Include brand data for styling
    }));
  } catch (error) {
    console.error('Failed to parse quotes:', error);
    return [];
  }
};

// Generate Video Repurposing Ideas
const generateVideoRepurposingIdeas = async (
  insights: string[], 
  contentData: ContentData,
  brandData?: BrandData | null
): Promise<GeneratedAsset[]> => {
  const openai = getOpenAIClient();
  
  const isWebinar = contentData.contentType === 'file';
  const contentTypeContext = isWebinar ? 'webinar/presentation' : 'article/blog post';
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a video content strategist specializing in short-form video content for social media. Create detailed video repurposing strategies that:

        VIDEO CONTENT BEST PRACTICES:
        - Focus on 15-60 second clips optimized for social media
        - Create hooks that grab attention in the first 3 seconds
        - Make content platform-specific (LinkedIn vs TikTok vs Instagram)
        - Include specific timestamps and moments to clip
        - Provide clear instructions for video creation
        - Focus on high-engagement, shareable content
        
        CONTENT TYPE AWARENESS:
        ${isWebinar ? `
        - Reference specific moments from the webinar/presentation
        - Suggest clipping key teaching moments, Q&A sections, and insights
        - Include behind-the-scenes or "live" moments
        - Focus on interactive elements and audience engagement
        ` : `
        - Transform written insights into visual storytelling
        - Suggest ways to present article concepts visually
        - Create educational content that explains key points
        - Focus on making abstract concepts tangible and visual
        `}

        STRUCTURE:
        - Provide 5-7 specific video ideas with exact durations
        - Include platform-specific optimization tips
        - Suggest visual elements, text overlays, and CTAs
        - Provide hooks, content structure, and endings
        - Include performance tracking suggestions
        
        TONE:
        - Practical and actionable
        - Platform-aware and trend-conscious
        - Focused on engagement and shareability
        - Educational but entertaining`
      },
      {
        role: 'user',
        content: `Create a comprehensive video repurposing strategy for our ${contentTypeContext} "${contentData.description}" targeting ${contentData.persona}.
        
        Key insights to work with:
        ${insights.slice(0, 5).map((insight, i) => `${i + 1}. ${insight}`).join('\n')}
        
        Funnel Stage: ${contentData.funnelStage}
        Content Type: ${contentTypeContext}
        
        Focus on creating viral, engaging short-form video content that drives engagement and shares.`
      }
    ],
    temperature: 0.7,
    max_tokens: 800
  });

  const videoIdeas = response.choices[0].message.content || '';

  return [{
    id: 'video-repurposing-strategy',
    type: 'Video Repurposing Ideas',
    title: 'Short Video Content Strategy',
    content: videoIdeas
  }];
};

// Main function to generate all assets
export const generateMarketingAssets = async (
  transcript: string,
  contentData: ContentData,
  brandData?: BrandData | null,
  onProgress?: (step: string, progress: number) => void
): Promise<GeneratedAsset[]> => {
  try {
    // Check if OpenAI API key is available
    const hasApiKey = !!import.meta.env.VITE_OPENAI_API_KEY;
    
    console.log('API Key check:', hasApiKey ? 'Found' : 'Not found');
    
    if (!hasApiKey) {
      console.log('No OpenAI API key found, generating mock assets for demo');
      onProgress?.('Generating demo assets...', 50);
      
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      onProgress?.('Finalizing your demo assets...', 100);
      
      return generateMockAssets(contentData);
    }

    onProgress?.('Analyzing content for key insights...', 15);
    
    // Extract key insights from transcript
    const insights = await extractInsights(transcript, contentData.description, contentData.contentType);
    
    if (insights.length === 0) {
      throw new Error('Could not extract meaningful insights from the content. Please ensure your content contains substantial discussion or valuable information.');
    }

    onProgress?.('Generating high-quality marketing assets...', 35);
    
    const allAssets: GeneratedAsset[] = [];
    
    // Generate assets based on selected types
    if (contentData.selectedAssets.some(asset => asset.toLowerCase().includes('linkedin posts'))) {
      onProgress?.('Creating engaging LinkedIn posts...', 45);
      const linkedInPosts = await generateLinkedInPosts(insights, contentData, brandData);
      allAssets.push(...linkedInPosts);
    }
    
    if (contentData.selectedAssets.some(asset => asset.toLowerCase().includes('sales outreach emails'))) {
      onProgress?.('Writing direct, value-focused sales emails...', 55);
      const salesEmails = await generateSalesOutreachEmails(insights, contentData, brandData);
      allAssets.push(...salesEmails);
    }
    
    if (contentData.selectedAssets.some(asset => asset.toLowerCase().includes('marketing nurture emails'))) {
      onProgress?.('Creating educational nurture emails...', 65);
      const nurtureEmails = await generateMarketingNurtureEmails(insights, contentData, brandData);
      allAssets.push(...nurtureEmails);
    }
    
    if (contentData.selectedAssets.some(asset => asset.toLowerCase().includes('quote'))) {
      onProgress?.('Extracting most insightful quotes...', 75);
      const quoteCards = await generateQuoteCards(insights, contentData, brandData);
      allAssets.push(...quoteCards);
    }
    
    if (contentData.selectedAssets.some(asset => asset.toLowerCase().includes('video repurposing'))) {
      onProgress?.('Creating video repurposing strategy...', 85);
      const videoIdeas = await generateVideoRepurposingIdeas(insights, contentData, brandData);
      allAssets.push(...videoIdeas);
    }
    
    onProgress?.('Finalizing your campaign-ready assets...', 100);
    
    return allAssets;
    
  } catch (error) {
    console.error('Asset generation error:', error);
    
    // If it's an API key error, fall back to mock assets
    if (error instanceof Error && error.message.includes('API key')) {
      console.log('API key error, falling back to mock assets');
      onProgress?.('Generating demo assets...', 50);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      onProgress?.('Finalizing your demo assets...', 100);
      
      return generateMockAssets(contentData);
    }
    
    throw error;
  }
};