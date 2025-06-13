import React from 'react';
import { Eye, Heart, UserPlus, Gift, Share } from 'lucide-react';
import { Stats } from '../types';

interface StatsPanelProps {
  stats: Stats;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const statItems = [
    {
      icon: Eye,
      label: 'İzleyici',
      value: stats.viewerCount.toLocaleString('tr-TR'),
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      icon: Heart,
      label: 'Beğeni',
      value: stats.likeCount.toLocaleString('tr-TR'),
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20'
    },
    {
      icon: UserPlus,
      label: 'Takipçi',
      value: stats.followCount.toLocaleString('tr-TR'),
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      icon: Gift,
      label: 'Hediye',
      value: stats.giftCount.toLocaleString('tr-TR'),
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20'
    },
    {
      icon: Share,
      label: 'Paylaşım',
      value: stats.shareCount.toLocaleString('tr-TR'),
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    }
  ];

  return (
    <div className="bg-black/30 backdrop-blur-lg rounded-xl border border-gray-700 p-6 shadow-2xl">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span>Canlı İstatistikler</span>
      </h2>
      
      <div className="space-y-3">
        {statItems.map((item, index) => (
          <div
            key={index}
            className={`${item.bgColor} ${item.borderColor} border rounded-lg p-3 transition-all duration-200 hover:scale-105`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-gray-300 text-sm">{item.label}</span>
              </div>
              <span className={`${item.color} font-bold text-lg`}>
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};