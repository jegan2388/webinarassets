import React, { useState } from 'react';
import { Upload, ArrowLeft, Link, Check } from 'lucide-react';
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
    { name: 'LinkedIn Posts', color: 'from-teal-500 to-cyan-500' },
    { name: 'Email Copy', color: 'from-emerald-500 to-teal-500' },
    { name: 'Quote Cards', color: 'from-violet-500 to-purple-500' },
    { name: 'Sales Snippets', color: 'from-orange-500 to-red-500' },
    { name: 'Twitter Threads', color: 'from-cyan-500 to-blue-500' },
    { name: 'Blog Outlines', color: 'from-purple-500 to-pink-500' }
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to home</span>
      </button>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Your Webinar
          </h1>
          <p className="text-gray-600">
            Tell us about your content and we'll create targeted marketing assets
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Upload Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Upload Method
            </label>
            <div className="flex bg-gray-100/80 rounded-2xl p-1">
              <button
                type="button"
                onClick={() => setUploadType('file')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                  uploadType === 'file'
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setUploadType('youtube')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                  uploadType === 'youtube'
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Link className="w-4 h-4 inline mr-2" />
                YouTube Link
              </button>
            </div>
          </div>

          {/* File Upload or YouTube URL */}
          {uploadType === 'file' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Webinar Recording (MP4, MP3, or other audio/video formats)
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-teal-400 bg-teal-50/50'
                    : formData.file
                    ? 'border-emerald-400 bg-emerald-50/50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {formData.file ? (
                  <div className="text-emerald-600">
                    <Check className="w-12 h-12 mx-auto mb-3" />
                    <p className="font-medium">{formData.file.name}</p>
                    <p className="text-sm text-gray-600">
                      {(formData.file.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-lg font-medium text-gray-700 mb-1">
                      Drop your webinar file here
                    </p>
                    <p className="text-gray-500 mb-4">or click to browse</p>
                    <input
                      type="file"
                      accept="video/*,audio/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-medium hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-3">
                YouTube URL
              </label>
              <input
                type="url"
                id="youtube-url"
                value={formData.youtubeUrl || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          )}

          {/* Webinar Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-3">
              What's the webinar about?
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g., B2B lead generation strategies, customer retention tactics, product demo..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          {/* Target Persona */}
          <div>
            <label htmlFor="persona" className="block text-sm font-medium text-gray-700 mb-3">
              Target Persona
            </label>
            <select
              id="persona"
              value={formData.persona}
              onChange={(e) => setFormData(prev => ({ ...prev, persona: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
              required
            >
              <option value="">Select target audience...</option>
              {personas.map(persona => (
                <option key={persona} value={persona}>{persona}</option>
              ))}
            </select>
          </div>

          {/* Funnel Stage */}
          <div>
            <label htmlFor="funnel-stage" className="block text-sm font-medium text-gray-700 mb-3">
              Funnel Stage
            </label>
            <select
              id="funnel-stage"
              value={formData.funnelStage}
              onChange={(e) => setFormData(prev => ({ ...prev, funnelStage: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
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
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Assets You Want (select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {assetTypes.map(asset => (
                <label
                  key={asset.name}
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                    formData.selectedAssets.includes(asset.name)
                      ? 'border-teal-500 bg-gradient-to-r from-teal-50 to-cyan-50 shadow-lg'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedAssets.includes(asset.name)}
                    onChange={() => handleAssetToggle(asset.name)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-lg border-2 mr-3 flex items-center justify-center transition-all duration-300 ${
                    formData.selectedAssets.includes(asset.name)
                      ? `bg-gradient-to-r ${asset.color} border-transparent`
                      : 'border-gray-300'
                  }`}>
                    {formData.selectedAssets.includes(asset.name) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{asset.name}</span>
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
              className="w-full bg-gradient-to-r from-teal-600 via-violet-600 to-orange-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:from-teal-700 hover:via-violet-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              Generate My Marketing Assets
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;