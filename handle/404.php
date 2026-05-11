<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Jaringan Bermasalah • Raaan Tools</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>
    :root{--bg:#efefe8;--panel:#fffdf8;--ink:#111;--red:#ff5e57;--yellow:#ffd84f;--blue:#2f67ff;--border:2.3px solid #111;--shadow:4px 4px 0 #111;--radius:18px}*{box-sizing:border-box}body{margin:0;min-height:100dvh;display:grid;place-items:center;padding:20px;font-family:'Space Grotesk',system-ui,sans-serif;background:radial-gradient(circle at 10px 10px,rgba(0,0,0,.13) 1.4px,transparent 1.6px),linear-gradient(180deg,#f4f4ef,#eaeae3);background-size:18px 18px,100% 100%;color:var(--ink)}.card{width:min(92vw,430px);background:var(--panel);border:var(--border);border-radius:var(--radius);box-shadow:var(--shadow);padding:26px 20px;text-align:center}.icon{width:84px;height:84px;margin:0 auto 16px;display:grid;place-items:center;background:var(--yellow);border:var(--border);border-radius:22px;box-shadow:3px 3px 0 #111;font-size:2.1rem}h1{margin:0 0 8px;font-size:1.25rem;text-transform:uppercase}p{margin:0;color:#333;font-weight:800;line-height:1.45;font-size:.88rem}.actions{display:grid;gap:10px;margin-top:18px}button,a{border:var(--border);border-radius:13px;padding:12px 14px;font-weight:900;text-transform:uppercase;text-decoration:none;box-shadow:3px 3px 0 #111;color:#111;background:#fff}button{background:var(--blue);color:#fff}a{background:var(--yellow)}
  </style>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={darkMode:'class',theme:{extend:{fontFamily:{space:['Space Grotesk','system-ui','sans-serif']}}}}</script>
</head>
<body>
  <div class="card">
    <div class="icon"><i class="fa-solid fa-wifi-slash"></i></div>
    <h1>Jaringan Bermasalah</h1>
    <p>Koneksi internet putus atau halaman tidak ditemukan. Coba refresh setelah jaringan normal.</p>
    <div class="actions">
      <button onclick="location.reload()"><i class="fa-solid fa-rotate-right"></i> Refresh</button>
      <a href="/"><i class="fa-solid fa-house"></i> Beranda</a>
    </div>
  </div>
</body>
</html>