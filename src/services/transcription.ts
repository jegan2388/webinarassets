import OpenAI from 'openai';

export interface TranscriptionResult {
  text: string;
  duration?: number;
  language?: string;
  segments?: Array<{
    start: number;
    end: number;
    text: string;
  }>;
}

// Initialize OpenAI client only when needed
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

// Common hallucination patterns to filter out
const HALLUCINATION_PATTERNS = [
  /you're going to die/gi,
  /i'm going to kill you/gi,
  /i'll kill/gi,
  /destroy you/gi,
  /thank you for watching/gi,
  /please subscribe/gi,
  /like and subscribe/gi,
  /don't forget to/gi,
  /see you next time/gi,
  /bye bye/gi,
  /goodbye/gi,
  /(\w+)\s+\1\s+\1\s+\1/gi, // Repetitive words (4+ times)
];

const cleanTranscription = (text: string): string => {
  let cleaned = text;
  
  // Remove common hallucination patterns
  HALLUCINATION_PATTERNS.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // Remove excessive repetition of phrases
  cleaned = cleaned.replace(/(.{10,}?)\1{3,}/gi, '$1');
  
  // Remove lines that are mostly repetitive
  const lines = cleaned.split('\n');
  const filteredLines = lines.filter(line => {
    const words = line.trim().split(/\s+/);
    if (words.length < 3) return true;
    
    // Check if more than 60% of words are the same
    const wordCounts = words.reduce((acc, word) => {
      acc[word.toLowerCase()] = (acc[word.toLowerCase()] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const maxCount = Math.max(...Object.values(wordCounts));
    const repetitionRatio = maxCount / words.length;
    
    return repetitionRatio < 0.6;
  });
  
  // Clean up extra whitespace
  cleaned = filteredLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  
  return cleaned;
};

export const transcribeAudio = async (file: File): Promise<TranscriptionResult> => {
  try {
    console.log('Starting transcription for file:', file.name);
    
    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'video/mp4', 'video/webm'];
    if (!validTypes.some(type => file.type.includes(type.split('/')[1]))) {
      throw new Error('Unsupported file type. Please upload MP3, WAV, M4A, MP4, or WebM files.');
    }

    // Check file size (Whisper has a 25MB limit)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      throw new Error('File too large. Please upload files smaller than 25MB.');
    }

    // Initialize OpenAI client only when transcribing
    const openai = getOpenAIClient();

    // Call OpenAI Whisper API with optimized parameters to reduce hallucinations
    const response = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'en', // Specifying language helps reduce hallucinations
      response_format: 'verbose_json', // Get timestamps and metadata
      temperature: 0, // Set to 0 for most deterministic output
      prompt: "This is a professional webinar or business presentation. Please transcribe accurately without adding any extra content." // Prompt to guide the model
    });

    console.log('Transcription completed successfully');

    // Clean the transcription to remove hallucinations
    const cleanedText = cleanTranscription(response.text);
    
    // Also clean segments if available
    const cleanedSegments = response.segments?.map(segment => ({
      start: segment.start,
      end: segment.end,
      text: cleanTranscription(segment.text)
    })).filter(segment => segment.text.trim().length > 0);

    // If the cleaned text is too short compared to original, warn the user
    if (cleanedText.length < response.text.length * 0.3) {
      console.warn('Significant content was filtered out due to potential hallucinations');
    }

    return {
      text: cleanedText,
      duration: response.duration,
      language: response.language,
      segments: cleanedSegments
    };

  } catch (error) {
    console.error('Transcription error:', error);
    
    if (error instanceof Error) {
      // Handle specific OpenAI errors
      if (error.message.includes('API key')) {
        throw new Error('OpenAI API key not configured. Please add your API key to continue.');
      }
      if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please check your OpenAI billing settings.');
      }
      if (error.message.includes('rate limit')) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      }
      throw error;
    }
    
    throw new Error('Failed to transcribe audio. Please try again.');
  }
};

export const formatTranscript = (result: TranscriptionResult): string => {
  if (!result.segments || result.segments.length === 0) {
    return result.text;
  }

  // Format with timestamps for better readability
  return result.segments
    .map(segment => {
      const startTime = formatTime(segment.start);
      const endTime = formatTime(segment.end);
      return `[${startTime} - ${endTime}]\n${segment.text.trim()}\n`;
    })
    .join('\n');
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};