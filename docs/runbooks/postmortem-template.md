# Postmortem: [Título del incidente]

- Fecha del incidente: YYYY-MM-DD HH:MM UTC
- Duración: Xh Ymin
- Severidad: P0 / P1 / P2
- Redactado por: Alexendros
- Fecha del postmortem: YYYY-MM-DD

---

## Resumen ejecutivo

> 2-3 frases: qué pasó, impacto real, causa raíz.

---

## Cronología

| Hora (UTC) | Evento |
|-----------|--------|
| HH:MM | Primera señal de alerta (Sentry / Vercel / Uptime monitor) |
| HH:MM | Diagnóstico inicial |
| HH:MM | Acción de contención |
| HH:MM | Remediación aplicada |
| HH:MM | Servicio restaurado |
| HH:MM | Postmortem iniciado |

---

## Causa raíz

> Análisis técnico específico. No "error humano" como causa final — profundizar hasta el sistema que permitió el error.

---

## Impacto

- **Usuarios afectados**: N (estimado / confirmado)
- **Datos comprometidos**: Sí / No — especificar tipo si aplica
- **Tiempo de inactividad**: Xh Ymin
- **Pérdida económica estimada**: €X (si aplica)
- **Obligación de notificación RGPD**: Sí / No (si Sí: plazo 72h Art. 33)

---

## Qué salió bien

- [ ] Las alertas dispararon en tiempo razonable
- [ ] El runbook existente fue útil
- [ ] La contención fue rápida

---

## Qué salió mal

- [ ] ...
- [ ] ...

---

## Acciones correctivas

| Acción | Responsable | Fecha límite | Estado |
|--------|------------|-------------|--------|
| Añadir test de regresión | Alexendros | YYYY-MM-DD | Pendiente |
| Actualizar threat-model.md | Alexendros | YYYY-MM-DD | Pendiente |
| Actualizar runbook X | Alexendros | YYYY-MM-DD | Pendiente |

---

## Lecciones aprendidas

> Insight no obvio que aplicar a futuras decisiones de diseño o proceso.
