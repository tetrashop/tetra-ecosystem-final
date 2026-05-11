exports.homePage = (user) => `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head><meta charset="UTF-8"><title>🏆 Tetra Ecosystem</title>
<style>body{background:#0f0c29;color:#fff;font-family:Tahoma;margin:0;padding:20px}
.container{max-width:1200px;margin:auto}
.header{text-align:center;padding:2rem;background:rgba(255,255,255,0.1);border-radius:15px}
.nav{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin:1rem 0}
.nav a{color:#00ff88;text-decoration:none;padding:0.8rem 1.5rem;border:2px solid #00ff88;border-radius:8px}
.nav a:hover{background:#00ff88;color:#000}
</style></head>
<body>
<div class="container">
<div class="header"><h1>🏆 اکوسیستم تترا</h1><p>${user ? `خوش آمدید ${user.username}` : 'ورود نکرده‌اید'}</p>
<div class="nav"><a href="/login">ورود</a><a href="/register">ثبت‌نام</a><a href="/wallet">کیف پول</a><a href="/admin">مدیریت</a></div></div>
</div></body></html>`;

exports.loginPage = () => `...`; // خلاصه برای نمونه، فایل واقعی کامل را در اسکریپت جای می‌دهیم.
