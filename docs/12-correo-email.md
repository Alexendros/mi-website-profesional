# 12 · Correo electrónico `@alexendros.pro`

> Configuración de correo del dominio, DNS, clientes, aliases y buzones. Documento pedagógico — sirve de referencia y de README público del área "correo".

---

## 1. Cómo funciona un buzón y qué pinta el DNS

Una bandeja de correo es un **buzón MIME** almacenado en un servidor **IMAP** (o históricamente POP3) perteneciente a un dominio. El DNS actúa de **cartero**: cuando alguien envía a `hola@alexendros.pro`, su servidor resuelve el registro **MX** del dominio (p.ej. `10 mail.protonmail.ch.`) y entrega el mensaje por SMTP al servidor indicado. El destinatario lo lee luego por IMAP o webmail.

Registros DNS que publica un dominio para correo:

| Registro | Para qué sirve | Ejemplo |
|---|---|---|
| **MX** | Dice a quién entregar correo entrante | `@ IN MX 10 mail.protonmail.ch.` |
| **SPF** (TXT) | Autoriza qué IPs/servidores pueden enviar en nombre del dominio | `v=spf1 include:_spf.protonmail.ch ~all` |
| **DKIM** (TXT/CNAME) | Firma criptográfica del mensaje; el receptor verifica integridad y origen | `protonmail._domainkey CNAME protonmail.domainkey.<hash>.domains.proton.ch.` |
| **DMARC** (TXT) | Política conjunta SPF+DKIM y reportes de abuso | `_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@alexendros.pro"` |
| **MTA-STS**, **TLS-RPT** | (Avanzados) fuerzan TLS en tránsito + reporte de fallos | `_mta-sts TXT "v=STSv1; id=2026…"` |
| **Autodiscover / Autoconfig** (CNAME) | Para que clientes se auto-configuren | `autodiscover CNAME autodiscover.protonmail.ch.` |

Sin SPF/DKIM/DMARC, los correos salen a spam con altísima probabilidad. Un dominio publicado **debe** tener al menos SPF + DKIM + DMARC. La política DMARC mínima razonable es `p=none` en rodaje (solo reporta), luego escalar a `p=quarantine` y finalmente `p=reject` cuando los reportes confirmen ausencia de spoofing.

---

## 2. Clientes: artesanal vs aplicación

### 2.1 Artesanal / manual

Hablar directamente con el servidor. Útil para depurar o scripts.

- **Lectura IMAP con `openssl`** (comandos RFC 3501):
  ```
  openssl s_client -connect imap.example:993
  A01 LOGIN user pass
  A02 SELECT INBOX
  A03 FETCH 1 BODY[]
  ```
- **Envío SMTP** con `swaks`:
  ```
  swaks --to hola@alexendros.pro --server mail.protonmail.ch --tls --auth
  ```
  O `msmtp` + `.msmtprc` para envío programático.
- **Administración por CLI**: `neomutt`, `mutt`, `aerc`.
- **Procesado por scripts**: `getmail` + `maildirmake`.

**Ventajas**: transparencia, auditabilidad, scripting trivial, sin telemetría.
**Desventajas**: sin notificaciones pulidas, sin calendario/contactos integrados, curva pronunciada.

### 2.2 Cliente de aplicación (Thunderbird, Apple Mail, Evolution, K-9 Mail)

- Pool de conexiones IMAP IDLE (notificación push nativa), cache local, filtros visuales.
- Cifrado S/MIME o OpenPGP con buena UX, calendario CalDAV, contactos CardDAV.
- **Autoconfiguración**: el cliente lee `autoconfig.<dominio>/mail/config-v1.1.xml` o `autodiscover.<dominio>` → el usuario solo pone email + contraseña.

**Ventajas**: UX para uso diario.
**Desventajas**: opaco ante bugs, sincronización masiva de cache pesada en discos lentos.

### 2.3 Webmail propietario (Proton WebMail, Roundcube, Hostinger)

Cero configuración local. Latencia de red. E2E en Proton (cifrado nativo entre cuentas Proton).

### 2.4 Bridge local (caso aplicable aquí)

**Proton Mail Bridge** traduce el correo E2E de Proton a IMAP/SMTP estándar en `127.0.0.1:1143` / `127.0.0.1:1025` para que Thunderbird (o un MCP, como `ProtonMail-MCP`) lo consuman. Es el puente entre el mundo artesanal/aplicación y el mundo E2E.

---

## 3. Qué direcciones debe tener un dominio publicado

No todos los dominios necesitan todas, pero un dominio **corporativo/profesional** publicado suele combinar 4 grupos:

### 3.1 Grupo 1 · Operativo (uso humano día a día)

- `hola@` o `contacto@` — buzón principal público. Va en webs, firmas, tarjetas.
- `alejandro@` o el nombre del fundador — correo personal corporativo. LinkedIn, comunicaciones personales salientes.

### 3.2 Grupo 2 · Funcional (departamental / por función)

- `soporte@` — incidencias de clientes. Imprescindible con ≥1 usuario externo.
- `facturacion@` o `admin@` — invoicing, contabilidad, gestoría.
- `prensa@` — opcional, para dominios con visibilidad pública.
- `ventas@` / `sales@` — si hay outbound.

### 3.3 Grupo 3 · Cumplimiento (RGPD / legal / abuso)

- `rgpd@` o `privacidad@` — obligatorio si el dominio publica una política de privacidad. Mención directa en el aviso legal ([RGPD art. 13-14]). Puede converger con `dpo@` si hay Delegado de Protección de Datos (no obligatorio para micropymes sin tratamientos especiales).
- `dpo@` — solo si hay DPO designado.
- `legal@` — avisos legales, requerimientos de terceros (takedown, GDPR requests, subpoenas).
- `abuse@` — **obligatorio de facto** por [RFC 2142] para dominios que emiten correo. Destinatario de quejas automatizadas de spam/blocklists.
- `postmaster@` — **obligatorio** por [RFC 2142]. Lo usan los servidores de otros dominios para reportar NDR o debug SMTP. Nunca se cierra.

### 3.4 Grupo 4 · Sistema (no para humanos directamente)

- `noreply@` o `no-reply@` — dirección **FROM** de correos transaccionales (signup, password reset, facturas automáticas). No abrir IMAP; o abrir y auto-descartar con filtro.
- `newsletter@` — si hay lista de distribución. El SPF necesita incluir al relay (Resend, Mailgun, SendGrid).
- `webmaster@` — histórico [RFC 2142] para avisos de errores técnicos del web (útil para Google Search Console).
- `security@` — recomendado por [RFC 9116] para publicar un `/.well-known/security.txt` con contacto de vulnerabilidades.

---

## 4. Propuesta concreta para `alexendros.pro` (12 entradas)

Dominio profesional con web pública Vercel y marca personal fuerte. Perfil: 1 humano + SaaS en backlog. Mix de 4 buzones reales + 7 aliases que forwardean al buzón que toque.

| Dirección | Tipo | Destino real | Justificación |
|---|---|---|---|
| `alejandro@alexendros.pro` | Buzón | Proton | Correo personal corporativo del fundador. |
| `hola@alexendros.pro` | Buzón | Proton | Puerta de entrada pública. Figura en web, firma, tarjeta. |
| `soporte@alexendros.pro` | Alias → buzón | → `hola@` (buzón propio cuando haya clientes) | Reservar el nombre ya. |
| `facturacion@alexendros.pro` | Buzón | Proton | Separar administrativo del operativo. |
| `rgpd@alexendros.pro` | Alias → buzón | → `alejandro@` | Obligatorio figurar en aviso legal. |
| `legal@alexendros.pro` | Alias → buzón | → `alejandro@` | Requerimientos / terceros / GDPR requests. |
| `abuse@alexendros.pro` | Alias → buzón | → `alejandro@` | [RFC 2142] obligatorio. |
| `postmaster@alexendros.pro` | Alias → buzón | → `alejandro@` | [RFC 2142] obligatorio. |
| `security@alexendros.pro` | Alias → buzón | → `alejandro@` | `/.well-known/security.txt`. |
| `webmaster@alexendros.pro` | Alias → buzón | → `alejandro@` | Search Console + [RFC 2142]. |
| `noreply@alexendros.pro` | FROM solo | Buzón con auto-respuesta "no monitorizado" | Transaccional. |
| `newsletter@alexendros.pro` | FROM solo | — | Opcional; activar cuando haya lista. |

**Plan Proton**: Mail Plus cubre 1 dominio custom + hasta 10 aliases. Si se queda corto, **Mail Professional** extiende a 10 dominios × 15 addresses.

---

## 5. Publicación DNS en Proton (valores canónicos)

Tras añadir el dominio en `account.proton.me → Settings → Domain names → Add domain → alexendros.pro`, Proton devuelve los valores exactos a publicar. Forma canónica:

```
MX    @                           10  mail.protonmail.ch.            14400
MX    @                           20  mailsec.protonmail.ch.         14400
TXT   @                           "v=spf1 include:_spf.protonmail.ch ~all"        14400
TXT   @                           "protonmail-verification=<CODE_SESSION>"        14400
CNAME protonmail._domainkey       protonmail.domainkey.<HASH>.domains.proton.ch.  14400
CNAME protonmail2._domainkey      protonmail2.domainkey.<HASH>.domains.proton.ch. 14400
CNAME protonmail3._domainkey      protonmail3.domainkey.<HASH>.domains.proton.ch. 14400
TXT   _dmarc  "v=DMARC1; p=none; rua=mailto:alejandro@alexendros.pro; ruf=mailto:alejandro@alexendros.pro; sp=none; aspf=s; adkim=s"   14400
```

**Orden de publicación**: primero `TXT protonmail-verification=…` (para que Proton acepte el dominio), luego `MX` (el switch real que entrega correos a Proton), luego DKIM + DMARC.

**Escalado DMARC**: `p=none` en rodaje 7 días con reportes `rua`. Cuando los reportes confirmen 0 spoofing, subir a `p=quarantine`. Solo con 14 días limpios en quarantine, subir a `p=reject`.

---

## 6. Validación end-to-end

```bash
dig +short MX alexendros.pro
# → 10 mail.protonmail.ch. / 20 mailsec.protonmail.ch.

dig +short TXT alexendros.pro
# → debe contener SPF y verification

dig +short TXT _dmarc.alexendros.pro
# → v=DMARC1; p=none; ...

dig +short CNAME protonmail._domainkey.alexendros.pro
# → protonmail.domainkey.<hash>.domains.proton.ch.
```

Auditar con [mail-tester.com](https://www.mail-tester.com/) desde `hola@alexendros.pro` → objetivo ≥ 9/10.

Envío de prueba: Gmail → `hola@alexendros.pro` → reply → de vuelta a Gmail sin tag de spam, con DKIM verde en `Authentication-Results`.

---

## 7. Publicación en el sitio web

- **Footer**: `hola@alexendros.pro` (contacto) + `rgpd@alexendros.pro` (privacidad).
- **Aviso legal / política de privacidad**: `rgpd@alexendros.pro` como contacto del responsable.
- **Condiciones de uso / legal**: `legal@alexendros.pro`.
- **security.txt**: fichero servido desde `/.well-known/security.txt` con:

```
Contact: mailto:security@alexendros.pro
Expires: 2027-04-23T00:00:00.000Z
Preferred-Languages: es, en
```

En Next.js: fichero en `apps/alexendros-pro/public/.well-known/security.txt`.

---

## Referencias

- [RFC 2142] · Mailbox Names for Common Services, Roles and Functions
- [RFC 9116] · A File Format to Aid in Security Vulnerability Disclosure
- RGPD arts. 13 y 14 · información al interesado
- [Proton Mail custom domain setup](https://proton.me/support/custom-domain)
- `reference_proton_bridge.md` (memoria) · IMAP/SMTP locales para cliente/MCP

[RFC 2142]: https://www.rfc-editor.org/rfc/rfc2142
[RFC 9116]: https://www.rfc-editor.org/rfc/rfc9116
