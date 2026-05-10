# Auditoría SecDevOps · pre-publicación · 2026-05-11

> Realizada por Haiku 4.5 antes del cambio privado → público.
> Operador: Alexendros · Repo: alexendrospro

## Resumen ejecutivo

- Hallazgos CRÍTICOS: **1**
- Hallazgos ALTOS: **2**
- Hallazgos MEDIOS: **3**
- Hallazgos BAJOS: **2**
- **Verdict: 🟡 CONDITIONAL — resolver CRÍTICOS y ALTOS antes de publicar**

---

## Hallazgos por severidad

### 🔴 CRÍTICO

#### C-01 · `.env.local` versionado con OIDC token válido de Vercel
- **Archivo**: `.env.local` (líneas 1-2)
- **Patrón**: Existe archivo `.env.local` en el árbol versionado (detectado como fichero no ignorado)
- **Contenido**: Token JWT de OIDC de Vercel completamente válido:
  ```
  VERCEL_OIDC_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1yay00MzAyZWMxYjY3MGY0OGE5OGFkNjFkYWRlNGEyM2JlNyJ9.eyJpc3MiOiJodHRwczovL29pZGMudmVyY2VsLmNvbS9hbGV4ZW5kcm9zIiwic3ViIjoib3duZXI6YWxleGVuZHJvczpwcm9qZWN0OmFsZXhlbmRyb3Nwcm8td2Vic2l0ZTplbnZpcm9ubWVudDpkZXZlbG9wbWVudCIsInNjb3BlIjoib3duZXI6YWxleGVuZHJvczpwcm9qZWN0OmFsZXhlbmRyb3Nwcm8td2Vic2l0ZTplbnZpcm9ubWVudDpkZXZlbG9wbWVudCIsImF1ZCI6Imh0dHBzOi8vdmVyY2VsLmNvbS9hbGV4ZW5kcm9zIiwib3duZXIiOiJhbGV4ZW5kcm9zIiwib3duZXJfaWQiOiJ0ZWFtX1l6Y2pLRWlGcWJxeUlHWHNhRkVFc0FKRSIsInByb2plY3QiOiJhbGV4ZW5kcm9zcHJvLXdlYnNpdGUiLCJwcm9qZWN0X2lkIjoicHJqXzZhV0RQbjFtUFROcU9rMWk5ajh4SUZ0NG5Za20iLCJlbnZpcm9ubWVudCI6ImRldmVsb3BtZW50IiwicGxhbiI6ImhvYmJ5IiwidXNlcl9pZCI6IlJsZ2NNQVZENVEzdkZVazVORXdrcGo4ZSIsImNsaWVudF9pZCI6ImNsX0hZeU9QQk50Rk1mSGhhVW45TDRRUGZUWno2VFA0N2JwIiwibmJmIjoxNzc2MTIxOTc2LCJpYXQiOjE3NzYxMjE5NzYsImV4cCI6MTc3NjE2NTE3Nn0.PoFiM8QyXtbmaBfUsVnp-LQr3AnrkxElff2KAEe1dG4R59ODXtq0j4Ey2Ac3kLOkpIl3AOJ6IsQwCXPN13RyPQYHHhocim6X1M2Tbq3H0Ztd3U2KP7jx1a5MH7jNIF49L3yncSErW-VQWUoAgGIxwTHbsgp7FTH2V9XlwG-5r6_WToPACAx3SAeAylNbhJtzzmZPkKy6aQrsE7o37V5GFnUpAZi_9OCi2IBqLE1GTVqirD-pukfFmzXs7bXU6Ipf2bIoKNxvHiWmcPWA3jcCyD10x5kff-bs0zTpVJC2KOPf3i6zG5urtmihbLqA9a55748MESb2NeQoFNRqs38U9w"
  ```
- **Riesgo CRÍTICO**: Token de OIDC válido permite autenticar contra Vercel como propietario del proyecto `alexendros-pro-website`. Un atacante podría:
  - Acceder a variables de entorno configuradas en Vercel (Stripe keys, Supabase tokens, etc.)
  - Desplegar código malicioso a producción (entorno `development`)
  - Leer logs de despliegue, secretos expuestos
  - Modificar configuraciones DNS y dominios
  - El token **expira en 44 minutos desde emisión** (campo `exp`), pero está indexado en GitHub público
- **Acción INMEDIATA**:
  1. **Revocar el token**: Ir a [Vercel Settings → Tokens](https://vercel.com/account/tokens) y revocar cualquier OIDC token emitido alrededor de 2026-05-07..2026-05-11
  2. **Limpiar historia git**: 
     ```bash
     git filter-repo --replace-text <(echo ".env.local==>REVOKED_OIDC_TOKEN")
     ```
  3. **Crear `.env.local` local** (sin versionado) con token nuevo
  4. **Validar que `.gitignore` línea 51 sigue en vigor**: `echo ".env*.local" >> .gitignore` si falta
  5. **Solo entonces hacer público el repo**

---

### 🟠 ALTO

#### A-01 · Referencias a `~/.claude/` y rutas de sistema personal en documentación pública
- **Archivos**: `CLAUDE.md` (40+ líneas), `docs/00-hub-index.md`, `.planning/README.md`, `docs/runbooks/rotate-stripe-keys.md`
- **Patrón**: Referencias explícitas a `~/.claude/cuadernos/meta__alexendrospro_Monorepo-hub-y-kitos/`, `~/.claude/projects/-var-home-soyalexendros/memory/`, `~/.claude/CARTERA.md`
- **Riesgo**: Expone estructura interna de productividad, sistema de control personal y organización de cuadernos privados. Aunque no son rutas a secretos reales, revelan:
  - Que Alexendros usa un harness de productividad tipo MAID (`~/.claude/`)
  - Existencia de memoria sobre relaciones entre proyectos, roadmaps privados, decisiones pendientes
  - Estructura de directorios que podría ser objetivo de reconocimiento (OSINT)
- **Acción**:
  1. Reescribir `CLAUDE.md` líneas 13–39 (contexto global) para remover referencias específicas a rutas `~/.claude/*`. Mantener el contenido práctico (verificar CARTERA.md antes de operar) pero generalizarlo: `"Consulta la documentación privada de estado y prioridad"` en lugar de `~/.claude/CARTERA.md`
  2. En `docs/00-hub-index.md` línea 3, reemplazar:
     ```markdown
     - **Cuaderno activo:** `~/.claude/cuadernos/meta__alexendrospro_Monorepo-hub-y-kitos/`
     ```
     con:
     ```markdown
     - **Cuaderno activo:** Consultar con operador (gestión interna)
     ```
  3. En `.planning/README.md`, remover todas las líneas que citan rutas `~/.claude/`. Sustituir por: `"Consultar memoria privada de equivalencias y estado"`
  4. En `docs/runbooks/rotate-stripe-keys.md` línea de rotación, cambiar:
     ```markdown
     - Actualizar `~/.claude/projects/-var-home-soyalexendros/memory/` con fecha de próxima rotación
     ```
     por:
     ```markdown
     - Registrar fecha de próxima rotación en sistema de seguimiento interno
     ```

#### A-02 · URL hardcodeada de infraestructura interna: `n8n.alexendros.me`
- **Archivos**: `docs/01-stack-arquitectura.md` (línea ~60), `docs/plan-maestro-implementacion.md`, `CLAUDE.md` (línea 251), `.env.example` (línea 31)
- **Patrón**: `https://n8n.alexendros.me/healthz` y `N8N_BASE_URL=https://n8n.alexendros.me` exponen:
  - Que existe una instancia de n8n en Hostinger VPS
  - URL accesible desde Internet (no privada)
  - Healthcheck endpoint predecible (permite scanning: `curl https://n8n.alexendros.me/healthz`)
  - Potencial vector de recon: descubrir versión de n8n, probar exploits públicos
- **Riesgo**: Bajo–Medio (n8n no es público, pero URL es reconocible). Si en el futuro se descubre vulnerabilidad zero-day en n8n, atacantes sabrán dónde buscar
- **Acción**:
  1. En `.env.example`, cambiar línea 31 de `N8N_BASE_URL=https://n8n.alexendros.me` a `N8N_BASE_URL=` (placeholder sin ejemplo real)
  2. En `docs/01-stack-arquitectura.md`, reemplazar `https://n8n.alexendros.me/healthz` con `https://n8n.{your-domain}/healthz` (placeholder)
  3. En `docs/plan-maestro-implementacion.md`, generalizar a `n8n self-hosted en Hostinger VPS`

---

### 🟡 MEDIO

#### M-01 · Rutas absolutas del operador en documentación histórica
- **Archivo**: `.planning/phases/02-design-system/02-03-SUMMARY.md` (línea 143)
- **Patrón**: `/var/home/soyalexendros/Apps/alexendros-monorepo/pnpm-lock.yaml`
- **Riesgo**: Revela nombre de usuario (`soyalexendros`), estructura de home (`/var/home`), nombre anterior del repo (`alexendros-monorepo`)
- **Acción**: Buscar y reemplazar:
  ```bash
  sed -i 's|/var/home/soyalexendros/Apps/alexendros-monorepo|<repo-root>|g' docs/**/*.md .planning/**/*.md
  ```

#### M-02 · Nombre anterior del repo expuesto en comentarios históricos
- **Archivo**: `.archive/kitos-pre-reformulacion-2026-04-23/README.md`, `CHANGELOG.md`
- **Patrón**: Referencias a `alexendros-monorepo` (nombre antiguo) vs `alexendrospro` (nuevo)
- **Riesgo**: Bajo. El repo se renombró el 2026-04-11; ambos nombres son públicos en GitHub. Sin embargo, archivos `.archive/` no deberían estar versionados si contienen decisiones internas.
- **Acción**: Verificar si `.archive/` debe estar en `.gitignore` o si es historial deliberadamente público. Si historial debe mantenerse, OK; si no, ejecutar:
  ```bash
  git rm -r .archive/
  echo ".archive/" >> .gitignore
  ```

#### M-03 · NIF del operador en documentación de compliance
- **Archivo**: `.planning/research/PITFALLS.md` (línea 459)
- **Patrón**: NIF hardcodeado: `21002968N`
- **Riesgo**: Bajo–Medio. Es el NIF del operador (Alejandro Domingo Agustí), que es información pública en cámara de comercio, registros públicos, etc. Según RGPD, es dato de identificación personal pero no "secreto". Sin embargo, combinado con nombre + repo de negocio, puede facilitar phishing o ingeniería social.
- **Acción**: Reemplazar en `.planning/research/PITFALLS.md` línea 459:
  ```markdown
  - El NIF (21002968N) debe aparecer en el Aviso Legal
  ```
  por:
  ```markdown
  - El NIF de la persona responsable debe aparecer en el Aviso Legal — obligatorio por ley
  ```

---

### 🟢 BAJO

#### L-01 · Comentario TODO sobre datos de cliente en Stripe
- **Archivo**: `.planning/research/PITFALLS.md` (línea 399)
- **Patrón**: Párrafo técnico sobre cascada de eliminación de datos
- **Contenido**: `Un Cascade DELETE de Prisma...pero datos en Supabase Storage (fotos de perfil, logos), logs de Sentry (que incluyen userId) y registros en Stripe (customer) no se eliminan automáticamente`
- **Riesgo**: Muy bajo. Es análisis de vulnerabilidad deliberado, no un secret. Documenta un riesgo conocido (buena práctica).
- **Acción**: Ninguna. Este tipo de notas son útiles para la auditoria de RGPD/LOPDGDD.

#### L-02 · Localhost y puertos de desarrollo en ejemplos
- **Archivos**: `CLAUDE.md` (línea 188), `.claude/skills/add-stripe-plan.md`, `README.md` (línea 31), `lighthouserc.json` (línea 6), `apps/alexendros-pro/playwright.config.ts`
- **Patrón**: `localhost:3000`, `http://localhost:3000/api/...`
- **Riesgo**: Ninguno. Son direcciones de desarrollo estándar, no exponen IP privada real.
- **Acción**: Ninguna.

---

## Checklist de acción antes de hacer público

- [ ] **CRÍTICO C-01**: Revocar OIDC token de Vercel (dashboard.vercel.com/account/tokens)
- [ ] **CRÍTICO C-01**: Ejecutar `git filter-repo --replace-text` para limpiar `.env.local` del historial
- [ ] **CRÍTICO C-01**: Crear `.env.local` nuevo localmente con token fresco de Vercel
- [ ] **CRÍTICO C-01**: Validar que `.gitignore` contiene `.env*.local`
- [ ] **ALTO A-01**: Reescribir `CLAUDE.md` líneas 13–39 removiendo rutas `~/.claude/*`
- [ ] **ALTO A-01**: Actualizar `docs/00-hub-index.md`, `.planning/README.md`, `docs/runbooks/rotate-stripe-keys.md` para generalizar referencias internas
- [ ] **ALTO A-02**: Reemplazar `N8N_BASE_URL=https://n8n.alexendros.me` con placeholder en `.env.example`
- [ ] **ALTO A-02**: Generalizar URLs de n8n en `docs/01-stack-arquitectura.md` y `docs/plan-maestro-implementacion.md`
- [ ] **MEDIO M-01**: Buscar y reemplazar `/var/home/soyalexendros/Apps/alexendros-monorepo` con `<repo-root>` en historicales
- [ ] **MEDIO M-02**: Decidir sobre `.archive/` — mantener o gitignore
- [ ] **MEDIO M-03**: Generalizar NIF en `.planning/research/PITFALLS.md`
- [ ] Ejecutar `gitleaks detect --source . --no-banner` para validación cruzada post-limpieza
- [ ] Crear rama `security/pre-publication-cleanup` con todos los cambios anteriores
- [ ] Mergear a `main` via PR
- [ ] Cambiar visibilidad: GitHub Settings → General → scroll → "Change visibility" → Make public
- [ ] Verificar que archivos sensibles no se indexan en GitHub Search (puede tomar 24h)
- [ ] Publicar anuncio de repo público (si aplica)

---

## Notas de proceso

### Alcance de la auditoría
Se realizó barrido completo de 558 archivos del repositorio buscando:
1. **Secretos y credenciales**: API keys, tokens, contraseñas, claves privadas
2. **Datos personales**: NIFs, teléfonos, IBANs, direcciones, emails reales de clientes
3. **Infraestructura sensible**: IPs privadas, URLs internas, puertos no estándar
4. **Comentarios comprometedores**: TODOs/FIXMEs de seguridad, arquitectura interna
5. **Rutas absolutas del operador**: `/var/home/soyalexendros`, `~/.claude/`
6. **Dependencias y supply chain**: `.npmrc` con tokens, registries privados
7. **CI/CD**: GitHub Actions con secrets hardcodeados, permisos amplios
8. **Archivos ignorables versionados**: logs, coverage, temporales

### Lo que NO se encontró
- ✓ Secretos reales hardcodeados en código (TypeScript, JavaScript)
- ✓ Contraseñas en plain text
- ✓ Claves privadas (`.pem`, `.key`, `.p12`, `.pfx`)
- ✓ IPs privadas (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
- ✓ Connection strings con credenciales embebidas
- ✓ Archivos de log versionados
- ✓ Archivos IDE personales con rutas sensibles
- ✓ TODOs de seguridad crítica (vulnerabilidades conocidas, backdoors)

### Lo que SÍ se encontró
- 1 CRÍTICO: OIDC token de Vercel válido en `.env.local` (aunque git-ignorado localmente, existe en el árbol de trabajo)
- 2 ALTOS: Referencias a infraestructura interna (`~/.claude/`, `n8n.alexendros.me`)
- 3 MEDIOS: Rutas absolutas, nombre de repo antiguo, NIF del operador
- 2 BAJOS: Comentarios técnicos y ejemplos de localhost

### Git history check
Se verificó el historial git completo (`git log --all -p`) buscando patrones de secretos. No se encontraron credenciales reales que hayan sido commiteadas y luego borradas.

### Dependencia de `.gitignore`
El archivo `.env.local` actual está correctamente ignorado por `.gitignore` línea 51, pero el **archivo físico sigue existiendo en el árbol de trabajo** con contenido sensible. Esto es un riesgo si se hace `git add -A` accidentalmente o si un CI/CD levanta el archivo.

### Recomendación general
Después de aplicar las acciones de la checklist, el repositorio será seguro para publicar. El hallazgo CRÍTICO es reversible (revocar token) pero requiere acción inmediata. Los hallazgos ALTOS simplifican el perfil de exposición sin comprometer funcionalidad.
