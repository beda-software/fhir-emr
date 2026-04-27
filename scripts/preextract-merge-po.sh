#!/usr/bin/env sh

set -u

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
LOCALES="en es ru de"

if ! command -v msgcat >/dev/null 2>&1; then
  echo "[preextract] warning: msgcat is not installed; skipping PO merge"
  exit 0
fi

for locale in $LOCALES; do
  target_dir="$ROOT_DIR/src/locale/$locale"
  target_file="$target_dir/messages.po"

  app_file="$ROOT_DIR/src/locale/$locale/messages.po"
  web_item_controls_file="$ROOT_DIR/node_modules/@beda.software/web-item-controls/src/locale/$locale/messages.po"
  fhir_questionnaire_file="$ROOT_DIR/node_modules/@beda.software/fhir-questionnaire/components/locale/$locale/messages.po"

  existing_files=""
  for candidate in "$app_file" "$web_item_controls_file" "$fhir_questionnaire_file"; do
    if [ -f "$candidate" ]; then
      existing_files="$existing_files $candidate"
    fi
  done

  set -- $existing_files
  count=$#

  if [ "$count" -eq 0 ]; then
    echo "[preextract] $locale: no source files found, skipping"
    continue
  fi

  mkdir -p "$target_dir"

  if [ "$count" -eq 1 ]; then
    cp "$1" "$target_file"
    echo "[preextract] $locale: copied $1 -> $target_file"
    continue
  fi

  if msgcat "$@" -o "$target_file"; then
    echo "[preextract] $locale: merged $count files into $target_file"
  else
    echo "[preextract] warning: $locale merge failed, continuing"
  fi
done
