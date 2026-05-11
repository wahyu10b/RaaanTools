<?php
declare(strict_types=1);

return [
    'brat'      => ['endpoint' => '/sticker/brat',       'param' => 'text',    'category' => 'generator'],
    'bratvid'   => ['endpoint' => '/sticker/bratvid',    'param' => 'text',    'category' => 'generator'],
    'tiktok'    => ['endpoint' => '/download/tiktok',    'param' => 'url',     'category' => 'downloader'],
    'instagram' => ['endpoint' => '/download/instagram', 'param' => 'url',     'category' => 'downloader'],
    'facebook'  => ['endpoint' => '/download/facebook',  'param' => 'url',     'category' => 'downloader'],
    'x'         => ['endpoint' => '/download/x',         'param' => 'url',     'category' => 'downloader'],
    'capcut'    => ['endpoint' => '/download/capcut',    'param' => 'url',     'category' => 'downloader'],
    'ytmp3'     => ['endpoint' => '/download/ytmp3',     'param' => 'url',     'category' => 'downloader'],
    'ytmp4'     => ['endpoint' => '/download/ytmp4',     'param' => 'url',     'category' => 'downloader'],
    'mediafire' => ['endpoint' => '/download/mediafire', 'param' => 'url',     'category' => 'downloader'],
    'gdrive'    => ['endpoint' => '/download/gdrive',    'param' => 'url',     'category' => 'downloader'],
    'github'    => ['endpoint' => '/download/github',    'param' => 'url',     'category' => 'downloader'],
    'npm'       => ['endpoint' => '/download/npm',       'param' => 'package', 'category' => 'downloader'],
    'pinterest' => ['endpoint' => '/download/pinterest', 'param' => 'url',     'category' => 'downloader'],
    'reddit'    => ['endpoint' => '/download/reddit',    'param' => 'url',     'category' => 'downloader'],
    'lahelu'    => ['endpoint' => '/download/lahelu',    'param' => 'url',     'category' => 'downloader'],
    'qrcode'    => ['endpoint' => '/tools/qrcode',       'param' => 'text',    'category' => 'tools', 'defaults' => ['format' => 'png']],
    'removebg'  => ['endpoint' => '/tools/removebg',     'param' => 'url',     'category' => 'tools'],
    'ssweb'     => ['endpoint' => '/tools/ssweb',        'param' => 'url',     'category' => 'tools', 'defaults' => ['type' => 'desktop', 'full' => 'false']],
    'upscale'   => ['endpoint' => '/tools/upscale',      'param' => 'url',     'category' => 'tools', 'defaults' => ['scale' => '2']],
];
