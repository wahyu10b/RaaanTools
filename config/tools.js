const RAAAN_CONFIG = {
  "apiDirectBase": "",
  "publicBaseLabel": "Raaan Tools",
  "useProxy": true,
  "proxyBase": "/api",
  "network": {
    "mode": "proxy-first",
    "timeoutMs": 14000,
    "statusTimeoutMs": 6500,
    "statusCacheMs": 45000,
    "maxConcurrent": 3,
    "retry": 1,
    "fallbackDirect": false
  },
  "menus": [
    {
      "key": "brat",
      "label": "BRAT Generator",
      "icon": "fa-wand-magic-sparkles",
      "desc": "Buat gambar gaya Brat dari teks",
      "category": "Generator",
      "file": "menu/generator/brat/"
    },
    {
      "key": "bratvid",
      "label": "BRAT Video",
      "icon": "fa-film",
      "desc": "Buat video singkat gaya Brat",
      "category": "Generator",
      "file": "menu/generator/bratvid/"
    },
    {
      "key": "tiktok",
      "label": "TikTok",
      "icon": "fa-tiktok",
      "desc": "Download video, audio, dan slide TikTok",
      "category": "Downloader",
      "file": "menu/downloader/tiktok/"
    },
    {
      "key": "instagram",
      "label": "Instagram",
      "icon": "fa-instagram",
      "desc": "Download Reels, foto, dan carousel Instagram",
      "category": "Downloader",
      "file": "menu/downloader/instagram/"
    },
    {
      "key": "facebook",
      "label": "Facebook",
      "icon": "fa-facebook",
      "desc": "Download video Facebook",
      "category": "Downloader",
      "file": "menu/downloader/facebook/"
    },
    {
      "key": "x",
      "label": "X / Twitter",
      "icon": "fa-x-twitter",
      "desc": "Download foto/video X",
      "category": "Downloader",
      "file": "menu/downloader/x/"
    },
    {
      "key": "capcut",
      "label": "CapCut",
      "icon": "fa-clapperboard",
      "desc": "Ambil video dan data template CapCut",
      "category": "Downloader",
      "file": "menu/downloader/capcut/"
    },
    {
      "key": "ytmp3",
      "label": "YouTube MP3",
      "icon": "fa-music",
      "desc": "Download audio MP3 YouTube",
      "category": "Downloader",
      "file": "menu/downloader/ytmp3/"
    },
    {
      "key": "ytmp4",
      "label": "YouTube MP4",
      "icon": "fa-video",
      "desc": "Download video MP4 YouTube",
      "category": "Downloader",
      "file": "menu/downloader/ytmp4/"
    },
    {
      "key": "mediafire",
      "label": "MediaFire",
      "icon": "fa-file-zipper",
      "desc": "Ambil direct download MediaFire",
      "category": "Downloader",
      "file": "menu/downloader/mediafire/"
    },
    {
      "key": "gdrive",
      "label": "Google Drive",
      "icon": "fa-google-drive",
      "desc": "Ambil direct download Google Drive",
      "category": "Downloader",
      "file": "menu/downloader/gdrive/"
    },
    {
      "key": "github",
      "label": "GitHub",
      "icon": "fa-github",
      "desc": "Download repository GitHub ZIP",
      "category": "Downloader",
      "file": "menu/downloader/github/"
    },
    {
      "key": "npm",
      "label": "NPM",
      "icon": "fa-npm",
      "desc": "Ambil metadata dan tarball package NPM",
      "category": "Downloader",
      "file": "menu/downloader/npm/"
    },
    {
      "key": "pinterest",
      "label": "Pinterest",
      "icon": "fa-pinterest",
      "desc": "Download video/gambar Pinterest",
      "category": "Downloader",
      "file": "menu/downloader/pinterest/"
    },
    {
      "key": "reddit",
      "label": "Reddit",
      "icon": "fa-reddit",
      "desc": "Download media Reddit",
      "category": "Downloader",
      "file": "menu/downloader/reddit/"
    },
    {
      "key": "lahelu",
      "label": "Lahelu",
      "icon": "fa-face-grin-squint-tears",
      "desc": "Download media Lahelu",
      "category": "Downloader",
      "file": "menu/downloader/lahelu/"
    },
    {
      "key": "qrcode",
      "label": "QR Code",
      "icon": "fa-qrcode",
      "desc": "Buat QR Code PNG",
      "category": "Tools",
      "file": "menu/tools/qrcode/"
    },
    {
      "key": "removebg",
      "label": "RemoveBG",
      "icon": "fa-scissors",
      "desc": "Hapus background gambar",
      "category": "Tools",
      "file": "menu/tools/removebg/"
    },
    {
      "key": "ssweb",
      "label": "SS Web",
      "icon": "fa-display",
      "desc": "Screenshot website",
      "category": "Tools",
      "file": "menu/tools/ssweb/"
    },
    {
      "key": "upscale",
      "label": "Upscale",
      "icon": "fa-up-right-and-down-left-from-center",
      "desc": "Tingkatkan kualitas gambar",
      "category": "Tools",
      "file": "menu/tools/upscale/"
    }
  ],
  "tools": {
    "brat": {
      "key": "brat",
      "label": "BRAT Generator",
      "short": "BRAT",
      "icon": "fa-wand-magic-sparkles",
      "brandIcon": "fa-solid fa-r",
      "accent": "#ffd84f",
      "category": "Generator",
      "endpoint": "/sticker/brat",
      "param": "text",
      "placeholder": "Ketik teks brat di sini...",
      "button": "GENERATE",
      "kind": "image-blob",
      "sample": "hello world 🍏",
      "desc": "Buat gambar gaya Brat dari teks",
      "defaults": {},
      "file": "menu/generator/brat/",
      "tutorials": [
        {
          "icon": "fa-keyboard",
          "title": "Masukkan Teks",
          "desc": "Tulis kalimat yang ingin dijadikan hasil generator."
        },
        {
          "icon": "fa-wand-magic-sparkles",
          "title": "Generate",
          "desc": "Tekan tombol utama dan tunggu proses render selesai."
        },
        {
          "icon": "fa-file-arrow-down",
          "title": "Simpan Hasil",
          "desc": "Preview hasil lalu unduh ke perangkat."
        }
      ]
    },
    "bratvid": {
      "key": "bratvid",
      "label": "BRAT Video",
      "short": "BRAT VIDEO",
      "icon": "fa-film",
      "brandIcon": "fa-solid fa-film",
      "accent": "#b6ff00",
      "category": "Generator",
      "endpoint": "/sticker/bratvid",
      "param": "text",
      "placeholder": "Ketik teks brat video di sini...",
      "button": "GENERATE",
      "kind": "video-blob",
      "sample": "brat summer 🍏",
      "desc": "Buat video singkat gaya Brat",
      "defaults": {},
      "file": "menu/generator/bratvid/",
      "tutorials": [
        {
          "icon": "fa-keyboard",
          "title": "Masukkan Teks",
          "desc": "Tulis kalimat yang ingin dijadikan hasil generator."
        },
        {
          "icon": "fa-wand-magic-sparkles",
          "title": "Generate",
          "desc": "Tekan tombol utama dan tunggu proses render selesai."
        },
        {
          "icon": "fa-file-arrow-down",
          "title": "Simpan Hasil",
          "desc": "Preview hasil lalu unduh ke perangkat."
        }
      ]
    },
    "tiktok": {
      "key": "tiktok",
      "label": "TikTok",
      "short": "TT TOOLS",
      "icon": "fa-tiktok",
      "brandIcon": "fa-brands fa-tiktok",
      "accent": "#00f2fe",
      "category": "Downloader",
      "endpoint": "/download/tiktok",
      "param": "url",
      "placeholder": "Tempel link TikTok di sini... Bisa lebih dari 1 link, pisahkan spasi",
      "button": "CARI DATA",
      "kind": "tiktok",
      "sample": "https://vt.tiktok.com/ZS9nU23ag/",
      "desc": "Download video, audio, dan slide TikTok",
      "defaults": {},
      "file": "menu/downloader/tiktok/",
      "tutorials": [
        {
          "icon": "fa-link",
          "title": "Salin Link TikTok",
          "desc": "Copy link dari aplikasi TikTok yang ingin diambil."
        },
        {
          "icon": "fa-paste",
          "title": "Tempel Link",
          "desc": "Tempel di kolom input. Untuk banyak link, pisahkan pakai spasi."
        },
        {
          "icon": "fa-download",
          "title": "Pilih Hasil",
          "desc": "Preview media muncul sebagai UI, lalu unduh video, audio, atau gambar."
        }
      ]
    },
    "instagram": {
      "key": "instagram",
      "label": "Instagram",
      "short": "IG TOOLS",
      "icon": "fa-instagram",
      "brandIcon": "fa-brands fa-instagram",
      "accent": "#e1306c",
      "category": "Downloader",
      "endpoint": "/download/instagram",
      "param": "url",
      "placeholder": "Tempel link Instagram di sini... Bisa lebih dari 1 link, pisahkan spasi",
      "button": "CARI DATA",
      "kind": "instagram",
      "sample": "https://www.instagram.com/reel/DYB_bAlJ8fS/",
      "desc": "Download Reels, foto, dan carousel Instagram",
      "defaults": {},
      "file": "menu/downloader/instagram/",
      "tutorials": [
        {
          "icon": "fa-link",
          "title": "Salin Link Instagram",
          "desc": "Copy link dari aplikasi Instagram yang ingin diambil."
        },
        {
          "icon": "fa-paste",
          "title": "Tempel Link",
          "desc": "Tempel di kolom input. Untuk banyak link, pisahkan pakai spasi."
        },
        {
          "icon": "fa-download",
          "title": "Pilih Hasil",
          "desc": "Preview media muncul sebagai UI, lalu unduh video, audio, atau gambar."
        }
      ]
    },
    "facebook": {
      "key": "facebook",
      "label": "Facebook",
      "short": "FB TOOLS",
      "icon": "fa-facebook",
      "brandIcon": "fa-brands fa-facebook",
      "accent": "#1877f2",
      "category": "Downloader",
      "endpoint": "/download/facebook",
      "param": "url",
      "placeholder": "Tempel link Facebook video di sini...",
      "button": "CARI DATA",
      "kind": "facebook",
      "sample": "https://www.facebook.com/share/v/14kH39imd1h/",
      "desc": "Download video Facebook",
      "defaults": {},
      "file": "menu/downloader/facebook/",
      "tutorials": [
        {
          "icon": "fa-link",
          "title": "Salin Link",
          "desc": "Copy link konten dari platform yang sesuai."
        },
        {
          "icon": "fa-bolt",
          "title": "Eksekusi",
          "desc": "Tunggu sampai preview dan tombol aksi muncul."
        },
        {
          "icon": "fa-download",
          "title": "Ambil Media",
          "desc": "Unduh media dari tombol yang tersedia."
        }
      ]
    },
    "x": {
      "key": "x",
      "label": "X / Twitter",
      "short": "X TOOLS",
      "icon": "fa-x-twitter",
      "brandIcon": "fa-brands fa-x-twitter",
      "accent": "#111111",
      "category": "Downloader",
      "endpoint": "/download/x",
      "param": "url",
      "placeholder": "Tempel link X/Twitter di sini...",
      "button": "CARI DATA",
      "kind": "x",
      "sample": "https://x.com/igus_ai/status/2052203246224343188?s=20",
      "desc": "Download foto/video X",
      "defaults": {},
      "file": "menu/downloader/x/",
      "tutorials": [
        {
          "icon": "fa-link",
          "title": "Salin Link",
          "desc": "Copy link konten dari platform yang sesuai."
        },
        {
          "icon": "fa-bolt",
          "title": "Eksekusi",
          "desc": "Tunggu sampai preview dan tombol aksi muncul."
        },
        {
          "icon": "fa-download",
          "title": "Ambil Media",
          "desc": "Unduh media dari tombol yang tersedia."
        }
      ]
    },
    "capcut": {
      "key": "capcut",
      "label": "CapCut",
      "short": "CAPCUT",
      "icon": "fa-clapperboard",
      "brandIcon": "fa-solid fa-clapperboard",
      "accent": "#00d5c8",
      "category": "Downloader",
      "endpoint": "/download/capcut",
      "param": "url",
      "placeholder": "Tempel link template CapCut di sini...",
      "button": "CARI DATA",
      "kind": "capcut",
      "sample": "https://www.capcut.com/tv2/ZTkvAuyuK/",
      "desc": "Ambil video dan data template CapCut",
      "defaults": {},
      "file": "menu/downloader/capcut/",
      "tutorials": [
        {
          "icon": "fa-link",
          "title": "Salin Link",
          "desc": "Copy link konten dari platform yang sesuai."
        },
        {
          "icon": "fa-bolt",
          "title": "Eksekusi",
          "desc": "Tunggu sampai preview dan tombol aksi muncul."
        },
        {
          "icon": "fa-download",
          "title": "Ambil Media",
          "desc": "Unduh media dari tombol yang tersedia."
        }
      ]
    },
    "ytmp3": {
      "key": "ytmp3",
      "label": "YouTube MP3",
      "short": "YT MP3",
      "icon": "fa-music",
      "brandIcon": "fa-brands fa-youtube",
      "accent": "#ff0033",
      "category": "Downloader",
      "endpoint": "/download/ytmp3",
      "param": "url",
      "placeholder": "Tempel link YouTube atau judul lagu di sini...",
      "button": "CARI DATA",
      "kind": "ytmp3",
      "sample": "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
      "desc": "Download audio MP3 YouTube",
      "defaults": {},
      "file": "menu/downloader/ytmp3/",
      "tutorials": [
        {
          "icon": "fa-youtube",
          "title": "Masukkan Link/Judul",
          "desc": "Tempel link YouTube atau ketik judul yang ingin dicari."
        },
        {
          "icon": "fa-bolt",
          "title": "Cari Data",
          "desc": "Tekan tombol utama dan tunggu daftar kualitas muncul."
        },
        {
          "icon": "fa-download",
          "title": "Unduh Format",
          "desc": "Pilih format audio/video yang tersedia di kartu hasil."
        }
      ]
    },
    "ytmp4": {
      "key": "ytmp4",
      "label": "YouTube MP4",
      "short": "YT MP4",
      "icon": "fa-video",
      "brandIcon": "fa-brands fa-youtube",
      "accent": "#ff0033",
      "category": "Downloader",
      "endpoint": "/download/ytmp4",
      "param": "url",
      "placeholder": "Tempel link YouTube atau judul video di sini...",
      "button": "CARI DATA",
      "kind": "ytmp4",
      "sample": "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
      "desc": "Download video MP4 YouTube",
      "defaults": {},
      "file": "menu/downloader/ytmp4/",
      "tutorials": [
        {
          "icon": "fa-youtube",
          "title": "Masukkan Link/Judul",
          "desc": "Tempel link YouTube atau ketik judul yang ingin dicari."
        },
        {
          "icon": "fa-bolt",
          "title": "Cari Data",
          "desc": "Tekan tombol utama dan tunggu daftar kualitas muncul."
        },
        {
          "icon": "fa-download",
          "title": "Unduh Format",
          "desc": "Pilih format audio/video yang tersedia di kartu hasil."
        }
      ]
    },
    "mediafire": {
      "key": "mediafire",
      "label": "MediaFire",
      "short": "MEDIAFIRE",
      "icon": "fa-file-zipper",
      "brandIcon": "fa-solid fa-file-zipper",
      "accent": "#1299f3",
      "category": "Downloader",
      "endpoint": "/download/mediafire",
      "param": "url",
      "placeholder": "Tempel link MediaFire di sini...",
      "button": "CARI DATA",
      "kind": "file",
      "sample": "https://www.mediafire.com/file/jirq5112on17zuj/Velinia.zip/file",
      "desc": "Ambil direct download MediaFire",
      "defaults": {},
      "file": "menu/downloader/mediafire/",
      "tutorials": [
        {
          "icon": "fa-file",
          "title": "Masukkan Target",
          "desc": "Tempel link file/repo atau nama package sesuai tool."
        },
        {
          "icon": "fa-bolt",
          "title": "Ambil Data",
          "desc": "Sistem akan mengambil metadata dan direct link."
        },
        {
          "icon": "fa-download",
          "title": "Unduh File",
          "desc": "Gunakan tombol unduh atau buka sumber dari kartu hasil."
        }
      ]
    },
    "gdrive": {
      "key": "gdrive",
      "label": "Google Drive",
      "short": "GDRIVE",
      "icon": "fa-google-drive",
      "brandIcon": "fa-brands fa-google-drive",
      "accent": "#34a853",
      "category": "Downloader",
      "endpoint": "/download/gdrive",
      "param": "url",
      "placeholder": "Tempel link Google Drive publik di sini...",
      "button": "CARI DATA",
      "kind": "file",
      "sample": "https://drive.google.com/file/d/1_T_B9qEwT6_1_V_I_D_E_I_D_E_R_1_2_3/view",
      "desc": "Ambil direct download Google Drive",
      "defaults": {},
      "file": "menu/downloader/gdrive/",
      "tutorials": [
        {
          "icon": "fa-file",
          "title": "Masukkan Target",
          "desc": "Tempel link file/repo atau nama package sesuai tool."
        },
        {
          "icon": "fa-bolt",
          "title": "Ambil Data",
          "desc": "Sistem akan mengambil metadata dan direct link."
        },
        {
          "icon": "fa-download",
          "title": "Unduh File",
          "desc": "Gunakan tombol unduh atau buka sumber dari kartu hasil."
        }
      ]
    },
    "github": {
      "key": "github",
      "label": "GitHub",
      "short": "GITHUB",
      "icon": "fa-github",
      "brandIcon": "fa-brands fa-github",
      "accent": "#111111",
      "category": "Downloader",
      "endpoint": "/download/github",
      "param": "url",
      "placeholder": "Tempel link repository GitHub di sini...",
      "button": "CARI DATA",
      "kind": "file",
      "sample": "https://github.com/antirez/ds4",
      "desc": "Download repository GitHub ZIP",
      "defaults": {},
      "file": "menu/downloader/github/",
      "tutorials": [
        {
          "icon": "fa-file",
          "title": "Masukkan Target",
          "desc": "Tempel link file/repo atau nama package sesuai tool."
        },
        {
          "icon": "fa-bolt",
          "title": "Ambil Data",
          "desc": "Sistem akan mengambil metadata dan direct link."
        },
        {
          "icon": "fa-download",
          "title": "Unduh File",
          "desc": "Gunakan tombol unduh atau buka sumber dari kartu hasil."
        }
      ]
    },
    "npm": {
      "key": "npm",
      "label": "NPM",
      "short": "NPM",
      "icon": "fa-npm",
      "brandIcon": "fa-brands fa-npm",
      "accent": "#cb3837",
      "category": "Downloader",
      "endpoint": "/download/npm",
      "param": "package",
      "placeholder": "Ketik nama package NPM, contoh: axios",
      "button": "CARI DATA",
      "kind": "file",
      "sample": "axios",
      "desc": "Ambil metadata dan tarball package NPM",
      "defaults": {},
      "file": "menu/downloader/npm/",
      "tutorials": [
        {
          "icon": "fa-file",
          "title": "Masukkan Target",
          "desc": "Tempel link file/repo atau nama package sesuai tool."
        },
        {
          "icon": "fa-bolt",
          "title": "Ambil Data",
          "desc": "Sistem akan mengambil metadata dan direct link."
        },
        {
          "icon": "fa-download",
          "title": "Unduh File",
          "desc": "Gunakan tombol unduh atau buka sumber dari kartu hasil."
        }
      ]
    },
    "pinterest": {
      "key": "pinterest",
      "label": "Pinterest",
      "short": "PINTEREST",
      "icon": "fa-pinterest",
      "brandIcon": "fa-brands fa-pinterest",
      "accent": "#e60023",
      "category": "Downloader",
      "endpoint": "/download/pinterest",
      "param": "url",
      "placeholder": "Tempel link Pinterest/pin.it di sini...",
      "button": "CARI DATA",
      "kind": "pinterest",
      "sample": "https://pin.it/lOPdveAO7",
      "desc": "Download video/gambar Pinterest",
      "defaults": {},
      "file": "menu/downloader/pinterest/",
      "tutorials": [
        {
          "icon": "fa-link",
          "title": "Salin Link",
          "desc": "Copy link konten dari platform yang sesuai."
        },
        {
          "icon": "fa-bolt",
          "title": "Eksekusi",
          "desc": "Tunggu sampai preview dan tombol aksi muncul."
        },
        {
          "icon": "fa-download",
          "title": "Ambil Media",
          "desc": "Unduh media dari tombol yang tersedia."
        }
      ]
    },
    "reddit": {
      "key": "reddit",
      "label": "Reddit",
      "short": "REDDIT",
      "icon": "fa-reddit",
      "brandIcon": "fa-brands fa-reddit",
      "accent": "#ff4500",
      "category": "Downloader",
      "endpoint": "/download/reddit",
      "param": "url",
      "placeholder": "Tempel link post Reddit di sini...",
      "button": "CARI DATA",
      "kind": "reddit",
      "sample": "https://www.reddit.com/r/bald/comments/1t8241c/pulled_the_trigger_is_it_working/",
      "desc": "Download media Reddit",
      "defaults": {},
      "file": "menu/downloader/reddit/",
      "tutorials": [
        {
          "icon": "fa-link",
          "title": "Salin Link",
          "desc": "Copy link konten dari platform yang sesuai."
        },
        {
          "icon": "fa-bolt",
          "title": "Eksekusi",
          "desc": "Tunggu sampai preview dan tombol aksi muncul."
        },
        {
          "icon": "fa-download",
          "title": "Ambil Media",
          "desc": "Unduh media dari tombol yang tersedia."
        }
      ]
    },
    "lahelu": {
      "key": "lahelu",
      "label": "Lahelu",
      "short": "LAHELU",
      "icon": "fa-face-grin-squint-tears",
      "brandIcon": "fa-solid fa-face-grin-squint-tears",
      "accent": "#ffcc00",
      "category": "Downloader",
      "endpoint": "/download/lahelu",
      "param": "url",
      "placeholder": "Tempel link post Lahelu di sini...",
      "button": "CARI DATA",
      "kind": "media-list",
      "sample": "https://lahelu.com/post/p/7R8mQ5J0",
      "desc": "Download media Lahelu",
      "defaults": {},
      "file": "menu/downloader/lahelu/",
      "tutorials": [
        {
          "icon": "fa-link",
          "title": "Salin Link",
          "desc": "Copy link konten dari platform yang sesuai."
        },
        {
          "icon": "fa-bolt",
          "title": "Eksekusi",
          "desc": "Tunggu sampai preview dan tombol aksi muncul."
        },
        {
          "icon": "fa-download",
          "title": "Ambil Media",
          "desc": "Unduh media dari tombol yang tersedia."
        }
      ]
    },
    "qrcode": {
      "key": "qrcode",
      "label": "QR Code",
      "short": "QR CODE",
      "icon": "fa-qrcode",
      "brandIcon": "fa-solid fa-qrcode",
      "accent": "#2f67ff",
      "category": "Tools",
      "endpoint": "/tools/qrcode",
      "param": "text",
      "placeholder": "Masukkan teks atau URL untuk dibuat QR...",
      "button": "EKSEKUSI",
      "kind": "image-blob",
      "sample": "https://api.pixxxry.eu.cc",
      "desc": "Buat QR Code PNG",
      "defaults": {
        "format": "png"
      },
      "file": "menu/tools/qrcode/",
      "tutorials": [
        {
          "icon": "fa-pen-to-square",
          "title": "Isi Input",
          "desc": "Masukkan URL/teks sesuai kebutuhan tool."
        },
        {
          "icon": "fa-bolt",
          "title": "Eksekusi",
          "desc": "Sistem memproses dan menampilkan hasil sebagai UI."
        },
        {
          "icon": "fa-download",
          "title": "Ambil Hasil",
          "desc": "Unduh, buka, atau salin hasil dari kartu hasil."
        }
      ]
    },
    "removebg": {
      "key": "removebg",
      "label": "RemoveBG",
      "short": "REMOVE BG",
      "icon": "fa-scissors",
      "brandIcon": "fa-solid fa-scissors",
      "accent": "#8b5cf6",
      "category": "Tools",
      "endpoint": "/tools/removebg",
      "param": "url",
      "placeholder": "Tempel URL gambar untuk hapus background...",
      "button": "EKSEKUSI",
      "kind": "image-blob",
      "sample": "https://files.catbox.moe/ozfwom.jpg",
      "desc": "Hapus background gambar",
      "defaults": {},
      "file": "menu/tools/removebg/",
      "tutorials": [
        {
          "icon": "fa-pen-to-square",
          "title": "Isi Input",
          "desc": "Masukkan URL/teks sesuai kebutuhan tool."
        },
        {
          "icon": "fa-bolt",
          "title": "Eksekusi",
          "desc": "Sistem memproses dan menampilkan hasil sebagai UI."
        },
        {
          "icon": "fa-download",
          "title": "Ambil Hasil",
          "desc": "Unduh, buka, atau salin hasil dari kartu hasil."
        }
      ]
    },
    "ssweb": {
      "key": "ssweb",
      "label": "SS Web",
      "short": "SS WEB",
      "icon": "fa-display",
      "brandIcon": "fa-solid fa-display",
      "accent": "#06b6d4",
      "category": "Tools",
      "endpoint": "/tools/ssweb",
      "param": "url",
      "placeholder": "Tempel URL website untuk screenshot...",
      "button": "EKSEKUSI",
      "kind": "image-blob",
      "sample": "https://api.pixxxry.eu.cc",
      "desc": "Screenshot website",
      "defaults": {
        "type": "desktop",
        "full": "false"
      },
      "file": "menu/tools/ssweb/",
      "tutorials": [
        {
          "icon": "fa-pen-to-square",
          "title": "Isi Input",
          "desc": "Masukkan URL/teks sesuai kebutuhan tool."
        },
        {
          "icon": "fa-bolt",
          "title": "Eksekusi",
          "desc": "Sistem memproses dan menampilkan hasil sebagai UI."
        },
        {
          "icon": "fa-download",
          "title": "Ambil Hasil",
          "desc": "Unduh, buka, atau salin hasil dari kartu hasil."
        }
      ]
    },
    "upscale": {
      "key": "upscale",
      "label": "Upscale",
      "short": "UPSCALE",
      "icon": "fa-up-right-and-down-left-from-center",
      "brandIcon": "fa-solid fa-up-right-and-down-left-from-center",
      "accent": "#2fbc63",
      "category": "Tools",
      "endpoint": "/tools/upscale",
      "param": "url",
      "placeholder": "Tempel URL gambar untuk upscale...",
      "button": "EKSEKUSI",
      "kind": "image-blob",
      "sample": "https://files.catbox.moe/ozfwom.jpg",
      "desc": "Tingkatkan kualitas gambar",
      "defaults": {
        "scale": "2"
      },
      "file": "menu/tools/upscale/",
      "tutorials": [
        {
          "icon": "fa-pen-to-square",
          "title": "Isi Input",
          "desc": "Masukkan URL/teks sesuai kebutuhan tool."
        },
        {
          "icon": "fa-bolt",
          "title": "Eksekusi",
          "desc": "Sistem memproses dan menampilkan hasil sebagai UI."
        },
        {
          "icon": "fa-download",
          "title": "Ambil Hasil",
          "desc": "Unduh, buka, atau salin hasil dari kartu hasil."
        }
      ]
    }
  }
};
