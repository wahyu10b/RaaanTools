<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover, user-scalable=no" />
    <title>Google Drive • Raaan Tools</title>
    <meta name="description" content="Raaan Tools - Ambil direct download Google Drive" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../../../asset/css/style.css">
    <link rel="stylesheet" href="../../../css/downloader/gdrive.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={darkMode:'class',theme:{extend:{fontFamily:{space:['Space Grotesk','system-ui','sans-serif']}}}}</script>
</head>

<body data-tool-key="gdrive">
    <script>window.RAAAN_ROOT_PREFIX = "../../../";</script>
    <script src="../../../asset/script/config.js"></script>
    <script src="../../../asset/script/savedata.js"></script>

    <div class="global-loader" id="globalLoader">
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <div class="loader-text">Memuat...</div>
        </div>
    </div>

    <div class="download-notification" id="downloadNotification">
        <div class="notif-card">
            <div class="notif-icon" id="notifIcon"></div>
            <div class="notif-title" id="notifTitle"></div>
            <div class="notif-detail" id="notifDetail"></div>
        </div>
    </div>

    <div class="toast-container" id="toastContainer"></div>

    <div class="offline-screen" id="offlineScreen">
        <div class="offline-card">
            <div class="offline-icon-yellow"><i class="fa-solid fa-wifi-slash"></i></div>
            <h2>Tidak ada internet</h2>
            <p>Periksa koneksi Anda lalu coba lagi.</p>
            <button class="refresh-btn" id="refreshBtn"><i class="fa-solid fa-rotate-right"></i> REFRESH</button>
            <a class="offline-link" href="../../../handle/404.php"><i class="fa-solid fa-triangle-exclamation"></i> HALAMAN JARINGAN</a>
        </div>
    </div>

    <div class="shell">
        <div class="app" id="appRoot">
            <header class="topbar">
                <div class="brand">
                    <div class="bolt"><i class="fa-solid fa-r"></i></div>
                    <div class="brand-text">
                        <span class="brand-raaan brand-title-main">Raaan</span><span class="brand-gen brand-title-sub">Tools</span>
                    </div>
                </div>
                <div class="header-controls">
                    <div class="status-badge status-loading" id="statusBadge">
                        <span class="spin" id="statusIcon"></span>
                        <span id="statusText">Loading</span>
                    </div>
                    <button class="dark-toggle" id="darkToggle" title="Mode Gelap/Terang">
                        <i class="fa-solid fa-moon"></i>
                    </button>
                </div>
            </header>

            <div class="content-grid" id="contentGrid">
                <div id="apiErrorSection" class="api-error-card" style="display:none;">
                    <div class="icon-red"><i class="fa-solid fa-triangle-exclamation"></i></div>
                    <h2>Ada Masalah!</h2>
                    <p>API sedang bermasalah atau offline. Coba lagi nanti.</p>
                </div>

                <div class="row-main" id="mainAppRow">
                    <div class="input-section">
                        <section class="panel input-area">
                            <div class="tabs-container">
                                <button class="tab-btn active" type="button"><span>Downloader / Google Drive</span></button>
                            </div>

                            <div class="input-header">
                                <div class="section-title" id="inputTitle"><i class="fa-solid fa-r"></i><span>Teks Input</span></div>
                                <div class="input-actions-top">
                                    <button class="input-action-btn paste-btn" id="pasteBtn" title="Tempel"><i class="fa-solid fa-paste"></i></button>
                                    <button class="input-action-btn clear-btn" id="clearInputBtn" title="Hapus"><i class="fa-solid fa-xmark"></i></button>
                                </div>
                            </div>

                            <div class="input-wrapper">
                                <textarea id="mainInput" placeholder="Ketik teks brat di sini..." spellcheck="false"></textarea>
                            </div>

                            <div class="history-label-mobile">Riwayat <span id="historyTypeLabel">BRAT Generator</span></div>
                            <div class="history-wrap" id="historyWrap">
                                <button class="history-arrow disabled" id="historyLeft" aria-label="Scroll kiri" style="display:none;"><i class="fa-solid fa-chevron-left"></i></button>
                                <div class="history-scroll-container" id="historyRow" style="display:none;"></div>
                                <button class="history-arrow disabled" id="historyRight" aria-label="Scroll kanan" style="display:none;"><i class="fa-solid fa-chevron-right"></i></button>
                                <div class="history-empty-placeholder" id="historyEmptyMobile">BELUM ADA HISTORY</div>
                            </div>
                        </section>

                        <button class="cta" id="fetchBtn" disabled>
                            <i class="fa-solid fa-wand-magic-sparkles"></i> GENERATE
                        </button>

                        <div class="desktop-history-vertical" id="desktopHistoryVertical">
                            <div class="history-vertical-header">
                                <span><i class="fa-solid fa-clock-rotate-left"></i> Riwayat</span>
                            </div>
                            <div class="history-empty-desktop" id="historyEmptyDesktop">BELUM ADA HISTORY</div>
                            <div class="history-vertical-list" id="desktopHistoryList"></div>
                            <div class="history-scroll-indicator" id="desktopHistoryScroll">
                                <i class="fa-solid fa-chevron-down"></i> SCROLL <i class="fa-solid fa-chevron-down"></i>
                            </div>
                        </div>
                    </div>

                    <div class="preview-section">
                        <section class="panel preview" id="previewContainer">
                            <div class="preview-placeholder" id="previewPlaceholder">
                                <div class="icon"><i class="fa-solid fa-r"></i></div>
                                <h3>Ruang Hasil</h3>
                                <p>Hasil akan muncul di sini sebagai UI.</p>
                            </div>

                            <div class="error-card" id="errorCard" style="display:none;">
                                <div class="icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
                                <h3>Gagal Memuat</h3>
                                <p id="errorText">Data gagal diproses.</p>
                            </div>

                            <div class="media-card" id="mediaCard">
                                <div class="author-header">
                                    <img src="" class="author-pic" id="mediaAuthorPic" alt="Avatar">
                                    <div class="author-info">
                                        <div class="author-name" id="mediaAuthorName">RAAAN</div>
                                        <div class="author-user" id="mediaAuthorUsername">BRAT Generator</div>
                                    </div>
                                    <a href="#" target="_blank" class="goto-btn" id="mediaGotoLink" title="Buka sumber">
                                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                    </a>
                                </div>

                                <div class="media-details">
                                    <div class="media-caption" id="mediaCaption">Hasil akan muncul di sini.</div>
                                    <div class="media-stats" id="mediaStats"></div>
                                </div>

                                <div id="mediaContentWrap"></div>
                            </div>

                            <div class="overlay" id="previewOverlay">
                                <div class="overlay-card">
                                    <div class="radar">
                                        <div class="ring"></div>
                                        <div class="ring"></div>
                                        <div class="ring"></div>
                                        <div class="spinner"></div>
                                    </div>
                                    <div class="render-text" id="renderOverlayText">Memproses...</div>
                                </div>
                            </div>
                        </section>

                        <div class="pagination-container" id="paginationContainer"></div>
                    </div>
                </div>

                <div class="tutorial-section" id="tutorialSection">
                    <section class="panel reveal visible">
                        <div class="section-title"><i class="fa-solid fa-circle-info"></i> Cara Pakai</div>
                        <div class="tutorial-grid" id="tutorialGridContainer"></div>
                    </section>
                </div>

                <div class="desktop-tools" id="desktopTools">
                    <section class="panel reveal visible">
                        <div class="section-title"><i class="fa-solid fa-toolbox"></i> Tools Lainnya</div>
                        <div class="tools-category-grid" id="desktopToolsGrid"></div>
                    </section>
                </div>
            </div>
        </div>
    </div>

    <footer class="footer" id="pageFooter">GDRIVE © 2026 • RAAAN</footer>

    <div class="floating-menu" id="floatingMenu">
        <div class="menu-panel" id="menuPanel">
            <div class="menu-panel-head" id="menuDragHandle">
                <div class="menu-logo"><i class="fa-solid fa-toolbox"></i></div>
                <div class="menu-title"><strong>TOOLS</strong></div>
            </div>
            <div class="menu-category-slider" id="menuCategorySlider"></div>
            <div class="tools-list" id="mobileToolsContainer"></div>
        </div>
        <button class="fab" id="menuFab"><i class="fa-solid fa-bars"></i></button>
    </div>
    <div class="dim" id="menuDim"></div>

    <script src="../../../script/tool-page.js"></script>
</body>
</html>
