import React from 'react';
import { Video, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-gray-800 bg-black/20 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg blur-sm"></div>
            <div className="relative bg-gradient-to-r from-pink-500 to-red-500 p-2 rounded-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400 bg-clip-text text-transparent">
              TikTok Chat Reader
            </h1>
            <p className="text-gray-400 text-sm flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>Canlı Sohbet Okuyucu</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};