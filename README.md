# Sejalan.web.id — AI Agent & Performance Scaling Studio

Website resmi [sejalan.web.id](https://sejalan.web.id) yang dilengkapi dengan **Chatbot AI 24/7 Interaktif**.

## 🚀 Fitur Utama
1. **Landing Page Modern**: Desain Dark Cyberpunk/Glassmorphic dengan Tailwind CSS & Lucide/FontAwesome.
2. **Interactive 3D Virtual Office**: Showcase agen AI bekerja secara real-time di `/office/`.
3. **AI Chatbot 24/7 (Floating Widget)**:
   - Floating chat trigger dengan animasi badge di pojok kanan bawah.
   - Respon interaktif cepat, quick prompt chips, dan format markdown rapi.
   - Terintegrasi langsung dengan eskalasi WhatsApp Mas Agus Supriyono (`0896-7023-6337`).
4. **Cloudflare Pages Functions + Workers AI Backend**:
   - Terletak di `/functions/api/chat.js`.
   - Menggunakan model LLaMA 3.1 8B Instruct dari Cloudflare Workers AI.
   - Dilengkapi fallback rule-based engine otomatis jika binding AI belum aktif.

---

## 🛠️ Cara Aktivasi Cloudflare Workers AI di Cloudflare Pages

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages**.
2. Pilih project Pages Anda (misal `sejalan-web` atau `sejalan`).
3. Masuk ke **Settings** → **Functions** → scroll ke bagian **Workers AI bindings**.
4. Klik **Add binding**:
   - **Variable name**: `AI`
5. Klik **Save and Deploy**.
6. Chatbot AI Anda kini aktif sepenuhnya menggunakan mesin LLM Cloudflare secara gratis!
