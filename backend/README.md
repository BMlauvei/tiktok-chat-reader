# TikTok Chat Reader Backend

Bu backend sunucu TikTok canlı yayın verilerini okur ve frontend'e Socket.IO ile iletir.

## Render'a Deploy Etme

1. [Render.com](https://render.com) hesabı oluşturun
2. "New Web Service" seçin
3. Bu repository'yi bağlayın
4. Ayarları yapın:
   - **Name**: tiktok-chat-reader-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: npm install
   - **Start Command**: npm start

## Environment Variables

Render'da şu environment variable'ları ayarlayın:

- `NODE_ENV`: production

## Endpoints

- `GET /` - Health check
- `POST /api/connect` - TikTok kullanıcısına bağlan
- `POST /api/disconnect` - Bağlantıyı kes
- `GET /api/health` - Sağlık kontrolü
- `GET /api/connections` - Aktif bağlantıları listele

## Socket.IO Events

- `message` - Yeni chat mesajı
- `stats` - İstatistik güncellemesi
- `connected` - TikTok bağlantısı kuruldu
- `disconnected` - TikTok bağlantısı koptu
- `error` - Hata oluştu