#!/usr/bin/env bash
# Fase 7 · SEO/GEO + Core Web Vitals
source "$(dirname "$0")/_lib.sh"

ROOT="$(audit_repo_root "$(dirname "$0")")" || exit 1
cd "$ROOT"

APP="apps/alexendros-pro"

# 1. Archivos estáticos esperados
for f in public/robots.txt public/llms.txt app/sitemap.ts app/sitemap.xml/route.ts app/opengraph-image.tsx app/manifest.ts; do
  if [[ -f "$APP/$f" ]]; then
    audit_ok "$f presente"
  else
    audit_warn "$f ausente"
  fi
done

# 2. JSON-LD en el árbol app/
ld_hits=$(grep -RIlE 'application/ld\+json|@type"\s*:\s*"(Organization|Service|Offer|FAQPage|Article|Person)"' "$APP/app" 2>/dev/null | wc -l || echo 0)
if (( ld_hits >= 3 )); then
  audit_ok "JSON-LD detectado en $ld_hits archivos"
else
  audit_warn "JSON-LD escaso ($ld_hits archivos) — Organization, Service, Offer, FAQPage como mínimo"
fi

# 3. Metadata API de Next (export const metadata o generateMetadata)
md_hits=$(grep -RIlE 'export const metadata|generateMetadata' "$APP/app" 2>/dev/null | wc -l || echo 0)
if (( md_hits >= 5 )); then
  audit_ok "Metadata API usada en $md_hits archivos"
else
  audit_warn "Metadata API en sólo $md_hits archivos"
fi

# 4. Lighthouse CI (opcional, sólo si está instalado)
if command -v lhci >/dev/null 2>&1 || [[ -x node_modules/.bin/lhci ]]; then
  audit_info "lhci disponible — ejecutar: pnpm --filter=alexendros-pro exec lhci autorun"
else
  audit_warn "lhci no instalado — instalar @lhci/cli para CI de CWV"
fi

# 5. Unlighthouse / vitales en CI workflow
if grep -RIlE 'lighthouse|lhci|unlighthouse' .github/workflows 2>/dev/null | head -n1 >/dev/null; then
  audit_ok "CI ejecuta auditoría Lighthouse"
else
  audit_warn "CI sin auditoría Lighthouse"
fi

audit_finish 7
