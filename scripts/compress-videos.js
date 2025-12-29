#!/usr/bin/env node

/**
 * Video Compression Script
 * Compresses hero background videos for optimal web performance
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../public/images');
const BACKUP_DIR = path.join(IMAGES_DIR, 'backup');
const FFMPEG = '/opt/homebrew/bin/ffmpeg';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / (1024 * 1024)).toFixed(2) + ' MB';
  } catch {
    return 'N/A';
  }
}

function compressMP4(input, output, resolution, maxrate, bufsize, crf) {
  log(`\nCompressing: ${path.basename(input)} -> ${path.basename(output)}`, 'yellow');
  log(`  Resolution: ${resolution}, Bitrate: ${maxrate}, CRF: ${crf}`);
  
  try {
    execSync(
      `${FFMPEG} -i "${input}" ` +
      `-c:v libx264 -preset slow -crf ${crf} ` +
      `-maxrate ${maxrate} -bufsize ${bufsize} ` +
      `-vf "scale=${resolution}" ` +
      `-c:a aac -b:a 128k ` +
      `-movflags +faststart -pix_fmt yuv420p ` +
      `-y "${output}"`,
      { stdio: 'inherit' }
    );
    return true;
  } catch (error) {
    log(`Error compressing ${input}: ${error.message}`, 'yellow');
    return false;
  }
}

function createWebM(input, output, resolution, crf) {
  log(`\nCreating WebM: ${path.basename(input)} -> ${path.basename(output)}`, 'yellow');
  log(`  Resolution: ${resolution}, CRF: ${crf}`);
  
  try {
    execSync(
      `${FFMPEG} -i "${input}" ` +
      `-c:v libvpx-vp9 -crf ${crf} -b:v 0 ` +
      `-vf "scale=${resolution}" ` +
      `-c:a libopus -b:a 128k ` +
      `-row-mt 1 ` +
      `-y "${output}"`,
      { stdio: 'inherit' }
    );
    return true;
  } catch (error) {
    log(`Error creating WebM ${output}: ${error.message}`, 'yellow');
    return false;
  }
}

// Main execution
function main() {
  log('🎬 Starting video compression...', 'green');
  
  // Create backup directory
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  const desktopVideo = path.join(IMAGES_DIR, 'hero-bg.mp4');
  const mobileVideo = path.join(IMAGES_DIR, 'hero-bg-mobile.mp4');
  
  // Check if files exist
  if (!fs.existsSync(desktopVideo)) {
    log('❌ hero-bg.mp4 not found!', 'yellow');
    process.exit(1);
  }
  
  // Backup original files
  log('\n📦 Creating backups...', 'green');
  if (fs.existsSync(desktopVideo)) {
    fs.copyFileSync(desktopVideo, path.join(BACKUP_DIR, 'hero-bg-original.mp4'));
  }
  if (fs.existsSync(mobileVideo)) {
    fs.copyFileSync(mobileVideo, path.join(BACKUP_DIR, 'hero-bg-mobile-original.mp4'));
  }
  log('✓ Backups created', 'green');
  
  // Show original sizes
  log('\nOriginal file sizes:', 'green');
  if (fs.existsSync(desktopVideo)) {
    log(`  hero-bg.mp4: ${getFileSize(desktopVideo)}`);
  }
  if (fs.existsSync(mobileVideo)) {
    log(`  hero-bg-mobile.mp4: ${getFileSize(mobileVideo)}`);
  }
  
  // Compress desktop video
  if (fs.existsSync(desktopVideo)) {
    const tempFile = path.join(IMAGES_DIR, 'hero-bg-temp.mp4');
    if (compressMP4(desktopVideo, tempFile, '1920:1080', '5M', '10M', '23')) {
      fs.renameSync(tempFile, desktopVideo);
      log(`✓ Desktop video compressed: ${getFileSize(desktopVideo)}`, 'green');
      
      // Create WebM version
      const webmFile = path.join(IMAGES_DIR, 'hero-bg.webm');
      if (createWebM(desktopVideo, webmFile, '1920:1080', '30')) {
        log(`✓ Desktop WebM created: ${getFileSize(webmFile)}`, 'green');
      }
    }
  }
  
  // Compress mobile video
  if (fs.existsSync(mobileVideo)) {
    const tempFile = path.join(IMAGES_DIR, 'hero-bg-mobile-temp.mp4');
    if (compressMP4(mobileVideo, tempFile, '1280:720', '2M', '4M', '25')) {
      fs.renameSync(tempFile, mobileVideo);
      log(`✓ Mobile video compressed: ${getFileSize(mobileVideo)}`, 'green');
      
      // Create WebM version
      const webmFile = path.join(IMAGES_DIR, 'hero-bg-mobile.webm');
      if (createWebM(mobileVideo, webmFile, '1280:720', '32')) {
        log(`✓ Mobile WebM created: ${getFileSize(webmFile)}`, 'green');
      }
    }
  } else {
    // Create mobile version from desktop
    log('\nCreating mobile version from desktop...', 'yellow');
    if (compressMP4(desktopVideo, mobileVideo, '1280:720', '2M', '4M', '25')) {
      log(`✓ Mobile video created: ${getFileSize(mobileVideo)}`, 'green');
      
      const webmFile = path.join(IMAGES_DIR, 'hero-bg-mobile.webm');
      if (createWebM(mobileVideo, webmFile, '1280:720', '32')) {
        log(`✓ Mobile WebM created: ${getFileSize(webmFile)}`, 'green');
      }
    }
  }
  
  // Final summary
  log('\n✅ Compression complete!', 'green');
  log('\nFinal file sizes:', 'green');
  if (fs.existsSync(desktopVideo)) {
    log(`  hero-bg.mp4: ${getFileSize(desktopVideo)}`);
  }
  if (fs.existsSync(path.join(IMAGES_DIR, 'hero-bg.webm'))) {
    log(`  hero-bg.webm: ${getFileSize(path.join(IMAGES_DIR, 'hero-bg.webm'))}`);
  }
  if (fs.existsSync(mobileVideo)) {
    log(`  hero-bg-mobile.mp4: ${getFileSize(mobileVideo)}`);
  }
  if (fs.existsSync(path.join(IMAGES_DIR, 'hero-bg-mobile.webm'))) {
    log(`  hero-bg-mobile.webm: ${getFileSize(path.join(IMAGES_DIR, 'hero-bg-mobile.webm'))}`);
  }
  
  log(`\n📁 Original files backed up in: ${BACKUP_DIR}`, 'yellow');
}

main();

