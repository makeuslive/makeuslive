#!/bin/bash

# Video Compression Script for Hero Background Videos
# This script compresses MP4 videos and creates WebM versions for optimal web performance

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🎬 Starting video compression...${NC}\n"

# Directory paths
IMAGES_DIR="public/images"
BACKUP_DIR="public/images/backup"
FFMPEG_CMD="/opt/homebrew/bin/ffmpeg"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Function to get file size
get_size() {
    if [ -f "$1" ]; then
        ls -lh "$1" | awk '{print $5}'
    else
        echo "N/A"
    fi
}

# Function to compress MP4
compress_mp4() {
    local input="$1"
    local output="$2"
    local resolution="$3"
    local maxrate="$4"
    local bufsize="$5"
    local crf="$6"
    
    echo -e "${YELLOW}Compressing: $input -> $output${NC}"
    echo "  Resolution: $resolution"
    echo "  Max bitrate: $maxrate"
    echo "  CRF: $crf"
    
    $FFMPEG_CMD -i "$input" \
        -c:v libx264 \
        -preset slow \
        -crf "$crf" \
        -maxrate "$maxrate" \
        -bufsize "$bufsize" \
        -vf "scale=$resolution" \
        -c:a aac \
        -b:a 128k \
        -movflags +faststart \
        -pix_fmt yuv420p \
        -y "$output" 2>&1 | grep -E "(Duration|bitrate|size)" || true
    
    echo ""
}

# Function to create WebM
create_webm() {
    local input="$1"
    local output="$2"
    local resolution="$3"
    local crf="$4"
    
    echo -e "${YELLOW}Creating WebM: $input -> $output${NC}"
    echo "  Resolution: $resolution"
    echo "  CRF: $crf"
    
    $FFMPEG_CMD -i "$input" \
        -c:v libvpx-vp9 \
        -crf "$crf" \
        -b:v 0 \
        -vf "scale=$resolution" \
        -c:a libopus \
        -b:a 128k \
        -row-mt 1 \
        -y "$output" 2>&1 | grep -E "(Duration|bitrate|size)" || true
    
    echo ""
}

# Check if source files exist
if [ ! -f "$IMAGES_DIR/hero-bg.mp4" ]; then
    echo -e "${YELLOW}⚠️  Warning: hero-bg.mp4 not found${NC}"
    exit 1
fi

# Backup original files
echo -e "${GREEN}📦 Creating backups...${NC}"
cp "$IMAGES_DIR/hero-bg.mp4" "$BACKUP_DIR/hero-bg-original.mp4" 2>/dev/null || true
cp "$IMAGES_DIR/hero-bg-mobile.mp4" "$BACKUP_DIR/hero-bg-mobile-original.mp4" 2>/dev/null || true
echo "✓ Backups created in $BACKUP_DIR\n"

# Show original file sizes
echo -e "${GREEN}Original file sizes:${NC}"
echo "  hero-bg.mp4: $(get_size "$IMAGES_DIR/hero-bg.mp4")"
echo "  hero-bg-mobile.mp4: $(get_size "$IMAGES_DIR/hero-bg-mobile.mp4")"
echo ""

# Compress desktop video (1920x1080)
if [ -f "$IMAGES_DIR/hero-bg.mp4" ]; then
    compress_mp4 "$IMAGES_DIR/hero-bg.mp4" "$IMAGES_DIR/hero-bg-compressed.mp4" "1920:1080" "5M" "10M" "23"
    mv "$IMAGES_DIR/hero-bg-compressed.mp4" "$IMAGES_DIR/hero-bg.mp4"
    
    # Create WebM version
    create_webm "$IMAGES_DIR/hero-bg.mp4" "$IMAGES_DIR/hero-bg.webm" "1920:1080" "30"
fi

# Compress mobile video (1280x720)
if [ -f "$IMAGES_DIR/hero-bg-mobile.mp4" ]; then
    compress_mp4 "$IMAGES_DIR/hero-bg-mobile.mp4" "$IMAGES_DIR/hero-bg-mobile-compressed.mp4" "1280:720" "2M" "4M" "25"
    mv "$IMAGES_DIR/hero-bg-mobile-compressed.mp4" "$IMAGES_DIR/hero-bg-mobile.mp4"
    
    # Create WebM version
    create_webm "$IMAGES_DIR/hero-bg-mobile.mp4" "$IMAGES_DIR/hero-bg-mobile.webm" "1280:720" "32"
else
    # If mobile version doesn't exist, create it from desktop version
    echo -e "${YELLOW}Creating mobile version from desktop...${NC}"
    compress_mp4 "$IMAGES_DIR/hero-bg.mp4" "$IMAGES_DIR/hero-bg-mobile.mp4" "1280:720" "2M" "4M" "25"
    create_webm "$IMAGES_DIR/hero-bg-mobile.mp4" "$IMAGES_DIR/hero-bg-mobile.webm" "1280:720" "32"
fi

# Show compressed file sizes
echo -e "${GREEN}✓ Compression complete!${NC}\n"
echo -e "${GREEN}Compressed file sizes:${NC}"
echo "  hero-bg.mp4: $(get_size "$IMAGES_DIR/hero-bg.mp4")"
echo "  hero-bg.webm: $(get_size "$IMAGES_DIR/hero-bg.webm")"
echo "  hero-bg-mobile.mp4: $(get_size "$IMAGES_DIR/hero-bg-mobile.mp4")"
echo "  hero-bg-mobile.webm: $(get_size "$IMAGES_DIR/hero-bg-mobile.webm")"
echo ""

# Calculate savings
if [ -f "$BACKUP_DIR/hero-bg-original.mp4" ]; then
    ORIGINAL_SIZE=$(stat -f%z "$BACKUP_DIR/hero-bg-original.mp4" 2>/dev/null || stat -c%s "$BACKUP_DIR/hero-bg-original.mp4" 2>/dev/null || echo "0")
    NEW_SIZE=$(stat -f%z "$IMAGES_DIR/hero-bg.mp4" 2>/dev/null || stat -c%s "$IMAGES_DIR/hero-bg.mp4" 2>/dev/null || echo "0")
    if [ "$ORIGINAL_SIZE" -gt 0 ] && [ "$NEW_SIZE" -gt 0 ]; then
        SAVINGS=$((ORIGINAL_SIZE - NEW_SIZE))
        PERCENTAGE=$((SAVINGS * 100 / ORIGINAL_SIZE))
        echo -e "${GREEN}💾 Space saved: ${PERCENTAGE}% ($(numfmt --to=iec-i --suffix=B $SAVINGS 2>/dev/null || echo "${SAVINGS} bytes"))${NC}"
    fi
fi

echo -e "\n${GREEN}✅ All done! Videos are optimized for web.${NC}"
echo -e "${YELLOW}Note: Original files backed up in $BACKUP_DIR${NC}"

