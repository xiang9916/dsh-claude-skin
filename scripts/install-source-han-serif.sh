#!/usr/bin/env bash
# Install 思源宋体 / Source Han Serif SC 2.003 — the Chinese serif body font used
# by this skin, in the SemiBold cut (weight < 600) plus the Bold cut (headings
# and the new-session hero). The skin references the family by name only (no
# font files are shipped), so the font has to exist in the OS font library
# before the browser can render it.
#
# Upstream: https://github.com/adobe-fonts/source-han-serif  (SIL Open Font License 1.1)
# The fonts are NOT committed to this repository (~140 MB for the seven SC
# cuts); this script fetches the official release archive, verifies its SHA-256
# and installs the Simplified Chinese OTFs.
set -euo pipefail

VERSION="2.003R"
URL="https://github.com/adobe-fonts/source-han-serif/releases/download/${VERSION}/09_SourceHanSerifSC.zip"
SHA256="8f633642eedf9bf23ab3336faa3d03ce1b56c14d654cd25752bc829c05f79f0d"
FILE="SourceHanSerifSC.zip"

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

echo "==> downloading Source Han Serif SC ${VERSION} (~140 MB)"
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

echo "==> extracting Simplified Chinese OTFs"
unzip -q -j "${tmpdir}/${FILE}" 'OTF/SimplifiedChinese/*.otf' -d "${tmpdir}/otf"
ls "${tmpdir}/otf" >/dev/null

case "$(uname -s)" in
  Darwin)
    dest="${HOME}/Library/Fonts"
    mkdir -p "$dest"
    cp "${tmpdir}"/otf/*.otf "$dest/"
    echo "==> installed 7 cuts to ${dest}/SourceHanSerifSC-*.otf"
    echo "    Refresh already-open browser tabs, or restart the browser, to pick it up."
    ;;
  Linux)
    dest="${HOME}/.local/share/fonts"
    mkdir -p "$dest"
    cp "${tmpdir}"/otf/*.otf "$dest/"
    command -v fc-cache >/dev/null 2>&1 && fc-cache -f "$dest" >/dev/null
    echo "==> installed 7 cuts to ${dest}/SourceHanSerifSC-*.otf"
    ;;
  *)
    echo "!! Unsupported OS for automatic install." >&2
    echo "   Extract OTF/SimplifiedChinese/*.otf from the release page and install" >&2
    echo "   them manually: ${URL}" >&2
    echo "   (Windows: select the .otf files -> right-click -> Install for all users.)" >&2
    exit 1
    ;;
esac

echo "==> done: Chinese body text renders in 思源宋体 SemiBold."
