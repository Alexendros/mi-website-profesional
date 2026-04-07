# Skill: brand-manual
# Uso: crear manual de identidad de marca profesional certificable
# Activar con: /skills brand-manual

## Objetivo
Generar un Brand Manual (Manual de Identidad Corporativa) completo que cumpla
estándares profesionales del sector de imagen de marca, diseño gráfico y branding.
El resultado debe ser un documento entregable a clientes con calidad de agencia.

## Estándares y referencias profesionales

| Referencia | Ámbito | Aplicación |
|-----------|--------|------------|
| ISO 10668:2010 | Valoración de marca | Estructura de activos de marca |
| ISO 20671:2019 | Evaluación de marca | Métricas de percepción y consistencia |
| Pantone Matching System (PMS) | Color profesional | Conversión oklch → PMS + CMYK + RGB + HEX |
| WCAG 2.1 AA | Accesibilidad | Ratios de contraste mínimos 4.5:1 (texto) / 3:1 (UI) |
| PDF/X-4 (ISO 15930-7) | Preimpresión | Exportación para impresión profesional |
| SVG 1.1 / SVG 2.0 | Formatos vectoriales | Logos y marcas gráficas escalables |

## Estructura del Brand Manual (secciones obligatorias)

### 1. Estrategia de marca
- **Brand Positioning Statement** (plantilla: Para [audiencia] que [necesidad], [marca] es [categoría] que [diferencial] porque [razón])
- **Brand Personality:** Arquetipos (Jung), tono de voz, vocabulario permitido/prohibido
- **Brand Values:** 3-5 valores con descripción aplicada
- **Tagline / Claim principal + variantes**

### 2. Identidad visual — Logotipo
- **Marca gráfica principal** (logo completo: imagotipo, isotipo, logotipo o isologo — justificar elección)
- **Versiones:** horizontal, vertical, reducida (favicon), monocromática, negativo
- **Área de respeto:** Mínimo 1x la altura del símbolo en cada dirección
- **Tamaño mínimo:** Definir en px (digital) y mm (impresión)
- **Usos incorrectos:** Mínimo 6 ejemplos de qué NO hacer (estirar, rotar, recolorear, añadir sombras, sobre fondos conflictivos, etc.)
- **Formatos de entrega:**
  - SVG (vectorial, web)
  - PNG con transparencia (digital, alta resolución: 2x y 3x)
  - PDF vectorial (impresión)
  - Favicon .ico + .svg + apple-touch-icon (192×192, 512×512)

### 3. Sistema de color
- **Paleta primaria:** Máx. 3 colores con valores en:
  - oklch (fuente de verdad CSS)
  - HEX / RGB (pantalla)
  - CMYK (impresión offset)
  - Pantone PMS (impresión spot)
- **Paleta secundaria/apoyo:** Máx. 4 colores complementarios
- **Paleta funcional:** success, warning, error, info (semántica UI)
- **Gradientes permitidos:** Definir dirección, stops y contextos de uso
- **Ratios de contraste WCAG AA:** Tabla de combinaciones fondo/texto validadas
- **Proporción de uso recomendada:** Regla 60-30-10

### 4. Tipografía
- **Fuente principal (headings):** Nombre, peso, tracking, referencia de licencia
- **Fuente secundaria (body):** Nombre, peso, line-height, tamaño base
- **Fuente monoespaciada (código/datos):** Si aplica
- **Escala tipográfica:** Basada en ratio (1.25 Major Third o similar)
- **Jerarquía:** h1–h6 con tamaño, peso, color y spacing definidos
- **Licencias:** Verificar y documentar tipo de licencia (OFL, comercial, etc.)

### 5. Iconografía y gráficos
- **Set de iconos:** Librería base (lucide-react para digital) + estilo (outline, solid, duotone)
- **Tamaños estándar:** 16px, 20px, 24px, 32px
- **Estilo ilustrativo:** Si aplica (flat, isométrico, line-art...)
- **Fotografía:** Directrices de estilo fotográfico (tonos, filtros, composición)

### 6. Aplicaciones y mockups
- **Digital:** Tarjeta de visita, firma de email, OG image template, avatar
- **Web:** Capturas de componentes clave con la marca aplicada
- **Social media:** Plantillas para Instagram (feed + stories), Twitter/X header, LinkedIn banner
- **Impresión (si aplica):** Papelería, carpeta, pegatinas

### 7. Tono y voz
- **Principios de comunicación:** 3-4 adjetivos (ej: directo, técnico, cercano, sin jerga innecesaria)
- **Ejemplos do/don't** por canal (web, email, redes sociales)
- **Vocabulario de marca:** Términos propios (KitOS, StageKit, etc.)

### 8. Arquitectura de marca
- **Marca madre vs. submarcas:** Relación Alexendros ↔ KitOS ↔ Kits individuales
- **Reglas de co-branding:** Cómo aplicar junto a marcas de clientes/partners
- **Nomenclatura:** Convención de nombres para productos futuros

## Proceso de elaboración (con subagentes)

### Flujo completo con ejecución paralela

```
brand-manual (skill orquestadora)
  │
  ├── [PASO 1 — SECUENCIAL] Invocar agente brand-auditor
  │   → Obtener BAS actual como baseline
  │   → Identificar fortalezas y debilidades de marca existente
  │
  ├── [PASO 2 — SECUENCIAL] Briefing de marca
  │   → Recopilar: audiencia, valores, competidores, referencias visuales
  │   → Definir Brand Positioning Statement
  │
  ├── [PASO 3 — PARALELO] Exploración y diseño
  │   │
  │   ├── Subagente: logo-designer
  │   │   Tipo: general-purpose
  │   │   → Generar 3 direcciones creativas con moodboard
  │   │   → Diseñar logotipo: bocetos → 2 propuestas → variantes
  │   │   → Exportar en todos los formatos (SVG, PNG 2x/3x, favicon)
  │   │   → Documentar área de respeto, tamaño mínimo, usos incorrectos
  │   │   → Output: carpeta assets/logo/ completa
  │   │
  │   ├── Subagente: color-system-builder
  │   │   Tipo: general-purpose
  │   │   → Definir paleta primaria + secundaria + funcional
  │   │   → Convertir a todos los formatos: oklch, HEX, RGB, CMYK, Pantone PMS
  │   │   → Validar ratios contraste WCAG AA (4.5:1 texto, 3:1 UI)
  │   │   → Generar gradientes permitidos + regla 60-30-10
  │   │   → Output: palette.json + palette.ase + tabla de contraste
  │   │
  │   └── Subagente: typography-selector
  │       Tipo: general-purpose
  │       → Seleccionar fuentes (heading, body, mono) con licencia verificada
  │       → Definir escala tipográfica (ratio, jerarquía h1-h6)
  │       → Configurar para next/font (Geist o alternativa)
  │       → Output: spec tipográfica + ficheros .woff2
  │
  ├── [PASO 4 — SECUENCIAL] Selección y refinamiento
  │   → Presentar propuestas al usuario → selección
  │   → Refinar dirección elegida
  │
  ├── [PASO 5 — PARALELO] Construcción del sistema completo
  │   │
  │   ├── Subagente: application-designer
  │   │   Tipo: general-purpose
  │   │   → Crear mockups de aplicaciones (tarjeta, firma email, OG, social)
  │   │   → Generar plantillas para Instagram, Twitter, LinkedIn
  │   │   → Output: carpeta assets/templates/
  │   │
  │   └── Subagente: token-synchronizer
  │       Tipo: general-purpose
  │       → Actualizar packages/brand/tokens.ts con colores y tipografía finales
  │       → Generar tokens.css (custom properties)
  │       → Actualizar tailwind preset si aplica
  │       → Output: tokens actualizados en el repo
  │
  └── [PASO 6 — SECUENCIAL] Validación y exportación
      → Verificar contraste WCAG AA
      → Verificar logo legible a tamaño mínimo
      → Verificar CMYK sin desviación crítica (ΔE < 3)
      → Exportar PDF manual (interactivo + versión web)
      → Generar carpeta brand-manual/ completa
```

### Resumen de pasos
1. **Auditoría previa** — Ejecutar agente `brand-auditor` para obtener BAS actual
2. **Briefing de marca** — Recopilar: audiencia, valores, competidores, referencias visuales
3. **Exploración visual** — 3 direcciones creativas con moodboard (referencias, no diseño final)
4. **Diseño de logotipo** — Bocetos → 2 propuestas → selección → refinamiento
5. **Sistema completo** — Construir secciones 1-8 con la propuesta seleccionada
6. **Validación técnica:**
   - Contraste WCAG AA verificado (herramienta: whocanuse.com o similar)
   - Logo legible a tamaño mínimo
   - Paleta reproducible en CMYK sin desviación crítica (ΔE < 3)
   - Fuentes con licencia válida para uso comercial + web
7. **Exportación y entrega:**
   - PDF interactivo del manual (navegable, con índice)
   - Carpeta `/brand-assets/` con todos los ficheros organizados
   - Tokens CSS actualizados en `packages/brand/tokens.ts`

## Entregables finales

```
brand-manual/
├── brand-manual-[marca]-v1.pdf          ← Manual completo (PDF/X-4 compatible)
├── brand-manual-[marca]-v1-web.pdf      ← Versión ligera optimizada para pantalla
├── assets/
│   ├── logo/
│   │   ├── [marca]-logo-full.svg
│   │   ├── [marca]-logo-horizontal.svg
│   │   ├── [marca]-logo-icon.svg
│   │   ├── [marca]-logo-mono-light.svg
│   │   ├── [marca]-logo-mono-dark.svg
│   │   ├── [marca]-logo-full@2x.png
│   │   ├── [marca]-logo-full@3x.png
│   │   ├── favicon.ico
│   │   ├── favicon.svg
│   │   └── apple-touch-icon.png
│   ├── colors/
│   │   ├── palette.ase              ← Adobe Swatch Exchange
│   │   └── palette.json             ← Tokens exportados
│   ├── typography/
│   │   └── fonts/                   ← Ficheros .woff2 o referencia a CDN
│   └── templates/
│       ├── social-instagram-feed.fig
│       ├── social-instagram-story.fig
│       ├── email-signature.html
│       └── og-image-template.fig
└── tokens/
    ├── tokens.css                    ← CSS custom properties
    └── tokens.ts                     ← TypeScript (para packages/brand)
```

## Reglas
- ❌ NUNCA entregar logo solo en PNG sin versión vectorial SVG
- ❌ NUNCA definir colores solo en HEX — siempre incluir oklch (CSS) + PMS (impresión)
- ❌ NUNCA usar fuentes sin verificar licencia comercial + web
- ✅ SIEMPRE validar contraste WCAG AA antes de finalizar paleta
- ✅ SIEMPRE incluir usos incorrectos del logo (mínimo 6)
- ✅ SIEMPRE entregar en formatos digitales + impresión
- ✅ SIEMPRE sincronizar tokens finales con packages/brand/tokens.ts
