const path = require('path')
const fs = require('fs-extra')
const { encodeChar } = require('./encode');
const { listDeepSync, stripPathPrefix } = require('./listFiles')

// Rarely changed arguments
const TEMPLATE_REG = /"[^"]*"/gi
const BOM_PREFIX = '\ufeff';
const TARGET_FOLDER = './localisation'

// CML
const args = process.argv;
const sourceFolder = path.resolve(args[2])
const targetFolder = path.resolve(TARGET_FOLDER)

// Ensure the target folder is up-to-date
fs.ensureDir(targetFolder)
fs.emptyDirSync(targetFolder)

// Read & write
const fileList = listDeepSync(sourceFolder)
for (const fullPath of fileList) {
    const subPath = stripPathPrefix(fullPath, sourceFolder)
    const newFilePath = path.resolve(targetFolder, subPath)

    console.log(`[encode] Processing ${subPath}...`)
    fs.ensureFileSync(newFilePath)
    const content = fs.readFileSync(fullPath, { encoding: 'utf-8' })
    const encoded = content.replace(TEMPLATE_REG, match => `"${
            Array.from(match.slice(1, match.length - 1))
                .map(encodeChar)
                .join('')
        }"`
    )
    fs.writeFileSync(newFilePath, BOM_PREFIX + encoded, { encoding: 'utf-8' })
}
