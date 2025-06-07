import React, { useState } from 'react';
import { Upload, ArrowLeft, Link, Check, FileVideo, Youtube, Users, Target, Sparkles } from 'lucide-react';
import { WebinarData } from '../App';

interface UploadFormProps {
  onSubmit: (data: WebinarData) => void;
  onBack: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState<WebinarData>({
    description: '',
    persona: '',
    funnelStage: '',
    selectedAssets: []
  });
  const [uploadType, setUploadType] = useState<'file' | 'youtube'>('file');
  const [isDragging, setIsDragging] = useState(false);

  const personas = [
    'Marketing Teams',
    'Sales Teams', 
    'Finance Teams',
    'Executive Leadership',
    'Product Teams',
    'Customer Success'
  ];

  const funnelStages = [
    'Top of Funnel (Awareness)',
    'Middle of Funnel (Consideration)', 
    'Bottom of Funnel (Decision)'
  ];

  const assetTypes = [
    { name: 'LinkedIn Posts', icon: <MessageSquare className="w-4 h-4" />, color: 'border-blue-200 bg-blue-50' },
    { name: 'Email Copy', icon: <Mail className="w-4 h-4" />, color: 'border-mint-200 bg-mint-50' },
    { name: 'Quote Cards', icon: <Quote className="w-4 h-4" />, color: 'border-indigo-200 bg-indigo-50' },
    { name: 'Sales Snippets', icon: <Target className="w-4 h-4" />, color: 'border-orange-200 bg-orange-50' },
    { name: 'Twitter Threads', icon: <MessageSquare className="w-4 h-4" />, color: 'border-cyan-200 bg-cyan-50' },
    { name: 'Blog Outlines', icon: <FileVideo className="w-4 h-4" />, color: 'border-purple-200 bg-purple-50' }
  ];

  const handleFileUpload = (file: File) => {
    if (file && (file.type.startsWith('video/') || file.type.startsWith('audio/'))) {
      setFormData(prev => ({ ...prev, file }));
    }
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
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleAssetToggle = (asset: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAssets: prev.selectedAssets.includes(asset)
        ? prev.selectedAssets.filter(a => a !== asset)
        : [...prev.selectedAssets, asset]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description && formData.persona && formData.funnelStage && 
        (formData.file || formData.youtubeUrl) && formData.selectedAssets.length > 0) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to home</span>
        </button>

        <div className="card p-8 lg:p-12">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Upload Your Webinar
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tell us about your content and we'll create targeted marketing assets that resonate with your audience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Upload Type Toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                How would you like to upload your webinar?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUploadType('file')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    uploadType === 'file'
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <FileVideo className="w-5 h-5 mb-2" />
                  <div className="font-medium">Upload File</div>
                  <div className="text-sm text-gray-600">MP4, MP3, or other formats</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType('youtube')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    uploadType === 'youtube'
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <Youtube className="w-5 h-5 mb-2" />
                  <div className="font-medium">YouTube Link</div>
                  <div className="text-sm text-gray-600">Paste any YouTube URL</div>
                </button>
              </div>
            </div>

            {/* File Upload or YouTube URL */}
            {uploadType === 'file' ? (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Upload your webinar recording
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    isDragging
                      ? 'border-blue-400 bg-blue-50'
                      : formData.file
                      ? 'border-success-400 bg-success-50'
                      : 'border-gray-300 hover:border-gray-400 bg-white'
                  }`}
                >
                  {formData.file ? (
                    <div className="text-success-700">
                      <Check className="w-12 h-12 mx-auto mb-3" />
                      <p className="font-semibold text-lg">{formData.file.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {(formData.file.size / (1024 * 1024)).toFixed(1)} MB • Ready to process
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        Drop your webinar file here
                      </p>
                      <p className="text-gray-500 mb-6">or click to browse your files</p>
                      <input
                        type="file"
                        accept="video/*,audio/*"
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
              </div>
            ) : (
              <div>
                <label htmlFor="youtube-url" className="block text-sm font-semibold text-gray-900 mb-4">
                  YouTube URL
                </label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    id="youtube-url"
                    value={formData.youtubeUrl || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="input-field pl-12"
                  />
                </div>
              </div>
            )}

            {/* Webinar Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-4">
                What's your webinar about?
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., B2B lead generation strategies, customer retention tactics, product demo for enterprise teams..."
                rows={4}
                className="input-field resize-none"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Be specific - this helps us create more targeted content for your audience
              </p>
            </div>

            {/* Target Persona */}
            <div>
              <label htmlFor="persona" className="block text-sm font-semibold text-gray-900 mb-4">
                <Users className="w-4 h-4 inline mr-2" />
                Who's your target audience?
              </label>
              <select
                id="persona"
                value={formData.persona}
                onChange={(e) => setFormData(prev => ({ ...prev, persona: e.target.value }))}
                className="input-field"
                required
              >
                <option value="">Select your target audience...</option>
                {personas.map(persona => (
                  <option key={persona} value={persona}>{persona}</option>
                ))}
              </select>
            </div>

            {/* Funnel Stage */}
            <div>
              <label htmlFor="funnel-stage" className="block text-sm font-semibold text-gray-900 mb-4">
                <Target className="w-4 h-4 inline mr-2" />
                Where are they in your funnel?
              </label>
              <select
                id="funnel-stage"
                value={formData.funnelStage}
                onChange={(e) => setFormData(prev => ({ ...prev, funnelStage: e.target.value }))}
                className="input-field"
                required
              >
                <option value="">Select funnel stage...</option>
                {funnelStages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            {/* Asset Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Which assets do you want? (select all that apply)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assetTypes.map(asset => (
                  <label
                    key={asset.name}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.selectedAssets.includes(asset.name)
                        ? `border-blue-500 bg-blue-50 ${asset.color}`
                        : `border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50`
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedAssets.includes(asset.name)}
                      onChange={() => handleAssetToggle(asset.name)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-lg border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                      formData.selectedAssets.includes(asset.name)
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {formData.selectedAssets.includes(asset.name) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {asset.icon}
                      <span className="font-medium text-gray-900">{asset.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={!formData.description || !formData.persona || !formData.funnelStage || 
                         (!formData.file && !formData.youtubeUrl) || formData.selectedAssets.length === 0}
                className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate My Marketing Assets
              </button>
              {(!formData.description || !formData.persona || !formData.funnelStage || 
                (!formData.file && !formData.youtubeUrl) || formData.selectedAssets.length === 0) && (
                <p className="text-sm text-gray-500 text-center mt-3">
                  Please fill in all fields to continue
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;