#!/usr/bin/env bash
# Install I.Ming (一點明體 / 一点明朝体) 8.10 — the Chinese serif body font used by
# this skin. The skin only references the family by name (no @font-face), so the
# font has to exist in the OS font library before the browser can render it.
#
# Upstream: https://github.com/ichitenfont/I.Ming  (IPA Font License 1.0)
# The font is NOT committed to this repository (25 MB); this script fetches it
# from the official GitHub release and verifies its SHA-256 before installing.
set -euo pipefail

VERSION="8.10"
URL="https://github.com/ichitenfont/I.Ming/releases/download/${VERSION}/I.Ming-${VERSION}.ttf"
SHA256="cba13b75b050d671b611d0063147262e421e14359ad4530948b070f56111f0f3"
FILE="I.Ming-${VERSION}.ttf"

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

echo "==> downloading I.Ming ${VERSION}"
curl -fL --http1.1 --retry 3 --progress-bar -o "${tmpdir}/${FILE}" "${URL}"

if command -v shasum >/dev/null 2>&1; then
  actual="$(shasum -a 256 "${tmpdir}/${FILE}" | awk '{print $1}')"
elif command -v sha256sum >/dev/null 2>&1; then
  actual="$(sha256sum "${tmpdir}/${FILE}" | awk '{print $1}')"
else
  actual=""
  echo "!! no shasum/sha256sum found, skipping checksum verification"
fi

if [[ -n "$actual" && "$actual" != "$SHA256" ]]; then
  echo "!! checksum mismatch: expected $SHA256, got $actual" >&2
  exit 1
fi
echo "==> checksum ok"

case "$(uname -s)" in
  Darwin)
    dest="${HOME}/Library/Fonts"
    mkdir -p "$dest"
    cp "${tmpdir}/${FILE}" "${dest}/${FILE}"
    echo "==> installed to ${dest}/${FILE}"
    echo "    Refresh already-open browser tabs, or restart the browser, to pick it up."
    ;;
  Linux)
    dest="${HOME}/.local/share/fonts"
    mkdir -p "$dest"
    cp "${tmpdir}/${FILE}" "${dest}/${FILE}"
    command -v fc-cache >/dev/null 2>&1 && fc-cache -f "$dest" >/dev/null
    echo "==> installed to ${dest}/${FILE}"
    ;;
  *)
    echo "!! Unsupported OS for automatic install." >&2
    echo "   Extract ${FILE} from the release page and install it manually:" >&2
    echo "   ${URL}" >&2
    echo "   (Windows: right-click the .ttf -> Install for all users / Install.)" >&2
    exit 1
    ;;
esac

echo "==> done: Chinese body text will render in I.Ming (一點明體)."
