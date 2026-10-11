// api/chat.js — Vercel Serverless Function
// Proxy untuk Gemini generateContent.
// API key TIDAK pernah keluar ke browser — hanya ada di environment variable server.

const GEMINI_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
]

const SYSTEM_PROMPT = `Kamu adalah Asisten Analisis Stok Barang untuk toko UMKM "Smart Retail AI".
Fokus utama kamu adalah menganalisis data inventori aktual yang disertakan pada setiap pertanyaan dan membantu pemilik toko mengambil keputusan operasional.

Panduan analisis:
- Prioritaskan produk kedaluwarsa atau yang segera kedaluwarsa, lalu stok di bawah batas minimum, kemudian stok berlebih/dead-stock.
- Gunakan stok minimum untuk menemukan risiko kehabisan barang. Gunakan estimasi laku bulanan untuk memperkirakan cakupan stok dan mendeteksi stok berlebih; sebutkan bahwa itu estimasi.
- Gunakan HPP dan harga jual hanya jika relevan untuk menjelaskan nilai persediaan atau dampak finansial. Jangan mengarang nilai penjualan, riwayat transaksi, atau tren yang tidak ada di data.
- Sebut nama produk dan angka stok yang relevan, lalu berikan langkah praktis dan prioritas yang jelas.
- Jika data tidak cukup untuk menyimpulkan sesuatu, katakan data apa yang belum tersedia. Untuk permintaan di luar inventori, arahkan kembali dengan sopan ke analisis stok.
- Jika pemilik meminta promo, berikan rekomendasi singkat yang tetap berlandaskan kondisi stok dan data produk.

Selalu jawab dalam Bahasa Indonesia yang ramah, profesional, ringkas, dan mudah dipahami pedagang.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY tidak dikonfigurasi di server.' })
  }

  const { text } = req.body ?? {}
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Field "text" wajib diisi.' })
  }

  let lastErr
  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
      const upstream = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      })

      if (!upstream.ok) {
        const errBody = await upstream.json().catch(() => ({}))
        // retry on quota / service-unavailable / model-not-found
        if ([429, 503, 404].includes(upstream.status)) {
          lastErr = { status: upstream.status, message: errBody?.error?.message ?? upstream.statusText }
          continue
        }
        return res.status(upstream.status).json({ error: errBody?.error?.message ?? upstream.statusText })
      }

      const data = await upstream.json()
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!reply) {
        lastErr = { status: 500, message: 'empty_response' }
        continue
      }
      return res.status(200).json({ text: reply, model })
    } catch (err) {
      lastErr = { status: 500, message: err.message }
    }
  }

  const status = lastErr?.status ?? 500
  return res.status(status >= 400 ? status : 500).json({ error: lastErr?.message ?? 'AI tidak tersedia.' })
}
