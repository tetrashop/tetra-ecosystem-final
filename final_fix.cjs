const fs = require('fs');
const srcPath = fs.existsSync('src/server.js') ? 'src/server.js' : 'src/server.cjs';
if (!fs.existsSync(srcPath)) {
    console.error('فایل src/server.js یا src/server.cjs یافت نشد.');
    process.exit(1);
}
let code = fs.readFileSync(srcPath, 'utf8');

// حذف خطوط import.meta.url و __filename/__dirname
code = code.replace(/const\s+__filename\s*=\s*fileURLToPath\(import\.meta\.url\)\s*;?/g, '');
code = code.replace(/const\s+__dirname\s*=\s*path\.dirname\(__filename\)\s*;?/g, '');
code = code.replace(/const\s+__dirname\s*=\s*dirname\(__filename\)\s*;?/g, '');

// تبدیل انواع import
code = code.replace(/import\s+(\w+)\s+from\s+'([^']+)';/g, "const $1 = require('$2');");
code = code.replace(/import\s+\*\s+as\s+(\w+)\s+from\s+'([^']+)';/g, "const $1 = require('$2');");
code = code.replace(/import\s+\{\s*([^}]+)\s*\}\s+from\s+'([^']+)';/g, (match, members, module) => {
    let cleaned = members.replace(/\s+as\s+/g, ': ');
    return `const { ${cleaned} } = require('${module}');`;
});
code = code.replace(/import\s+'([^']+)';/g, "require('$1');");

// export default
code = code.replace(/export\s+default\s+class\s+(\w+)/g, "class $1");
code = code.replace(/export\s+default\s+function\s+(\w+)/g, "function $1");
code = code.replace(/export\s+default\s+/g, '');

// پاک‌سازی نهایی
code = code.replace(/import\.meta\.url/g, '""');

// ذخیره در فایل server.cjs (اگر ورودی server.js بود، خروجی را server.cjs بگذاریم تا تمایز مشخص باشد)
const destPath = srcPath.endsWith('.cjs') ? srcPath : 'src/server.cjs';
fs.writeFileSync(destPath, code, 'utf8');
console.log(`فایل ${destPath} به‌روز شد.`);
