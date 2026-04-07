# Skill: gdpr-audit
# Uso: antes de cualquier deploy a producción con features de datos personales
# Activar con: /skills gdpr-audit

## Checklist pre-deploy (ejecutar en orden)

### 1. Inventario de datos
- [ ] ¿Qué datos personales procesa esta feature? (nombre, email, IP, comportamiento...)
- [ ] ¿Hay base legal documentada en código? (`// RGPD Art.6.1.X — [finalidad]`)
- [ ] ¿Los datos se transmiten a terceros? ¿Cuáles? ¿DPA firmado?

### 2. Consentimiento (si base legal = 6.1.a)
- [ ] Checkbox no pre-marcado
- [ ] Texto claro (no legalés), enlace a Política de Privacidad
- [ ] `consent_given_at` almacenado en DB
- [ ] Mecanismo de revocación disponible

### 3. Analytics y tracking
- [ ] PostHog: NO se inicializa hasta `window.__consent === 'accepted'`
- [ ] Sentry `beforeSend`: elimina `user.email`, `user.id`, IPs de eventos
- [ ] Sin cookies de terceros cargándose antes de consentimiento
- [ ] Cookie banner bloquea scripts (no solo oculta visualmente)

### 4. Seguridad técnica (Art. 32 RGPD)
- [ ] RLS activo en tablas con datos personales
- [ ] HTTPS obligatorio (Vercel lo garantiza)
- [ ] Passwords: NUNCA en DB (Supabase Auth gestiona hashing)
- [ ] Tokens/secretos: NUNCA en logs
- [ ] Rate limiting en endpoints de autenticación

### 5. Derechos de los interesados
- [ ] Endpoint `/api/account/export` funcional (Derecho de acceso + portabilidad)
- [ ] Endpoint `/api/account/delete` funcional (Derecho de supresión)
- [ ] Email de respuesta a solicitudes ARCO: privacidad@alexendros.me

### 6. Textos legales
- [ ] Aviso Legal publicado en `/legal/aviso-legal` (Art. 10 LSSI-CE)
- [ ] Política de Privacidad en `/legal/privacidad` (Art. 13 RGPD)
- [ ] Política de Cookies en `/legal/cookies` (AEPD Guía 2023)
- [ ] Términos en `/legal/terminos` (con SLA, cancelación, reembolsos)

### 7. Registro de actividades (Art. 30 RGPD)
- [ ] Actualizar Notion → "Registro de Actividades" con la nueva feature

## Resultado: VERDE / ROJO
```
VERDE → todos los checks marcados → autorizado deploy a producción
ROJO → algún check sin marcar → NO desplegar hasta resolver
```

## Normativa de referencia
- RGPD: Reglamento EU 2016/679 (vigente 25/05/2018)
- LOPDGDD: LO 3/2018, BOE 06/12/2018
- LSSI-CE: Ley 34/2002, BOE 12/07/2002
- AEPD Guía Cookies 2023: aepd.es/guias/guia-cookies.pdf
- PCI DSS v4.0: pcisecuritystandards.org
