<?php
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim($path, '/');

if ($path === '') {
    require __DIR__ . '/../index.php';
    exit;
}

if ($path === 'api' || $path === 'api/') {
    require __DIR__ . '/index.php';
    exit;
}

$file = __DIR__ . '/../' . $path;

if (is_dir($file) && file_exists($file . '/index.php')) {
    require $file . '/index.php';
    exit;
}

if (file_exists($file) && pathinfo($file, PATHINFO_EXTENSION) === 'php') {
    require $file;
    exit;
}

if (file_exists($file)) {
    return false;
}

http_response_code(404);
require __DIR__ . '/../handle/404.php';
