<?php
/**
 * Raaan Tools PHP Proxy V7
 * PHP 8.2+ ready, tokenized request, allowlist endpoint, cache ringan.
 */
declare(strict_types=1);

require_once __DIR__ . '/includes/env.php';

$TOOLS = require __DIR__ . '/includes/tools.php';

$API_BASE = rtrim(env_value('RAAAN_API_BASE', 'https://api.pixxxry.eu.cc'), '/');
$SECRET = env_value('RAAAN_TOKEN_SECRET', 'change-this-secret-in-vercel-env');
$TOKEN_TTL = max(30, (int) env_value('RAAAN_TOKEN_TTL', '120'));
$TIMEOUT_SECONDS = max(8, (int) env_value('RAAAN_TIMEOUT_SECONDS', '18'));
$CACHE_SECONDS = max(0, (int) env_value('RAAAN_CACHE_SECONDS', '25'));

function send_json(array $data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function request_input(): array {
    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    $input = $_GET;
    if ($method === 'POST') {
        $raw = file_get_contents('php://input') ?: '';
        $json = json_decode($raw, true);
        $input = array_merge($input, is_array($json) ? $json : $_POST);
    }
    return $input;
}

function token_make(string $tool, string $secret, int $ttl): array {
    $exp = time() + $ttl;
    $nonce = bin2hex(random_bytes(8));
    $payload = $tool . '|' . $exp . '|' . $nonce;
    $sig = hash_hmac('sha256', $payload, $secret);
    return ['token' => base64_encode($payload . '|' . $sig), 'expires' => $exp, 'expires_ms' => $exp * 1000];
}

function token_valid(string $token, string $tool, string $secret): bool {
    $raw = base64_decode($token, true);
    if (!$raw) return false;
    $parts = explode('|', $raw);
    if (count($parts) !== 4) return false;
    [$tokenTool, $exp, $nonce, $sig] = $parts;
    if (!hash_equals($tokenTool, $tool)) return false;
    if (!ctype_digit($exp) || (int)$exp < time()) return false;
    $expected = hash_hmac('sha256', $tokenTool . '|' . $exp . '|' . $nonce, $secret);
    return hash_equals($expected, $sig);
}

function cache_file(string $url): string {
    $dir = __DIR__ . '/storage/cache';
    if (!is_dir($dir)) @mkdir($dir, 0775, true);
    return $dir . '/' . sha1($url) . '.cache';
}

function curl_fetch(string $url, int $timeout): array {
    if (!function_exists('curl_init')) {
        $ctx = stream_context_create(['http' => ['timeout' => $timeout, 'header' => "User-Agent: RaaanTools/7.0\r\nAccept: */*\r\n"]]);
        $body = @file_get_contents($url, false, $ctx);
        return $body === false
            ? ['ok' => false, 'status' => 502, 'type' => 'application/json', 'body' => json_encode(['status' => false, 'message' => 'Upstream gagal diakses.'])]
            : ['ok' => true, 'status' => 200, 'type' => 'application/json', 'body' => $body];
    }
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_TIMEOUT => $timeout,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_USERAGENT => 'RaaanTools/7.0',
        CURLOPT_HEADER => true,
        CURLOPT_HTTPHEADER => ['Accept: application/json,image/*,video/*,audio/*,*/*', 'X-Raaan-Proxy: v7'],
    ]);
    $raw = curl_exec($ch);
    $errno = curl_errno($ch);
    $err = curl_error($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $contentType = (string) curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    $headerSize = (int) curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    curl_close($ch);
    if ($raw === false || $errno) {
        return ['ok' => false, 'status' => 502, 'type' => 'application/json', 'body' => json_encode(['status' => false, 'message' => $err ?: 'Proxy request failed'])];
    }
    return ['ok' => $status >= 200 && $status < 300, 'status' => $status ?: 200, 'type' => $contentType ?: 'application/octet-stream', 'body' => substr($raw, $headerSize)];
}

$input = request_input();
$toolKey = strtolower((string)($input['tool'] ?? $input['__tool'] ?? ''));
if ($toolKey === '' || !isset($TOOLS[$toolKey])) {
    send_json(['status' => false, 'message' => 'Tool tidak terdaftar / tujuan tidak ada.', 'available' => array_keys($TOOLS)], 404);
}

if (($input['action'] ?? '') === 'token') {
    send_json(['status' => true, 'creator' => 'raaan', 'proxy' => 'php-v7', 'tool' => $toolKey] + token_make($toolKey, $SECRET, $TOKEN_TTL));
}

$token = (string)($input['raan_token'] ?? $_SERVER['HTTP_X_RAAAN_TOKEN'] ?? '');
if (!token_valid($token, $toolKey, $SECRET)) {
    send_json(['status' => false, 'message' => 'Token tidak valid / expired. Refresh halaman lalu coba lagi.'], 401);
}

$tool = $TOOLS[$toolKey];
if (isset($input['ping'])) {
    send_json(['status' => true, 'creator' => 'raaan', 'proxy' => 'php-v7', 'tool' => $toolKey, 'endpoint' => $tool['endpoint']]);
}

$param = $tool['param'];
$value = trim((string)($input[$param] ?? ''));
if ($value === '') send_json(['status' => false, 'message' => "Parameter {$param} wajib diisi."], 422);

$query = array_merge($tool['defaults'] ?? [], [$param => $value]);
$targetUrl = $API_BASE . $tool['endpoint'] . '?' . http_build_query($query);
$cacheable = ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET' && strlen($targetUrl) < 1800 && $CACHE_SECONDS > 0;
$cachePath = cache_file($targetUrl);

if ($cacheable && is_file($cachePath) && (time() - filemtime($cachePath) <= $CACHE_SECONDS)) {
    $cached = json_decode((string)file_get_contents($cachePath), true);
    if (is_array($cached) && isset($cached['type'], $cached['body'])) {
        header('X-Raaan-Cache: HIT');
        header('X-Raaan-Proxy: php-v7');
        header('Content-Type: ' . $cached['type']);
        header('Cache-Control: public, max-age=' . $CACHE_SECONDS);
        echo base64_decode((string)$cached['body']);
        exit;
    }
}

$result = curl_fetch($targetUrl, $TIMEOUT_SECONDS);
http_response_code($result['status']);
header('X-Raaan-Cache: MISS');
header('X-Raaan-Proxy: php-v7');
header('X-Upstream-Status: ' . $result['status']);
header('Content-Type: ' . $result['type']);
header('Cache-Control: public, max-age=' . $CACHE_SECONDS);

if ($cacheable && $result['ok'] && strlen((string)$result['body']) <= 4 * 1024 * 1024) {
    @file_put_contents($cachePath, json_encode(['type' => $result['type'], 'body' => base64_encode((string)$result['body'])]));
}

echo $result['body'];
