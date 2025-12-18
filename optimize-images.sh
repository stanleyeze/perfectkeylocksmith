#!/bin/bash
# Perfect Key Locksmith - Image Optimization Script
# This script converts images to WebP and compresses them for optimal web performance
# 
# REQUIREMENTS:
# - macOS: brew install webp imagemagick jpegoptim optipng
# - Linux: sudo apt install webp imagemagick jpegoptim optipng
#
# USAGE: ./optimize-images.sh

set -e

echo "=================================="
echo "Perfect Key Locksmith"
echo "Image Optimization Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directory containing images
ASSETS_DIR="./assets/images"
SERVICES_DIR="./assets/images/services"

# Check if required tools are installed
check_tools() {
    echo "Checking required tools..."
    
    local missing_tools=()
    
    if ! command -v cwebp &> /dev/null; then
        missing_tools+=("webp")
    fi
    
    if ! command -v convert &> /dev/null; then
        missing_tools+=("imagemagick")
    fi
    
    if ! command -v jpegoptim &> /dev/null; then
        missing_tools+=("jpegoptim")
    fi
    
    if ! command -v optipng &> /dev/null; then
        missing_tools+=("optipng")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        echo -e "${RED}Missing tools: ${missing_tools[*]}${NC}"
        echo ""
        echo "Install on macOS:"
        echo "  brew install webp imagemagick jpegoptim optipng"
        echo ""
        echo "Install on Linux:"
        echo "  sudo apt install webp imagemagick jpegoptim optipng"
        echo ""
        exit 1
    fi
    
    echo -e "${GREEN}✓ All tools installed${NC}"
    echo ""
}

# Get file size in human-readable format
get_size() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        stat -f%z "$1" 2>/dev/null | numfmt --to=iec 2>/dev/null || stat -f%z "$1"
    else
        stat --printf="%s" "$1" 2>/dev/null | numfmt --to=iec 2>/dev/null || stat --printf="%s" "$1"
    fi
}

# Optimize JPEG images
optimize_jpeg() {
    local file="$1"
    local original_size=$(stat -f%z "$file" 2>/dev/null || stat --printf="%s" "$file")
    
    echo -n "  Optimizing JPEG: $(basename "$file")... "
    
    # Optimize JPEG (quality 85%, strip metadata)
    jpegoptim --max=85 --strip-all --quiet "$file"
    
    local new_size=$(stat -f%z "$file" 2>/dev/null || stat --printf="%s" "$file")
    local saved=$((original_size - new_size))
    local percent=$((saved * 100 / original_size))
    
    echo -e "${GREEN}saved ${percent}%${NC}"
}

# Optimize PNG images
optimize_png() {
    local file="$1"
    local original_size=$(stat -f%z "$file" 2>/dev/null || stat --printf="%s" "$file")
    
    echo -n "  Optimizing PNG: $(basename "$file")... "
    
    # Optimize PNG
    optipng -o5 -quiet "$file"
    
    local new_size=$(stat -f%z "$file" 2>/dev/null || stat --printf="%s" "$file")
    local saved=$((original_size - new_size))
    local percent=0
    if [ $original_size -gt 0 ]; then
        percent=$((saved * 100 / original_size))
    fi
    
    echo -e "${GREEN}saved ${percent}%${NC}"
}

# Convert to WebP
convert_to_webp() {
    local file="$1"
    local webp_file="${file%.*}.webp"
    
    # Skip if WebP already exists and is newer
    if [ -f "$webp_file" ] && [ "$webp_file" -nt "$file" ]; then
        echo "  Skipping $(basename "$file") (WebP exists)"
        return
    fi
    
    echo -n "  Creating WebP: $(basename "$webp_file")... "
    
    # Convert to WebP with quality 80
    cwebp -q 80 -quiet "$file" -o "$webp_file"
    
    local original_size=$(stat -f%z "$file" 2>/dev/null || stat --printf="%s" "$file")
    local webp_size=$(stat -f%z "$webp_file" 2>/dev/null || stat --printf="%s" "$webp_file")
    local percent=$((100 - (webp_size * 100 / original_size)))
    
    echo -e "${GREEN}${percent}% smaller${NC}"
}

# Resize large images (max 1920px width for hero, 800px for content)
resize_large_images() {
    local file="$1"
    local max_width="$2"
    
    # Get current width
    local width=$(identify -format "%w" "$file" 2>/dev/null)
    
    if [ -n "$width" ] && [ "$width" -gt "$max_width" ]; then
        echo -n "  Resizing $(basename "$file") to ${max_width}px... "
        convert "$file" -resize "${max_width}>" -quality 85 "$file"
        echo -e "${GREEN}done${NC}"
    fi
}

# Main optimization process
main() {
    check_tools
    
    echo "=================================="
    echo "Step 1: Analyzing Current Images"
    echo "=================================="
    echo ""
    
    # List current image sizes
    echo "Current image sizes:"
    du -sh "$ASSETS_DIR"/* 2>/dev/null | head -20 || echo "No images found in $ASSETS_DIR"
    echo ""
    
    if [ -d "$SERVICES_DIR" ]; then
        echo "Services images:"
        du -sh "$SERVICES_DIR"/* 2>/dev/null | head -10 || echo "No images found in $SERVICES_DIR"
        echo ""
    fi
    
    echo "=================================="
    echo "Step 2: Resizing Oversized Images"
    echo "=================================="
    echo ""
    
    # Resize hero/slider images (max 1920px)
    for file in "$ASSETS_DIR"/slider*.jpg "$ASSETS_DIR"/*bg*.jpg; do
        [ -f "$file" ] && resize_large_images "$file" 1920
    done
    
    # Resize content images (max 800px)
    for file in "$ASSETS_DIR"/*.jpg "$ASSETS_DIR"/*.png; do
        [ -f "$file" ] && [[ ! "$file" =~ slider|bg ]] && resize_large_images "$file" 800
    done
    
    echo "=================================="
    echo "Step 3: Optimizing JPEG Images"
    echo "=================================="
    echo ""
    
    find "$ASSETS_DIR" -name "*.jpg" -o -name "*.jpeg" 2>/dev/null | while read file; do
        [ -f "$file" ] && optimize_jpeg "$file"
    done
    
    echo ""
    echo "=================================="
    echo "Step 4: Optimizing PNG Images"
    echo "=================================="
    echo ""
    
    find "$ASSETS_DIR" -name "*.png" 2>/dev/null | while read file; do
        [ -f "$file" ] && optimize_png "$file"
    done
    
    echo ""
    echo "=================================="
    echo "Step 5: Creating WebP Versions"
    echo "=================================="
    echo ""
    
    find "$ASSETS_DIR" \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) 2>/dev/null | while read file; do
        [ -f "$file" ] && convert_to_webp "$file"
    done
    
    echo ""
    echo "=================================="
    echo "Optimization Complete!"
    echo "=================================="
    echo ""
    echo "New image sizes:"
    du -sh "$ASSETS_DIR"/* 2>/dev/null | head -20 || echo "Done"
    echo ""
    echo -e "${YELLOW}NEXT STEPS:${NC}"
    echo "1. Test images on your site"
    echo "2. The .htaccess automatically serves WebP to supported browsers"
    echo "3. Consider using a CDN like Cloudflare for even better performance"
    echo ""
}

# Alternative: Use online tools
show_online_alternatives() {
    echo ""
    echo "=================================="
    echo "ALTERNATIVE: Free Online Tools"
    echo "=================================="
    echo ""
    echo "If you prefer not to install tools locally:"
    echo ""
    echo "1. TinyPNG (https://tinypng.com/)"
    echo "   - Drag & drop PNG and JPEG files"
    echo "   - Free for up to 20 images at a time"
    echo ""
    echo "2. Squoosh (https://squoosh.app/)"
    echo "   - Google's image optimizer"
    echo "   - Supports WebP conversion"
    echo "   - Real-time preview"
    echo ""
    echo "3. ShortPixel (https://shortpixel.com/online-image-compression)"
    echo "   - Batch optimization"
    echo "   - WordPress plugin available"
    echo ""
    echo "4. Cloudinary (https://cloudinary.com/)"
    echo "   - Free tier: 25 credits/month"
    echo "   - Auto-optimization via URL parameters"
    echo ""
}

# Run the script
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo "Usage: ./optimize-images.sh [options]"
    echo ""
    echo "Options:"
    echo "  --help, -h     Show this help message"
    echo "  --online       Show online tool alternatives"
    echo ""
    exit 0
fi

if [ "$1" == "--online" ]; then
    show_online_alternatives
    exit 0
fi

main

