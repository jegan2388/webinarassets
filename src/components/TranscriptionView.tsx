import React, { useState } from 'react';
import { Upload, FileAudio, Clock, Download, Copy, Check, AlertCircle, Loader2 } from 'lucide-react';
import { transcribeAudio, formatTranscript, TranscriptionResult } from '../services/transcription';

const TranscriptionView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileUpload(droppedFile);
  };

  const handleTranscribe = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const transcriptionResult = await transcribeAudio(file);
      setResult(transcriptionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;

    const formattedText = formatTranscript(result);
    const blob = new Blob([formattedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.split('.')[0]}-transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FileAudio className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Webinar Transcriber
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your webinar recording and get an accurate, timestamped transcript in minutes
          </p>
        </div>

        {/* Upload Section */}
        {!result && (
          <div className="card p-8 mb-8">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                isDragging
                  ? 'border-blue-400 bg-blue-50'
                  : file
                  ? 'border-success-400 bg-success-50'
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
            >
              {file ? (
                <div className="text-success-700">
                  <Check className="w-12 h-12 mx-auto mb-3" />
                  <p className="font-semibold text-lg">{file.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB • Ready to transcribe
                  </p>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-700 mb-2">
                    Drop your audio or video file here
                  </p>
                  <p className="text-gray-500 mb-6">
                    Supports MP3, WAV, M4A, MP4, WebM (max 25MB)
                  </p>
                  <input
                    type="file"
                    accept="audio/*,video/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="btn-primary cursor-pointer inline-flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose File</span>
                  </label>
                </div>
              )}
            </div>

            {file && !isProcessing && (
              <div className="text-center mt-6">
                <button
                  onClick={handleTranscribe}
                  className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
                >
                  <FileAudio className="w-5 h-5" />
                  <span>Start Transcription</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="card p-8 text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Transcribing Your Audio...
            </h3>
            <p className="text-gray-600 mb-4">
              This usually takes 1-2 minutes depending on file length
            </p>
            <div className="max-w-md mx-auto bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card p-6 border-red-200 bg-red-50 mb-8">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900">Transcription Failed</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="mt-4 btn-secondary text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card p-4 text-center">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">
                  {result.duration ? `${Math.round(result.duration / 60)} min` : 'N/A'}
                </p>
              </div>
              <div className="card p-4 text-center">
                <FileAudio className="w-6 h-6 text-mint-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Words</p>
                <p className="font-semibold">{result.text.split(' ').length}</p>
              </div>
              <div className="card p-4 text-center">
                <Check className="w-6 h-6 text-success-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Language</p>
                <p className="font-semibold">{result.language || 'English'}</p>
              </div>
            </div>

            {/* Transcript */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Transcript</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      copied
                        ? 'bg-gradient-to-r from-success-500 to-mint-500 text-white'
                        : 'btn-secondary'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-medium">
                  {result.text}
                </pre>
              </div>
            </div>

            {/* Start Over */}
            <div className="text-center">
              <button
                onClick={() => {
                  setFile(null);
                  setResult(null);
                  setError(null);
                }}
                className="btn-secondary"
              >
                Transcribe Another File
              </button>
            </div>
          </div>
        )}

        {/* API Key Notice */}
        {!import.meta.env.VITE_OPENAI_API_KEY && (
          <div className="card p-6 border-yellow-200 bg-yellow-50 mt-8">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900">API Key Required</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  Add your OpenAI API key to the environment variables to enable transcription.
                  Create a <code>.env</code> file with: <code>VITE_OPENAI_API_KEY=your_key_here</code>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptionView;