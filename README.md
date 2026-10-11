<div align="center">

# Smart Retail AI

**Proyek Hackathon — IBM Bob × LangFlow**

**Dashboard operasional toko untuk UMKM Indonesia**

Kelola inventaris, transaksi kasir, pemasok, dan purchase order dalam satu aplikasi. Chatbot AI membantu menganalisis stok aktual untuk menemukan prioritas restock, stok berlebih, dan risiko kedaluwarsa.

[![Live Demo](https://img.shields.io/badge/Live_Demo-smart--retail--ai--ten.vercel.app-0070f3?style=for-the-badge)](https://smart-retail-ai-ten.vercel.app/)
![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

</div>

---

## Tentang Project

Smart Retail AI menyatukan alur kerja toko sehari-hari dalam dashboard yang mudah digunakan. Pemilik toko dapat memantau kondisi stok dan finansial, sementara kasir dapat mencari produk, mengelola keranjang, dan mencatat pembayaran.

Chatbot inventori menerima data stok terkini dari aplikasi saat menjawab pertanyaan. Analisisnya berfokus pada produk di bawah batas minimum, stok berlebih dibanding estimasi laku, serta tanggal kedaluwarsa. Sistem tidak memiliki riwayat penjualan persisten; estimasi laku merupakan data produk, bukan laporan transaksi historis.

## Peran IBM Bob dan LangFlow

- **IBM Bob** berperan sebagai AI coding assistant selama pengembangan. Bob membantu scaffolding struktur dan komponen React, debugging, pembaruan integrasi, serta konfigurasi aplikasi. Contoh pekerjaan yang didokumentasikan pada project ini meliputi menelusuri masalah model LangFlow, menyiapkan proxy API lokal, dan menjaga API key berada di environment server. Bob adalah alat bantu developer, bukan fitur runtime untuk pemilik toko.
- **LangFlow** digunakan untuk menyusun flow AI secara visual. Flow menerima prompt berisi konteks inventori dan menghasilkan respons untuk chatbot. LangFlow Desktop dapat digunakan pada demo lokal; aplikasi juga memiliki endpoint server LangFlow opsional.
- **MCP Bob ↔ LangFlow** menghubungkan IBM Bob ke project LangFlow agar Bob dapat menemukan dan memanggil flow sebagai tools saat proses development. Konfigurasi project menggunakan `supergateway` sebagai bridge: Bob berkomunikasi melalui MCP stdio, lalu `supergateway` meneruskan koneksi ke endpoint MCP LangFlow dengan transport Streamable HTTP. Dengan demikian Bob dapat berinteraksi dengan flow LangFlow tanpa menyalin API key ke dokumentasi. Integrasi MCP ini adalah tool development dan terpisah dari request chatbot yang digunakan pemilik toko.
- **Gemini** melayani chatbot dan OCR pada deployment online melalui API server. Default aplikasi adalah `gemini-only`; API key tetap disimpan di environment server. Pada mode lokal `langflow-first`, aplikasi mencoba LangFlow sebelum fallback ke Gemini.

Ringkasan alur integrasi MCP:

```text
IBM Bob (MCP client)
    │ MCP stdio
    ▼
supergateway
    │ Streamable HTTP
    ▼
LangFlow MCP endpoint
    │
    └── tools untuk menjalankan flow dalam project LangFlow
```

Konfigurasi MCP memerlukan LangFlow Desktop yang aktif serta akses ke endpoint project. Simpan API key di konfigurasi lokal yang tidak di-commit; jangan menaruh credential atau URL bertoken di README.

## Fitur

### Dashboard dan inventaris
- Ringkasan KPI stok, potensi nilai produk berisiko, kedaluwarsa, dan skor inventaris.
- Grafik stok dan penjualan estimasi per kategori serta distribusi status produk.
- Tabel produk dengan pencarian, filter kategori, status stok, ekspor CSV, dan penghapusan massal.
- Tambah produk satu per satu atau pindai faktur dengan OCR.
- Saat produk yang sama diterima dari faktur, jumlah stok digabung dan HPP dihitung dengan metode moving average.

### Chatbot analisis stok
- Mengirim konteks inventaris terbaru bersama setiap pertanyaan.
- Membantu memprioritaskan restock, menilai stok berlebih, dan meninjau risiko kedaluwarsa.
- Rekomendasi promo produk tetap tersedia sebagai alur tambahan.
- Menggunakan Gemini pada deployment online; mode lokal dapat menggunakan LangFlow terlebih dahulu dengan fallback ke Gemini.

### POS, pemasok, dan operasional
- POS dengan pencarian produk, input barcode, kategori, keranjang, dan pembayaran tunai, kartu, atau e-wallet.
- Ilustrasi produk pada katalog POS dan thumbnail pada keranjang.
- Pengurangan stok saat transaksi selesai, pratinjau struk, cetak, dan e-receipt.
- Data pemasok, Purchase Order, serta pengaitan produk ke pemasok untuk membantu proses pemesanan.
- Log aktivitas, pengaturan toko/printer, dan profil aplikasi.
- Navbar desktop dan navigasi bawah pada layar mobile; menu kasir dibatasi ke POS dan pengaturan printer.

## Demo

Buka [Smart Retail AI](https://smart-retail-ai-ten.vercel.app/) dan pilih akun demo pada halaman login.

| Username | Password | Akses |
|---|---|---|
| `pemilik` | `pemilik123` | Dashboard, POS, pemasok, log, pengaturan, dan profil |
| `kasir` | `kasir123` | POS dan pengaturan printer |

Akun demo ditujukan untuk mencoba antarmuka. Autentikasi dan pembatasan halaman berada di frontend, sehingga belum cocok untuk melindungi data sensitif pada penggunaan produksi.

## Menjalankan Secara Lokal

### Prasyarat
- Node.js 20.19+ atau 22.12+
- npm
- Gemini API key untuk chatbot dan OCR
- Opsional: LangFlow Desktop untuk mode AI lokal `langflow-first`

```bash
git clone https://github.com/Nannndaa5/Projeck-Hackhathon.git
cd Projeck-Hackhathon/umkm-dashboard
npm install
cp .env.example .env
```

Isi `GEMINI_API_KEY` pada `umkm-dashboard/.env`. Jangan gunakan prefix `VITE_` untuk secret karena variabel `VITE_` dimasukkan ke bundle browser.

```bash
npm run dev
```

Buka `http://localhost:5173`. Untuk pemeriksaan kode dan build:

```bash
npm run lint
npm run build
```

Konfigurasi LangFlow lokal menggunakan environment server `LANGFLOW_BASE_URL`, `LANGFLOW_FLOW_ID`, dan `LANGFLOW_API_KEY`; set `VITE_AI_MODE=langflow-first` bila ingin LangFlow dicoba sebelum Gemini. Secara default, `VITE_AI_MODE=gemini-only`.

## Environment Variables

| Nama | Digunakan oleh | Keterangan |
|---|---|---|
| `VITE_AI_MODE` | Frontend | `gemini-only` (default) atau `langflow-first`; bukan secret |
| `GEMINI_API_KEY` | API server | API key Gemini untuk chatbot dan OCR |
| `LANGFLOW_BASE_URL` | API server | URL server LangFlow, opsional |
| `LANGFLOW_FLOW_ID` | API server | ID flow LangFlow, opsional |
| `LANGFLOW_API_KEY` | API server | API key LangFlow, opsional |

Untuk Vercel, tambahkan `GEMINI_API_KEY` melalui pengaturan Environment Variables project. Nilai tanpa prefix `VITE_` hanya dibaca oleh fungsi server. Jangan commit file `.env` atau secret ke Git.

## Teknologi

- React 19, Vite 8, Tailwind CSS 4
- Recharts, Axios, dan Lucide React
- Vercel Functions untuk endpoint AI
- Google Gemini untuk chatbot dan ekstraksi OCR
- LangFlow sebagai opsi backend AI lokal
- IBM Bob sebagai AI coding assistant selama pengembangan (bukan dependency/runtime aplikasi)

## Struktur Project

```text
.
├── README.md
├── start.sh
├── docs/
└── umkm-dashboard/
    ├── api/                 # Endpoint Gemini, OCR, dan LangFlow
    ├── public/
    └── src/
        ├── components/      # Widget, tabel, kartu, chart, modal
        ├── config/          # Mode AI dan izin role
        ├── data/            # Data contoh produk, pemasok, dan CRM
        ├── hooks/           # State inventaris, pemasok, login, dan log
        ├── pages/           # Dashboard, POS, pemasok, pengaturan, dll.
        └── utils/           # KPI, akuntansi, dan pencarian pemasok
```

## Catatan Data dan Keamanan

- Data produk awal adalah data contoh yang ditentukan di aplikasi; state inventaris berjalan di sisi browser dan tidak disimpan sebagai database persisten.
- Chatbot menganalisis data inventaris yang diberikan aplikasi. Riwayat POS tidak digunakan sebagai tren penjualan historis.
- Login dan role demo merupakan kontrol antarmuka frontend, bukan sistem autentikasi produksi.
- API key Gemini dan LangFlow harus disimpan sebagai environment variable server, bukan di kode frontend.
