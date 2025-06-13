import React, { useState } from 'react';
import { Play, Square, Loader2, Wifi, WifiOff, User, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface ConnectionPanelProps {
  isConnected: boolean;
  isConnecting: boolean;
  username: string;
  error: string | null;
  onConnect: (username: string) => void;
  onDisconnect: () => void;
}

export const ConnectionPanel: React.FC<ConnectionPanelProps> = ({
  isConnected,
  isConnecting,
  username,
  error,
  onConnect,
  onDisconnect
}) => {
  const [inputUsername, setInputUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUsername.trim() && !isConnecting) {
      onConnect(inputUsername.trim());
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-lg rounded-xl border border-gray-700 p-6 shadow-2xl">
      <div className="flex items-center space-x-2 mb-6">
        {isConnected ? (
          <Wifi className="w-5 h-5 text-green-400" />
        ) : (
          <WifiOff className="w-5 h-5 text-gray-400" />
        )}
        <h2 className="text-lg font-semibold text-white">
          TikTok Canlı Yayın Bağlantısı
        </h2>
      </div>

      {/* Bilgi mesajı */}
      <div className="mb-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-blue-400 text-xs">
            <p className="font-medium mb-1">🎯 Gerçek TikTok Canlı Yayın Verisi</p>
            <p>Bu uygulama gerçek TikTok canlı yayın sohbetini okur. Kullanıcının şu anda canlı yayında olması gerekir.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 animate-pulse">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {!isConnected ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              TikTok Kullanıcı Adı
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                id="username"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                placeholder="kullaniciadi (@ işareti olmadan)"
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                disabled={isConnecting}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              ⚠️ Kullanıcı şu anda canlı yayında olmalıdır
            </p>
          </div>
          
          <button
            type="submit"
            disabled={!inputUsername.trim() || isConnecting}
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-pink-500/25 transform hover:scale-105 disabled:hover:scale-100"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Bağlanıyor...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Canlı Yayına Bağlan</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium">Canlı Yayına Bağlı</span>
            </div>
            <p className="text-white font-semibold">@{username}</p>
            <p className="text-green-300 text-xs mt-1">✅ Gerçek veriler alınıyor...</p>
          </div>
          
          <button
            onClick={onDisconnect}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105"
          >
            <Square className="w-4 h-4" />
            <span>Bağlantıyı Kes</span>
          </button>
        </div>
      )}
    </div>
  );
};