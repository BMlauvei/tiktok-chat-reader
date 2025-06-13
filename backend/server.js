import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { WebcastPushConnection } from 'tiktok-live-connector';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Aktif bağlantıları takip et
const activeConnections = new Map();
const connectionStats = new Map();

console.log('🚀 TikTok Live Connector sunucusu başlatılıyor...');

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TikTok Chat Reader Backend',
    timestamp: new Date().toISOString(),
    activeConnections: activeConnections.size
  });
});

// TikTok kullanıcısına bağlan
app.post('/api/connect', async (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: 'Kullanıcı adı gerekli' });
  }

  // @ işaretini kaldır
  const cleanUsername = username.replace('@', '');

  try {
    // Önceki bağlantıyı kapat
    if (activeConnections.has(cleanUsername)) {
      console.log(`⚠️ @${cleanUsername} için mevcut bağlantı kapatılıyor...`);
      activeConnections.get(cleanUsername).disconnect();
      activeConnections.delete(cleanUsername);
    }

    console.log(`🔄 @${cleanUsername} kullanıcısına bağlanmaya çalışılıyor...`);

    // Yeni bağlantı oluştur
    const tiktokLiveConnection = new WebcastPushConnection(cleanUsername, {
      processInitialData: true,
      enableExtendedGiftInfo: true,
      enableWebsocketUpgrade: true,
      requestPollingIntervalMs: 1000,
      sessionId: undefined,
      clientParams: {},
      requestHeaders: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      websocketHeaders: {},
      requestOptions: {
        timeout: 15000,
      },
    });

    // İstatistikleri başlat
    connectionStats.set(cleanUsername, {
      viewerCount: 0,
      likeCount: 0,
      followCount: 0,
      giftCount: 0,
      shareCount: 0
    });

    // Bağlantı olaylarını dinle
    tiktokLiveConnection.connect().then(state => {
      console.log(`✅ @${cleanUsername} kullanıcısına başarıyla bağlandı!`);
      console.log(`📺 Yayın durumu: ${state.roomInfo?.status === 2 ? 'Canlı ✅' : 'Canlı değil ❌'}`);
      console.log(`👥 İzleyici sayısı: ${state.roomInfo?.user_count || 0}`);
      
      // Bağlantıyı kaydet
      activeConnections.set(cleanUsername, tiktokLiveConnection);
      
      // İlk istatistikleri gönder
      const initialStats = {
        viewerCount: state.roomInfo?.user_count || 0,
        likeCount: state.roomInfo?.stats?.like_count || 0,
        followCount: 0,
        giftCount: 0,
        shareCount: 0
      };
      
      connectionStats.set(cleanUsername, initialStats);
      io.emit('stats', initialStats);
      io.emit('connected', { 
        username: cleanUsername, 
        isLive: state.roomInfo?.status === 2,
        viewerCount: state.roomInfo?.user_count || 0
      });

      res.json({ 
        success: true, 
        message: `@${cleanUsername} kullanıcısına başarıyla bağlandı`,
        isLive: state.roomInfo?.status === 2,
        viewerCount: state.roomInfo?.user_count || 0
      });

    }).catch(err => {
      console.error('❌ Bağlantı hatası:', err.message);
      res.status(500).json({ 
        error: 'Kullanıcıya bağlanılamadı. Kullanıcı canlı yayında olmayabilir veya kullanıcı adı yanlış olabilir.',
        details: err.message 
      });
    });

    // Chat mesajları
    tiktokLiveConnection.on('chat', data => {
      console.log(`💬 Chat: @${data.uniqueId}: ${data.comment}`);
      
      const message = {
        id: data.msgId || Math.random().toString(36).substr(2, 9),
        username: data.uniqueId,
        message: data.comment,
        timestamp: new Date(),
        type: 'chat',
        verified: data.userBadges?.some(badge => badge.type === 'verified') || false,
        profilePicture: data.profilePictureUrl
      };
      
      io.emit('message', message);
    });

    // Hediyeler
    tiktokLiveConnection.on('gift', data => {
      console.log(`🎁 Hediye: @${data.uniqueId} -> ${data.giftName} (${data.diamondCount} elmas)`);
      
      const message = {
        id: Math.random().toString(36).substr(2, 9),
        username: data.uniqueId,
        message: '',
        timestamp: new Date(),
        type: 'gift',
        giftName: data.giftName,
        giftValue: data.diamondCount,
        verified: data.userBadges?.some(badge => badge.type === 'verified') || false,
        profilePicture: data.profilePictureUrl
      };
      
      io.emit('message', message);
      
      // Gift istatistiğini güncelle
      const stats = connectionStats.get(cleanUsername);
      if (stats) {
        stats.giftCount += data.repeatCount || 1;
        connectionStats.set(cleanUsername, stats);
        io.emit('stats', stats);
      }
    });

    // Takip etme
    tiktokLiveConnection.on('social', data => {
      console.log(`👥 Sosyal: @${data.uniqueId} -> ${data.displayType}`);
      
      if (data.displayType === 'pm_main_follow_message_viewer_2_anchor') {
        const message = {
          id: Math.random().toString(36).substr(2, 9),
          username: data.uniqueId,
          message: '',
          timestamp: new Date(),
          type: 'follow',
          verified: data.userBadges?.some(badge => badge.type === 'verified') || false,
          profilePicture: data.profilePictureUrl
        };
        
        io.emit('message', message);
        
        // Follow istatistiğini güncelle
        const stats = connectionStats.get(cleanUsername);
        if (stats) {
          stats.followCount += 1;
          connectionStats.set(cleanUsername, stats);
          io.emit('stats', stats);
        }
      }
    });

    // Beğeniler
    tiktokLiveConnection.on('like', data => {
      console.log(`❤️ Beğeni: @${data.uniqueId} -> ${data.likeCount} beğeni`);
      
      const message = {
        id: Math.random().toString(36).substr(2, 9),
        username: data.uniqueId,
        message: '',
        timestamp: new Date(),
        type: 'like',
        verified: data.userBadges?.some(badge => badge.type === 'verified') || false,
        profilePicture: data.profilePictureUrl
      };
      
      io.emit('message', message);
      
      // Like istatistiğini güncelle
      const stats = connectionStats.get(cleanUsername);
      if (stats) {
        stats.likeCount += data.likeCount || 1;
        connectionStats.set(cleanUsername, stats);
        io.emit('stats', stats);
      }
    });

    // Paylaşımlar
    tiktokLiveConnection.on('share', data => {
      console.log(`📤 Paylaşım: @${data.uniqueId}`);
      
      const message = {
        id: Math.random().toString(36).substr(2, 9),
        username: data.uniqueId,
        message: '',
        timestamp: new Date(),
        type: 'share',
        verified: data.userBadges?.some(badge => badge.type === 'verified') || false,
        profilePicture: data.profilePictureUrl
      };
      
      io.emit('message', message);
      
      // Share istatistiğini güncelle
      const stats = connectionStats.get(cleanUsername);
      if (stats) {
        stats.shareCount += 1;
        connectionStats.set(cleanUsername, stats);
        io.emit('stats', stats);
      }
    });

    // İzleyici sayısı güncellemeleri
    tiktokLiveConnection.on('roomUser', data => {
      const stats = connectionStats.get(cleanUsername);
      if (stats) {
        stats.viewerCount = data.viewerCount || stats.viewerCount;
        connectionStats.set(cleanUsername, stats);
        io.emit('stats', stats);
      }
    });

    // Bağlantı koptuğunda
    tiktokLiveConnection.on('disconnected', () => {
      console.log(`🔌 @${cleanUsername} bağlantısı koptu`);
      activeConnections.delete(cleanUsername);
      connectionStats.delete(cleanUsername);
      io.emit('disconnected');
    });

    // Hata durumunda
    tiktokLiveConnection.on('error', err => {
      console.error(`❌ @${cleanUsername} bağlantı hatası:`, err.message);
      io.emit('error', { message: err.message });
    });

  } catch (error) {
    console.error('❌ Genel hata:', error);
    res.status(500).json({ 
      error: 'Beklenmeyen bir hata oluştu',
      details: error.message 
    });
  }
});

// Bağlantıyı kes
app.post('/api/disconnect', (req, res) => {
  const { username } = req.body;
  const cleanUsername = username?.replace('@', '');
  
  if (activeConnections.has(cleanUsername)) {
    activeConnections.get(cleanUsername).disconnect();
    activeConnections.delete(cleanUsername);
    connectionStats.delete(cleanUsername);
    console.log(`🔌 @${cleanUsername} bağlantısı kesildi`);
  }
  
  io.emit('disconnected');
  res.json({ success: true });
});

// Aktif bağlantıları listele
app.get('/api/connections', (req, res) => {
  const connections = Array.from(activeConnections.keys());
  res.json({ connections });
});

// Sağlık kontrolü
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    activeConnections: activeConnections.size
  });
});

// Socket.IO bağlantıları
io.on('connection', (socket) => {
  console.log('🔗 Yeni client bağlandı:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('🔌 Client bağlantısı koptu:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log('🎉 TikTok Live Connector sunucusu başarıyla başlatıldı!');
  console.log(`🔧 Backend: Port ${PORT}`);
  console.log(`📊 Sağlık kontrolü: /api/health`);
  console.log('📝 Hazır! TikTok kullanıcı adı girerek canlı yayın verilerini okuyabilirsiniz.');
});