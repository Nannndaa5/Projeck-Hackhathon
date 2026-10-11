# Smart Retail AI — Dashboard UMKM

Aplikasi web untuk mengelola inventaris dan operasional toko UMKM. Tersedia dashboard stok untuk pemilik, POS untuk transaksi, pengelolaan pemasok dan purchase order, OCR faktur, serta chatbot AI yang menganalisis data inventaris aktual.

## Peran IBM Bob dan LangFlow

- **IBM Bob** membantu proses pengembangan sebagai AI coding assistant untuk pengerjaan kode, debugging, dan konfigurasi. IBM Bob bukan bagian dari runtime aplikasi atau fitur yang digunakan langsung oleh pemilik toko.
- **LangFlow** adalah visual builder untuk flow AI dan dapat digunakan sebagai backend chatbot pada demo lokal. Dengan `VITE_AI_MODE=langflow-first`, aplikasi mencoba LangFlow terlebih dahulu lalu menggunakan Gemini sebagai fallback.
- Deployment online menggunakan mode default `gemini-only`; chatbot dan OCR memanggil Gemini melalui endpoint server aplikasi.

## Prasyarat

- Node.js 20.19+ atau 22.12+
- npm
- Gemini API key untuk chatbot dan OCR
- Opsional: LangFlow Desktop jika menggunakan mode `langflow-first`

## Setup Lokal

```bash
npm install
cp .env.example .env
```

Isi `GEMINI_API_KEY` pada `.env`, lalu jalankan:

```bash
npm run dev
```

Buka `http://localhost:5173`. Vite menyediakan middleware lokal untuk endpoint `/api/*`, sehingga fungsi chatbot, OCR, dan LangFlow dapat diuji dengan server development ini.

```bash
npm run lint
npm run build
npm run preview
```

## Environment Variables

| Nama | Wajib | Keterangan |
|---|---|---|
| `VITE_AI_MODE` | Tidak | `gemini-only` (default) atau `langflow-first` |
| `GEMINI_API_KEY` | Ya untuk Gemini/OCR | Secret server untuk API Gemini; jangan beri prefix `VITE_` |
| `LANGFLOW_BASE_URL` | Tidak | URL LangFlow, misalnya `http://localhost:7860` |
| `LANGFLOW_FLOW_ID` | Tidak | ID flow LangFlow |
| `LANGFLOW_API_KEY` | Tidak | API key LangFlow |

Mode `gemini-only` mengirim chat langsung ke endpoint Gemini server. Mode `langflow-first` mencoba LangFlow, lalu beralih ke Gemini bila LangFlow gagal. Simpan semua API key sebagai environment variable server. Pada Vercel, konfigurasikan `GEMINI_API_KEY` di pengaturan project.

## Fitur Utama

- Ringkasan inventaris, indikator stok, dan grafik kategori.
- Pencarian, filter, ekspor CSV, tambah produk, dan penghapusan massal.
- OCR faktur untuk membaca baris produk dan menerima barang; stok produk yang cocok digabung dan HPP diperbarui dengan moving average.
- Chatbot mengirim data stok terkini, batas minimum, estimasi laku, HPP, harga jual, dan tanggal kedaluwarsa sebagai konteks analisis.
- POS dengan katalog produk, pencarian, input barcode, keranjang, pembayaran, pengurangan stok, dan struk.
- Pengelolaan pemasok, purchase order, log aktivitas, pengaturan, dan navigasi mobile.

## Akun Demo

| Username | Password | Role |
|---|---|---|
| `pemilik` | `pemilik123` | Pemilik toko |
| `kasir` | `kasir123` | Kasir |

Akun demo dan pemeriksaan role bekerja di frontend untuk demonstrasi, bukan autentikasi produksi. Data inventaris aplikasi saat ini juga tidak menggunakan database persisten.

## Deployment

Project dapat di-deploy ke Vercel. Atur root directory ke `umkm-dashboard`, framework ke Vite, dan tambahkan `GEMINI_API_KEY` sebagai environment variable server agar chatbot dan OCR tersedia.

Demo online: https://smart-retail-ai-ten.vercel.app/

IBM Bob adalah alat bantu development, sedangkan LangFlow hanya diperlukan bila menjalankan mode AI lokal `langflow-first`; keduanya bukan dependency yang harus dipasang untuk memakai deployment online.
