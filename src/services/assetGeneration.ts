import OpenAI from 'openai';
import { WebinarData, GeneratedAsset } from '../App';

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

// Extract key insights from webinar transcript
const extractInsights = async (transcript: string, description: string): Promise<string[]> => {
  const openai = getOpenAIClient();
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are an expert content strategist. Extract the 5-7 most valuable, actionable insights from this webinar transcript. Focus on:
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
        content: `Webinar Topic: ${description}\n\nTranscript: ${transcript.slice(0, 8000)}` // Limit to avoid token limits
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

// Generate LinkedIn posts
const generateLinkedInPosts = async (
  insights: string[], 
  webinarData: WebinarData
): Promise<GeneratedAsset[]> => {
  const openai = getOpenAIClient();
  
  const posts: GeneratedAsset[] = [];
  
  // Generate 2-3 different LinkedIn posts
  for (let i = 0; i < Math.min(3, insights.length); i++) {
    const insight = insights[i];
    
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
          - Include 3-5 relevant hashtags for ${webinarData.persona}
          - Make the value clear and immediately actionable
          
          TONE & STYLE:
          - Professional but conversational and relatable
          - Confident without being arrogant
          - Helpful and generous with insights
          - Match the sophistication level of ${webinarData.funnelStage} audience
          
          AVOID:
          - Generic corporate speak
          - Overly promotional language
          - Long paragraphs or walls of text
          - Excessive hashtags or emojis`
        },
        {
          role: 'user',
          content: `Create a highly engaging LinkedIn post based on this insight from our webinar "${webinarData.description}" for ${webinarData.persona}:

          Key Insight: ${insight}
          
          Funnel Stage: ${webinarData.funnelStage}
          Target Audience: ${webinarData.persona}
          
          Make this post irresistible to read and share. Focus on creating genuine engagement and discussion.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    posts.push({
      id: `linkedin-${i + 1}`,
      type: 'LinkedIn Post',
      title: `Engaging LinkedIn Post ${i + 1}`,
      content: response.choices[0].message.content || ''
    });
  }
  
  return posts;
};

// Generate email copy
const generateEmailCopy = async (
  insights: string[], 
  webinarData: WebinarData
): Promise<GeneratedAsset[]> => {
  const openai = getOpenAIClient();
  
  const emails: GeneratedAsset[] = [];
  
  // Generate nurture email
  const nurtureResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are an email marketing expert specializing in B2B nurture sequences. Create a nurture email that follows marketing best practices:
        
        EMAIL STRUCTURE & LENGTH:
        - Keep the email concise, under 150 words total
        - Use a compelling subject line under 50 characters
        - Structure: Brief intro → 2-3 bullet points for key takeaways → Single clear CTA
        - Focus on ONE primary message and call-to-action
        
        TONE & APPROACH:
        - Friendly, direct, and value-driven tone
        - Thank attendees briefly but focus on delivering value
        - Write in a conversational, helpful style
        - Personalized for ${webinarData.persona} teams
        
        CONTENT REQUIREMENTS:
        - Lead with the most valuable insight first
        - Make takeaways immediately actionable
        - Include a soft, relevant call-to-action appropriate for ${webinarData.funnelStage}
        - Avoid being pushy or overly promotional
        
        FORMAT:
        Subject: [compelling subject line under 50 characters]
        
        [email body - under 150 words]
        
        BEST PRACTICES:
        - Use scannable formatting (bullet points, short paragraphs)
        - Include social proof or urgency when appropriate
        - Make the value proposition crystal clear
        - Ensure the CTA is specific and actionable`
      },
      {
        role: 'user',
        content: `Create a concise, high-converting nurture email for attendees of our webinar "${webinarData.description}" targeting ${webinarData.persona}.
        
        Key insights to include (pick the most valuable 2-3):
        ${insights.slice(0, 3).map((insight, i) => `${i + 1}. ${insight}`).join('\n')}
        
        Funnel Stage: ${webinarData.funnelStage}
        
        Remember: Keep it under 150 words and focus on immediate value delivery.`
      }
    ],
    temperature: 0.6,
    max_tokens: 400
  });

  emails.push({
    id: 'email-nurture',
    type: 'Email Copy',
    title: 'Concise Nurture Email',
    content: nurtureResponse.choices[0].message.content || ''
  });

  // Generate follow-up email for non-attendees if applicable
  if (webinarData.funnelStage !== 'Bottom of Funnel (Decision)') {
    const followUpResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Create a follow-up email for people who registered but didn't attend the webinar. Follow these guidelines:
          
          - Keep under 120 words
          - Empathetic but brief acknowledgment they missed it
          - Lead with the most valuable takeaway immediately
          - Include ONE clear next step (recording, resource, or future event)
          - Subject line should create urgency or curiosity
          
          Format: Subject: [subject line]\n\n[email body]`
        },
        {
          role: 'user',
          content: `Create a brief follow-up email for non-attendees of "${webinarData.description}" for ${webinarData.persona}.
          
          Top insights they missed:
          ${insights.slice(0, 2).map((insight, i) => `${i + 1}. ${insight}`).join('\n')}`
        }
      ],
      temperature: 0.6,
      max_tokens: 350
    });

    emails.push({
      id: 'email-followup',
      type: 'Email Copy',
      title: 'Non-Attendee Follow-up',
      content: followUpResponse.choices[0].message.content || ''
    });
  }
  
  return emails;
};

// Generate quote cards
const generateQuoteCards = async (
  insights: string[], 
  webinarData: WebinarData
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
        - Encapsulate core messages or key findings from the webinar
        - Self-contained and impactful out of context
        
        QUOTE CHARACTERISTICS:
        - Concise (under 40 words for visual impact)
        - Memorable and thought-provoking
        - Relevant and valuable to ${webinarData.persona}
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
        content: `Extract the most insightful, quotable statements from these webinar insights about "${webinarData.description}" for ${webinarData.persona}:
        
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
      type: 'Quote Card',
      title: `Insightful Quote ${index + 1}`,
      content: quote,
      preview: 'quote-card-preview'
    }));
  } catch (error) {
    console.error('Failed to parse quotes:', error);
    return [];
  }
};

// Generate sales snippets
const generateSalesSnippets = async (
  insights: string[], 
  webinarData: WebinarData
): Promise<GeneratedAsset[]> => {
  const openai = getOpenAIClient();
  
  const snippets: GeneratedAsset[] = [];
  
  // Cold outreach snippet
  const coldResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Create a cold outreach message following sales best practices:
        
        STRUCTURE & LENGTH:
        - Keep under 100 words for higher response rates
        - Use the webinar as credible social proof
        - Lead with ONE compelling insight as immediate value
        - End with a soft, specific ask for a brief conversation
        
        PERSONALIZATION:
        - Reference their likely challenges as ${webinarData.persona}
        - Connect the webinar insight to their potential pain points
        - Appropriate tone for ${webinarData.funnelStage} prospects
        
        BEST PRACTICES:
        - Conversational, not salesy tone
        - Focus on their potential benefit, not your offering
        - Include a specific, low-commitment next step
        - Create curiosity about how the insight applies to them
        
        AVOID:
        - Generic templates or corporate speak
        - Multiple asks or CTAs
        - Overly promotional language
        - Long paragraphs or complex sentences`
      },
      {
        role: 'user',
        content: `Create a high-converting cold outreach snippet referencing our webinar "${webinarData.description}" for ${webinarData.persona}.
        
        Key insight to mention: ${insights[0]}
        
        Funnel stage: ${webinarData.funnelStage}
        
        Make it personal, valuable, and irresistible to respond to.`
      }
    ],
    temperature: 0.6,
    max_tokens: 250
  });

  snippets.push({
    id: 'sales-cold',
    type: 'Sales Snippet',
    title: 'Cold Outreach Message',
    content: coldResponse.choices[0].message.content || ''
  });

  // Follow-up snippet for warm leads
  const warmResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Create a follow-up message for warm leads who attended the webinar:
        
        APPROACH:
        - Brief, genuine thank you for attending
        - Reference specific value they received (show you know they were there)
        - Connect their attendance to potential next steps
        - Suggest logical progression based on ${webinarData.funnelStage}
        
        TONE:
        - Professional but warm and appreciative
        - Consultative, not pushy
        - Focus on their success and outcomes
        - Build on the relationship established during the webinar
        
        Keep under 80 words and include ONE clear, valuable next step.`
      },
      {
        role: 'user',
        content: `Create a warm follow-up snippet for webinar attendees of "${webinarData.description}".
        
        Key value delivered: ${insights[0]}
        Target: ${webinarData.persona}
        Stage: ${webinarData.funnelStage}
        
        Make it feel personal and build on the webinar experience.`
      }
    ],
    temperature: 0.6,
    max_tokens: 200
  });

  snippets.push({
    id: 'sales-warm',
    type: 'Sales Snippet',
    title: 'Warm Lead Follow-up',
    content: warmResponse.choices[0].message.content || ''
  });
  
  return snippets;
};

// Main function to generate all assets
export const generateMarketingAssets = async (
  transcript: string,
  webinarData: WebinarData,
  onProgress?: (step: string, progress: number) => void
): Promise<GeneratedAsset[]> => {
  try {
    onProgress?.('Analyzing webinar content for key insights...', 10);
    
    // Extract key insights from transcript
    const insights = await extractInsights(transcript, webinarData.description);
    
    if (insights.length === 0) {
      throw new Error('Could not extract meaningful insights from the webinar content. Please ensure your audio contains substantial discussion or presentation content.');
    }

    onProgress?.('Generating high-quality marketing assets...', 30);
    
    const allAssets: GeneratedAsset[] = [];
    
    // Generate assets based on selected types
    if (webinarData.selectedAssets.some(asset => asset.toLowerCase().includes('linkedin'))) {
      onProgress?.('Creating engaging LinkedIn posts...', 40);
      const linkedInPosts = await generateLinkedInPosts(insights, webinarData);
      allAssets.push(...linkedInPosts);
    }
    
    if (webinarData.selectedAssets.some(asset => asset.toLowerCase().includes('email'))) {
      onProgress?.('Writing concise, high-converting email copy...', 60);
      const emailCopy = await generateEmailCopy(insights, webinarData);
      allAssets.push(...emailCopy);
    }
    
    if (webinarData.selectedAssets.some(asset => asset.toLowerCase().includes('quote'))) {
      onProgress?.('Extracting most insightful quotes...', 75);
      const quoteCards = await generateQuoteCards(insights, webinarData);
      allAssets.push(...quoteCards);
    }
    
    if (webinarData.selectedAssets.some(asset => asset.toLowerCase().includes('sales'))) {
      onProgress?.('Creating personalized sales snippets...', 90);
      const salesSnippets = await generateSalesSnippets(insights, webinarData);
      allAssets.push(...salesSnippets);
    }
    
    onProgress?.('Finalizing your campaign-ready assets...', 100);
    
    return allAssets;
    
  } catch (error) {
    console.error('Asset generation error:', error);
    throw error;
  }
};