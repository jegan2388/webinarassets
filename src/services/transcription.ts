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

const cleanTranscription = (text: string): string => {
  let cleaned = text;
  
  // Only remove excessive repetition patterns, not specific phrases
  // Remove when the same phrase (10+ chars) repeats 3+ times consecutively
  cleaned = cleaned.replace(/(.{10,?}?)\1{2,}/gi, '$1');
  
  // Remove lines that are mostly repetitive (same word repeated many times)
  const lines = cleaned.split('\n');
  const filteredLines = lines.filter(line => {
    const words = line.trim().split(/\s+/);
    if (words.length < 4) return true; // Keep short lines
    
    // Check if more than 70% of words are the same (indicating repetitive hallucination)
    const wordCounts = words.reduce((acc, word) => {
      acc[word.toLowerCase()] = (acc[word.toLowerCase()] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const maxCount = Math.max(...Object.values(wordCounts));
    const repetitionRatio = maxCount / words.length;
    
    // Only filter out if it's extremely repetitive (likely hallucination)
    return repetitionRatio < 0.7;
  });
  
  // Clean up extra whitespace
  cleaned = filteredLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  
  return cleaned;
};

// Intelligent segment merging to handle dramatic pauses vs meaningful breaks
const mergeSegments = (segments: Array<{ start: number; end: number; text: string }>): Array<{ start: number; end: number; text: string }> => {
  if (!segments || segments.length === 0) return [];
  
  const merged: Array<{ start: number; end: number; text: string }> = [];
  let currentSegment = { ...segments[0] };
  
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    const timeBetween = segment.start - currentSegment.end;
    const currentText = currentSegment.text.trim();
    const nextText = segment.text.trim();
    
    // Skip empty segments
    if (!nextText) continue;
    
    // Conditions for merging segments:
    const shouldMerge = (
      // Very short pause (likely dramatic pause within sentence)
      timeBetween < 1.5 ||
      
      // Current segment is very short (likely incomplete thought)
      currentText.length < 15 ||
      
      // Current segment doesn't end with sentence-ending punctuation and pause is short
      (timeBetween < 3 && !currentText.match(/[.!?]$/)) ||
      
      // Next segment starts with lowercase (continuation of sentence)
      (timeBetween < 4 && nextText.match(/^[a-z]/)) ||
      
      // Current segment ends with comma, "and", "but", etc. (continuation words)
      (timeBetween < 5 && currentText.match(/[,;:]$|and$|but$|or$|so$|then$|now$/i)) ||
      
      // Both segments are very short (likely fragmented speech)
      (currentText.length < 30 && nextText.length < 30 && timeBetween < 4)
    );
    
    if (shouldMerge) {
      // Merge with current segment
      currentSegment.text = currentText + ' ' + nextText;
      currentSegment.end = segment.end;
    } else {
      // Start new segment
      merged.push(currentSegment);
      currentSegment = { ...segment };
    }
  }
  
  // Add the last segment
  merged.push(currentSegment);
  
  // Final cleanup: merge any remaining very short segments
  const finalMerged: Array<{ start: number; end: number; text: string }> = [];
  let current = merged[0];
  
  for (let i = 1; i < merged.length; i++) {
    const next = merged[i];
    const timeBetween = next.start - current.end;
    
    // Merge if current segment is very short and pause isn't too long
    if (current.text.trim().length < 20 && timeBetween < 8) {
      current.text = current.text.trim() + ' ' + next.text.trim();
      current.end = next.end;
    } else {
      finalMerged.push(current);
      current = next;
    }
  }
  finalMerged.push(current);
  
  return finalMerged.filter(seg => seg.text.trim().length > 0);
};

export const transcribeAudio = async (file: File): Promise<TranscriptionResult> => {
  try {
    console.log('Starting transcription for file:', file.name);
    
    // Validate file type - expanded to support more formats
    const validTypes = [
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac', 'audio/ogg', 'audio/flac',
      'video/mp4', 'video/webm', 'video/mov', 'video/avi', 'video/quicktime', 'video/x-msvideo'
    ];
    
    const isValidType = validTypes.some(type => 
      file.type.includes(type.split('/')[1]) || 
      file.name.toLowerCase().includes(type.split('/')[1])
    );
    
    if (!isValidType) {
      throw new Error('Unsupported file type. Please upload MP3, WAV, M4A, MP4, WebM, MOV, or AVI files.');
    }

    // Check file size - increased to 100MB to match the UI
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      throw new Error(`File too large. Please upload files smaller than ${Math.round(maxSize / (1024 * 1024))}MB.`);
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

    // Clean the transcription to remove repetitive hallucinations only
    const cleanedText = cleanTranscription(response.text);
    
    // Clean and merge segments intelligently
    let cleanedSegments: Array<{ start: number; end: number; text: string }> | undefined;
    
    if (response.segments && response.segments.length > 0) {
      // First clean individual segments (only remove repetitive patterns)
      const initialCleanedSegments = response.segments
        .map(segment => ({
          start: segment.start,
          end: segment.end,
          text: cleanTranscription(segment.text)
        }))
        .filter(segment => segment.text.trim().length > 0);
      
      // Then merge segments intelligently
      cleanedSegments = mergeSegments(initialCleanedSegments);
    }

    // If the cleaned text is significantly shorter, it might indicate heavy filtering
    if (cleanedText.length < response.text.length * 0.5) {
      console.warn('Some repetitive content was filtered out - this may indicate background music or audio artifacts');
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