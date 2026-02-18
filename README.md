# Nundu Task Management

API CRUD desacoplada + Frontend Next.js para gestión de tareas, developers y sprints usando JSON como almacenamiento.

## Estructura del Proyecto

```
nundu-task/                 # Frontend Next.js
├── components/
├── app/
├── public/
├── Dockerfile
└── package.json

nundu-api/                  # Backend Node.js/Express
├── data/                   # Almacenamiento JSON
│   ├── tasks.json
│   ├── developers.json
│   └── sprints.json
├── Dockerfile
├── index.js
└── package.json

docker-compose.yml          # Orquestación de servicios
```

## Instalación Local

### Requisitos
- Node.js 18+
- npm o yarn

### Setup del API

```bash
cd nundu-api
npm install
npm start
```

El API estará disponible en `http://localhost:3001`

### Setup del Frontend

```bash
cd nundu-task
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## Docker

### Build y ejecutar con Docker Compose

```bash
docker-compose up --build
```

- API: `http://localhost:3001`
- Frontend: `http://localhost:3000`

### Detener servicios

```bash
docker-compose down
```

## API Endpoints

### Tasks
- `GET /tasks` - Obtener todas las tareas
- `POST /tasks` - Crear nueva tarea
- `GET /tasks/:id` - Obtener tarea específica
- `PUT /tasks/:id` - Actualizar tarea
- `DELETE /tasks/:id` - Eliminar tarea

**Ejemplo POST:**
```json
{
  "title": "Nueva Tarea",
  "description": "Descripción",
  "assignedTo": "developer-id",
  "state": "to-do",
  "sprint": "Sprint 1"
}
```

### Developers
- `GET /developers` - Obtener todos los developers
- `POST /developers` - Crear nuevo developer
- `GET /developers/:id` - Obtener developer específico
- `PUT /developers/:id` - Actualizar developer
- `DELETE /developers/:id` - Eliminar developer

**Ejemplo POST:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "role": "Frontend Developer"
}
```

### Sprints
- `GET /sprints` - Obtener todos los sprints
- `POST /sprints` - Crear nuevo sprint
- `GET /sprints/:id` - Obtener sprint específico
- `PUT /sprints/:id` - Actualizar sprint
- `DELETE /sprints/:id` - Eliminar sprint

**Ejemplo POST:**
```json
{
  "name": "Sprint 1",
  "startDate": "2024-02-18",
  "endDate": "2024-03-03",
  "status": "planning"
}
```

## Almacenamiento de Datos

Los datos se almacenan en archivos JSON en la carpeta `nundu-api/data/`:
- `tasks.json` - Tareas
- `developers.json` - Developers
- `sprints.json` - Sprints

En Docker, el volumen `./nundu-api/data:/app/data` persiste los datos entre reinicios.

## Desarrollo

Para desarrollo local con hot-reload en el API:

```bash
cd nundu-api
npm install
npm run dev
```

Para el frontend:

```bash
cd nundu-task
npm install
npm run dev
```
