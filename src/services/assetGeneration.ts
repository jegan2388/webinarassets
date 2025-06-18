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
        - Memorable quotes or statements
        - Practical tips that attendees can implement
        
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
          content: `You are a B2B marketing expert. Create engaging LinkedIn posts that:
          - Start with a hook that grabs attention
          - Share valuable insights without being salesy
          - Use appropriate emojis and formatting
          - Include relevant hashtags for ${webinarData.persona}
          - Encourage engagement with questions or calls-to-action
          - Match the tone for ${webinarData.funnelStage} audience
          
          Keep posts between 150-300 words. Make them professional but conversational.`
        },
        {
          role: 'user',
          content: `Create a LinkedIn post based on this insight from our webinar "${webinarData.description}" for ${webinarData.persona}:

          Key Insight: ${insight}
          
          Funnel Stage: ${webinarData.funnelStage}
          Target Audience: ${webinarData.persona}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    posts.push({
      id: `linkedin-${i + 1}`,
      type: 'LinkedIn Post',
      title: `LinkedIn Post ${i + 1}`,
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
        content: `You are an email marketing expert. Create a nurture email that:
        - Has a compelling subject line
        - Thanks attendees for joining the webinar
        - Shares 2-3 key takeaways with value
        - Includes a soft call-to-action appropriate for ${webinarData.funnelStage}
        - Maintains a helpful, non-pushy tone
        - Is personalized for ${webinarData.persona}
        
        Format: Subject: [subject line]\n\n[email body]`
      },
      {
        role: 'user',
        content: `Create a nurture email for attendees of our webinar "${webinarData.description}" targeting ${webinarData.persona}.
        
        Key insights to include:
        ${insights.slice(0, 3).map((insight, i) => `${i + 1}. ${insight}`).join('\n')}
        
        Funnel Stage: ${webinarData.funnelStage}`
      }
    ],
    temperature: 0.6,
    max_tokens: 800
  });

  emails.push({
    id: 'email-nurture',
    type: 'Email Copy',
    title: 'Nurture Email',
    content: nurtureResponse.choices[0].message.content || ''
  });

  // Generate follow-up email for non-attendees if applicable
  if (webinarData.funnelStage !== 'Bottom of Funnel (Decision)') {
    const followUpResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Create a follow-up email for people who registered but didn't attend the webinar. Include:
          - Empathetic subject line acknowledging they missed it
          - Brief summary of key takeaways
          - Link to recording or resources
          - Soft invitation to future events
          
          Format: Subject: [subject line]\n\n[email body]`
        },
        {
          role: 'user',
          content: `Create a follow-up email for non-attendees of "${webinarData.description}" for ${webinarData.persona}.
          
          Top insights they missed:
          ${insights.slice(0, 2).map((insight, i) => `${i + 1}. ${insight}`).join('\n')}`
        }
      ],
      temperature: 0.6,
      max_tokens: 600
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
        content: `Extract 2-3 powerful, quotable statements from these insights that would work well as visual quote cards. 
        
        Good quotes are:
        - Concise (under 50 words)
        - Memorable and impactful
        - Actionable or thought-provoking
        - Relevant to ${webinarData.persona}
        
        Return as JSON array of quote strings only.`
      },
      {
        role: 'user',
        content: `Extract quotable statements from these webinar insights about "${webinarData.description}":
        
        ${insights.join('\n\n')}`
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
      title: `Quote Card ${index + 1}`,
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
        content: `Create a cold outreach message that:
        - References the webinar as social proof
        - Shares one compelling insight as value
        - Makes a soft ask for a conversation
        - Is personalized for ${webinarData.persona}
        - Appropriate for ${webinarData.funnelStage} prospects
        
        Keep it under 150 words and conversational.`
      },
      {
        role: 'user',
        content: `Create a cold outreach snippet referencing our webinar "${webinarData.description}" for ${webinarData.persona}.
        
        Key insight to mention: ${insights[0]}
        
        Funnel stage: ${webinarData.funnelStage}`
      }
    ],
    temperature: 0.6,
    max_tokens: 300
  });

  snippets.push({
    id: 'sales-cold',
    type: 'Sales Snippet',
    title: 'Cold Outreach',
    content: coldResponse.choices[0].message.content || ''
  });

  // Follow-up snippet for warm leads
  const warmResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Create a follow-up message for warm leads who attended the webinar:
        - Thank them for attending
        - Reference specific value they received
        - Suggest next steps based on ${webinarData.funnelStage}
        - Professional but warm tone`
      },
      {
        role: 'user',
        content: `Create a warm follow-up snippet for webinar attendees of "${webinarData.description}".
        
        Key value delivered: ${insights[0]}
        Target: ${webinarData.persona}
        Stage: ${webinarData.funnelStage}`
      }
    ],
    temperature: 0.6,
    max_tokens: 300
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
    onProgress?.('Analyzing webinar content...', 10);
    
    // Extract key insights from transcript
    const insights = await extractInsights(transcript, webinarData.description);
    
    if (insights.length === 0) {
      throw new Error('Could not extract meaningful insights from the webinar content.');
    }

    onProgress?.('Generating marketing assets...', 30);
    
    const allAssets: GeneratedAsset[] = [];
    
    // Generate assets based on selected types
    if (webinarData.selectedAssets.some(asset => asset.toLowerCase().includes('linkedin'))) {
      onProgress?.('Creating LinkedIn posts...', 40);
      const linkedInPosts = await generateLinkedInPosts(insights, webinarData);
      allAssets.push(...linkedInPosts);
    }
    
    if (webinarData.selectedAssets.some(asset => asset.toLowerCase().includes('email'))) {
      onProgress?.('Writing email copy...', 60);
      const emailCopy = await generateEmailCopy(insights, webinarData);
      allAssets.push(...emailCopy);
    }
    
    if (webinarData.selectedAssets.some(asset => asset.toLowerCase().includes('quote'))) {
      onProgress?.('Designing quote cards...', 75);
      const quoteCards = await generateQuoteCards(insights, webinarData);
      allAssets.push(...quoteCards);
    }
    
    if (webinarData.selectedAssets.some(asset => asset.toLowerCase().includes('sales'))) {
      onProgress?.('Creating sales snippets...', 90);
      const salesSnippets = await generateSalesSnippets(insights, webinarData);
      allAssets.push(...salesSnippets);
    }
    
    onProgress?.('Finalizing assets...', 100);
    
    return allAssets;
    
  } catch (error) {
    console.error('Asset generation error:', error);
    throw error;
  }
};