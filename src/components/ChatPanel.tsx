import React, { useEffect, useRef } from 'react';
import { MessageSquare, Gift, UserPlus, Heart, Share } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatPanelProps {
  messages: ChatMessage[];
  isConnected: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, isConnected }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'gift':
        return <Gift className="w-4 h-4 text-yellow-400" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-green-400" />;
      case 'like':
        return <Heart className="w-4 h-4 text-red-400" />;
      case 'share':
        return <Share className="w-4 h-4 text-purple-400" />;
      default:
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
    }
  };

  const getMessageContent = (message: ChatMessage) => {
    switch (message.type) {
      case 'gift':
        return `${message.giftName} hediyesi gönderdi (${message.giftValue} ⭐)`;
      case 'follow':
        return 'takip etmeye başladı';
      case 'like':
        return 'beğendi';
      case 'share':
        return 'paylaştı';
      default:
        return message.message;
    }
  };

  const getMessageStyle = (type: string) => {
    switch (type) {
      case 'gift':
        return 'bg-yellow-500/10 border-yellow-500/20 border';
      case 'follow':
        return 'bg-green-500/10 border-green-500/20 border';
      case 'like':
        return 'bg-red-500/10 border-red-500/20 border';
      case 'share':
        return 'bg-purple-500/10 border-purple-500/20 border';
      default:
        return 'bg-gray-800/50 border-gray-700/50 border';
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-black/30 backdrop-blur-lg rounded-xl border border-gray-700 p-6 shadow-2xl h-96 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Sohbet mesajlarını görmek için bir TikTok kullanıcısına bağlanın</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/30 backdrop-blur-lg rounded-xl border border-gray-700 shadow-2xl">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-pink-400" />
          <span>Canlı Sohbet</span>
          <div className="ml-auto bg-pink-500/20 text-pink-400 text-xs px-2 py-1 rounded-full">
            {messages.length} mesaj
          </div>
        </h2>
      </div>
      
      <div className="h-96 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>Henüz mesaj yok. Mesajlar burada görünecek...</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`${getMessageStyle(message.type)} rounded-lg p-3 transition-all duration-200 hover:scale-[1.02] animate-fade-in`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getMessageIcon(message.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-white text-sm">
                      @{message.username}
                    </span>
                    {message.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    <span className="text-gray-400 text-xs">
                      {message.timestamp.toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <p className="text-gray-200 text-sm break-words">
                    {getMessageContent(message)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};