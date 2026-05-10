# ADR-0006 · Cookie banner bloqueante real (AEPD 2023)

- Fecha: 2026-05-10
- Estado: Aceptado
- Decisor: Alexendros

## Contexto

La guía de cookies de la AEPD (enero 2023) exige que las cookies de analítica (PostHog) y publicidad no se activen hasta que el usuario dé consentimiento explícito. El incumplimiento conlleva sanciones de 3.000€ a 50.000€ (Art. 43 LSSI-CE).

## Decisión

Cookie banner **bloqueante real**: PostHog y cualquier analytics third-party se inicializan únicamente después de que el usuario haga clic en "Aceptar". El consentimiento se persiste en `ConsentLog` (tabla Prisma) y en cookie de primera parte `consent_given=1; SameSite=Strict; max-age=31536000`.

## Justificación

- **Riesgo económico**: sanción típica AEPD por cookie decorativa: 3.000€–50.000€. Coste de implementar correctamente: ~4 horas.
- **Técnicamente**: PostHog SDK tiene `opt_in_capturing()` / `opt_out_capturing()` — no requiere librerías externas.
- **RGPD Art. 6.1.a**: base legal "consentimiento" requiere que sea libre, específico, informado e inequívoco. Un banner que activa cookies al navegar no cumple.

## Consecuencias

- `PostHog` no importar en layout global — inicializar solo en Client Component `<AnalyticsProvider>` con guard de consent.
- `ConsentLog` en DB con `user_id`, `consent_at`, `consent_version`, `ip_hash` (no IP literal — anonimización RGPD Art. 25).
- Endpoint `/api/consent` para registrar/revocar consent con rate limiting.
- El banner muestra: "Aceptar todo" · "Rechazar" · "Gestionar preferencias". Las tres opciones deben ser igual de prominentes (AEPD: no asimetría visual).
- Cookies estrictamente necesarias (auth session, CSRF) no requieren consent — documentar en política de cookies.

## Alternativas descartadas

- **`react-cookie-consent`**: genera banners decorativos que no bloquean scripts. No compliant AEPD 2023.
- **Consent Management Platform (CMP) externa** (Cookiebot, OneTrust): coste mensual >30€ injustificado para MVP. La implementación propia cubre el caso.
- **No analytics**: opción válida técnicamente, pero PostHog es necesario para medir conversión y churn. Implementar consent correctamente es la solución.
