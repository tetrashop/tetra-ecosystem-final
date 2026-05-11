const fs = require('fs');
let code = fs.readFileSync('src/server.js', 'utf8');

// 1. import default: import X from 'Y'  (ممکن است پیش از آن فاصله باشد)
code = code.replace(/import\s+(\w+)\s+from\s+'([^']+)';/g, "const $1 = require('$2');");
// 2. import * as X from 'Y'
code = code.replace(/import\s+\*\s+as\s+(\w+)\s+from\s+'([^']+)';/g, "const $1 = require('$2');");
// 3. import { members } from 'Y'  (با در نظر گرفتن as و فاصله)
code = code.replace(/import\s+\{\s*([^}]+)\s*\}\s+from\s+'([^']+)';/g, (match, members, module) => {
    // تبدیل alias مثل { foo as bar } به foo: bar
    let cleaned = members.replace(/\s+as\s+/g, ': ');
    return `const { ${cleaned} } = require('${module}');`;
});
// 4. import 'Y'
code = code.replace(/import\s+'([^']+)';/g, "require('$1');");
// 5. import { a, b } from 'Y' (بدون فاصله اضافی) - pattern قبلی باید کار کنه.
// 6. ممکن است import با خط شکسته شده باشد؟ بعید است.

// حذف هرگونه export default (اگر وجود داشته باشد) و تبدیل به module.exports
code = code.replace(/export default class (\w+)/g, "class $1");
code = code.replace(/export default /g, "");
// اگر کلاس بدون export بود و در پایان module.exports وجود نداشت، چیزی اضافه نمی‌کنیم، چون اجرای مستقیم است.

fs.writeFileSync('src/server.js', code, 'utf8');
console.log('تمام importها تبدیل شدند.');
