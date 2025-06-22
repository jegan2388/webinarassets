import OpenAI from 'openai';
import { ContentData, GeneratedAsset } from '../App';
import { BrandData } from './brandExtraction';

// Initialize OpenAI client
const getOpenAIClient = (): OpenAI => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please add your API key to continue.');
  }
  
  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Note: In production, this should be done server-side
  });
};

// Extract key insights from content transcript
const extractInsights = async (transcript: string, description: string): Promise<string[]> => {
  const openai = getOpenAIClient();
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are an expert content strategist. Extract the 5-7 most valuable, actionable insights from this content. Focus on:
        - Key takeaways that would be valuable to share
        - Actionable strategies or frameworks mentioned
        - Surprising statistics or data points
        - Memorable quotes or statements that reveal new perspectives or challenge assumptions
        - Practical tips that attendees can implement immediately
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
        content: `Content Topic: ${description}\n\nContent: ${transcript.slice(0, 8000)}` // Limit to avoid token limits
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

// Generate One-Pager Recap
const generateOnePagerRecap = async (
  transcript: string,
  contentData: ContentData,
  brandData?: BrandData | null
): Promise<GeneratedAsset> => {
  const openai = getOpenAIClient();
  
  const brandContext = brandData?.companyName 
    ? `Company: ${brandData.companyName}. ` 
    : '';
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a professional content strategist creating a one-page content recap document. Create a structured document with exactly these sections and word limits:

        STRUCTURE REQUIREMENTS:
        1. Quick Session Overview (50 words max) - Brief summary of what was covered
        2. Key Quote from Content (20 words max) - Most impactful direct quote from the content
        3. 4 Key Takeaways (25 words each) - Most valuable insights readers can implement
        
        FORMAT REQUIREMENTS:
        - Return as structured JSON with sections: "overview", "quote", "takeaways" (array of 4 strings)
        - Each section must stay within word limits
        - Use professional, engaging language appropriate for ${contentData.persona}
        - Focus on actionable insights and practical value
        - Make it scannable and easy to digest
        
        CONTENT FOCUS:
        - Highlight the most valuable and actionable content
        - Use specific examples or data points when available
        - Ensure takeaways are implementable immediately
        - Match the tone and sophistication level for the target audience`
      },
      {
        role: 'user',
        content: `${brandContext}Create a one-page recap for the content "${contentData.description}" targeting ${contentData.persona}.
        
        Use this content to extract the information (focus on the most valuable parts):
        ${transcript.slice(0, 6000)}
        
        Funnel Stage: ${contentData.funnelStage}
        
        Remember: Follow the exact structure and word limits specified.`
      }
    ],
    temperature: 0.4,
    max_tokens: 800
  });

  try {
    const content = JSON.parse(response.choices[0].message.content || '{}');
    return {
      id: 'one-pager-recap',
      type: 'One-Pager Recap',
      title: 'Content Session Recap',
      content: JSON.stringify(content)
    };
  } catch (error) {
    console.error('Failed to parse one-pager content:', error);
    return {
      id: 'one-pager-recap',
      type: 'One-Pager Recap',
      title: 'Content Session Recap',
      content: response.choices[0].message.content || ''
    };
  }
};

// Generate Visual Infographic using DALL-E
const generateVisualInfographic = async (
  insights: string[],
  contentData: ContentData,
  brandData?: BrandData | null
): Promise<GeneratedAsset> => {
  const openai = getOpenAIClient();
  
  try {
    // Create a comprehensive visual prompt for the infographic
    const brandColors = brandData?.primaryColor && brandData?.secondaryColor 
      ? `using brand colors ${brandData.primaryColor} and ${brandData.secondaryColor}` 
      : 'using professional blue (#2563eb) and teal (#0d9488) colors';
    
    const companyName = brandData?.companyName || 'Professional Content';
    
    // Take the top 4 insights for the infographic
    const topInsights = insights.slice(0, 4);
    
    const visualPrompt = `Create a professional business infographic titled "${contentData.description}" for ${contentData.persona}. 
    
    Design requirements:
    - Clean, modern corporate design ${brandColors}
    - Include 4 key sections/boxes for main insights
    - Professional typography with clear hierarchy
    - Icons and visual elements that represent business concepts
    - Minimal text overlay - focus on visual design structure
    - Company branding space for "${companyName}"
    - Layout: vertical infographic format, well-organized sections
    - Style: corporate, professional, high-quality business presentation
    - Include subtle geometric patterns and professional gradients
    - Ensure readability and visual balance
    
    The infographic should look like it belongs in a professional business presentation or marketing material.`;

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: visualPrompt,
      n: 1,
      size: '1024x1792', // Vertical infographic format
      quality: 'hd',
      style: 'natural'
    });

    const imageUrl = response.data[0]?.url;
    
    if (!imageUrl) {
      throw new Error('Failed to generate infographic image');
    }

    // Create content that includes both the image and key insights
    const infographicContent = {
      imageUrl: imageUrl,
      title: `${contentData.description} - Key Insights`,
      insights: topInsights,
      targetAudience: contentData.persona,
      companyName: brandData?.companyName
    };

    return {
      id: 'visual-infographic',
      type: 'Visual Infographic',
      title: 'Professional Content Infographic',
      content: JSON.stringify(infographicContent),
      imageUrl: imageUrl
    };

  } catch (error) {
    console.error('Visual infographic generation failed:', error);
    
    // Return a fallback asset with error information
    return {
      id: 'visual-infographic',
      type: 'Visual Infographic',
      title: 'Professional Content Infographic',
      content: JSON.stringify({
        error: 'Failed to generate visual infographic',
        insights: insights.slice(0,4),
        fallbackMessage: 'Visual generation temporarily unavailable. Key insights are provided below.'
      })
    };
  }
};

// Generate LinkedIn posts
const generateLinkedInPosts = async (
  insights: string[], 
  contentData: ContentData,
  brandData?: BrandData | null
): Promise<GeneratedAsset[]> => {
  const openai = getOpenAIClient();
  
  const posts: GeneratedAsset[] = [];
  
  // Generate 2-3 different LinkedIn posts
  for (let i = 0; i < Math.min(3, insights.length); i++) {
    const insight = insights[i];
    
    const brandContext = brandData?.companyName 
      ? `Company: ${brandData.companyName}. ` 
      : '';
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a B2B marketing expert specializing in viral LinkedIn content. Create highly engaging LinkedIn posts that:
          
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
          content: `${brandContext}Create a highly engaging LinkedIn post based on this insight from our content "${contentData.description}" for ${contentData.persona}:

          Key Insight: ${insight}
          
          Funnel Stage: ${contentData.funnelStage}
          Target Audience: ${contentData.persona}
          
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

// Generate Sales Outreach Emails
const generateSalesOutreachEmails = async (
  insights: string[], 
  contentData: ContentData,
  brandData?: BrandData | null
): Promise<GeneratedAsset[]> => {
  const openai = getOpenAIClient();
  
  const emails: GeneratedAsset[] = [];
  
  const brandContext = brandData?.companyName 
    ? `Company: ${brandData.companyName}. ` 
    : '';
  
  // Cold outreach email
  const coldResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Create a cold sales outreach email following these strict guidelines:

        TONE & APPROACH:
        - Direct, confident, and value-focused
        - Conversational like talking to a peer, not corporate-speak
        - Assume they're busy - get to the point quickly
        - Sound like a real person, not a sales bot
        
        STRUCTURE (80-100 words max):
        - Subject line: Curiosity-driven, specific, under 50 characters
        - Brief personal connection or relevant observation
        - ONE valuable insight from the content as immediate value
        - Clear, specific ask for a brief conversation
        - Professional but warm sign-off
        
        BEST PRACTICES:
        - Use "you" language, focus on their potential benefit
        - Include social proof (content insights)
        - Make the ask low-commitment (15-min call, quick chat)
        - Avoid: "I hope this email finds you well" and other clichés
        - Sound human: use contractions, natural language
        
        FORMAT: Subject: [subject line]\n\n[email body]`
      },
      {
        role: 'user',
        content: `${brandContext}Create a cold sales outreach email referencing our content "${contentData.description}" for ${contentData.persona}.
        
        Key insight to include: ${insights[0]}
        Funnel stage: ${contentData.funnelStage}
        
        Make it feel personal, valuable, and impossible to ignore.`
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

        TONE & APPROACH:
        - Warm but professional, building on existing relationship
        - Appreciative but not overly grateful
        - Consultative, focused on their success
        - Natural conversation starter
        
        STRUCTURE (60-80 words max):
        - Subject line: Reference content engagement, create urgency
        - Brief thanks for engaging
        - Connect their engagement to a specific next step
        - Reference value they received
        - Suggest logical progression based on their funnel stage
        
        BEST PRACTICES:
        - Assume they found value in the content
        - Reference specific content they engaged with
        - Make the next step feel natural and beneficial
        - Keep it short - they already know you
        
        FORMAT: Subject: [subject line]\n\n[email body]`
      },
      {
        role: 'user',
        content: `${brandContext}Create a warm follow-up email for people who engaged with "${contentData.description}".
        
        Key value they received: ${insights[0]}
        Target: ${contentData.persona}
        Stage: ${contentData.funnelStage}
        
        Make it feel like a natural next step in the conversation.`
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

// Generate Marketing Nurture Emails
const generateMarketingNurtureEmails = async (
  insights: string[], 
  contentData: ContentData,
  brandData?: BrandData | null
): Promise<GeneratedAsset[]> => {
  const openai = getOpenAIClient();
  
  const emails: GeneratedAsset[] = [];
  
  const brandContext = brandData?.companyName 
    ? `Company: ${brandData.companyName}. ` 
    : '';
  
  // Educational nurture email
  const educationalResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Create an educational marketing nurture email following these guidelines:

        TONE & APPROACH:
        - Helpful, educational, and relationship-building
        - Generous with insights, not pushy
        - Friendly and approachable, like a helpful colleague
        - Focus on their success, not your offering
        
        STRUCTURE (120-150 words max):
        - Subject line: Value-focused, educational angle
        - Warm greeting acknowledging their interest
        - 2-3 key takeaways from the content with brief explanations
        - Soft call-to-action (resource, next content, etc.)
        - Helpful sign-off
        
        BEST PRACTICES:
        - Lead with education, not promotion
        - Use bullet points for easy scanning
        - Include actionable tips they can implement
        - Soft CTA appropriate for nurture sequence
        - Build trust through valuable content
        - Sound like a helpful expert, not a salesperson
        
        FORMAT: Subject: [subject line]\n\n[email body]`
      },
      {
        role: 'user',
        content: `${brandContext}Create an educational nurture email for leads interested in "${contentData.description}" targeting ${contentData.persona}.
        
        Key insights to share:
        ${insights.slice(0, 3).map((insight, i) => `${i + 1}. ${insight}`).join('\n')}
        
        Funnel Stage: ${contentData.funnelStage}
        
        Focus on building trust and providing value.`
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

        TONE & APPROACH:
        - Supportive and resourceful
        - Positioned as sharing valuable tools/insights
        - Collaborative, like sharing with a colleague
        - No pressure, just helpful resources
        
        STRUCTURE (100-120 words max):
        - Subject line: Resource/tool focused
        - Context about why you're sharing this
        - Brief recap of content value
        - Offer additional resources or tools
        - Gentle invitation to engage further
        
        BEST PRACTICES:
        - Frame as "thought you might find this helpful"
        - Reference their specific challenges/goals
        - Offer multiple ways to engage (low pressure)
        - Include social proof if relevant
        - End with open door for questions
        
        FORMAT: Subject: [subject line]\n\n[email body]`
      },
      {
        role: 'user',
        content: `${brandContext}Create a resource-sharing email for "${contentData.description}" audience.
        
        Key insight to build on: ${insights[1] || insights[0]}
        Target: ${contentData.persona}
        
        Focus on being helpful and building the relationship.`
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

// Generate sales snippets
const generateSalesSnippets = async (
  insights: string[], 
  contentData: ContentData,
  brandData?: BrandData | null
): Promise<GeneratedAsset[]> => {
  const openai = getOpenAIClient();
  
  const snippets: GeneratedAsset[] = [];
  
  const brandContext = brandData?.companyName 
    ? `Company: ${brandData.companyName}. ` 
    : '';
  
  // LinkedIn connection request
  const linkedinResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Create a LinkedIn connection request message:
        
        REQUIREMENTS:
        - Under 200 characters (LinkedIn limit)
        - Reference the content as credible social proof
        - Personalized for ${contentData.persona}
        - Conversational and professional tone
        - Clear value proposition
        
        STRUCTURE:
        - Brief personal connection
        - Content reference
        - Value offer
        - Connection request
        
        Keep it short, valuable, and human.`
      },
      {
        role: 'user',
        content: `${brandContext}Create a LinkedIn connection request for ${contentData.persona} referencing our content "${contentData.description}".
        
        Key insight: ${insights[0]}
        
        Make it personal and valuable within LinkedIn's character limit.`
      }
    ],
    temperature: 0.6,
    max_tokens: 150
  });

  snippets.push({
    id: 'sales-linkedin',
    type: 'Sales Snippets',
    title: 'LinkedIn Connection Request',
    content: linkedinResponse.choices[0].message.content || ''
  });

  // Phone call opener
  const phoneResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Create a phone call opening script:
        
        APPROACH:
        - Confident but respectful
        - Reference content engagement or interest
        - Quick value statement
        - Permission-based conversation starter
        
        STRUCTURE (30-40 words):
        - Greeting and introduction
        - Content reference
        - Value proposition
        - Permission to continue
        
        Sound natural and conversational, not scripted.`
      },
      {
        role: 'user',
        content: `${brandContext}Create a phone call opener for ${contentData.persona} who engaged with "${contentData.description}".
        
        Key value: ${insights[0]}
        
        Make it sound natural and permission-based.`
      }
    ],
    temperature: 0.6,
    max_tokens: 200
  });

  snippets.push({
    id: 'sales-phone',
    type: 'Sales Snippets',
    title: 'Phone Call Opener',
    content: phoneResponse.choices[0].message.content || ''
  });
  
  return snippets;
};

// Main function to generate all assets
export const generateMarketingAssets = async (
  transcript: string,
  contentData: ContentData,
  brandData?: BrandData | null,
  onProgress?: (step: string, progress: number) => void
): Promise<GeneratedAsset[]> => {
  try {
    onProgress?.('Analyzing content for key insights...', 15);
    
    // Extract key insights from transcript
    const insights = await extractInsights(transcript, contentData.description);
    
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
    
    if (contentData.selectedAssets.some(asset => asset.toLowerCase().includes('sales snippets'))) {
      onProgress?.('Creating personalized sales snippets...', 85);
      const salesSnippets = await generateSalesSnippets(insights, contentData, brandData);
      allAssets.push(...salesSnippets);
    }
    
    if (contentData.selectedAssets.some(asset => asset.toLowerCase().includes('one-pager'))) {
      onProgress?.('Generating comprehensive one-pager recap...', 90);
      const onePager = await generateOnePagerRecap(transcript, contentData, brandData);
      allAssets.push(onePager);
    }
    
    if (contentData.selectedAssets.some(asset => asset.toLowerCase().includes('visual infographic'))) {
      onProgress?.('Creating professional visual infographic...', 95);
      const visualInfographic = await generateVisualInfographic(insights, contentData, brandData);
      allAssets.push(visualInfographic);
    }
    
    onProgress?.('Finalizing your campaign-ready assets...', 100);
    
    return allAssets;
    
  } catch (error) {
    console.error('Asset generation error:', error);
    throw error;
  }
};