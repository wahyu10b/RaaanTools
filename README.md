# Raaan Tools V7 PHP

Versi V7 dari struktur V6. Semua halaman utama/tool sudah memakai `index.php`, proxy API memakai PHP, request dilindungi token singkat dari script, service worker dipindah ke `script/sw.js`, dan struktur siap commit ke GitHub lalu deploy ke Vercel/hosting PHP.

## Fitur V7

- Root utama: `index.php`, bukan HTML.
- Semua halaman tool: `menu/{kategori}/{tool}/index.php`.
- API proxy: `api.php` dengan allowlist tool/endpoint.
- Token generator: frontend otomatis minta token via `api.php?action=token&tool=...` lalu token dikirim sebagai `raan_token`.
- ENV support: `.env` lokal dan ENV Vercel.
- 404 handler: `handle/404.php`.
- Service Worker: `script/sw.js`.
- File counter di halaman utama: total file, PHP, JS, CSS.
- Tailwind CDN aktif di semua halaman PHP, sambil tetap mempertahankan CSS lama agar UI v6 tidak hancur.
- Cache ringan proxy di `storage/cache`.
- Fallback cURL ke `file_get_contents` kalau cURL tidak aktif.

## Struktur

```txt
.
├─ index.php
├─ api.php
├─ vercel.json
├─ .env.example
├─ .htaccess
├─ handle/
│  └─ 404.php
├─ includes/
│  ├─ env.php
│  └─ tools.php
├─ script/
│  ├─ tool-page.js
│  ├─ savedata.js
│  └─ sw.js
├─ config/
│  └─ tools.js
├─ asset/
│  ├─ css/style.css
│  ├─ icon/logo.svg
│  └─ gambar/preview.svg
├─ css/
│  ├─ downloader/*.css
│  ├─ generator/*.css
│  └─ tools/*.css
├─ menu/
│  ├─ generator/{brat,bratvid}/index.php
│  ├─ downloader/{tiktok,instagram,facebook,x,capcut,ytmp3,ytmp4,mediafire,gdrive,github,npm,pinterest,reddit,lahelu}/index.php
│  └─ tools/{qrcode,removebg,ssweb,upscale}/index.php
└─ storage/cache/
```

## ENV

Copy `.env.example` ke `.env` untuk lokal. Di Vercel masukkan Environment Variables berikut:

```env
RAAAN_API_BASE=https://api.pixxxry.eu.cc
RAAAN_TOKEN_SECRET=isi-random-panjang
RAAAN_TOKEN_TTL=120
RAAAN_TIMEOUT_SECONDS=18
RAAAN_CACHE_SECONDS=25
```

`RAAAN_TOKEN_SECRET` wajib diganti saat production. Jangan pakai nilai contoh, nanti tokennya kayak pintu rumah tapi kuncinya digantung di gagang pintu, jir.

## Jalankan lokal

```bash
php -S localhost:8000
```

Buka:

```txt
http://localhost:8000
```

## Deploy GitHub → Vercel

1. Push folder ini ke repository GitHub.
2. Import repository ke Vercel.
3. Tambahkan ENV di Project Settings → Environment Variables.
4. Deploy.

Catatan: konfigurasi ini memakai runtime PHP komunitas `vercel-php`. Kalau Vercel menolak runtime, pakai hosting PHP biasa seperti cPanel/LiteSpeed/Apache/Nginx atau ubah proxy ke serverless JS. Source PHP-nya tetap aman buat GitHub.

## Endpoint API

Token:

```txt
GET /api.php?action=token&tool=tiktok
```

Request tool:

```txt
GET /api.php?tool=tiktok&url=https://...&raan_token=TOKEN
POST /api.php?tool=tiktok&raan_token=TOKEN
```

Kalau tool tidak ada, API mengembalikan `404` JSON dengan daftar tool tersedia.
