<?php
$root = __DIR__;
$rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS));
$totalFiles = 0; $phpFiles = 0; $jsFiles = 0; $cssFiles = 0;
foreach ($rii as $file) {
    if (!$file->isFile()) continue;
    $path = $file->getPathname();
    if (str_contains($path, DIRECTORY_SEPARATOR . '.git' . DIRECTORY_SEPARATOR) || str_contains($path, DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR)) continue;
    $totalFiles++;
    $ext = strtolower($file->getExtension());
    if ($ext === 'php') $phpFiles++;
    if ($ext === 'js') $jsFiles++;
    if ($ext === 'css') $cssFiles++;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover, user-scalable=no" />
    <title>Raaan Tools</title>
    <meta name="description" content="Raaan Tools - kumpulan downloader, generator, dan tools Pixxxry dengan UI neobrutalism." />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="asset/css/style.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={darkMode:'class',theme:{extend:{fontFamily:{space:['Space Grotesk','system-ui','sans-serif']}}}}</script>
</head>
<body>
    <script src="asset/script/config.js"></script>
    <div class="shell">
        <div class="app" id="appRoot">
            <header class="topbar">
                <div class="brand">
                    <div class="bolt"><i class="fa-solid fa-r"></i></div>
                    <div class="brand-text"><span class="brand-raaan brand-title-main">Raaan</span><span class="brand-gen brand-title-sub">Tools</span></div>
                </div>
                <div class="header-controls"><button class="dark-toggle" id="darkToggle" title="Mode Gelap/Terang"><i class="fa-solid fa-moon"></i></button></div>
            </header>
            <main class="content-grid">
                <section class="panel reveal visible">
                    <div class="section-title"><i class="fa-solid fa-toolbox"></i> Pilih Tools</div>
                    <p style="margin-top:8px;font-size:.82rem;font-weight:800;color:var(--ink-soft);line-height:1.45;">Pilih tool yang mau dipakai. Semua halaman tool sudah berubah ke <b>PHP V7</b>, API pakai token, SW ada di folder script, dan struktur siap GitHub/Vercel.</p>
                    <div class="grid grid-cols-2 gap-2 mt-4 text-xs font-black uppercase">
                        <div class="rounded-xl border-2 border-black bg-white/80 p-3 shadow-[3px_3px_0_#111]">File<br><span class="text-lg"><?= number_format($totalFiles) ?></span></div>
                        <div class="rounded-xl border-2 border-black bg-white/80 p-3 shadow-[3px_3px_0_#111]">PHP<br><span class="text-lg"><?= number_format($phpFiles) ?></span></div>
                        <div class="rounded-xl border-2 border-black bg-white/80 p-3 shadow-[3px_3px_0_#111]">JS<br><span class="text-lg"><?= number_format($jsFiles) ?></span></div>
                        <div class="rounded-xl border-2 border-black bg-white/80 p-3 shadow-[3px_3px_0_#111]">CSS<br><span class="text-lg"><?= number_format($cssFiles) ?></span></div>
                    </div>
                </section>
                <section class="panel reveal visible"><div class="section-title"><i class="fa-solid fa-layer-group"></i> Generator</div><div class="home-grid"><a class="home-card" href="menu/generator/brat/">
            <div class="tool-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
            <div class="tool-info"><strong>BRAT Generator</strong><span>Buat gambar gaya Brat dari teks</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a><a class="home-card" href="menu/generator/bratvid/">
            <div class="tool-icon"><i class="fa-solid fa-film"></i></div>
            <div class="tool-info"><strong>BRAT Video</strong><span>Buat video singkat gaya Brat</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a></div></section><section class="panel reveal visible"><div class="section-title"><i class="fa-solid fa-layer-group"></i> Downloader</div><div class="home-grid"><a class="home-card" href="menu/downloader/tiktok/">
            <div class="tool-icon"><i class="fa-brands fa-tiktok"></i></div>
            <div class="tool-info"><strong>TikTok</strong><span>Download video, audio, dan slide TikTok</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a><a class="home-card" href="menu/downloader/instagram/">
            <div class="tool-icon"><i class="fa-brands fa-instagram"></i></div>
            <div class="tool-info"><strong>Instagram</strong><span>Download Reels, foto, dan carousel Instagram</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a><a class="home-card" href="menu/downloader/facebook/">
            <div class="tool-icon"><i class="fa-brands fa-facebook"></i></div>
            <div class="tool-info"><strong>Facebook</strong><span>Download video Facebook</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a><a class="home-card" href="menu/downloader/x/">
            <div class="tool-icon"><i class="fa-brands fa-x-twitter"></i></div>
            <div class="tool-info"><strong>X / Twitter</strong><span>Download foto/video X</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a><a class="home-card" href="menu/downloader/capcut/">
            <div class="tool-icon"><i class="fa-solid fa-clapperboard"></i></div>
            <div class="tool-info"><strong>CapCut</strong><span>Ambil video dan data template CapCut</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a><a class="home-card" href="menu/downloader/ytmp3/">
            <div class="tool-icon"><i class="fa-solid fa-music"></i></div>
            <div class="tool-info"><strong>YouTube MP3</strong><span>Download audio MP3 YouTube</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a><a class="home-card" href="menu/downloader/ytmp4/">
            <div class="tool-icon"><i class="fa-solid fa-video"></i></div>
            <div class="tool-info"><strong>YouTube MP4</strong><span>Download video MP4 YouTube</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a><a class="home-card" href="menu/downloader/mediafire/">
            <div class="tool-icon"><i class="fa-solid fa-file-zipper"></i></div>
            <div class="tool-info"><strong>MediaFire</strong><span>Ambil direct download MediaFire</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a><a class="home-card" href="menu/downloader/gdrive/">
            <div class="tool-icon"><i class="fa-brands fa-google-drive"></i></div>
            <div class="tool-info"><strong>Google Drive</strong><span>Ambil direct download Google Drive</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a><a class="home-card" href="menu/downloader/github/">
            <div class="tool-icon"><i class="fa-brands fa-github"></i></div>
            <div class="tool-info"><strong>GitHub</strong><span>Download repository GitHub ZIP</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a><a class="home-card" href="menu/downloader/npm/">
            <div class="tool-icon"><i class="fa-brands fa-npm"></i></div>
            <div class="tool-info"><strong>NPM</strong><span>Ambil metadata dan tarball package NPM</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a><a class="home-card" href="menu/downloader/pinterest/">
            <div class="tool-icon"><i class="fa-brands fa-pinterest"></i></div>
            <div class="tool-info"><strong>Pinterest</strong><span>Download video/gambar Pinterest</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a><a class="home-card" href="menu/downloader/reddit/">
            <div class="tool-icon"><i class="fa-brands fa-reddit"></i></div>
            <div class="tool-info"><strong>Reddit</strong><span>Download media Reddit</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a><a class="home-card" href="menu/downloader/lahelu/">
            <div class="tool-icon"><i class="fa-solid fa-face-grin-squint-tears"></i></div>
            <div class="tool-info"><strong>Lahelu</strong><span>Download media Lahelu</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a></div></section><section class="panel reveal visible"><div class="section-title"><i class="fa-solid fa-layer-group"></i> Tools</div><div class="home-grid"><a class="home-card" href="menu/tools/qrcode/">
            <div class="tool-icon"><i class="fa-solid fa-qrcode"></i></div>
            <div class="tool-info"><strong>QR Code</strong><span>Buat QR Code PNG</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a><a class="home-card" href="menu/tools/removebg/">
            <div class="tool-icon"><i class="fa-solid fa-scissors"></i></div>
            <div class="tool-info"><strong>RemoveBG</strong><span>Hapus background gambar</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a><a class="home-card" href="menu/tools/ssweb/">
            <div class="tool-icon"><i class="fa-solid fa-display"></i></div>
            <div class="tool-info"><strong>SS Web</strong><span>Screenshot website</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a><a class="home-card" href="menu/tools/upscale/">
            <div class="tool-icon"><i class="fa-solid fa-up-right-and-down-left-from-center"></i></div>
            <div class="tool-info"><strong>Upscale</strong><span>Tingkatkan kualitas gambar</span></div>
            <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
        </a></div></section>
            </main>
        </div>
    </div>
    <footer class="footer">RAAAN TOOLS © 2026 • RAAAN</footer>
    <script>
        const darkToggle = document.getElementById('darkToggle');
        function applyDark(mode) { document.body.classList.toggle('dark', mode); darkToggle.innerHTML = mode ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>'; localStorage.setItem('raaan-dark', mode ? '1' : '0'); }
        applyDark(localStorage.getItem('raaan-dark') === '1');
        darkToggle.addEventListener('click', () => applyDark(!document.body.classList.contains('dark')));
        if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('script/sw.js').catch(()=>{});
    </script>
</body>
</html>