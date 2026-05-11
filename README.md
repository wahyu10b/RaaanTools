# RaaanTools

RaaanTools adalah web tools berbasis PHP untuk generator, downloader, dan utilitas ringan dengan sistem proxy API server-side.

## Fitur

- PHP router untuk Vercel.
- Proxy API server-side agar endpoint utama tidak ditulis langsung di frontend.
- Struktur halaman modular: generator, downloader, dan tools.
- UI responsive untuk penggunaan mobile.
- Siap deploy ke Vercel lewat GitHub auto deployment.

## Struktur Project

```txt
.
├─ index.php
├─ vercel.json
├─ api/
│  ├─ app.php
│  └─ index.php
├─ includes/
│  └─ env.php
├─ config/
│  └─ tools.js
├─ menu/
│  ├─ downloader/
│  ├─ generator/
│  └─ tools/
├─ asset/
├─ css/
├─ script/
└─ handle/

