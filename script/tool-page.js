(() => {
    const toolKey = document.body.dataset.toolKey || 'brat';
    const tool = RAAAN_CONFIG.tools[toolKey] || RAAAN_CONFIG.tools.brat;
    const ROOT_PREFIX = window.RAAAN_ROOT_PREFIX || '';
    const API_DIRECT_BASE = RAAAN_CONFIG.apiDirectBase || RAAAN_CONFIG.baseUrl || 'https://api.pixxxry.eu.cc';
    const NETWORK_CONFIG = RAAAN_CONFIG.network || {};
    const PROXY_BASE_RAW = RAAAN_CONFIG.proxyBase || 'api.php';
    const USE_PROXY = RAAAN_CONFIG.useProxy !== false;
    const FALLBACK_DIRECT = NETWORK_CONFIG.fallbackDirect !== false;
    const REQUEST_TIMEOUT = Number(NETWORK_CONFIG.timeoutMs || 14000);
    const STATUS_TIMEOUT = Number(NETWORK_CONFIG.statusTimeoutMs || 6500);
    const STATUS_CACHE_MS = Number(NETWORK_CONFIG.statusCacheMs || 45000);
    const MAX_CONCURRENT = Math.max(1, Math.min(6, Number(NETWORK_CONFIG.maxConcurrent || 3)));
    const RETRY_COUNT = Math.max(0, Math.min(2, Number(NETWORK_CONFIG.retry || 1)));
    const PUBLIC_BASE_LABEL = RAAAN_CONFIG.publicBaseLabel || 'Raaan Tools';

    const $ = (id) => document.getElementById(id);
    const appRoot = $('appRoot');
    const contentGrid = $('contentGrid');
    const pageFooter = $('pageFooter');
    const globalLoader = $('globalLoader');
    const offlineScreen = $('offlineScreen');
    const refreshBtn = $('refreshBtn');

    const statusBadge = $('statusBadge');
    const statusIcon = $('statusIcon');
    const statusText = $('statusText');

    const inputBox = $('mainInput');
    const fetchBtn = $('fetchBtn');
    const pasteBtn = $('pasteBtn');
    const clearInputBtn = $('clearInputBtn');
    const inputTitle = $('inputTitle');

    const previewPlaceholder = $('previewPlaceholder');
    const previewOverlay = $('previewOverlay');
    const renderOverlayText = $('renderOverlayText');
    const errorCard = $('errorCard');
    const errorText = $('errorText');
    const paginationContainer = $('paginationContainer');

    const historyTypeLabel = $('historyTypeLabel');
    const historyRow = $('historyRow');
    const historyLeft = $('historyLeft');
    const historyRight = $('historyRight');
    const historyEmptyMobile = $('historyEmptyMobile');
    const desktopHistoryList = $('desktopHistoryList');
    const historyEmptyDesktop = $('historyEmptyDesktop');
    const desktopHistoryScroll = $('desktopHistoryScroll');

    const mediaCard = $('mediaCard');
    const mediaAuthorPic = $('mediaAuthorPic');
    const mediaAuthorName = $('mediaAuthorName');
    const mediaAuthorUsername = $('mediaAuthorUsername');
    const mediaGotoLink = $('mediaGotoLink');
    const mediaCaption = $('mediaCaption');
    const mediaStats = $('mediaStats');
    const mediaContentWrap = $('mediaContentWrap');

    const downloadNotification = $('downloadNotification');
    const notifIcon = $('notifIcon');
    const notifTitle = $('notifTitle');
    const notifDetail = $('notifDetail');
    const toastContainer = $('toastContainer');
    const tutorialGridContainer = $('tutorialGridContainer');
    const desktopToolsGrid = $('desktopToolsGrid');
    const mobileToolsContainer = $('mobileToolsContainer');
    const menuCategorySlider = $('menuCategorySlider');
    const floatingMenu = $('floatingMenu');
    const menuFab = $('menuFab');
    const menuDim = $('menuDim');
    const darkToggle = $('darkToggle');
    const menuDragHandle = $('menuDragHandle');
    const menuPanel = $('menuPanel');

    let apiOnline = false;
    let isFetching = false;
    let currentResults = [];
    let activePageIndex = 0;
    let lastFetchedValue = '';
    let pollingTimer = null;
    let activeObjectUrls = [];
    let historyItems = [];
    let proxyTokenCache = null;
    const HISTORY_KEY = `raaan_pixxxry_history_${toolKey}`;

    function esc(value) {
        return String(value ?? '').replace(/[&<>"']/g, (m) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[m]));
    }

    function appUrl(path) {
        if (!path) return '#';
        if (/^(https?:|mailto:|tel:|#|\/)/.test(path)) return path;
        return ROOT_PREFIX + path;
    }

    function iconClass(icon) {
        const brands = ['fa-tiktok','fa-instagram','fa-facebook','fa-x-twitter','fa-youtube','fa-github','fa-google-drive','fa-pinterest','fa-reddit','fa-npm'];
        return `${brands.includes(icon) ? 'fa-brands' : 'fa-solid'} ${icon}`;
    }

    function formatNumber(num) {
        const n = Number(num || 0);
        if (!Number.isFinite(n)) return esc(num || '0');
        if (n >= 1000000000) return (n / 1000000000).toFixed(1).replace('.0', '') + 'B';
        if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
        if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'K';
        return String(n);
    }

    function formatSize(bytes) {
        const n = Number(bytes || 0);
        if (!n) return '-';
        const units = ['B','KB','MB','GB'];
        let i = 0, val = n;
        while (val >= 1024 && i < units.length - 1) { val /= 1024; i++; }
        return `${val.toFixed(i ? 2 : 0)} ${units[i]}`;
    }

    function makeAvatar(name) {
        const safe = encodeURIComponent(String(name || 'RAAAN').slice(0, 32));
        return `https://ui-avatars.com/api/?name=${safe}&background=ffd84f&color=111&bold=true`;
    }

    function showGlobalLoader(show) {
        globalLoader.classList.toggle('show', !!show);
    }

    function setStatus(state, code = '') {
        statusBadge.className = 'status-badge';
        if (state === 'online') {
            statusBadge.classList.add('status-online');
            statusIcon.className = 'status-dot';
            statusText.textContent = 'Online';
        } else if (state === 'offline') {
            statusBadge.classList.add('status-offline');
            statusIcon.className = 'status-dot';
            statusText.textContent = code ? `Offline ${code}` : 'Offline';
        } else {
            statusBadge.classList.add('status-loading');
            statusIcon.className = 'spin';
            statusText.textContent = 'Loading';
        }
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-xmark' : type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${esc(message)}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('hide');
            toast.addEventListener('animationend', () => toast.remove(), { once: true });
        }, 1900);
    }

    function showFullScreenPopup(type, title, detail) {
        notifIcon.className = `notif-icon ${type}`;
        const icon = type === 'success' ? 'fa-circle-check' : type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-xmark';
        notifIcon.innerHTML = `<i class="fa-solid ${icon}"></i>`;
        notifTitle.textContent = title;
        notifDetail.textContent = detail;
        downloadNotification.classList.add('show');
        setTimeout(() => downloadNotification.classList.remove('show'), 1200);
    }

    function applyDark(mode) {
        document.body.classList.toggle('dark', mode);
        darkToggle.innerHTML = mode ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('raaan-dark', mode ? '1' : '0');
    }

    function toggleOfflineScreen(networkOffline) {
        if (networkOffline) {
            offlineScreen.classList.add('show');
            contentGrid.style.display = 'none';
            pageFooter.style.display = 'none';
            floatingMenu.style.display = 'none';
            document.body.style.overflow = 'hidden';
        } else {
            offlineScreen.classList.remove('show');
            contentGrid.style.display = '';
            pageFooter.style.display = '';
            floatingMenu.style.display = '';
            document.body.style.overflow = '';
        }
    }

    function buildParams(value) {
        const params = new URLSearchParams();
        params.set(tool.param || 'url', value);
        Object.entries(tool.defaults || {}).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') params.set(k, v);
        });
        return params;
    }

    function normalizeProxyBase() {
        if (/^https?:/i.test(PROXY_BASE_RAW) || PROXY_BASE_RAW.startsWith('/')) return PROXY_BASE_RAW;
        return ROOT_PREFIX + PROXY_BASE_RAW.replace(/^\.\//, '');
    }

    function buildDirectUrl(value) {
        return `${API_DIRECT_BASE}${tool.endpoint}?${buildParams(value).toString()}`;
    }

    function appendToken(params, token) {
        if (token) params.set('raan_token', token);
        return params;
    }

    async function getProxyToken(force = false) {
        if (!USE_PROXY) return '';
        if (!force && proxyTokenCache && proxyTokenCache.expires > Date.now() + 15000) return proxyTokenCache.token;
        const url = `${normalizeProxyBase()}?action=token&tool=${encodeURIComponent(toolKey)}`;
        const res = await fetchWithTimeout(url, { method: 'GET' }, STATUS_TIMEOUT);
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.status || !json?.token) throw new Error(json?.message || 'Token proxy gagal dibuat.');
        proxyTokenCache = { token: json.token, expires: Number(json.expires_ms || (Date.now() + 90000)) };
        return proxyTokenCache.token;
    }

    async function buildProxyUrl(value) {
        const params = buildParams(value);
        params.set('tool', toolKey);
        appendToken(params, await getProxyToken());
        return `${normalizeProxyBase()}?${params.toString()}`;
    }

    function buildUrl(value) {
        return USE_PROXY ? buildProxyUrl(value) : buildDirectUrl(value);
    }

    async function fetchWithTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT) {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), timeoutMs);
        try {
            const res = await fetch(url, { ...options, signal: ctrl.signal, cache: 'no-store' });
            clearTimeout(timer);
            return res;
        } catch (e) {
            clearTimeout(timer);
            throw e;
        }
    }

    async function parseResponse(res) {
        const type = (res.headers.get('content-type') || '').toLowerCase();
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        if (type.includes('application/json') || type.includes('text/json')) {
            const json = await res.json();
            if (json && json.status === false) {
                throw new Error(json.error || json.message || 'Status false');
            }
            return { type: 'json', data: json };
        }
        const blob = await res.blob();
        if (!blob || blob.size === 0) throw new Error('Respon kosong');
        return { type: 'blob', data: blob, mime: blob.type || type || 'application/octet-stream' };
    }

    function makePostBody(value) {
        const body = {};
        body[tool.param || 'url'] = value;
        Object.assign(body, tool.defaults || {});
        return body;
    }

    async function proxyPostUrl() {
        const params = new URLSearchParams();
        params.set('tool', toolKey);
        appendToken(params, await getProxyToken());
        return `${normalizeProxyBase()}?${params.toString()}`;
    }

    function directPostUrl() {
        return `${API_DIRECT_BASE}${tool.endpoint}`;
    }

    async function requestViaGet(url, timeout = REQUEST_TIMEOUT) {
        const res = await fetchWithTimeout(url, { method: 'GET' }, timeout);
        return await parseResponse(res);
    }

    async function requestViaPost(url, value, timeout = REQUEST_TIMEOUT) {
        const res = await fetchWithTimeout(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(makePostBody(value))
        }, timeout);
        return await parseResponse(res);
    }

    async function requestEndpoint(value, options = {}) {
        const timeout = options.timeout || REQUEST_TIMEOUT;
        const attempts = [];
        if (USE_PROXY) {
            attempts.push(async () => requestViaGet(await buildProxyUrl(value), timeout));
            attempts.push(async () => requestViaPost(await proxyPostUrl(), value, timeout));
        }
        if (!USE_PROXY || FALLBACK_DIRECT) {
            attempts.push(() => requestViaGet(buildDirectUrl(value), timeout));
            attempts.push(() => requestViaPost(directPostUrl(), value, timeout));
        }

        let lastError = null;
        for (let retry = 0; retry <= RETRY_COUNT; retry++) {
            for (const attempt of attempts) {
                try {
                    return await attempt();
                } catch (e) {
                    lastError = e;
                }
            }
        }
        throw lastError || new Error('API tidak merespons');
    }

    function statusCacheKey() {
        return `raaan_status_${toolKey}_${USE_PROXY ? 'proxy' : 'direct'}`;
    }

    function getCachedStatus() {
        try {
            const cached = JSON.parse(sessionStorage.getItem(statusCacheKey()) || 'null');
            if (cached && Date.now() - cached.time < STATUS_CACHE_MS) return cached.result;
        } catch (e) {}
        return null;
    }

    function setCachedStatus(result) {
        try {
            sessionStorage.setItem(statusCacheKey(), JSON.stringify({ time: Date.now(), result }));
        } catch (e) {}
    }

    async function checkApi(force = false) {
        if (!force) {
            const cached = getCachedStatus();
            if (cached) return cached;
        }
        try {
            let result;
            if (USE_PROXY) {
                const pingUrl = `${normalizeProxyBase()}?tool=${encodeURIComponent(toolKey)}&ping=1&raan_token=${encodeURIComponent(await getProxyToken(true))}`;
                const res = await fetchWithTimeout(pingUrl, { method: 'GET' }, STATUS_TIMEOUT);
                const json = await res.json().catch(() => null);
                result = { ok: res.ok && json?.status !== false, status: res.status };
            } else {
                const response = await requestEndpoint(tool.sample || 'ping', { timeout: STATUS_TIMEOUT });
                if (response.type === 'json' && response.data?.status === false) result = { ok: false, status: response.data.upstreamStatus || response.data.statusCode || 'false' };
                else result = { ok: true, status: 200 };
            }
            setCachedStatus(result);
            return result;
        } catch (e) {
            const result = { ok: false, status: e.name === 'AbortError' ? 'timeout' : '' };
            setCachedStatus(result);
            return result;
        }
    }

    async function runApiCheck(isInitial = false) {
        if (isInitial) showGlobalLoader(true);
        const startTime = Date.now();
        if (!navigator.onLine) {
            apiOnline = false;
            setStatus('offline');
            toggleOfflineScreen(true);
            validateInput();
        } else {
            toggleOfflineScreen(false);
            setStatus('loading');
            const result = await checkApi(isInitial);
            apiOnline = result.ok;
            setStatus(apiOnline ? 'online' : 'offline', apiOnline ? '' : result.status);
            validateInput();
        }
        if (isInitial) {
            const elapsed = Date.now() - startTime;
            if (elapsed < 900) await new Promise(r => setTimeout(r, 900 - elapsed));
            showGlobalLoader(false);
        }
        clearTimeout(pollingTimer);
        pollingTimer = setTimeout(() => runApiCheck(false), apiOnline ? 60000 : 25000);
    }

    function shouldSplitInput() {
        return tool.category === 'Downloader' && ['url'].includes(tool.param);
    }

    function getInputValues() {
        const raw = inputBox.value.trim();
        if (!raw) return [];
        return shouldSplitInput() ? raw.split(/\s+/).filter(v => v.length > 2) : [raw];
    }

    function validateInput() {
        const value = inputBox.value.trim();
        fetchBtn.disabled = !apiOnline || isFetching || !value || value === lastFetchedValue;
        updateChipDisabledState();
    }

    function clearObjectUrls() {
        activeObjectUrls.forEach(url => URL.revokeObjectURL(url));
        activeObjectUrls = [];
    }

    function objectUrl(blob) {
        const url = URL.createObjectURL(blob);
        activeObjectUrls.push(url);
        return url;
    }

    function resetAll(keepInput = true) {
        validateInput();
        clearObjectUrls();
        previewPlaceholder.style.display = 'flex';
        previewOverlay.classList.remove('show');
        errorCard.style.display = 'none';
        mediaCard.style.display = 'none';
        paginationContainer.style.display = 'none';
        paginationContainer.innerHTML = '';
        mediaContentWrap.innerHTML = '';
        mediaStats.innerHTML = '';
        currentResults = [];
        activePageIndex = 0;
        if (!keepInput) inputBox.value = '';
    }

    function loadHistory() {
        historyItems = RAAAN_STORAGE.loadHistory(HISTORY_KEY);
        renderHistory();
    }

    function saveHistory(value) {
        historyItems = RAAAN_STORAGE.addHistory(HISTORY_KEY, value);
        renderHistory();
    }

    function updateChipDisabledState() {
        const currentValues = getInputValues();
        document.querySelectorAll('.history-chip').forEach(chip => {
            if (currentValues.includes(chip.dataset.value)) chip.classList.add('disabled-chip');
            else chip.classList.remove('disabled-chip');
        });
    }

    function updateHistoryArrows() {
        if (!historyItems.length) {
            historyLeft.classList.add('disabled');
            historyRight.classList.add('disabled');
            return;
        }
        const canLeft = historyRow.scrollLeft > 2;
        const canRight = historyRow.scrollWidth > historyRow.clientWidth + historyRow.scrollLeft + 2;
        historyLeft.classList.toggle('disabled', !canLeft);
        historyRight.classList.toggle('disabled', !canRight);
    }

    function updateDesktopScrollIndicator() {
        if (!desktopHistoryScroll || !desktopHistoryList || !historyItems.length) return;
        if (desktopHistoryList.scrollHeight <= desktopHistoryList.clientHeight) {
            desktopHistoryScroll.style.opacity = '0.3';
            desktopHistoryScroll.innerHTML = '<i class="fa-solid fa-chevron-down"></i> SCROLL <i class="fa-solid fa-chevron-down"></i>';
        } else {
            desktopHistoryScroll.style.opacity = '1';
            const bottom = Math.ceil(desktopHistoryList.scrollTop + desktopHistoryList.clientHeight) >= desktopHistoryList.scrollHeight - 2;
            desktopHistoryScroll.innerHTML = bottom ? '<i class="fa-solid fa-chevron-up"></i> SCROLL <i class="fa-solid fa-chevron-up"></i>' : '<i class="fa-solid fa-chevron-down"></i> SCROLL <i class="fa-solid fa-chevron-down"></i>';
        }
    }

    function renderHistory() {
        const isEmpty = historyItems.length === 0;
        historyTypeLabel.textContent = tool.label;
        const chipHtml = historyItems.map(v => `<button class="history-chip" data-value="${esc(v)}" title="${esc(v)}">${esc(v)}</button>`).join('');
        historyRow.innerHTML = chipHtml;
        desktopHistoryList.innerHTML = chipHtml;
        document.querySelectorAll('.history-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                if (chip.classList.contains('disabled-chip')) return;
                inputBox.value = chip.dataset.value;
                validateInput();
            });
        });

        historyEmptyMobile.style.display = isEmpty ? 'block' : 'none';
        historyLeft.style.display = isEmpty ? 'none' : '';
        historyRight.style.display = isEmpty ? 'none' : '';
        historyRow.style.display = isEmpty ? 'none' : 'flex';
        historyEmptyDesktop.style.display = isEmpty ? 'flex' : 'none';
        desktopHistoryScroll.style.display = isEmpty ? 'none' : 'flex';

        updateHistoryArrows();
        updateDesktopScrollIndicator();
        updateChipDisabledState();
    }

    function renderTutorials() {
        const data = getTutorials();
        tutorialGridContainer.innerHTML = data.map(t => `
            <div class="step">
                <div class="badge"><i class="fa-solid ${t.icon}"></i></div>
                <h4>${esc(t.title)}</h4>
                <p>${esc(t.desc)}</p>
            </div>
        `).join('');
    }

    function getTutorials() {
        if (Array.isArray(tool.tutorials) && tool.tutorials.length) return tool.tutorials;
        if (tool.category === 'Generator') {
            return [
                { icon: 'fa-keyboard', title: 'Masukkan Teks', desc: 'Tulis teks sesuai kebutuhan.' },
                { icon: 'fa-bolt', title: 'Eksekusi', desc: 'Tekan tombol utama dan tunggu proses selesai.' },
                { icon: 'fa-download', title: 'Unduh Hasil', desc: 'Preview hasil lalu simpan ke perangkat.' }
            ];
        }
        if (tool.category === 'Tools') {
            return [
                { icon: 'fa-pen-to-square', title: 'Isi Input', desc: 'Masukkan teks, URL gambar, atau URL website.' },
                { icon: 'fa-bolt', title: 'Eksekusi', desc: 'Sistem memproses dan menampilkan hasil sebagai UI.' },
                { icon: 'fa-copy', title: 'Ambil Hasil', desc: 'Buka, salin, atau unduh hasil dari tombol yang tersedia.' }
            ];
        }
        return [
            { icon: 'fa-link', title: 'Salin Link', desc: 'Copy link dari platform yang sesuai.' },
            { icon: 'fa-paste', title: 'Tempel Link', desc: 'Paste ke kolom input. Bisa banyak link, pisahkan pakai spasi.' },
            { icon: 'fa-download', title: 'Unduh Media', desc: 'Preview hasil dan pilih tombol download yang tersedia.' }
        ];
    }

    function renderMenus() {
        const categories = [...new Set(RAAAN_CONFIG.menus.map(t => t.category))];
        menuCategorySlider.innerHTML = categories.map(cat => `<button class="menu-cat-tab ${cat === tool.category ? 'active' : ''}" data-cat="${esc(cat)}">${esc(cat)}</button>`).join('');

        function renderMobile(cat) {
            const items = RAAAN_CONFIG.menus.filter(t => t.category === cat);
            mobileToolsContainer.innerHTML = items.map(item => `
                <button class="tool-item ${item.key === toolKey ? 'active' : ''}" data-key="${esc(item.key)}" data-file="${esc(item.file)}">
                    <div class="tool-icon"><i class="${iconClass(item.icon)}"></i></div>
                    <div class="tool-info"><strong>${esc(item.label)}</strong><span>${esc(item.desc)}</span></div>
                    <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
                </button>
            `).join('');
            mobileToolsContainer.querySelectorAll('.tool-item').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (btn.dataset.key === toolKey) toggleMenu(false);
                    else window.location.href = appUrl(btn.dataset.file);
                });
            });
        }

        menuCategorySlider.querySelectorAll('.menu-cat-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                menuCategorySlider.querySelectorAll('.menu-cat-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                renderMobile(tab.dataset.cat);
            });
        });
        renderMobile(tool.category);

        let desktop = '';
        categories.forEach(cat => {
            desktop += `<div class="tools-category-label">${esc(cat)}</div>`;
            RAAAN_CONFIG.menus.filter(t => t.category === cat).forEach(item => {
                desktop += `
                    <button class="tool-item-desktop ${item.key === toolKey ? 'active' : ''}" data-key="${esc(item.key)}" data-file="${esc(item.file)}">
                        <div class="tool-icon"><i class="${iconClass(item.icon)}"></i></div>
                        <div class="tool-info"><strong>${esc(item.label)}</strong><span>${esc(item.desc)}</span></div>
                        <div class="tool-go"><i class="fa-solid fa-arrow-right"></i></div>
                    </button>
                `;
            });
        });
        desktopToolsGrid.innerHTML = desktop;
        desktopToolsGrid.querySelectorAll('.tool-item-desktop').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.key !== toolKey) window.location.href = appUrl(btn.dataset.file);
            });
        });
    }

    let menuOpen = false;
    function toggleMenu(force) {
        if (window.innerWidth >= 1024) return;
        menuOpen = typeof force === 'boolean' ? force : !menuOpen;
        floatingMenu.classList.toggle('open', menuOpen);
        menuDim.classList.toggle('show', menuOpen);
        menuFab.querySelector('i').className = menuOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars';
    }

    function setupDragMenu() {
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        menuDragHandle.addEventListener('pointerdown', (e) => {
            if (window.innerWidth >= 1024) return;
            isDragging = true;
            const rect = menuPanel.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            menuPanel.style.transition = 'none';
            menuPanel.setPointerCapture(e.pointerId);
            e.preventDefault();
        });
        window.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            const maxX = window.innerWidth - menuPanel.offsetWidth;
            const maxY = window.innerHeight - menuPanel.offsetHeight;
            const newLeft = Math.min(Math.max(0, e.clientX - dragOffsetX), maxX);
            const newTop = Math.min(Math.max(0, e.clientY - dragOffsetY), maxY);
            menuPanel.style.left = `${newLeft}px`;
            menuPanel.style.top = `${newTop}px`;
            menuPanel.style.right = 'auto';
            menuPanel.style.bottom = 'auto';
        });
        window.addEventListener('pointerup', () => {
            if (!isDragging) return;
            isDragging = false;
            menuPanel.style.transition = 'opacity .26s ease, visibility .26s ease, transform .28s cubic-bezier(.17,1.05,.31,1.02)';
        });
    }

    function getPayload(response) {
        if (!response) return null;
        if (response.type === 'blob') return response.data;
        const json = response.data;
        return json?.result ?? json?.data ?? json;
    }

    function sourceFromResponse(response) {
        if (response?.type === 'json') return response.data;
        return null;
    }

    function primaryMediaUrl(item) {
        return item?.url || item?.media || item?.video || item?.play || item?.download || item?.audio || item?.thumbnail || '';
    }

    function mediaTypeFromUrl(url, fallback = 'video') {
        const u = String(url || '').toLowerCase();
        if (/\.(jpg|jpeg|png|webp|gif)(\?|$)/.test(u)) return 'image';
        if (/\.(mp3|m4a|wav|ogg|webm)(\?|$)/.test(u) && !u.includes('video')) return 'audio';
        if (/\.(mp4|mov|m3u8|webm)(\?|$)/.test(u)) return 'video';
        return fallback;
    }

    function mediaTag(url, options = {}) {
        if (!url) return '';
        const type = options.type || mediaTypeFromUrl(url, 'video');
        const poster = options.poster || '';
        const wrapClass = options.wide ? 'media-player-wrap is-wide' : options.square ? 'media-player-wrap is-square' : 'media-player-wrap';
        if (type === 'image') return `<div class="${wrapClass}"><img src="${esc(url)}" alt="Preview"></div>`;
        if (type === 'audio') return `<div class="${wrapClass} is-wide"><audio controls src="${esc(url)}"></audio></div>`;
        return `<div class="${wrapClass}"><video controls playsinline ${poster ? `poster="${esc(poster)}"` : ''}><source src="${esc(url)}" type="video/mp4"></video></div>`;
    }

    function linkButton(url, label, icon = 'fa-download', extra = '') {
        if (!url) return '';
        const finalIcon = String(icon || 'fa-download').startsWith('fa-') ? icon : `fa-${icon}`;
        return `<a href="${esc(url)}" target="_blank" class="download-btn ${extra}"><i class="fa-solid ${finalIcon}"></i> ${esc(label)}</a>`;
    }

    function setBaseCard({ title, subtitle, avatar, link, caption, stats, content, identity = false }) {
        previewPlaceholder.style.display = 'none';
        errorCard.style.display = 'none';
        mediaCard.style.display = 'flex';
        mediaCard.classList.toggle('no-identity', !identity);
        mediaAuthorName.textContent = title || tool.label;
        mediaAuthorUsername.textContent = subtitle || tool.category;
        mediaAuthorPic.src = avatar || makeAvatar(title || tool.label);
        mediaGotoLink.href = link || '#';
        mediaGotoLink.style.display = link ? 'grid' : 'none';
        mediaCaption.textContent = caption || 'Hasil sudah siap.';
        mediaStats.innerHTML = (stats || []).filter(Boolean).map(s => `<span><i class="fa-solid ${s.icon}"></i><b>${esc(s.value)}</b></span>`).join('');
        mediaStats.style.display = stats && stats.length ? 'flex' : 'none';
        const head = identity ? '' : `<div class="result-head"><h3>${esc(title || tool.label)}</h3><p>${esc(subtitle || tool.desc || tool.category)}</p></div>`;
        mediaContentWrap.innerHTML = head + (content || '');
    }

    function renderBlob(blob, value, typeHint = '') {
        const url = objectUrl(blob);
        const isVideo = typeHint === 'video' || (blob.type || '').includes('video');
        const isAudio = (blob.type || '').includes('audio');
        const title = tool.label;
        const content = `
            ${mediaTag(url, { type: isVideo ? 'video' : isAudio ? 'audio' : 'image', wide: isAudio })}
            <div class="action-buttons-grid">
                <a href="${esc(url)}" download="${esc(toolKey)}-raaan" class="download-btn">
                    <i class="fa-solid fa-download"></i> UNDUH HASIL
                </a>
                <button class="copy-btn" data-copy="${esc(url)}"><i class="fa-solid fa-link"></i> SALIN LINK LOKAL</button>
            </div>
        `;
        setBaseCard({
            title,
            subtitle: isVideo ? 'Video siap' : isAudio ? 'Audio siap' : 'Gambar siap',
            avatar: makeAvatar(title),
            caption: value,
            content
        });
        bindCopyButtons();
    }

    function renderTiktok(payload, sourceUrl) {
        const data = payload?.data || payload;
        const author = data?.author || {};
        const username = author.unique_id || data.author_nickname || data.nickname || 'tiktok';
        const title = author.nickname || data.author_nickname || username;
        const avatar = author.avatar || data.author_cover_link || data.avatar || makeAvatar(username);
        const play = data.play || data.no_watermark_link || data.hdplay || data.video;
        const cover = data.cover || data.cover_link || data.origin_cover || data.thumbnail;
        const music = data.music || data.music_link || data?.music_info?.play;
        const caption = data.title || data.text || 'Video TikTok';
        const slides = extractSlides(data);
        let content = '';
        if (slides.length) {
            content = renderSlideContent(slides, music);
        } else {
            content = `
                ${mediaTag(play || cover, { type: play ? 'video' : 'image', poster: cover })}
                <div class="action-buttons-grid">
                    ${linkButton(play, 'VIDEO NO-WM', 'video')}
                    ${linkButton(data.hdplay || data.no_watermark_link_hd, 'VIDEO HD', 'video', 'outline')}
                    ${linkButton(data.wmplay, 'VIDEO WM', 'video', 'outline')}
                    ${linkButton(music, 'UNDUH AUDIO', 'music', 'audio')}
                </div>
            `;
        }
        setBaseCard({
            title,
            subtitle: '@' + username,
            avatar,
            link: sourceUrl,
            caption,
            identity: true,
            stats: [
                { icon: 'fa-play', value: formatNumber(data.play_count) },
                { icon: 'fa-heart', value: formatNumber(data.digg_count || data.like_count) },
                { icon: 'fa-comment', value: formatNumber(data.comment_count) },
                { icon: 'fa-share', value: formatNumber(data.share_count) }
            ],
            content
        });
        bindSlideActions(slides, music);
    }

    function extractSlides(data) {
        const urls = [];
        if (Array.isArray(data.images)) urls.push(...data.images);
        if (data.slides && typeof data.slides === 'object') {
            Object.keys(data.slides).forEach(k => {
                const item = data.slides[k];
                if (item?.url) urls.push(item.url);
                else if (typeof item === 'string' && /^https?:/.test(item)) urls.push(item);
            });
        }
        if (Array.isArray(data.media)) {
            data.media.forEach(m => {
                if ((m.type === 'image' || mediaTypeFromUrl(m.url, '') === 'image') && m.url) urls.push(m.url);
            });
        }
        return [...new Set(urls.filter(Boolean))];
    }

    function renderSlideContent(slideUrls, audioUrl = '') {
        const items = slideUrls.map((imgUrl, idx) => `
            <div class="slide-item" data-url="${esc(imgUrl)}">
                <div class="slide-checkbox-wrap"><input type="checkbox" class="img-cb" value="${esc(imgUrl)}"></div>
                <img src="${esc(imgUrl)}" alt="Slide ${idx + 1}">
                <a href="${esc(imgUrl)}" target="_blank" class="slide-dl-btn"><i class="fa-solid fa-download"></i> Unduh</a>
            </div>
        `).join('');
        return `
            <div class="slide-container">
                ${audioUrl ? linkButton(audioUrl, 'UNDUH AUDIO', 'music', 'audio') : ''}
                <div class="slide-header">
                    <div class="slide-header-title">SLIDE GAMBAR (${slideUrls.length})</div>
                    <div class="slide-header-actions" id="slideActionsWrap">
                        <button class="btn-small btn-pilih" id="btnModePilih"><i class="fa-solid fa-check-double"></i> PILIH</button>
                    </div>
                </div>
                <div class="slide-grid-box" id="slideGridBox"><div class="slide-grid">${items}</div></div>
            </div>
        `;
    }

    function bindSlideActions(slideUrls) {
        const slideGridBox = $('slideGridBox');
        const slideActionsWrap = $('slideActionsWrap');
        const btnModePilih = $('btnModePilih');
        if (!slideGridBox || !slideActionsWrap || !btnModePilih || !slideUrls.length) return;
        let isSelectMode = false;
        function updateSelectionState() {
            const checkboxes = [...document.querySelectorAll('.img-cb')];
            let count = 0;
            checkboxes.forEach(cb => {
                const item = cb.closest('.slide-item');
                if (cb.checked) { item.classList.add('selected'); count++; }
                else item.classList.remove('selected');
            });
            const btnDlSelected = $('btnDlSelected');
            const btnDlAll = $('btnDlAll');
            if (!btnDlSelected || !btnDlAll) return;
            btnDlSelected.style.display = count > 0 ? 'block' : 'none';
            btnDlSelected.textContent = `UNDUH (${count})`;
            btnDlAll.style.display = count > 0 ? 'none' : 'block';
        }
        function openMany(urls) {
            if (!urls.length) return;
            showToast(`Membuka ${urls.length} gambar`, 'success');
            urls.forEach((url, i) => setTimeout(() => window.open(url, '_blank'), i * 260));
        }
        function bindSelectModeEvents() {
            const btnBatal = $('btnBatalPilih');
            const btnDlSelected = $('btnDlSelected');
            const btnDlAll = $('btnDlAll');
            btnBatal?.addEventListener('click', () => {
                isSelectMode = false;
                slideGridBox.classList.remove('mode-pilih');
                document.querySelectorAll('.img-cb').forEach(cb => {
                    cb.checked = false;
                    cb.closest('.slide-item')?.classList.remove('selected');
                });
                slideActionsWrap.innerHTML = `<button class="btn-small btn-pilih" id="btnModePilih"><i class="fa-solid fa-check-double"></i> PILIH</button>`;
                $('btnModePilih').addEventListener('click', enterSelectMode);
            });
            btnDlSelected?.addEventListener('click', () => {
                const selected = [...document.querySelectorAll('.img-cb')].filter(cb => cb.checked).map(cb => cb.value);
                openMany(selected);
                btnBatal?.click();
            });
            btnDlAll?.addEventListener('click', () => openMany(slideUrls));
        }
        function enterSelectMode() {
            isSelectMode = true;
            slideGridBox.classList.add('mode-pilih');
            slideActionsWrap.innerHTML = `
                <button class="btn-small btn-batal" id="btnBatalPilih">BATAL</button>
                <button class="btn-small outline" id="btnDlSelected" style="display:none;">UNDUH (0)</button>
                <button class="btn-small btn-pilih" id="btnDlAll">UNDUH SEMUA</button>
            `;
            document.querySelectorAll('.img-cb').forEach(cb => cb.addEventListener('change', updateSelectionState));
            bindSelectModeEvents();
        }
        btnModePilih.addEventListener('click', enterSelectMode);
        slideGridBox.addEventListener('click', e => {
            if (!isSelectMode) return;
            const item = e.target.closest('.slide-item');
            if (item && e.target.tagName !== 'INPUT') {
                const cb = item.querySelector('.img-cb');
                cb.checked = !cb.checked;
                updateSelectionState();
            }
        });
    }

    function renderInstagram(payload, sourceUrl) {
        const media = payload.media || payload.url || payload.medias || [];
        const items = Array.isArray(media) ? media : [];
        const first = items[0] || payload;
        const firstUrl = first.url || first.download || payload.video || payload.thumbnail;
        const type = first.type || mediaTypeFromUrl(firstUrl, 'video');
        const buttons = items.map((m, idx) => {
            const label = (m.type || m.ext || 'MEDIA').toUpperCase() + ` ${idx + 1}`;
            const icon = (m.type === 'image' || m.ext === 'jpg' || m.ext === 'png') ? 'fa-image' : 'fa-video';
            return linkButton(m.url || m.download, `UNDUH ${label}`, icon);
        }).join('');
        setBaseCard({
            identity: true,
            title: 'Instagram Media',
            subtitle: payload.shortcode ? `#${payload.shortcode}` : 'Downloader',
            avatar: makeAvatar('Instagram'),
            link: payload.original_url || sourceUrl,
            caption: payload.title || payload.description || 'Media Instagram siap diunduh.',
            stats: [{ icon: 'fa-layer-group', value: formatNumber(payload.total || items.length || 1) }],
            content: `
                ${mediaTag(firstUrl, { type, poster: payload.thumbnail })}
                <div class="action-buttons-grid">${buttons || linkButton(firstUrl, 'UNDUH MEDIA', type === 'image' ? 'image' : 'video')}</div>
            `
        });
    }

    function renderFacebook(payload, sourceUrl) {
        const videos = payload.videos || [];
        const first = videos[0] || {};
        const firstUrl = first.url || payload.video || payload.download;
        const buttons = videos.map(v => linkButton(v.url, `${v.quality || v.width + 'p' || 'VIDEO'} ${v.ext || ''}`, 'video')).join('');
        setBaseCard({
            title: payload.uploader || 'Facebook Video',
            subtitle: payload.duration ? `Durasi ${payload.duration}` : 'Downloader',
            avatar: makeAvatar(payload.uploader || 'Facebook'),
            link: payload.webpage_url || payload.original_url || sourceUrl,
            caption: payload.title || payload.description || 'Video Facebook siap diunduh.',
            stats: [{ icon: 'fa-layer-group', value: formatNumber(payload.total || videos.length || 1) }],
            content: `
                ${mediaTag(firstUrl || payload.thumbnail, { type: firstUrl ? 'video' : 'image', poster: payload.thumbnail })}
                <div class="action-buttons-grid">${buttons || linkButton(firstUrl, 'UNDUH VIDEO', 'video')}</div>
            `
        });
    }

    function renderX(payload, sourceUrl) {
        const items = payload.media || [];
        const clean = items.filter(m => m.url);
        const main = clean.find(m => m.type === 'video') || clean.find(m => m.type === 'image') || clean[0] || {};
        const buttons = clean.slice(0, 18).map((m, idx) => linkButton(m.url, `UNDUH ${String(m.type || 'MEDIA').toUpperCase()} ${idx + 1}`, m.type === 'image' ? 'fa-image' : 'fa-video', idx > 1 ? 'outline' : '')).join('');
        setBaseCard({
            title: 'X / Twitter Media',
            subtitle: payload.tweet_id ? `Tweet ${payload.tweet_id}` : 'Downloader',
            avatar: makeAvatar('X'),
            link: payload.original_url || sourceUrl,
            caption: `Ditemukan ${payload.total || clean.length || 1} media.`,
            stats: [
                { icon: 'fa-layer-group', value: formatNumber(payload.total || clean.length) },
                payload.failed?.length ? { icon: 'fa-triangle-exclamation', value: `${payload.failed.length} gagal` } : null
            ],
            content: `
                ${mediaTag(main.url, { type: main.type || mediaTypeFromUrl(main.url, 'video'), poster: payload.thumbnail })}
                <div class="action-buttons-grid">${buttons}</div>
            `
        });
    }

    function renderYoutubeMp3(payload, sourceUrl) {
        setBaseCard({
            title: payload.title || 'YouTube MP3',
            subtitle: payload.author || payload.quality || 'Audio',
            avatar: payload.thumbnail || makeAvatar('YouTube'),
            link: payload.url || sourceUrl,
            caption: payload.duration ? `Durasi ${payload.duration}` : 'Audio YouTube siap diunduh.',
            stats: [
                { icon: 'fa-eye', value: formatNumber(payload.views) },
                { icon: 'fa-music', value: payload.quality || 'MP3' }
            ],
            content: `
                ${mediaTag(payload.audio || payload.thumbnail, { type: payload.audio ? 'audio' : 'image', wide: true })}
                <div class="action-buttons-grid">${linkButton(payload.audio, 'UNDUH AUDIO', 'music', 'audio')}${linkButton(payload.thumbnail, 'BUKA THUMBNAIL', 'image', 'outline')}</div>
            `
        });
    }

    function renderYoutubeMp4(payload, sourceUrl) {
        const videos = payload.downloads?.video || [];
        const audios = payload.downloads?.audio || [];
        const buttons = [
            ...videos.slice(0, 8).map(v => linkButton(v.url, `${v.quality || v.height + 'p'} ${formatSize(v.filesize)}`, 'video')),
            ...audios.slice(0, 3).map(a => linkButton(a.url, `AUDIO ${a.quality || a.bitrate + 'kbps'}`, 'music', 'audio'))
        ].join('');
        setBaseCard({
            title: payload.title || 'YouTube MP4',
            subtitle: payload.author || 'Video',
            avatar: payload.thumbnail || makeAvatar('YouTube'),
            link: payload.url || sourceUrl,
            caption: payload.duration ? `Durasi ${payload.duration}` : 'Video YouTube siap diunduh.',
            stats: [
                { icon: 'fa-eye', value: formatNumber(payload.views) },
                { icon: 'fa-video', value: `${videos.length} format` },
                { icon: 'fa-music', value: `${audios.length} audio` }
            ],
            content: `
                ${mediaTag(payload.thumbnail, { type: 'image', wide: true })}
                <div class="action-buttons-grid">${buttons}</div>
            `
        });
    }

    function renderCapcut(payload, sourceUrl) {
        setBaseCard({
            title: payload.title || 'CapCut Template',
            subtitle: payload.author || 'Template',
            avatar: payload.avatar || payload.thumbnail || makeAvatar('CapCut'),
            link: sourceUrl,
            caption: payload.description || 'Template CapCut siap diunduh.',
            stats: [
                { icon: 'fa-heart', value: formatNumber(payload.likes) },
                { icon: 'fa-users', value: formatNumber(payload.uses) }
            ],
            content: `
                ${mediaTag(payload.video || payload.thumbnail, { type: payload.video ? 'video' : 'image', poster: payload.thumbnail })}
                <div class="action-buttons-grid">${linkButton(payload.video, 'UNDUH VIDEO', 'video')}${linkButton(payload.thumbnail, 'BUKA THUMBNAIL', 'image', 'outline')}</div>
            `
        });
    }

    function renderPinterest(payload, sourceUrl) {
        const url = payload.media || payload.url || payload.video || payload.image;
        const type = payload.type || mediaTypeFromUrl(url, 'image');
        setBaseCard({
            title: payload.title || 'Pinterest Media',
            subtitle: payload.username ? `@${payload.username}` : payload.author || 'Downloader',
            avatar: makeAvatar(payload.author || 'Pinterest'),
            link: payload.pinterest_url || sourceUrl,
            caption: payload.description || 'Media Pinterest siap diunduh.',
            stats: [{ icon: type === 'video' ? 'fa-video' : 'fa-image', value: type.toUpperCase() }],
            content: `
                ${mediaTag(url, { type })}
                <div class="action-buttons-grid">${linkButton(url, `UNDUH ${type.toUpperCase()}`, type === 'image' ? 'image' : 'video')}</div>
            `
        });
    }

    function renderReddit(payload, sourceUrl) {
        const items = payload.videos || payload.media || [];
        const first = items[0] || {};
        const firstUrl = first.url || payload.url || payload.media;
        const buttons = items.map((m, idx) => linkButton(m.url, `${m.quality || m.type || 'MEDIA'} ${idx + 1}`, mediaTypeFromUrl(m.url, 'image') === 'image' ? 'fa-image' : 'fa-video')).join('');
        setBaseCard({
            title: 'Reddit Media',
            subtitle: payload.source || 'Downloader',
            avatar: makeAvatar('Reddit'),
            link: payload.original_url || sourceUrl,
            caption: `Ditemukan ${payload.total || items.length || 1} media.`,
            stats: [{ icon: 'fa-layer-group', value: formatNumber(payload.total || items.length) }],
            content: `
                ${mediaTag(firstUrl, { type: first.type || mediaTypeFromUrl(firstUrl, 'image') })}
                <div class="action-buttons-grid">${buttons || linkButton(firstUrl, 'UNDUH MEDIA', 'download')}</div>
            `
        });
    }

    function renderFile(payload, sourceUrl) {
        const download = payload.download || payload.tarball || payload.url || payload.audio;
        const title = payload.title || payload.name || payload.filename || payload.repo || payload.package || payload.id || tool.label;
        const size = payload.size_formatted || payload.size || formatSize(payload.unpacked_size);
        const infoPairs = [
            ['Nama', title],
            ['Ukuran', size],
            ['Sumber', payload.source || tool.label],
            ['Masa Berlaku', payload.expires_in || payload.license || '-']
        ];
        setBaseCard({
            title,
            subtitle: payload.source || tool.label,
            avatar: makeAvatar(title),
            link: payload.page || payload.source_url || payload.npm_url || sourceUrl,
            caption: payload.description || payload.note || 'File siap diunduh.',
            stats: [
                { icon: 'fa-file', value: payload.ext || payload.mime || 'FILE' },
                { icon: 'fa-hard-drive', value: size }
            ],
            content: `
                <div class="info-grid">${infoPairs.map(([k,v]) => `<div class="info-box"><span>${esc(k)}</span><strong>${esc(v || '-')}</strong></div>`).join('')}</div>
                <div class="action-buttons-grid">
                    ${linkButton(download, 'UNDUH FILE', 'download')}
                    ${linkButton(payload.source_url || payload.registry_url || payload.page, 'BUKA SUMBER', 'arrow-up-right-from-square', 'outline')}
                </div>
            `
        });
    }

    function renderMediaList(payload, sourceUrl) {
        const list = payload.media || payload.videos || payload.images || payload.items || [];
        if (Array.isArray(list) && list.length) {
            const firstUrl = primaryMediaUrl(list[0]);
            const buttons = list.map((m, idx) => linkButton(primaryMediaUrl(m), `UNDUH MEDIA ${idx + 1}`, mediaTypeFromUrl(primaryMediaUrl(m), 'image') === 'image' ? 'fa-image' : 'fa-video')).join('');
            setBaseCard({
                title: payload.title || tool.label,
                subtitle: payload.author || payload.source || 'Downloader',
                avatar: payload.thumbnail || makeAvatar(tool.label),
                link: payload.original_url || sourceUrl,
                caption: payload.description || `Ditemukan ${list.length} media.`,
                stats: [{ icon: 'fa-layer-group', value: formatNumber(list.length) }],
                content: `${mediaTag(firstUrl, { type: mediaTypeFromUrl(firstUrl, 'image') })}<div class="action-buttons-grid">${buttons}</div>`
            });
            return;
        }
        renderFile(payload, sourceUrl);
    }

    function renderByKind(response, sourceValue) {
        const payload = getPayload(response);
        const raw = sourceFromResponse(response);
        if (response.type === 'blob') {
            renderBlob(payload, sourceValue, tool.kind === 'video-blob' ? 'video' : '');
            return;
        }
        switch (tool.kind) {
            case 'tiktok': renderTiktok(payload, sourceValue); break;
            case 'instagram': renderInstagram(payload, sourceValue); break;
            case 'facebook': renderFacebook(payload, sourceValue); break;
            case 'x': renderX(payload, sourceValue); break;
            case 'ytmp3': renderYoutubeMp3(payload, sourceValue); break;
            case 'ytmp4': renderYoutubeMp4(payload, sourceValue); break;
            case 'capcut': renderCapcut(payload, sourceValue); break;
            case 'pinterest': renderPinterest(payload, sourceValue); break;
            case 'reddit': renderReddit(payload, sourceValue); break;
            case 'file': renderFile(payload, sourceValue); break;
            case 'media-list': renderMediaList(payload, sourceValue); break;
            default: renderMediaList(payload, sourceValue);
        }
        if (raw?.creator) {
            mediaAuthorUsername.textContent = mediaAuthorUsername.textContent || PUBLIC_BASE_LABEL;
        }
        bindCopyButtons();
    }

    function renderError(message) {
        previewPlaceholder.style.display = 'none';
        mediaCard.style.display = 'none';
        errorText.textContent = message || 'Data gagal dimuat.';
        errorCard.style.display = 'flex';
    }

    function renderPagination() {
        if (currentResults.length <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        paginationContainer.style.display = 'flex';
        paginationContainer.style.justifyContent = currentResults.length < 3 ? 'center' : 'flex-start';
        paginationContainer.innerHTML = currentResults.map((res, idx) => {
            const cls = `page-btn ${res.error ? 'error-btn' : ''} ${idx === activePageIndex ? 'active' : ''}`;
            return `<button class="${cls}" data-index="${idx}">Hasil ${idx + 1}</button>`;
        }).join('');
        paginationContainer.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                activePageIndex = Number(btn.dataset.index);
                renderPagination();
                renderActivePage();
            });
        });
    }

    function renderActivePage() {
        clearObjectUrls();
        const item = currentResults[activePageIndex];
        mediaContentWrap.innerHTML = '';
        if (!item || item.error) {
            renderError(item?.error || 'Data tidak ditemukan.');
            return;
        }
        renderByKind(item.response, item.value);
    }

    async function executeTool() {
        if (!apiOnline) {
            showToast('API sedang offline', 'error');
            return;
        }
        const values = getInputValues();
        if (!values.length) return;

        isFetching = true;
        lastFetchedValue = inputBox.value.trim();
        validateInput();
        currentResults = [];
        activePageIndex = 0;
        previewPlaceholder.style.display = 'none';
        mediaCard.style.display = 'none';
        errorCard.style.display = 'none';
        paginationContainer.style.display = 'none';
        previewOverlay.classList.add('show');

        let success = 0;
        let failed = 0;
        let completed = 0;
        currentResults = values.map(value => ({ value, response: null, error: null, pending: true }));

        async function worker() {
            while (true) {
                const index = currentResults.findIndex(item => item.pending && !item.running);
                if (index === -1) return;
                const item = currentResults[index];
                item.running = true;
                renderOverlayText.textContent = values.length > 1 ? `Memproses ${completed + 1} dari ${values.length}...` : `Memuat ${tool.label}...`;
                try {
                    const response = await requestEndpoint(item.value);
                    currentResults[index] = { value: item.value, response, error: null, pending: false };
                    saveHistory(item.value);
                    success++;
                } catch (e) {
                    const message = e.name === 'AbortError' ? 'Request timeout.' : (e.message || 'Gagal terhubung ke API.');
                    currentResults[index] = { value: item.value, response: null, error: message, pending: false };
                    failed++;
                } finally {
                    completed++;
                    renderOverlayText.textContent = values.length > 1 ? `Selesai ${completed} dari ${values.length}...` : `Memuat ${tool.label}...`;
                }
            }
        }

        await Promise.all(Array.from({ length: Math.min(MAX_CONCURRENT, values.length) }, worker));

        isFetching = false;
        previewOverlay.classList.remove('show');
        validateInput();

        if (!currentResults.length) {
            renderError('Tidak ada hasil.');
            showFullScreenPopup('error', 'GAGAL', 'Tidak ada data yang diproses.');
            return;
        }
        renderPagination();
        renderActivePage();

        if (success && !failed) showFullScreenPopup('success', 'SELESAI', values.length > 1 ? `Berhasil memproses ${success} data.` : 'Hasil berhasil dimuat.');
        else if (success && failed) showFullScreenPopup('warning', 'PARSIAL', `Berhasil ${success}, gagal ${failed}.`);
        else {
            setStatus('offline');
            showFullScreenPopup('error', 'GAGAL', 'API tidak merespons atau status false.');
        }
    }

    function bindCopyButtons() {
        document.querySelectorAll('[data-copy]').forEach(btn => {
            btn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(btn.dataset.copy || '');
                    showToast('Berhasil disalin', 'success');
                } catch (e) {
                    showToast('Gagal menyalin', 'warning');
                }
            });
        });
    }

    function setupEvents() {
        const savedDark = localStorage.getItem('raaan-dark') === '1';
        applyDark(savedDark);

        darkToggle.addEventListener('click', () => applyDark(!document.body.classList.contains('dark')));
        fetchBtn.addEventListener('click', executeTool);
        let inputTimer = null;
        inputBox.addEventListener('input', () => {
            clearTimeout(inputTimer);
            inputTimer = setTimeout(validateInput, 90);
        });
        inputBox.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !fetchBtn.disabled) executeTool();
        });

        clearInputBtn.addEventListener('click', () => {
            inputBox.value = '';
            lastFetchedValue = '';
            resetAll(false);
            validateInput();
        });

        pasteBtn.addEventListener('click', async () => {
            inputBox.focus();
            try {
                if (!navigator.clipboard || !navigator.clipboard.readText) throw new Error('clipboard unsupported');
                const text = await navigator.clipboard.readText();
                if (!text) {
                    showToast('Clipboard kosong', 'warning');
                    return;
                }
                inputBox.value = shouldSplitInput() && inputBox.value ? `${inputBox.value.trim()} ${text}` : text;
                validateInput();
                showToast('Teks ditempel', 'success');
            } catch (e) {
                showToast('Tahan kolom input lalu tempel manual', 'warning');
            }
        });

        historyLeft.addEventListener('click', () => historyRow.scrollBy({ left: -120, behavior: 'smooth' }));
        historyRight.addEventListener('click', () => historyRow.scrollBy({ left: 120, behavior: 'smooth' }));
        historyRow.addEventListener('scroll', updateHistoryArrows);
        desktopHistoryList.addEventListener('scroll', updateDesktopScrollIndicator);
        window.addEventListener('resize', () => {
            updateHistoryArrows();
            updateDesktopScrollIndicator();
        });

        refreshBtn.addEventListener('click', () => runApiCheck(true));
        window.addEventListener('online', () => runApiCheck(true));
        window.addEventListener('offline', () => runApiCheck(false));
        menuFab.addEventListener('click', () => toggleMenu());
        menuDim.addEventListener('click', () => toggleMenu(false));
        setupDragMenu();
    }

    function setupHeader() {
        document.title = `${tool.label} • RAAAN`;
        document.querySelector('meta[name="description"]')?.setAttribute('content', `RAAAN ${tool.label} - ${tool.desc}`);
        const bolt = document.querySelector('.brand .bolt i');
        if (bolt) bolt.className = tool.brandIcon || iconClass(tool.icon);
        const brandMain = document.querySelector('.brand-raaan');
        if (brandMain) brandMain.textContent = 'Raaan';
        const gen = document.querySelector('.brand-gen');
        if (gen) {
            gen.textContent = 'Tools';
            gen.style.color = 'var(--blue)';
        }
        const footer = $('pageFooter');
        footer.textContent = `${(tool.short || tool.label).toUpperCase()} © 2026 • RAAAN`;
        inputTitle.innerHTML = `<i class="${tool.brandIcon || iconClass(tool.icon)}"></i><span>${esc(tool.param === 'text' ? 'Teks Input' : tool.param === 'package' ? 'Nama Package' : 'Target URL')}</span>`;
        inputBox.placeholder = tool.placeholder || 'Masukkan input...';
        fetchBtn.innerHTML = `<i class="fa-solid ${tool.category === 'Downloader' ? 'fa-magnifying-glass' : 'fa-bolt'}"></i> ${esc(tool.button || 'EKSEKUSI')}`;
        document.documentElement.style.setProperty('--tool-accent', tool.accent || '#2f67ff');
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) activeTab.innerHTML = `<span>${esc(tool.category)} / ${esc(tool.label)}</span>`;
        const placeholderIcon = document.querySelector('#previewPlaceholder .icon i');
        if (placeholderIcon) placeholderIcon.className = tool.brandIcon || iconClass(tool.icon);
        const placeholderText = document.querySelector('#previewPlaceholder p');
        if (placeholderText) placeholderText.textContent = tool.category === 'Downloader' ? 'Preview, statistik, dan tombol download akan muncul di sini.' : 'Hasil akan muncul di sini sebagai UI.';
    }

    function initServiceWorker() {
        if ('serviceWorker' in navigator && location.protocol !== 'file:') {
            navigator.serviceWorker.register(appUrl('script/sw.js')).catch(() => {});
        }
    }

    (async () => {
        setupHeader();
        setupEvents();
        renderTutorials();
        renderMenus();
        loadHistory();
        validateInput();
        await runApiCheck(true);
        initServiceWorker();
    })();
})();
