# Watch Polling Fix para Windows/WSL

## Problema
El hot reload no funciona en Windows/WSL con Docker - los cambios no se reflejan hasta que se hace rebuild manual.

## Causa
Windows/WSL tiene limitaciones con file watching nativo en volúmenes Docker. Necesita polling explícito.

## Solución Implementada

### 1. Docker Compose Dev (`.yml`)
```yaml
environment:
  - CHOKIDAR_USEPOLLING=true        # Habilita polling en lugar de watch
  - CHOKIDAR_INTERVAL=500            # Cada 500ms (más rápido)
  - CHOKIDAR_USEFSEVENTSPATH=false   # Desactiva eventos del FS
  - WATCHPACK_POLLING=true           # Polling para webpack
  - WATCHPACK_POLLING_INTERVAL=500   # Cada 500ms

volumes:
  - ./app:/app:cached                # :cached mejora performance
```

### 2. Stdin/TTY para Mejor Detección
```yaml
stdin_open: true
tty: true
```

Permite que Node.js detecte cambios más rápidamente.

## Cómo Usar

### Reiniciar Docker Compose Dev
```bash
# Detener y limpiar
docker-compose -f docker-compose.dev.yml down -v

# Iniciar nuevamente
docker-compose -f docker-compose.dev.yml up --build
```

### Ver Logs en Tiempo Real
```bash
# API
docker-compose -f docker-compose.dev.yml logs -f api

# Frontend
docker-compose -f docker-compose.dev.yml logs -f frontend
```

### Verificar que Funciona
1. Edita un archivo en `nundu-api/index.js` o `nundu-task/components/NewTaskModal.tsx`
2. Guarda el archivo
3. Espera 500-1000ms
4. Deberías ver en los logs que se detectó el cambio
5. El navegador debería recargar automáticamente (hot reload)

## Si Sigue Sin Funcionar

### Opción 1: Rebuild Forzado
```bash
docker-compose -f docker-compose.dev.yml up --build --force-recreate
```

### Opción 2: Limpiar Volúmenes
```bash
# Esto BORRARÁ los datos
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up --build
```

### Opción 3: Verificar Archivos Sincronizados
```bash
# Entrar al contenedor
docker-compose -f docker-compose.dev.yml exec api sh

# Ver contenido
ls -la /app/

# Ver si tu archivo cambió
stat /app/index.js
```

### Opción 4: Aumentar el Intervalo de Polling
Si los cambios son muy lentos, aumenta el intervalo:

En `docker-compose.dev.yml`:
```yaml
environment:
  - CHOKIDAR_INTERVAL=1000  # 1 segundo en lugar de 500ms
```

## Alternativa: Usar Servidor Local (Sin Docker)

Si Docker sigue sin funcionar bien, usa los servidores locales:

**Terminal 1 - API:**
```bash
cd nundu-api
npm install
npm start
```

**Terminal 2 - Frontend:**
```bash
cd nundu-task
npm install
npm run dev
```

Esto usa el file watching nativo de Next.js y Express que funciona mejor en Windows.

## Notas

- El polling consume más CPU que watching nativo
- Intervalo de 500ms es un buen balance entre responsividad y CPU
- El `:cached` flag en volúmenes mejora performance
- En WSL2, esto debería funcionar mejor que en WSL1

## Referencias

- [Chokidar Polling Options](https://github.com/paulmillr/chokidar#api)
- [Docker Volumes en Windows](https://docs.docker.com/desktop/windows/wsl/)
- [Next.js File Watching](https://nextjs.org/docs/basic-features/fast-refresh)
