const path = require('path')
const fs = require('fs')
const { encodeChar } = require('./encode');

// Rarely changed arguments
const TEMPLATE_REG = /"[^"]*"/gi
const BOM_PREFIX = '\ufeff';
const TARGET_FOLDER = './localisation'

// CML
const args = process.argv;
const rootFolder = path.resolve('.')
const sourceFolder = path.resolve(args[2])
const targetFolder = path.resolve(TARGET_FOLDER)

// Ensure the target folder
if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder)
}

// Read & write
const fileList = fs.readdirSync(sourceFolder)
for (const name of fileList) {
    console.log(`[encode] Processing ${name}...`)
    const content = fs.readFileSync(path.join(sourceFolder, name), { encoding: 'utf-8' })
    const encoded = content.replace(TEMPLATE_REG, match => `"${
            Array.from(match.slice(1, match.length - 1))
                .map(encodeChar)
                .join('')
        }"`
    )
    fs.writeFileSync(path.join(targetFolder, name), BOM_PREFIX + encoded, { encoding: 'utf-8' })
}

