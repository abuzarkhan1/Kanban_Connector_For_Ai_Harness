const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const buildDir = path.join(__dirname, '../build')
const resourcesDir = path.join(__dirname, '../resources')

if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true })
if (!fs.existsSync(resourcesDir)) fs.mkdirSync(resourcesDir, { recursive: true })

// 1024x1024 SVG App Icon
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14171c" />
      <stop offset="100%" stop-color="#07080a" />
    </linearGradient>
    <linearGradient id="cardGlow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.16" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.04" />
    </linearGradient>
    <linearGradient id="accentGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#a0a5ad" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="24" stdDeviation="32" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Squircle / Base -->
  <rect x="64" y="64" width="896" height="896" rx="224" fill="url(#bg)" stroke="#22272e" stroke-width="8" filter="url(#shadow)" />

  <!-- Inner border highlight -->
  <rect x="72" y="72" width="880" height="880" rx="216" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="2" />

  <!-- Kanban Column 1 (Left / Backlog) -->
  <rect x="180" y="220" width="180" height="584" rx="28" fill="url(#cardGlow)" stroke="#ffffff" stroke-opacity="0.12" stroke-width="3"/>
  <rect x="206" y="260" width="128" height="120" rx="16" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2"/>
  <rect x="206" y="410" width="128" height="160" rx="16" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.08" stroke-width="2"/>
  <rect x="206" y="600" width="128" height="100" rx="16" fill="#ffffff" fill-opacity="0.04" stroke="#ffffff" stroke-opacity="0.06" stroke-width="2"/>

  <!-- Kanban Column 2 (Center / In Progress Active) -->
  <rect x="420" y="220" width="184" height="584" rx="28" fill="url(#cardGlow)" stroke="#ffffff" stroke-opacity="0.2" stroke-width="3"/>
  <!-- Glowing In-Progress Card -->
  <rect x="444" y="260" width="136" height="220" rx="18" fill="url(#accentGlow)" filter="url(#shadow)"/>
  <!-- Card interior details -->
  <rect x="468" y="292" width="88" height="16" rx="8" fill="#07080a" fill-opacity="0.85"/>
  <rect x="468" y="324" width="60" height="12" rx="6" fill="#07080a" fill-opacity="0.5"/>
  <rect x="468" y="420" width="40" height="24" rx="6" fill="#07080a" fill-opacity="0.8"/>

  <rect x="444" y="510" width="136" height="140" rx="16" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2"/>

  <!-- Kanban Column 3 (Right / Done) -->
  <rect x="664" y="220" width="180" height="584" rx="28" fill="url(#cardGlow)" stroke="#ffffff" stroke-opacity="0.12" stroke-width="3"/>
  <rect x="690" y="260" width="128" height="150" rx="16" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2"/>
  <rect x="690" y="440" width="128" height="130" rx="16" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2"/>
  <rect x="690" y="600" width="128" height="140" rx="16" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2"/>

  <!-- Connection pulse line at bottom -->
  <circle cx="512" cy="740" r="10" fill="#ffffff" />
  <circle cx="512" cy="740" r="20" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="2"/>
</svg>
`

const svgPath = path.join(buildDir, 'icon.svg')
fs.writeFileSync(svgPath, svg, 'utf8')
fs.writeFileSync(path.join(resourcesDir, 'icon.svg'), svg, 'utf8')
console.log('Created icon.svg in build/ and resources/')
