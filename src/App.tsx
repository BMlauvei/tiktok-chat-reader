import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Header } from './components/Header';
import { ConnectionPanel } from './components/ConnectionPanel';
import { StatsPanel } from './components/StatsPanel';
import { ChatPanel } from './components/ChatPanel';
import { ChatMessage, Stats } from './types';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stats, setStats] = useState<Stats>({
    viewerCount: 0,
    likeCount: 0,
    followCount: 0,
    giftCount: 0,
    shareCount: 0
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [backendUrl, setBackendUrl] = useState<string>('');

  // Get backend URL from environment or user input
  const getBackendUrl = () => {
    // Check if we have a custom backend URL from environment
    const envBackendUrl = import.meta.env.VITE_BACKEND_URL;
    if (envBackendUrl) {
      return envBackendUrl;
    }

    // For development, try to detect local backend
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3001';
    }

    // For production, return empty string to show backend URL input
    return '';
  };

  useEffect(() => {
    const detectedBackendUrl = getBackendUrl();
    setBackendUrl(detectedBackendUrl);
    
    if (detectedBackendUrl) {
      initializeSocket(detectedBackendUrl);
    }
  }, []);

  const initializeSocket = (url: string) => {
    console.log('🔗 Socket.IO bağlantısı kuruluyor...', url);
    
    const newSocket = io(url, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });
    
    setSocket(newSocket);

    // Bağlantı durumunu kontrol et
    newSocket.on('connect', () => {
      console.log('✅ Socket.IO bağlantısı kuruldu');
      setError(null);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket.IO bağlantı hatası:', error);
      setError('Sunucuya bağlanılamıyor. Backend sunucusunun çalıştığından ve URL\'nin doğru olduğundan emin olun.');
    });

    // Socket olaylarını dinle
    newSocket.on('message', (message: ChatMessage) => {
      console.log('📨 Yeni mesaj alındı:', message);
      setMessages(prev => [...prev, message].slice(-100)); // Son 100 mesajı tut
    });

    newSocket.on('stats', (newStats: Stats) => {
      console.log('📊 İstatistikler güncellendi:', newStats);
      setStats(newStats);
    });

    newSocket.on('connected', (data: { username: string; isLive: boolean; viewerCount: number }) => {
      console.log('🎉 TikTok bağlantısı kuruldu:', data);
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    });

    newSocket.on('disconnected', () => {
      console.log('🔌 TikTok bağlantısı koptu');
      setIsConnected(false);
      setUsername('');
      setMessages([]);
      setStats({
        viewerCount: 0,
        likeCount: 0,
        followCount: 0,
        giftCount: 0,
        shareCount: 0
      });
    });

    newSocket.on('error', (errorData: { message: string }) => {
      console.error('❌ TikTok hatası:', errorData);
      setError(errorData.message);
      setIsConnecting(false);
    });

    return () => {
      console.log('🔌 Socket.IO bağlantısı kapatılıyor');
      newSocket.close();
    };
  };

  const handleBackendUrlSubmit = (url: string) => {
    setBackendUrl(url);
    if (socket) {
      socket.close();
    }
    initializeSocket(url);
  };

  // TikTok kullanıcısına bağlan
  const handleConnect = async (inputUsername: string) => {
    if (!backendUrl) {
      setError('Lütfen önce backend sunucu URL\'sini girin');
      return;
    }

    console.log('🔄 TikTok bağlantısı başlatılıyor:', inputUsername);
    setIsConnecting(true);
    setUsername(inputUsername);
    setError(null);
    setMessages([]);
    
    try {
      const response = await fetch(`${backendUrl}/api/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: inputUsername }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Bağlantı hatası');
      }

      console.log('✅ Bağlantı başarılı:', data);
      
    } catch (err) {
      console.error('❌ Bağlantı hatası:', err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      setIsConnecting(false);
    }
  };

  // Bağlantıyı kes
  const handleDisconnect = async () => {
    if (!backendUrl) return;
    
    console.log('🔌 Bağlantı kesiliyor...');
    try {
      await fetch(`${backendUrl}/api/disconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      console.log('✅ Bağlantı başarıyla kesildi');
    } catch (err) {
      console.error('❌ Bağlantı kesme hatası:', err);
    }
  };

  // Backend URL input component
  const BackendUrlInput = () => {
    const [inputUrl, setInputUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (inputUrl.trim()) {
        handleBackendUrlSubmit(inputUrl.trim());
      }
    };

    return (
      <div className="bg-black/30 backdrop-blur-lg rounded-xl border border-gray-700 p-6 shadow-2xl mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Backend Sunucu Bağlantısı</h2>
        <div className="mb-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <p className="text-yellow-400 text-sm">
            ⚠️ Bu uygulama bir backend sunucuya ihtiyaç duyar. Lütfen backend sunucunuzun URL'sini girin.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="backendUrl" className="block text-sm font-medium text-gray-300 mb-2">
              Backend Sunucu URL'si
            </label>
            <input
              type="url"
              id="backendUrl"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://your-backend-server.com"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Örnek: https://your-backend-server.herokuapp.com
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
          >
            <span>Bağlan</span>
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Arka plan efektleri */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {!backendUrl ? (
            <BackendUrlInput />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sol Panel - Bağlantı ve İstatistikler */}
              <div className="lg:col-span-1 space-y-6">
                {/* Backend URL Display */}
                <div className="bg-black/30 backdrop-blur-lg rounded-xl border border-gray-700 p-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Backend Sunucu:</p>
                      <p className="text-sm text-green-400 font-mono">{backendUrl}</p>
                    </div>
                    <button
                      onClick={() => setBackendUrl('')}
                      className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded border border-gray-600 hover:border-gray-500 transition-colors"
                    >
                      Değiştir
                    </button>
                  </div>
                </div>

                <ConnectionPanel
                  isConnected={isConnected}
                  isConnecting={isConnecting}
                  username={username}
                  error={error}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                />
                
                {isConnected && (
                  <StatsPanel stats={stats} />
                )}
              </div>
              
              {/* Sağ Panel - Sohbet */}
              <div className="lg:col-span-2">
                <ChatPanel
                  messages={messages}
                  isConnected={isConnected}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;