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

$apiBase = rtrim(
    raan_env('RAAAN_API_BASE', 'https://api.pixxxry.eu.cc'),
    '/'
);

$timeout = (int) raan_env('RAAAN_TIMEOUT_SECONDS', 25);

$tool = strtolower(
    trim((string)($_GET['tool'] ?? $_POST['tool'] ?? ''))
);

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
    'brat' => '/sticker/brat',
    'bratvid' => '/sticker/bratvid',
    'qrcode' => '/tools/qrcode',
    'removebg' => '/tools/removebg',
    'ssweb' => '/tools/ssweb',
    'upscale' => '/tools/upscale'
];

function raan_json($data, int $code = 200): void
{
    http_response_code($code);

    echo json_encode(
        $data,
        JSON_UNESCAPED_SLASHES |
        JSON_UNESCAPED_UNICODE
    );

    exit;
}

if ($tool === '') {
    raan_json([
        'status' => true,
        'name' => 'RaaanTools API',
        'message' => 'API gateway is running.'
    ]);
}

if (!isset($routes[$tool])) {
    raan_json([
        'status' => false,
        'message' => 'Tool tidak tersedia.'
    ], 404);
}

$params = $_GET;

unset(
    $params['tool'],
    $params['action'],
    $params['raan_token']
);

foreach ($_POST as $key => $value) {
    if (
        !isset($params[$key]) &&
        !in_array(
            $key,
            ['tool', 'action', 'raan_token'],
            true
        )
    ) {
        $params[$key] = $value;
    }
}

if (empty($params)) {
    raan_json([
        'status' => false,
        'message' => 'Parameter kosong.'
    ], 400);
}

$target =
    $apiBase .
    $routes[$tool] .
    '?' .
    http_build_query($params);

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

$contentType = curl_getinfo(
    $ch,
    CURLINFO_CONTENT_TYPE
);

curl_close($ch);

if ($response === false || $response === '') {
    raan_json([
        'status' => false,
        'message' => 'Gateway gagal.',
        'tool' => $tool,
        'error' => $error
    ], 502);
}

if ($code >= 400) {
    raan_json([
        'status' => false,
        'message' => 'Service error.',
        'tool' => $tool,
        'code' => $code
    ], 200);
}

if ($contentType) {
    header('Content-Type: ' . $contentType);
}

http_response_code(200);

echo $response;
