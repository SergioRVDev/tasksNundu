# Docker Development Guide

## Quick Start

### Desarrollo (Recomendado - Con Hot Reload)

```bash
# Primera vez - build + run
docker-compose -f docker-compose.dev.yml up --build

# Próximas veces - solo run
docker-compose -f docker-compose.dev.yml up
```

✅ Cambios en código se reflejan automáticamente
✅ Sin necesidad de rebuild
✅ Logs en tiempo real

**Acceso:**
- Frontend: http://localhost:3000
- API: http://localhost:3001

### Producción (Optimizado - Sin Hot Reload)

```bash
# Build + run
docker-compose up --build

# Solo run
docker-compose up
```

⚡ Más rápido y ligero
🔒 Totalmente compilado y optimizado
🚀 Listo para deploy

---

## Cómo Funciona el Hot Reload

### 1. **Volúmenes Montados**
```yaml
volumes:
  - ./nundu-api:/app           # Sincroniza código local
  - /app/node_modules          # Pero NO node_modules
  - ./nundu-api/data:/app/data  # Datos persistentes
```

El código del host se sincroniza con el contenedor en tiempo real.

### 2. **Watch Polling**
```yaml
environment:
  - CHOKIDAR_USEPOLLING=true    # Usa polling en Windows
  - CHOKIDAR_INTERVAL=1000       # Cada 1 segundo
```

Necesario en Windows/WSL porque el file watching nativo no funciona con volúmenes.

### 3. **Detección Automática**
- Node.js (API) detecta cambios automáticamente
- Next.js (Frontend) recompila automáticamente
- No necesitas reiniciar el contenedor

---

## Archivos de Configuración

| Archivo | Propósito |
|---------|-----------|
| `docker-compose.yml` | Producción: compilado, optimizado, sin hot reload |
| `docker-compose.dev.yml` | Desarrollo: con hot reload y watch polling |
| `nundu-api/Dockerfile` | API producción: build final |
| `nundu-api/Dockerfile.dev` | API desarrollo: solo dependencias |
| `nundu-task/Dockerfile` | Frontend producción: next build + start |
| `nundu-task/Dockerfile.dev` | Frontend desarrollo: next dev |

---

## Comandos Útiles

### Desarrollo

```bash
# Iniciar con hot reload
docker-compose -f docker-compose.dev.yml up --build

# Ver logs en tiempo real
docker-compose -f docker-compose.dev.yml logs -f

# Ver logs solo de un servicio
docker-compose -f docker-compose.dev.yml logs -f api
docker-compose -f docker-compose.dev.yml logs -f frontend

# Entrar a la terminal del contenedor
docker-compose -f docker-compose.dev.yml exec api sh
docker-compose -f docker-compose.dev.yml exec frontend sh

# Detener sin eliminar volúmenes
docker-compose -f docker-compose.dev.yml down

# Detener y eliminar volúmenes (resetea datos)
docker-compose -f docker-compose.dev.yml down -v

# Reconstruir imágenes
docker-compose -f docker-compose.dev.yml up --build --force-recreate
```

### Producción

```bash
# Iniciar producción
docker-compose up --build

# Ver logs
docker-compose logs -f

# Detener
docker-compose down

# Backup de datos
docker cp nundu-api:/app/data ./data-backup
```

---

## Solución de Problemas

### Los cambios no se reflejan
1. Verifica que estés usando `docker-compose.dev.yml`
2. Confirma que los volúmenes están montados: `docker-compose config`
3. Reinicia los contenedores: `docker-compose -f docker-compose.dev.yml restart`

### Puerto ya en uso
```bash
# Matar proceso en puerto 3000/3001
# En Windows (PowerShell):
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

### Volumen no sincroniza
- En Windows: asegúrate de tener WSL2 instalado
- En Docker Desktop: verifica que haya suficiente memoria
- Intenta: `docker-compose -f docker-compose.dev.yml down -v && docker-compose -f docker-compose.dev.yml up --build`

### Node modules corrupto
```bash
docker-compose -f docker-compose.dev.yml exec api rm -rf node_modules
docker-compose -f docker-compose.dev.yml exec api npm install
docker-compose -f docker-compose.dev.yml restart api
```

---

## Variables de Entorno

### Desarrollo
```
NODE_ENV=development
CHOKIDAR_USEPOLLING=true
CHOKIDAR_INTERVAL=1000
NEXT_PUBLIC_API_URL=http://api:3001
```

### Producción
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://api:3001
```

---

## Flujo de Trabajo Recomendado

### Para Desarrollar Localmente
```bash
# 1. Inicia con hot reload
docker-compose -f docker-compose.dev.yml up --build

# 2. Edita código normalmente en tu editor
# Los cambios se reflejan automáticamente

# 3. Ver logs si hay errores
docker-compose -f docker-compose.dev.yml logs -f

# 4. Cuando termines, detén los contenedores
docker-compose -f docker-compose.dev.yml down
```

### Para Preparar Producción
```bash
# 1. Prueba con docker-compose.yml
docker-compose up --build

# 2. Verifica que todo funcione correctamente
# Accede a http://localhost:3000

# 3. Si todo está bien, detén y commitea
docker-compose down

# 4. Deploy a servidor
```

---

## Notas Importantes

⚠️ **En Windows/WSL:**
- El watch polling es esencial para detectar cambios
- Puede ser más lento que en Linux nativo
- 1 segundo de intervalo es recomendado

⚠️ **Volúmenes:**
- Los archivos `node_modules` NO se sincronizan
- Los datos en `/app/data` sí persisten
- Para resetear: `docker-compose down -v`

✅ **Buenas Prácticas:**
- Usa `docker-compose.dev.yml` para desarrollo
- Usa `docker-compose.yml` para producción
- Siempre haz push antes de cambios importantes
- Mantén `.dockerignore` actualizado
