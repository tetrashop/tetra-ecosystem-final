const fs = require('fs');
let code = fs.readFileSync('src/server.js', 'utf8');

// اصلاح بلاک اول (تراکنش‌ها در کیف پول)
code = code.replace(
    /transactions\.map\(t => `\s*<div style="padding: 0\.5rem; border-bottom: 1px solid rgba\(255,255,255,0\.1\);">\s*\$\{t\.amount\} TETRA - \$\{new Date\(t\.timestamp\)\.toLocaleString\('fa-IR'\)\}\s*<\/div>\s*`\)\.join\(''\)/g,
    `transactions.map(t => 
    '<div style="padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);">' +
    t.amount + ' TETRA - ' + new Date(t.timestamp).toLocaleString('fa-IR') +
    '</div>'
).join('')`
);

// اصلاح بلاک دوم (کاربران در پنل ادمین)
code = code.replace(
    /data\.users\.map\(user => `\s*<div style="padding: 1rem; border-bottom: 1px solid rgba\(255,255,255,0\.1\);">\s*<strong>\$\{user\.username\}<\/strong> \(\$\{user\.role\}\) - \$\{user\.email\}\s*<\/div>\s*`\)\.join\(''\)/g,
    `data.users.map(user => 
    '<div style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1);">' +
    '<strong>' + user.username + '</strong> (' + user.role + ') - ' + user.email +
    '</div>'
).join('')`
);

fs.writeFileSync('src/server.js', code, 'utf8');
console.log('دو نقطه اصلاح شد.');
