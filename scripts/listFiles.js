const fs = require('fs')
const path = require('path')

// List all files in a directory in Node.js recursively and synchronously
const listDeepSync = (dir, filelist=[]) => {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
        const fullPath = path.join(dir, file)
        if (fs.statSync(fullPath).isDirectory()) {
            filelist = listDeepSync(fullPath, filelist)
        } else {
            filelist.push(fullPath)
        }
    })
    return filelist
};

// Get rid of common prefix of two paths
const stripPathPrefix = (string, prefix) => {
    const fullPrefix = prefix[prefix.length - 1] === '/' ? prefix : prefix + '/'
    let i = 0;
    for (i = 0; i < fullPrefix.length; i++) {
        if (string[i] !== fullPrefix[i]) break
    }
    return string.substring(i)
}

exports.listDeepSync = listDeepSync
exports.stripPathPrefix = stripPathPrefix
