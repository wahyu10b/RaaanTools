<?php

require_once __DIR__ . '/../includes/env.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Raaan-Token');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$apiBase = rtrim(raan_env('RAAAN_API_BASE', 'https://api.pixxxry.eu.cc'), '/');
$timeout = (int) raan_env('RAAAN_TIMEOUT_SECONDS', 25);

$tool = $_GET['tool'] ?? $_POST['tool'] ?? '';
$tool = strtolower(trim($tool));

$routes = [
    'tiktok' => '/download/tiktok',
    'instagram' => '/download/instagram',
    'facebook' => '/download/facebook',
    'twitter' => '/download/twitter',
    'x' => '/download/twitter',
    'capcut' => '/download/capcut',
    'mediafire' => '/download/mediafire',
    'gdrive' => '/download/gdrive',
    'github' => '/download/github',
    'npm' => '/download/npm',
    'pinterest' => '/download/pinterest',
    'reddit' => '/download/reddit',
    'lahelu' => '/download/lahelu',
    'ytmp3' => '/download/ytmp3',
    'ytmp4' => '/download/ytmp4',
    'brat' => '/maker/brat',
    'bratvid' => '/maker/bratvid',
    'qrcode' => '/tools/qrcode',
    'removebg' => '/tools/removebg',
    'ssweb' => '/tools/ssweb',
    'upscale' => '/tools/upscale'
];

function out($data, $code = 200) {
    http_response_code($code);
    echo is_string($data)
        ? $data
        : json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

if ($tool === '') {
    out([
        'status' => false,
        'message' => 'Tool kosong.',
        'available_tools' => array_keys($routes)
    ], 400);
}

if (!isset($routes[$tool])) {
    out([
        'status' => false,
        'message' => 'Tool tidak tersedia.',
        'tool' => $tool,
        'available_tools' => array_keys($routes)
    ], 404);
}

$params = $_GET;
unset($params['tool'], $params['action'], $params['raan_token']);

foreach ($_POST as $key => $value) {
    if (!isset($params[$key]) && !in_array($key, ['tool', 'action', 'raan_token'], true)) {
        $params[$key] = $value;
    }
}

$target = $apiBase . $routes[$tool];

if (!empty($params)) {
    $target .= '?' . http_build_query($params);
}

$ch = curl_init($target);

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => $timeout,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_HTTPHEADER => [
        'User-Agent: RaaanTools/7.0',
        'Accept: application/json,text/plain,*/*'
    ]
]);

$response = curl_exec($ch);
$error = curl_error($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false || $response === '') {
    out([
        'status' => false,
        'message' => 'API proxy gagal.',
        'tool' => $tool,
        'error' => $error,
        'target_hidden' => true
    ], 502);
}

http_response_code($code ?: 200);
echo $response;
