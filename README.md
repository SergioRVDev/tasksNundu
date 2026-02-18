# Sistema de Gestión de Tareas

Aplicación completa para gestionar tareas con vistas Kanban y de tabla, permitiendo organizar el trabajo en sprints y asignar desarrolladores.

## Descripción General

El proyecto incluye:

- **API**: Servidor backend con operaciones CRUD para tareas, desarrolladores y sprints
- **Frontend**: Interfaz web moderna con dos vistas de visualización
- **Tests**: Suite completa de pruebas unitarias (72 tests, 100% pasando)
- **Seguridad**: Validación y sanitización de entrada
- **Docker**: Soporte completo con recarga automática de cambios

## Estructura del Proyecto

```
tasksNundu/
├── nundu-api/              # Backend API
│   ├── index.js            # Endpoints y lógica del servidor
│   ├── middleware/         # Validación de entrada
│   ├── data/               # Almacenamiento JSON
│   ├── __tests__/          # Tests (27 tests)
│   └── Dockerfile.dev
│
├── nundu-task/             # Frontend
│   ├── app/                # Páginas principales
│   ├── components/         # Componentes
│   ├── lib/                # Funciones auxiliares
│   ├── __tests__/          # Tests (45 tests)
│   └── Dockerfile.dev
│
├── docker-compose.dev.yml  # Desarrollo
└── docker-compose.yml      # Producción
```

## Inicio Rápido

### ⚠️ Configuración Requerida

Antes de iniciar, crea el archivo `.env.local` en `nundu-task/`:

```bash
# nundu-task/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Este paso es obligatorio** o la aplicación no podrá conectar con la API.

### Con Docker (Recomendado)

```bash
# Iniciar API y Frontend
docker-compose -f docker-compose.dev.yml up --build

# Acceso:
# Frontend: http://localhost:3000
# API: http://localhost:3001
```

### Sin Docker

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
# Requiere .env.local configurado
```

## Características Principales

### Gestión de Tareas
- Crear, editar y eliminar tareas
- Asignar a desarrolladores
- Organizar en sprints
- Prioridades: Baja, Media, Alta
- Estados: Por hacer, En progreso, Por validar, Hecho
- Fechas de inicio y cierre

### Vistas de Visualización
- **Kanban**: Columnas arrastrables por estado
- **Tabla**: Listado completo de tareas

### Gestión de Equipo
- Crear y administrar desarrolladores
- Información de contacto (nombre, email, rol)
- Asignar tareas a desarrolladores

### Sprints
- Crear y gestionar sprints
- Seguimiento de estado
- Agrupar tareas por sprint

## Tests

### Ejecutar Tests

```bash
# Frontend (45 tests)
cd nundu-task
npm test

# API (27 tests)
cd nundu-api
npm test

# Modo continuo
npm run test:watch
```

### Cobertura de Tests

**Frontend**: 45/45 tests (100%)
- Componentes (UI, interacciones)
- Validación de entrada

**API**: 27/27 tests (100%)
- CRUD de tareas, desarrolladores, sprints
- Manejo de errores

## Endpoints de la API

### Tareas
```
GET    /tasks           # Obtener todas las tareas
POST   /tasks           # Crear tarea
PUT    /tasks/:id       # Actualizar tarea
DELETE /tasks/:id       # Eliminar tarea
```

### Desarrolladores
```
GET    /developers      # Obtener desarrolladores
POST   /developers      # Crear desarrollador
PUT    /developers/:id  # Actualizar
DELETE /developers/:id  # Eliminar
```

### Sprints
```
GET    /sprints         # Obtener sprints
POST   /sprints         # Crear sprint
PUT    /sprints/:id     # Actualizar
DELETE /sprints/:id     # Eliminar
```

## Decisiones de Diseño

### Almacenamiento en JSON
- Sin dependencias de bases de datos
- Fácil de inspeccionar y modificar
- Datos en formato legible
- Rápido para desarrollo

### Validación de Entrada
- Validación en cliente: retroalimentación inmediata al usuario
- Validación en servidor: seguridad contra ataques
- Prevención de inyección de código
- Sanitización de entrada

### Arquitectura Modular
- Componentes reutilizables
- Funciones genéricas de API
- Fácil de extender
- Separación de responsabilidades

### Docker para Desarrollo
- Recarga automática de código
- Sincronización de archivos en tiempo real
- Soporte para Windows/WSL
- Reinicio automático en errores

## Flujo de Desarrollo

1. Iniciar Docker: `docker-compose -f docker-compose.dev.yml up --build`
2. Editar archivos en el IDE
3. Los cambios se detectan automáticamente
4. Frontend y API se recargan automáticamente
5. Ejecutar tests: `npm test`

## Solución de Problemas

### Frontend No Conecta con API (ERR_NAME_NOT_RESOLVED)

**Problema**: `net::ERR_NAME_NOT_RESOLVED http://api:3001`

**Solución**: Asegúrate de tener el archivo `.env.local` en `nundu-task/`:

```bash
# nundu-task/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Luego reinicia los contenedores:

```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up --build
```

### Recarga Automática No Funciona

```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up --build
```

### Puerto en Uso

```bash
# Windows: Terminar proceso
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Tests Fallando

```bash
# Limpiar caché
npm test -- --clearCache

# Test específico
npm test -- NombreComponente
```

## Documentación Detallada

- [Backend API](./nundu-api/README.md)
- [Frontend](./nundu-task/README.md)

## Características de Seguridad

- Validación de tipos de datos
- Límites de longitud en campos
- Escape de caracteres HTML
- Validación de email y URLs
- Validación de fechas
- Sanitización en servidor y cliente

## Notas de Performance

- Intervalo de polling: 500ms
- Caché de volúmenes Docker habilitado
- Componentes optimizados
- Respuestas API validadas

## Licencia

Proyecto educativo y de demostración.
