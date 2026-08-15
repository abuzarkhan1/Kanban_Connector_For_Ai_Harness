const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const rootLogo = path.join(__dirname, '../logo.png')
const buildDir = path.join(__dirname, '../build')
const resourcesDir = path.join(__dirname, '../resources')
const iconsetDir = path.join(buildDir, 'icons.iconset')

if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true })
if (!fs.existsSync(resourcesDir)) fs.mkdirSync(resourcesDir, { recursive: true })

if (fs.existsSync(rootLogo)) {
  console.log('Generating icon bundles from logo.png...')
  if (!fs.existsSync(iconsetDir)) fs.mkdirSync(iconsetDir, { recursive: true })

  const sizes = [
    { size: 16, name: 'icon_16x16.png' },
    { size: 32, name: 'icon_16x16@2x.png' },
    { size: 32, name: 'icon_32x32.png' },
    { size: 64, name: 'icon_32x32@2x.png' },
    { size: 128, name: 'icon_128x128.png' },
    { size: 256, name: 'icon_128x128@2x.png' },
    { size: 256, name: 'icon_256x256.png' },
    { size: 512, name: 'icon_256x256@2x.png' },
    { size: 512, name: 'icon_512x512.png' },
    { size: 1024, name: 'icon_512x512@2x.png' }
  ]

  for (const s of sizes) {
    execSync(`sips -z ${s.size} ${s.size} "${rootLogo}" --out "${path.join(iconsetDir, s.name)}"`, { stdio: 'ignore' })
  }

  // Generate .icns for macOS
  try {
    execSync(`iconutil -c icns "${iconsetDir}" -o "${path.join(buildDir, 'icon.icns')}"`, { stdio: 'inherit' })
  } catch (e) {
    console.warn('iconutil not supported or failed, skipping .icns creation')
  }

  // Generate 512x512 PNGs
  execSync(`sips -z 512 512 "${rootLogo}" --out "${path.join(buildDir, 'icon.png')}"`, { stdio: 'ignore' })
  execSync(`sips -z 512 512 "${rootLogo}" --out "${path.join(resourcesDir, 'icon.png')}"`, { stdio: 'ignore' })

  // Clean iconset directory
  fs.rmSync(iconsetDir, { recursive: true, force: true })
  console.log('Successfully generated icon.icns and icon.png assets!')
}

