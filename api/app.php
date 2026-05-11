<?php

$path = trim(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH),
    '/'
);

if ($path === '') {
    require __DIR__ . '/../index.php';
    exit;
}

if (
    $path === 'api' ||
    str_starts_with($path, 'api/')
) {
    require __DIR__ . '/index.php';
    exit;
}

$file = __DIR__ . '/../' . $path;

if (
    is_dir($file) &&
    file_exists($file . '/index.php')
) {
    require $file . '/index.php';
    exit;
}

if (
    file_exists($file) &&
    pathinfo($file, PATHINFO_EXTENSION) === 'php'
) {
    require $file;
    exit;
}

if (file_exists($file)) {
    return false;
}

http_response_code(404);

echo '404 Not Found';
