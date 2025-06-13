export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'chat' | 'gift' | 'follow' | 'like' | 'share';
  giftName?: string;
  giftValue?: number;
  profilePicture?: string;
  verified?: boolean;
}

export interface Stats {
  viewerCount: number;
  likeCount: number;
  followCount: number;
  giftCount: number;
  shareCount: number;
}

export interface ConnectionStatus {
  isConnected: boolean;
  isConnecting: boolean;
  error?: string;
}