# 09 — CRM Clientes

> Gestión comercial y pipeline de ventas para KitOS. Integrado con n8n para automatización.

## Pipeline de ventas

| # | Etapa | Definición | Acción siguiente |
|---|-------|-----------|-----------------|
| 1 | **Lead** | Contacto inicial, interés genérico | Cualificar: ¿tiene presupuesto + timeline? |
| 2 | **Cualificado** | Presupuesto + timeline definidos | Enviar propuesta (doc/08 template) |
| 3 | **Propuesta enviada** | Doc template enviado | Follow-up a los 3 días si no responde |
| 4 | **Negociación** | Ajustes de scope o precio | Cerrar o ajustar propuesta |
| 5 | **Cerrado Ganado** | Contrato firmado (Afiladocs) + pago recibido | Activar onboarding (W-01) |
| 6 | **Cerrado Perdido** | Documentar razón (precio/competidor/timing/otro) | Win-back a 90 días |
| 7 | **Cliente Activo** | Suscripción activa en KitOS | Engagement continuo (W-04..W-07) |

## Modelo de datos CRM

```typescript
// Estructura de lead en Notion / Supabase (tabla futura: crm_leads)
interface CRMlead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;              // nombre artístico, despacho o gestoría
  kitId: string;                 // 'stagekit' | 'lexkit' | 'gestkit'
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'active';
  source: string;                // 'instagram' | 'referral' | 'seo' | 'event' | 'outreach' | 'waitlist'
  referredBy?: string;           // ID del afiliado si aplica
  proposalValue?: number;        // € estimado (setup + 12 meses suscripción)
  lostReason?: string;           // si stage = 'lost'
  notes: string;
  nextAction: string;
  nextActionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Canales de adquisición

| Canal | Kit principal | Métrica de seguimiento |
|-------|-------------|----------------------|
| Instagram DM / Story | StageKit | Leads desde IG / semana |
| Referido por cliente | Todos | Referrals / mes (affiliate tracking) |
| SEO orgánico | Todos | Leads desde búsqueda / mes (PostHog UTM) |
| Eventos techno Madrid/Barcelona | StageKit | Leads post-evento / evento |
| Outreach directo | StageKit | Response rate (%) |
| Waitlist web | Todos | Signups waitlist / semana |
| Colegios profesionales | LexKit, GestKit | Leads desde partnerships / mes |

## Workflows n8n (automatización CRM)

| Workflow | Trigger | Acciones |
|---------|---------|----------|
| **Nuevo lead** | Webhook KitOS `waitlist_signup` o `booking_request_created` | 1. Crear entrada en CRM → 2. Email notificación a Alejandro → 3. Crear tarea follow-up (3 días) |
| **Follow-up inactivo** | Cron: diario 9:00 | Consultar leads sin actividad > 7 días → Email recordatorio interno → Escalar si > 14 días |
| **Lead → Cliente** | Webhook Stripe `checkout.session.completed` | Actualizar stage a "won" → Registrar valor del contrato → Trigger onboarding W-01 |
| **Churn tracking** | Webhook Stripe `customer.subscription.deleted` | Actualizar stage a "lost" con motivo → Trigger win-back W-21 |

## Métricas pipeline

| Métrica | Fórmula | Target mes 1 |
|---------|---------|-------------|
| Leads / mes | Nuevos leads totales | 100 |
| Tasa cualificación | Cualificados / Leads | ≥ 30% |
| Tasa propuesta→cierre | Won / Propuestas | ≥ 40% |
| Tiempo medio en pipeline | Avg(won.date - lead.date) | < 14 días |
| Valor medio por cliente | MRR total / clientes activos | 29€ (target Pro) |
| Churn mensual | Bajas / activos inicio mes | < 5% |

## Plantilla de seguimiento

| Cliente | Kit | Etapa | Valor est. | Fuente | Próxima acción | Fecha |
|---------|-----|-------|-----------|--------|---------------|-------|
| — | — | — | — | — | — | — |
