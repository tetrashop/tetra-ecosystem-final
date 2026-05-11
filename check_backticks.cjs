const fs = require('fs');
const lines = fs.readFileSync('src/server.js', 'utf8').split('\n');

let open = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // شمارش بک‌تیک‌ها در این خط (با احتساب بک‌تیک‌های escape شده)
    const count = (line.match(/`/g) || []).length;
    // اگر قبلاً درون یک template literal باز باشیم
    if (open % 2 === 1) {
        // همچنان درون template هستیم تا وقتی که بسته شود
        open += count;
        if (open % 2 === 0) {
            // بسته شد
            continue;
        }
    } else {
        open = count;
    }
    // اگر تعداد بک‌تیک‌ها فرد باشد یعنی در این خط باز مانده
    if (open % 2 === 1) {
        console.log(`خط ${i+1}: بک‌تیک باز بدون بسته شدن - تعداد: ${open}`);
        console.log(`  محتوا: ${line.trim().substring(0, 80)}...`);
        // ادامه می‌دهیم تا ببینیم کجا بسته می‌شود
    }
}
console.log('پایان بررسی.');
