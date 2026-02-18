# API - Backend

Servidor backend que proporciona operaciones CRUD para tareas, desarrolladores y sprints.

## Descripción

API REST que gestiona:
- Tareas (crear, leer, actualizar, eliminar)
- Desarrolladores (crear, leer, actualizar, eliminar)
- Sprints (crear, leer, actualizar, eliminar)

Características:
- Validación y sanitización de entrada
- Almacenamiento en archivos JSON
- 27 tests unitarios (100% pasando)
- Docker con recarga automática
- CORS habilitado

## Inicio Rápido

### Con Docker

```bash
docker-compose -f docker-compose.dev.yml up --build
# API disponible en: http://localhost:3001
```

### Sin Docker

```bash
npm install
npm start
# Servidor en http://localhost:3001
```

## Estructura

```
nundu-api/
├── index.js              # Endpoints y lógica
├── middleware/
│   └── sanitize.js      # Validación de entrada
├── data/
│   ├── tasks.json       # Tareas
│   ├── developers.json  # Desarrolladores
│   └── sprints.json     # Sprints
├── __tests__/
│   ├── tasks.test.js
│   ├── developers.test.js
│   └── sprints.test.js
└── jest.config.js
```

## Endpoints de la API

### Tareas
```
GET    /tasks           # Obtener todas las tareas
POST   /tasks           # Crear tarea
PUT    /tasks/:id       # Actualizar tarea
DELETE /tasks/:id       # Eliminar tarea
```

**Crear Tarea:**
```json
POST /tasks
{
  "title": "Título de la tarea",
  "description": "Descripción",
  "priority": "High",
  "assignedTo": "dev-id",
  "sprint": "Sprint 1",
  "state": "to-do",
  "startDate": "2026-02-18",
  "endDate": "2026-02-25"
}
```

### Desarrolladores
```
GET    /developers      # Obtener desarrolladores
POST   /developers      # Crear desarrollador
PUT    /developers/:id  # Actualizar
DELETE /developers/:id  # Eliminar
```

**Crear Desarrollador:**
```json
POST /developers
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "role": "Frontend Developer"
}
```

### Sprints
```
GET    /sprints         # Obtener sprints
POST   /sprints         # Crear sprint
PUT    /sprints/:id     # Actualizar
DELETE /sprints/:id     # Eliminar
```

**Crear Sprint:**
```json
POST /sprints
{
  "name": "Sprint 1",
  "startDate": "2026-02-18",
  "endDate": "2026-03-04",
  "status": "active"
}
```

## Tests

### Ejecutar Tests

```bash
npm test              # Ejecutar una vez
npm run test:watch    # Modo observación
```

### Cobertura

**27 tests (100% pasando):**
- 9 tests de tareas
- 9 tests de desarrolladores
- 9 tests de sprints

## Validación de Entrada

### Reglas
- **Strings**: Máximo 500 caracteres
- **Email**: Formato RFC válido
- **Fechas**: Formato ISO 8601 (YYYY-MM-DD)

### Sanitización
- Escape de caracteres HTML
- Validación de tipos
- Límites de longitud
- Trimming de espacios

### Ejemplo de Error
```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": ""}'

# Respuesta: 400 Bad Request
# {"error": "title is required"}
```

## Almacenamiento de Datos

Datos en archivos JSON en `data/`:

**Ejemplo de Tarea:**
```json
{
  "id": "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
  "title": "Implementar login",
  "description": "Agregar autenticación",
  "priority": "High",
  "assignedTo": "dev-id",
  "sprint": "Sprint 1",
  "state": "in-progress",
  "startDate": "2026-02-18",
  "endDate": "2026-02-25",
  "createdAt": "2026-02-18T10:30:00.000Z",
  "updatedAt": "2026-02-19T15:45:00.000Z"
}
```

## Respuestas de Error

**400 Bad Request** - Entrada inválida
```json
{
  "error": "Validación fallida",
  "errors": {
    "campo": "Mensaje de error"
  }
}
```

**404 Not Found** - Recurso no encontrado
```json
{
  "error": "Tarea no encontrada"
}
```

**500 Internal Server Error** - Error del servidor
```json
{
  "error": "Error al crear tarea"
}
```

## Decisiones de Diseño

### Por qué Almacenamiento JSON
- Sin necesidad de configurar base de datos
- Fácil de inspeccionar datos
- Perfecto para demostración
- Datos legibles

### Validación de Entrada
- Validación en servidor para seguridad
- Prevención de ataques de inyección
- Sanitización en todos los endpoints

### Flujo de Datos
1. Recibe solicitud HTTP
2. Middleware valida y sanitiza
3. Endpoint procesa datos
4. Lee/escribe en JSON
5. Envía respuesta

## Performance

- Almacenamiento JSON adecuado para demos
- Sin overhead de base de datos
- JSON parsing mínimo
- Ideal para entrevistas técnicas

## Notas de Producción

Para producción, considerar:
- Reemplazar JSON con base de datos
- Agregar autenticación
- Rate limiting
- Logging de requests
- HTTPS

## Desarrollo

1. Editar `index.js` para nuevos endpoints
2. Agregar tests en `__tests__/`
3. Ejecutar `npm test`
4. Iniciar: `npm start`

## Ejemplos de Uso

**Crear Tarea:**
```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tarea nueva",
    "description": "Descripción",
    "priority": "High",
    "state": "to-do"
  }'
```

**Obtener Tareas:**
```bash
curl http://localhost:3001/tasks
```

**Actualizar Tarea:**
```bash
curl -X PUT http://localhost:3001/tasks/id \
  -H "Content-Type: application/json" \
  -d '{"state": "in-progress"}'
```

**Eliminar Tarea:**
```bash
curl -X DELETE http://localhost:3001/tasks/id
```

## Solución de Problemas

### Puerto en Uso
```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Archivos de Datos No Encontrados
```bash
mkdir data
```

### Tests Fallando
```bash
npm test -- --clearCache
npm test -- tasks.test.js
```

## Dependencias

- express - Framework web
- cors - Solicitudes entre orígenes
- uuid - Generación de IDs
- jest - Testing (dev)
- supertest - Assertions HTTP (dev)

## Licencia

Proyecto educativo.
