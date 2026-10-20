// Cloudflare Pages Functions: POST /api/chat
export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = await request.json();
    const userMessages = body.messages || [];

    if (!userMessages.length) {
      return new Response(JSON.stringify({ error: 'Pesan tidak boleh kosong.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const systemPrompt = `Anda adalah Asisten Virtual Resmi dari "Sejalan" (sejalan.web.id) — Business Growth & AI Agency di Indonesia.
Konsultan Utama & Founder: Mas M Agus Supriyono.
Nomor WhatsApp resmi: 0896-7023-6337 (link https://wa.me/6289670236337).

Tentang Sejalan:
Sejalan membantu pemilik bisnis dan perusahaan mengintegrasikan Karyawan Virtual AI 24/7, Iklan Berkinerja Tinggi (Meta Ads & Google Ads), serta Analisa Bisnis agar operasional bisnis berjalan otomatis tanpa lembur manual.

4 Pilar Utama Solusi Sejalan:
1. Setup AI Agent 24/7:
   - Membangun karyawan virtual berbasis AI di WhatsApp, Telegram, website, dan CRM internal perusahaan.
   - Customer Service cerdas yang merespons pertanyaan pelanggan secara instan, ramah, dan solutif selama 24 jam non-stop.
   - Otomasi follow-up prospek lama dan broadcast terjadwal yang aman dari banned.
   - Sinkronisasi data order/lead langsung ke Google Sheets atau database bisnis secara real-time.
2. Jasa Advertiser & Media Buying:
   - Pengelolaan kampanye Meta Ads (Facebook & Instagram) dan Google Ads berorientasi profit & ROAS (target 3x - 5x).
   - Riset audiens potensial, angle kreatif bernilai konversi tinggi (copywriting persuasif).
   - Setup tracking presisi (Meta CAPI / Conversions API, Pixel, Server-side tracking).
   - Skalasi anggaran iklan secara terukur dan berkelanjutan.
3. Analisa & Intelijen Bisnis (Business Intelligence):
   - Audit kebocoran biaya (Cost Leakage) operasional dan iklan.
   - Dashboard metrik real-time: omset harian, jumlah leads, dan margin bersih dalam 1 layar.
   - Analisa kompetitor dan tren pergerakan pasar.
4. Jasa Peningkatan Bisnis (Business Scaling):
   - Restrukturisasi SOP digital dan alur kerja tim agar owner terbebas dari rutinitas harian.
   - Optimalisasi Sales Funnel dari iklan hingga transfer pembayaran.
   - Strategi retensi dan repeat order untuk meningkatkan Customer Lifetime Value (LTV).

Panduan Menjawab:
- Selalu gunakan Bahasa Indonesia yang santun, ramah, profesional, dan meyakinkan.
- Format jawaban dengan rapi menggunakan poin-poin (bullet points) agar mudah dibaca di smartphone.
- Jika pengguna menanyakan biaya/harga: jelaskan bahwa biaya disesuaikan dengan skala dan kompleksitas kebutuhan sistem bisnis klien (mulai dari UMKM hingga korporat). Arahkan untuk konsultasi gratis terlebih dahulu melalui WhatsApp Mas Agus (0896-7023-6337) agar mendapatkan penawaran yang tepat sasaran.
- Tawarkan solusi nyata dan sertakan ajakan (Call-to-Action) untuk berdiskusi langsung via WhatsApp.`;

    // 1. If Cloudflare Workers AI binding is available
    if (env && env.AI) {
      const messagesForModel = [
        { role: 'system', content: systemPrompt },
        ...userMessages.slice(-6) // keep last 6 turns for context
      ];

      try {
        const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: messagesForModel,
          max_tokens: 512,
          temperature: 0.6
        });

        const reply = aiResponse.response || aiResponse.text || (typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse));
        return new Response(JSON.stringify({ reply }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      } catch (aiErr) {
        // Fallback to llama-3-8b-instruct if 3.1 is loading or variant differs
        try {
          const fallbackResp = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
            messages: messagesForModel,
            max_tokens: 512,
            temperature: 0.6
          });
          const reply = fallbackResp.response || fallbackResp.text;
          return new Response(JSON.stringify({ reply }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        } catch (innerErr) {
          console.error('Workers AI execution failed:', innerErr);
        }
      }
    }

    // 2. Fallback rule-based engine (if AI binding is not configured in dashboard yet)
    const latestUserMsg = (userMessages[userMessages.length - 1].content || '').toLowerCase();
    let reply = '';

    if (latestUserMsg.includes('harga') || latestUserMsg.includes('biaya') || latestUserMsg.includes('tarif') || latestUserMsg.includes('paket')) {
      reply = `Investasi layanan di **Sejalan** dirancang fleksibel dan disesuaikan dengan skala kebutuhan bisnis Anda:
• **Setup AI Agent:** Disesuaikan dengan kanal integrasi (WhatsApp, Website, CRM, atau Google Sheets).
• **Jasa Advertiser (Meta & Google Ads):** Berbasis paket pengelolaan bulanan dengan target ROAS 3x-5x.
• **Analisa Bisnis & Otomasi:** Berdasarkan kompleksitas dashboard & SOP bisnis.

💡 *Mari konsultasikan kebutuhan bisnis Anda secara gratis bersama Mas Agus Supriyono melalui WhatsApp di **0896-7023-6337** agar kami bisa menyiapkan estimasi dan proposal yang paling tepat!*`;
    } else if (latestUserMsg.includes('layanan') || latestUserMsg.includes('jasa') || latestUserMsg.includes('fitur') || latestUserMsg.includes('apa saja') || latestUserMsg.includes('bisa apa')) {
      reply = `**Sejalan** menghadirkan 4 Pilar Solusi Bisnis:
1. **Setup AI Agent 24/7:** Karyawan virtual cerdas di WhatsApp, web & CRM untuk CS otomatis, follow-up, dan database sync.
2. **Jasa Advertiser (Meta & Google Ads):** Manajemen iklan profit-oriented, riset audiens, setup tracking CAPI/Pixel, dan scaling.
3. **Analisa & Intelijen Bisnis:** Audit kebocoran biaya, dashboard metrik real-time, dan riset kompetitor.
4. **Jasa Peningkatan Bisnis:** Optimalisasi sales funnel, restrukturisasi SOP kerja, dan strategi repeat order.

Kira-kira solusi mana yang paling mendesak untuk bisnis Anda saat ini?`;
    } else if (latestUserMsg.includes('whatsapp') || latestUserMsg.includes('wa') || latestUserMsg.includes('kontak') || latestUserMsg.includes('telepon') || latestUserMsg.includes('hubungi') || latestUserMsg.includes('agus')) {
      reply = `Anda dapat langsung terhubung dengan Mas Agus Supriyono melalui:
• **WhatsApp:** [0896-7023-6337](https://wa.me/6289670236337?text=Halo%20Mas%20Agus%2C%20saya%20ingin%20konsultasi%20layanan%20Sejalan...)
• **Website:** sejalan.web.id

Kami siap membantu memetakan solusi AI dan periklanan yang cocok untuk bisnis Anda!`;
    } else if (latestUserMsg.includes('integrasi') || latestUserMsg.includes('bisa whatsapp') || latestUserMsg.includes('bot wa')) {
      reply = `Tentu saja, **sangat bisa!**
AI Agent kami dapat diintegrasikan langsung ke:
• **WhatsApp Bisnis:** Menjawab pesan masuk 24/7 layaknya admin manusia ramah.
• **Google Sheets / CRM:** Setiap data prospek langsung tersimpan otomatis.
• **Website & Telegram:** Saling tersinkronisasi dalam satu sistem.

Apakah Anda sudah memiliki nomor WhatsApp khusus untuk bisnis Anda?`;
    } else {
      reply = `Halo! Terima kasih sudah menyapa **Sejalan**. 
Kami siap membantu mengotomasi operasional bisnis Anda dengan **AI Agent 24/7**, mengelola **Meta & Google Ads**, serta meningkatkan profit bisnis.

Ada yang bisa kami bantu jelaskan lebih lanjut mengenai kebutuhan Anda? Anda juga bisa langsung chat Mas Agus di WhatsApp: [0896-7023-6337](https://wa.me/6289670236337).`;
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      reply: 'Halo! Mohon maaf sistem sedang sibuk. Silakan langsung konsultasikan kebutuhan Anda via WhatsApp Mas Agus di https://wa.me/6289670236337.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
