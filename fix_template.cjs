const fs = require('fs');
let code = fs.readFileSync('src/server.js', 'utf8');

code = code.replace(/`([^`]*?<[^>]+>[^`]*?)`/gs, (match, inner) => {
    if (/\$\{/.test(inner)) {
        let parts = inner.split(/(\$\{[^}]*\})/g);
        let result = '';
        for (let part of parts) {
            if (part.startsWith('${')) {
                let varName = part.slice(2, -1);
                result += '\' + ' + varName + ' + \'';
            } else {
                let escaped = part.replace(/'/g, "\\'");
                result += escaped;
            }
        }
        result = result.replace(/^'\s*\+\s*/, '').replace(/\s*\+\s*'$/, '');
        if (result === '\'\'') result = '\"\"';
        if (!/^[^']/.test(result) && !result.startsWith('+')) {
            result = "'" + result + "'";
        }
        return result;
    } else {
        let escaped = inner.replace(/'/g, "\\'");
        return "'" + escaped + "'";
    }
});

fs.writeFileSync('src/server.js', code, 'utf8');
console.log('Done.');
