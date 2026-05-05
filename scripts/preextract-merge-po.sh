#!/usr/bin/env sh

set -u

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
LOCALES="en es ru de"

if ! command -v msgcat >/dev/null 2>&1; then
  echo "[preextract] error: msgcat is not installed; install gettext and retry" >&2
  exit 1
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

  tmp_dir="$(mktemp -d)"

  i=0
  deduped=""
  for src in $existing_files; do
    i=$((i + 1))
    tmp_src="$tmp_dir/$i.po"
    msguniq --use-first "$src" -o "$tmp_src" 2>/dev/null
    if [ ! -s "$tmp_src" ]; then
      cp "$src" "$tmp_src"
    fi
    deduped="$deduped $tmp_src"
  done
  set -- $deduped

  if [ "$count" -eq 1 ]; then
    cp "$1" "$target_file"
    rm -rf "$tmp_dir"
    echo "[preextract] $locale: copied (deduplicated) -> $target_file"
    continue
  fi

  if msgcat "$@" -o "$tmp_dir/merged.po"; then
    mv "$tmp_dir/merged.po" "$target_file"
    rm -rf "$tmp_dir"
    echo "[preextract] $locale: merged $count files into $target_file"
  else
    rm -rf "$tmp_dir"
    echo "[preextract] error: $locale merge failed" >&2
    exit 1
  fi
done
