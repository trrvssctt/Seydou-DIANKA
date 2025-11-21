#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const distSrc = path.join(root, 'dist');
const serverDist = path.join(root, 'server', 'dist');

try {
  console.log('Running frontend build (vite)...');
  execSync('npm run build', { stdio: 'inherit', cwd: root });

  // Remove existing server/dist
  if (fs.existsSync(serverDist)) {
    console.log('Removing existing server/dist...');
    fs.rmSync(serverDist, { recursive: true, force: true });
  }

  // Move/copy dist to server/dist
  console.log('Copying dist to server/dist...');
  copyRecursiveSync(distSrc, serverDist);

  console.log('Build and copy complete. server/dist is ready.');
} catch (err) {
  console.error('Build-and-copy failed:', err);
  process.exit(1);
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}
