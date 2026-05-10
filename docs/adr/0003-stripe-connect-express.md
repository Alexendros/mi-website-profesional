# ADR-0003 · Stripe Connect Express para pagos y afiliados

- Fecha: 2026-05-10
- Estado: Aceptado
- Decisor: Alexendros

## Contexto

El modelo de negocio tiene dos capas: suscripciones de clientes finales (StageKit Pro/Agency) y programa de afiliados donde partners cobran comisión por referidos. Ambas capas requieren gestión de dinero real.

## Decisión

**Stripe Subscriptions** para suscripciones de clientes. **Stripe Connect Express** para el programa de afiliados. PCI DSS SAQ-A + PSD2/SCA obligatorio.

## Justificación

| Criterio | Connect Express | Connect Standard | Connect Custom |
|---------|:---:|:---:|:---:|
| Onboarding afiliados | Stripe-hosted simplificado | Gestión propia | Completamente custom |
| Control sobre cuenta | Medio | Bajo | Alto |
| Caso de uso | ✅ Afiliados/partners | Marketplaces | Plataformas UX custom |
| Compliance PSD2 | ✅ gestionado por Stripe | ✅ | requiere trabajo |
| Time-to-market | ✅ rápido | ✅ | lento |

Stripe gestiona 100% del procesamiento de tarjetas — nunca almacenar datos de tarjeta propios (PCI DSS SAQ-A).

## Consecuencias

- Webhooks verificados con `stripe.webhooks.constructEvent()` antes de cualquier proceso.
- 6 webhooks críticos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`, `transfer.created`, `payment_intent.succeeded`.
- 3DS2/SCA obligatorio para transacciones UE (Directiva PSD2 2015/2366/UE).
- IDs de precios (`price_xxx`) en variables de entorno — nunca hardcodeados.
- Trial 14 días para conversión: `trial_period_days: 14` en subscription params.

## Alternativas descartadas

- **Paddle**: mejor para SaaS con VAT handling automático EU, pero menor integración con el ecosistema React/Next.js y mayor coste por transacción.
- **LemonSqueezy**: buena alternativa Merchant of Record, evaluar en V2 si el VAT manual se convierte en carga.
- **Procesador propio**: descartado — PCI DSS Nivel 1 requiere auditoría anual cara.
