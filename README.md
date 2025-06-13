# TikTok Chat Reader

Bu uygulama, TikTok canlı yayın sohbetlerini gerçek zamanlı olarak okur ve görüntüler.

## 🚀 Özellikler

- ✅ Gerçek TikTok canlı yayın verilerini okur
- 💬 Canlı sohbet mesajları
- 🎁 Hediye bildirimleri
- 👥 Takipçi bildirimleri
- ❤️ Beğeni sayaçları
- 📊 Canlı istatistikler
- 🎨 Modern ve responsive tasarım

## 📋 Gereksinimler

- Node.js 18+ 
- npm veya yarn

## 🛠️ Kurulum

### Frontend (Bu Proje)

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd tiktok-chat-reader
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

### Backend Sunucu

Backend sunucu ayrı olarak deploy edilmelidir. Backend için `server.js` dosyasını kullanabilirsiniz.

#### Heroku'ya Deploy

1. Heroku hesabı oluşturun ve Heroku CLI'yi yükleyin
2. Yeni bir Heroku uygulaması oluşturun:
```bash
heroku create your-app-name
```

3. Backend dosyalarını ayrı bir klasöre kopyalayın:
```bash
mkdir backend
cp server.js backend/
cp package.json backend/
cp connectionWrapper.js backend/
cp limiter.js backend/
```

4. Backend klasöründe package.json'u güncelleyin:
```json
{
  "name": "tiktok-chat-reader-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.4",
    "tiktok-live-connector": "^1.1.8",
    "cors": "^2.8.5"
  }
}
```

5. Deploy edin:
```bash
cd backend
git init
heroku git:remote -a your-app-name
git add .
git commit -m "Initial backend deploy"
git push heroku main
```

#### Railway'e Deploy

1. [Railway](https://railway.app) hesabı oluşturun
2. GitHub repository'nizi bağlayın
3. Backend klasörünü seçin
4. Deploy edin

#### Render'a Deploy

1. [Render](https://render.com) hesabı oluşturun
2. "New Web Service" oluşturun
3. GitHub repository'nizi bağlayın
4. Build ve start komutlarını ayarlayın:
   - Build Command: `npm install`
   - Start Command: `node server.js`

## 🔧 Yapılandırma

### Environment Variables

Frontend için `.env` dosyası oluşturun:

```env
VITE_BACKEND_URL=https://your-backend-url.herokuapp.com
```

Eğer bu değişken ayarlanmazsa, uygulama kullanıcıdan backend URL'sini girmesini ister.

## 📱 Kullanım

1. Uygulamayı açın
2. Backend sunucu URL'sini girin (eğer environment variable ayarlanmamışsa)
3. Canlı yayında olan bir TikTok kullanıcı adını girin
4. "Canlı Yayına Bağlan" butonuna tıklayın
5. Canlı sohbet mesajlarını ve istatistikleri görün

## ⚠️ Önemli Notlar

- Kullanıcı **mutlaka canlı yayında olmalıdır**
- TikTok kullanıcı adını @ işareti olmadan girin
- Backend sunucu sürekli çalışır durumda olmalıdır
- Bazı TikTok hesapları özel ayarlar nedeniyle erişilemeyebilir

## 🎯 OBS Entegrasyonu

OBS için özel overlay sayfası: `/obs.html`

Bu sayfa şeffaf arka plan ile mesajları gösterir ve OBS'de browser source olarak kullanılabilir.

## 🛠️ Geliştirme

```bash
# Geliştirme sunucusu
npm run dev

# Build
npm run build

# Preview
npm run preview

# Lint
npm run lint
```

## 📄 Lisans

MIT License

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 Destek

Herhangi bir sorun yaşarsanız, lütfen GitHub Issues bölümünde bildirin.