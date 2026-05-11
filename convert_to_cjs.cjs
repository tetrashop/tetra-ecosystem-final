const fs = require('fs');
let code = fs.readFileSync('src/server.js', 'utf8');

// تبدیل import x from 'y' به const x = require('y')
code = code.replace(/import (\w+) from '([^']+)';/g, "const $1 = require('$2');");
// تبدیل import { x } from 'y'
code = code.replace(/import \{ (\w+) \} from '([^']+)';/g, "const { $1 } = require('$2');");
// تبدیل import 'y'
code = code.replace(/import '([^']+)';/g, "require('$1');");

fs.writeFileSync('src/server.js', code, 'utf8');
console.log('تبدیل به CommonJS انجام شد.');
