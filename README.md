# 📚 MyShelf - AI Powered Personal Book Tracker

**MyShelf**, sadece bir kitap listeleme uygulaması değil, yapay zeka ile güçlendirilmiş kişisel bir edebiyat asistanıdır. Google Books API ile devasa bir kütüphaneye erişim sağlarken, Google Gemini API (GenAI) ile okuma alışkanlıklarınızı analiz ederek size özel kürasyonlar sunar.

![Version](https://img.shields.io/badge/version-1.0.0-amber)
![License](https://img.shields.io/badge/license-MIT-stone)
![Tech](https://img.shields.io/badge/tech-React%2019-blue)
![AI](https://img.shields.io/badge/AI-Gemini%203%20Flash-orange)

---

## ✨ Öne Çıkan Özellikler

### 🤖 AI Küratör Masası (Curator Desk)
Uygulamanın kalbi olan bu özellik, klasik algoritmalardan farklı çalışır:
- **Semantik Analiz:** Sadece tür eşleşmesi yapmaz; okuduğunuz kitapların temaları ile okumak istediğiniz kitapların alt metinlerini birleştirir.
- **"Neden" Gerekçesi:** AI, her öneri için size özel bir açıklama sunar (Örn: *"X kitabındaki distopik atmosferi sevdiğiniz için Y kitabındaki felsefe ilginizi çekebilir"*).

### 🔍 Akıllı Keşif (Discovery)
- Google Books API entegrasyonu ile milyonlarca kitaba anında erişim.
- Kategori bazlı filtreleme ve dinamik arama.
- Modern "Snap-carousel" tasarımı ile mobil öncelikli kullanıcı deneyimi.

### 🛡️ Gizlilik ve Mimari (Privacy-First)
- **Zero-Backend:** Kullanıcı verileri hiçbir sunucuda saklanmaz; her şey tarayıcınızın `localStorage` alanında, tamamen size özel kalır.
- **PWA Uyumluluğu:** Mobil uygulama hissi veren, tarayıcı üzerinden yüklenebilir yapı.

---

## 🛠️ Teknik Yığın (Tech Stack)

| Katman | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Frontend** | React 19 (ES6 Modules) | Modern, hızlı ve deklaratif UI. |
| **Styling** | Tailwind CSS | Utility-first, responsive tasarım. |
| **AI Engine** | Google Gemini 3 Flash | `@google/genai` ile gelişmiş doğal dil işleme. |
| **Data Source** | Google Books API | Gerçek zamanlı kitap meta verileri. |
| **Icons** | Lucide React | Minimalist ve performanslı SVG ikon seti. |
| **Testing** | Vitest | Servis ve bileşen bazlı birim testleri. |

---

## 🚀 Kurulum ve Çalıştırma

1. **Projeyi Klonlayın:**
   ```bash
   git clone https://github.com/kullanici/myshelf.git
   ```

2. **Gerekli Ortam Değişkenleri:**
   Uygulama, Gemini API'ye erişmek için `process.env.API_KEY` değişkenini kullanır. Geliştirme ortamınızda bu anahtarı tanımladığınızdan emin olun.

3. **Uygulamayı Başlatın:**
   Proje kök dizininde `index.html` dosyasını bir canlı sunucu (Live Server) ile açmanız yeterlidir. Modern ESM yapısı sayesinde ek bir derleme adımına gerek kalmaz.

---

## 🎨 Tasarım Felsefesi

Uygulama, "Gece Yarısı Kütüphanesi" (Midnight Library) temasından ilham almıştır:
- **Tipografi:** Başlıklarda klasik kütüphane estetiği için *Playfair Display*, gövde metinlerinde modern okunabilirlik için *Inter* kullanılmıştır.
- **Renk Paleti:** Göz yormayan Amber tonları ve derin Stone renkleri (Dark Mode desteği ile).

---

## 📝 Geliştirme Günlüğü (AI Development Log)

Projenin mimari kararları, AI prompt stratejileri ve karşılaşılan teknik zorlukların çözümleri için [AI_LOG.md](./AI_LOG.md) dosyasını inceleyebilirsiniz.

---

## 📄 Lisans

Bu proje MIT lisansı altında korunmaktadır. Daha fazla bilgi için `LICENSE` dosyasına göz atabilirsiniz.

---
*Developed with ❤️ by an AI Architect*
