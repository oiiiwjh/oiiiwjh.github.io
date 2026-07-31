#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"

for theme_name in terracotta ink sage plum; do
  python3 "$SCRIPT_DIR/build.py" \
    --theme "$theme_name" \
    --output "$SITE_DIR/preview-$theme_name.html"
done

echo "Theme gallery: $SITE_DIR/theme-preview.html"
