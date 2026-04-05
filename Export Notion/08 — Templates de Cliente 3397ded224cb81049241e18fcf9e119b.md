# 08 — Templates de Cliente

# Templates de Cliente

## Estructura de un template EPK

Cada template es un objeto JSON almacenado en el campo `content` del modelo EPK.

```tsx
// types/epk.ts
export interface EPKContent {
  template: 'default' | 'minimal' | 'festival' | 'agency';
  sections: {
    hero: {
      photo: string;          // URL Supabase Storage
      stageName: string;
      tagline: string;        // max 120 chars
    };
    bio: {
      short: string;          // max 280 chars (para promotores)
      long: string;           // full bio
      lang: 'es' | 'en' | 'bilingual';
    };
    music: {
      soundcloudUrl?: string;
      spotifyUrl?: string;
      mixcloudUrl?: string;
      featuredTrackEmbed?: string;
    };
    live: {
      genres: string[];
      bpm: { min: number; max: number };
      setDuration: string;    // ej: '60-90 min'
      technicalRiderUrl?: string;
    };
    press: {
      photos: string[];       // URLs Supabase Storage, max 10
      logos: string[];        // artist logo variants
    };
    social: {
      instagram?: string;
      residentAdvisor?: string;
      facebook?: string;
      youtube?: string;
    };
    booking: {
      contactEmail: string;
      fee?: string;           // rango ej: '500-1500 EUR'
      territories: string[];  // ['ES', 'DE', 'NL', 'UK']
    };
  };
}
```

## Template: Propuesta comercial (para clíentes de Alexendros)

```markdown
# Propuesta de Desarrollo Web
## [Nombre del artista/proyecto]

**Preparado por:** Alejandro Domingo Agustí · alexendros.me
**Fecha:** [FECHA]
**Validez:** 30 días

---

### Scope del proyecto

| Entregable | Descripción | Incluido |
|-----------|-------------|----------|
| Diseño UI | Figma mockups + design tokens | ✅ |
| EPK Web | Implementación en StageKit | ✅ |
| Dominio custom | Configuración DNS + SSL | ✅ |
| Email de artista | [artista]@[dominio].com | ✅ |
| SEO inicial | Meta tags, JSON-LD, sitemap | ✅ |
| Analytics | PostHog dashboard privado | ✅ |

### Inversión

| Concepto | Importe |
|----------|---------|
| Setup + diseño | 350 € |
| Suscripción StageKit Pro | 29 €/mes |
| Mantenimiento mensual (opcional) | 99 €/mes |

### Condiciones
- 50% pago inicial para comenzar
- 50% restante en entrega
- Soporte incluido: 30 días post-entrega
```