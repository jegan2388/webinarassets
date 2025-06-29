import React from 'react';
import { ExternalLink, Zap } from 'lucide-react';

const BoltBadge: React.FC = () => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center space-x-2 bg-white/90 backdrop-blur-sm hover:bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <Zap className="w-4 h-4 text-yellow-500" />
        <span>Built with</span>
        <span className="font-semibold text-slate-900">bolt.new</span>
        <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
      </a>
    </div>
  );
};

export default BoltBadge;