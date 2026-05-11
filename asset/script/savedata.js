const RAAAN_STORAGE = {
    MAX_HISTORY: 18,
    get(key, fallback = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            return fallback;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    },
    loadHistory(key) {
        const data = this.get(key, []);
        return Array.isArray(data) ? data : [];
    },
    saveHistory(key, items) {
        const sliced = Array.isArray(items) ? items.slice(0, this.MAX_HISTORY) : [];
        this.set(key, sliced);
        return sliced;
    },
    addHistory(key, value) {
        if (!value) return this.loadHistory(key);
        let list = this.loadHistory(key).filter(v => v !== value);
        list.unshift(value);
        return this.saveHistory(key, list);
    },
    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    },
    base64ToBlob(dataUrl) {
        const [meta, base64] = dataUrl.split(',');
        const mime = (meta.match(/data:(.*?);/) || [])[1] || 'application/octet-stream';
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return new Blob([bytes], { type: mime });
    }
};
