const fs = require('fs');
const path = require('path');

const svg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#18181b"/>
  <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="${size * 0.4}" fill="white">W</text>
</svg>`;

const dir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Write SVG files as placeholders
fs.writeFileSync(path.join(dir, 'icon-192.png'), svg(192));
fs.writeFileSync(path.join(dir, 'icon-512.png'), svg(512));

console.log('Placeholder icons generated.');
