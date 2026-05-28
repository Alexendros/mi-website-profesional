# Preflight Dokploy — VPS Hostinger antes de desplegar Supabase

> Fase 4.0 del ROADMAP. Ninguna casilla queda sin ejecutar antes de pasar a 4.1.
> Comandos pensados para ejecutar **en el VPS** (no en el portátil del operador).
> El operador los lanza con `! ssh vps "<comando>"` o entrando por SSH.

## Salida esperada

Rellenar la tabla `Resultados` con la fecha y el valor obtenido. Si cualquier
check obligatorio falla, **bloquear** el deploy y resolverlo antes.

## Checks obligatorios

| # | Check | Comando | Esperado | Bloqueador |
|---|---|---|---|---|
| 1 | País del datacenter (RGPD Art. 44+) | `curl -fsSL ipinfo.io/country` | DE, NL, FR, LT, IE, ES o cualquier EU/EEA | **Sí** |
| 2 | RAM total | `free -h \| awk '/Mem:/{print $2}'` | ≥ 4Gi | **Sí** |
| 3 | vCPU | `nproc` | ≥ 2 | **Sí** |
| 4 | Disco libre en `/var/lib/docker` | `df -h /var/lib/docker \| tail -n1` | ≥ 40 GB libres | **Sí** |
| 5 | Docker version | `docker --version` | ≥ 24.x | **Sí** |
| 6 | Compose v2 | `docker compose version` | v2.x | **Sí** |
| 7 | Red Dokploy presente | `docker network ls \| grep dokploy-network` | una fila | **Sí** |
| 8 | Resolver Traefik Let's Encrypt | revisar UI Dokploy → Settings → Traefik → `certificatesResolvers.letsencrypt` | configurado | **Sí** |
| 9 | DNS `supabase.alexendros.pro` A | `dig +short supabase.alexendros.pro A` | IP del VPS | **Sí** |
| 10 | DNS `studio.supabase.alexendros.pro` A | `dig +short studio.alexendros.pro A` (alias correcto) | IP del VPS | **Sí** |
| 11 | DNS `db.supabase.alexendros.pro` A | `dig +short db.supabase.alexendros.pro A` | IP del VPS | **Sí** |
| 12 | Reloj sincronizado (NTP) | `timedatectl status \| grep -E 'NTP|synchronized'` | `System clock synchronized: yes` | Sí |
| 13 | Firewall — puerto 22 SSH limitado | `! sudo ufw status numbered` o `! sudo iptables -L INPUT -n` | IPs del operador | Sí |
| 14 | IPv6 (opcional) | `dig +short supabase.alexendros.pro AAAA` | AAAA o vacío | No |

## Estimación de recursos en VPS

Con Supabase + n8n + Dokploy + Traefik conviviendo:

| Servicio | RAM | Disco |
|---|---|---|
| Dokploy + Traefik | 300 MB | 1 GB |
| Postgres (Supabase) | 1.5 GB | 10 GB inicial |
| Kong | 256 MB | <100 MB |
| GoTrue (Auth) | 256 MB | <100 MB |
| Realtime | 256 MB | <100 MB |
| Storage + imgproxy | 384 MB | 5 GB |
| Studio | 256 MB | <100 MB |
| meta / functions / analytics / vector | 768 MB | 2 GB |
| Supavisor | 192 MB | <100 MB |
| n8n + Postgres n8n | 1 GB | 5 GB |
| Total objetivo | ~5.2 GB | ~24 GB |

Margen recomendado: VPS de **8 GB RAM / 80 GB disco** si se prevé crecimiento.

## DNS — registros a crear en panel Hostinger

```
Tipo  Nombre                          Valor              TTL
A     supabase.alexendros.pro         <IP_VPS>           3600
A     studio.supabase.alexendros.pro  <IP_VPS>           3600
A     db.supabase.alexendros.pro      <IP_VPS>           3600
AAAA  (mismos, opcional)              <IPv6_VPS>         3600
```

## Resultados (rellenar)

| Fecha | Check | Resultado | Notas |
|---|---|---|---|
| YYYY-MM-DD | #1 país | DE | Hostinger Frankfurt |
| ... | ... | ... | ... |

## Salida del bloque

Cuando los 13 obligatorios estén en verde, marcar el ítem 4.0 del ROADMAP como `[x]`
y proceder a `infra/dokploy/supabase/README.md` (Fase 4.1).
