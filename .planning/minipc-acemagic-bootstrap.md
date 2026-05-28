# Puesta en marcha MiniPC AceMagic AlderLake (Ubuntu Server) + Coolify

## Contexto
Ubuntu Server recién instalado en MiniPC AceMagic AlderLake, sin red ni acceso remoto. Objetivo: llevarlo desde la consola física hasta un nodo autónomo, endurecido y con Coolify operativo como panel de orquestación Docker. Restricciones acordadas:

- Acceso desde 0: el operador conecta el equipo a Wi-Fi en la consola local; SSH se habilita después.
- Hardening "estándar + extras": UFW deny-by-default, SSH solo por clave, sin root, unattended-upgrades, fail2ban, AppArmor verificado, auditd, USBGuard, lynis baseline, SSH en puerto no estándar.
- DNS/dominio y layout de almacenamiento se deciden tras `lsblk`/`df -h` y tras evaluar exposición; arrancamos LAN-only.
- Yo (Claude) nunca invoco `sudo` directamente: preparo los comandos y el operador los ejecuta con `! sudo …` o los pega en la sesión del MiniPC ([[feedback_sudauth]]).

## Fases

### Fase A — En la consola física del MiniPC (sin red aún)
Inspección y conexión Wi-Fi. El operador ejecuta y me reporta salidas; yo decido la rama (NetworkManager vs systemd-networkd) según lo que encontremos.

1. Verificación base: `hostnamectl`, `timedatectl`, `localectl`, `ip -br a`, `ls /etc/netplan/`, `systemctl is-active NetworkManager systemd-networkd`.
2. Conectar Wi-Fi:
   - Si NetworkManager está activo: `nmcli device wifi list` → `nmcli device wifi connect "<SSID>" password "<pass>"` → `nmcli connection modify <name> connection.autoconnect yes`.
   - Si solo hay netplan+networkd: instalar `wpasupplicant`, escribir `/etc/netplan/60-wifi.yaml` con bloque `wifis:` (PSK via `wpa_passphrase` para no dejar la clave en claro), `netplan generate && netplan apply`.
3. Conectividad: `ping -c3 1.1.1.1`, `resolvectl status`, `ip route`.
4. Sistema al día: `apt update && apt -y full-upgrade && apt -y autoremove`. Reinicio si hay nuevo kernel.
5. SSH: confirmar `openssh-server` instalado (`dpkg -s openssh-server`), `systemctl enable --now ssh`, `ss -tlnp '( sport = :22 )'`. Anotar IP LAN.

### Fase B — Bootstrap de acceso desde esta máquina (Arch)
Crear material de claves dedicado y dejar SSH-por-clave operativo antes de tocar nada más.

1. Local: `ssh-keygen -t ed25519 -a 100 -f ~/.ssh/minipc_acemagic -C "alexendros@arch->minipc-acemagic"`.
2. Primer login con contraseña: `ssh-copy-id -i ~/.ssh/minipc_acemagic.pub <usuario>@<IP-LAN>`.
3. Entrada en `~/.ssh/config`:
   ```
   Host minipc
       HostName <IP-LAN>
       User <usuario>
       IdentityFile ~/.ssh/minipc_acemagic
       IdentitiesOnly yes
   ```
4. Validación: `ssh minipc 'id; uname -a; lsb_release -a'` sin pedir contraseña.

### Fase C — Hardening estándar + extras (vía SSH; comandos preparados por mí, ejecuta el operador)
Archivos a crear/editar (rutas representativas — describo el patrón una vez):

- `/etc/ssh/sshd_config.d/99-hardening.conf`: `PasswordAuthentication no`, `PermitRootLogin no`, `KbdInteractiveAuthentication no`, `PubkeyAuthentication yes`, `MaxAuthTries 3`, `LoginGraceTime 20`, `AllowUsers <usuario>`, `Port <no-estándar>` (te pregunto el puerto antes de aplicar), juego conservador de `KexAlgorithms`/`Ciphers`/`MACs` validado con `ssh-audit`. Test: `sshd -t` y mantener una sesión paralela abierta antes de `systemctl reload ssh`.
- UFW: `default deny incoming` / `default allow outgoing`, `allow <SSH-port>/tcp`, `enable`. 80/443 quedan cerrados hasta decidir exposición.
- `fail2ban` con jail `sshd` apuntando al puerto elegido (`/etc/fail2ban/jail.d/sshd.local`).
- `unattended-upgrades` + `apt-listchanges`; activar updates de seguridad y `Unattended-Upgrade::Automatic-Reboot "false"` por defecto (te pregunto si quieres ventana automática).
- `needrestart` en modo lista (no auto-restart de servicios).
- AppArmor: verificar `aa-status` (viene activo en Ubuntu); no cambiamos perfiles salvo necesidad.
- `auditd` con reglas base en `/etc/audit/rules.d/hardening.rules` (sudo, ssh, mod de `/etc/passwd|shadow`, USB).
- `usbguard`: `usbguard generate-policy > /etc/usbguard/rules.conf` con los dispositivos actuales, luego `systemctl enable --now usbguard`.
- `lynis audit system` y guardar el informe como baseline en `/var/log/lynis-baseline-$(date +%F).log`.
- `/etc/sysctl.d/99-hardening.conf`: `kernel.kptr_restrict=2`, `kernel.dmesg_restrict=1`, `net.ipv4.conf.all.rp_filter=1`, `net.ipv4.conf.all.accept_redirects=0`, `net.ipv6.conf.all.accept_redirects=0`, `net.ipv4.conf.all.send_redirects=0`, `net.ipv4.tcp_syncookies=1`.
- `/etc/systemd/journald.conf.d/persistent.conf`: `Storage=persistent`, `SystemMaxUse=1G`.
- `chrony` para NTP (sustituye a `systemd-timesyncd` si conviene auditoría de deriva).
- Swap: si el instalador no creó, `zram-tools` (preferido en RAM holgada) o swapfile de 2–4 GB.

Cualquier script de orquestación local que generemos vivirá en `$CLAUDE_JOB_DIR` y se enviará por `scp` (no editaré nada del MiniPC sin que tú apliques).

### Fase D — Docker Engine + Coolify
1. Inventario antes de tocar disco: `lsblk -f`, `df -h`, `findmnt`. Con ese dato decidimos juntos si `/var/lib/docker` y `/data/coolify` viven en raíz o en partición/LV separado (decisión diferida en la pregunta inicial).
2. Docker Engine **oficial** (no `docker.io` de Ubuntu) siguiendo el repo apt de Docker: `apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`.
3. `/etc/docker/daemon.json`: `{"log-driver":"json-file","log-opts":{"max-size":"10m","max-file":"5"},"live-restore":true,"userland-proxy":false}` y, si separamos disco, `"data-root":"/data/docker"`.
4. Coolify (vía instalador oficial; lo reviso antes de ejecutar):
   `curl -fsSL https://cdn.coolify.io/coolify/install.sh | sudo bash`.
   Comprobaciones previas: ≥2 vCPU, ≥2 GB RAM, ≥30 GB libres. Coolify deja sus datos en `/data/coolify`.
5. UFW: abrir `8000/tcp` (UI) restringido a la LAN con `ufw allow from <CIDR-LAN> to any port 8000`. 80/443 siguen cerrados.
6. Acceso inicial: `http://<IP-LAN>:8000`, crear cuenta admin, guardar credenciales en gestor de contraseñas.

### Fase E — Decisiones diferidas (post-bootstrap)
Plantear y resolver una vez Coolify esté arriba:

- **Exposición/DNS**: LAN-only vs dominio público con Let's Encrypt (Coolify lo gestiona) vs Cloudflare Tunnel sin abrir puertos. Recomendación por defecto si quieres que decida yo: **Cloudflare Tunnel** — evita NAT/puertos, oculta IP residencial y da TLS gestionado.
- **Administración remota fuera de LAN**: Tailscale (subnet router en el MiniPC) en lugar de exponer SSH a Internet.
- **Backups**: Coolify soporta destinos S3-compatibles; complementar con `restic` o `borgbackup` a un destino externo para `/data/coolify` y volúmenes Docker.
- **Observabilidad**: panel propio de Coolify + opcional Netdata local (read-only, sin cloud).

### Fase F — Verificación end-to-end
- `ssh-audit minipc -p <puerto>` desde Arch → sin findings rojos.
- `lynis audit system` → comparar score con el baseline.
- `systemctl is-active sshd ufw fail2ban auditd usbguard docker chrony unattended-upgrades` → todos `active`.
- `aa-status | head` → perfiles enforcing.
- `docker ps` muestra contenedores de Coolify; UI accesible en `http://<IP-LAN>:8000`; login y creación de un proyecto/recurso de prueba (ej: una app estática) confirma el flujo.
- Reinicio controlado del MiniPC y verificar que Wi-Fi, SSH y Coolify levantan solos (`live-restore` + autoconnect).

## Preguntas que dispararé durante la ejecución
- Puerto SSH no estándar concreto (sugiero uno en 49152–65535).
- `<usuario>` real creado en el instalador y `<SSID>`/credenciales Wi-Fi (las pides tú, no se guardan en memoria).
- Layout final `/data` cuando veamos `lsblk`.
- Modelo de exposición Coolify cuando lleguemos a Fase E.

## Riesgos y mitigaciones
- **Bloqueo por SSH mal configurado**: aplicar `sshd_config.d` con `sshd -t` y dejar sesión paralela abierta antes de `reload`.
- **UFW corta SSH**: añadir regla del puerto SSH *antes* de `ufw enable`.
- **Wi-Fi inestable para un servidor**: documentado como provisional; recomendable cable Ethernet en cuanto sea posible (anotado para revisitar).
- **Instalador de Coolify ejecuta script remoto como root**: leer el script (`curl … | less`) antes de pasar a `bash`; fijar versión si conviene reproducibilidad.
