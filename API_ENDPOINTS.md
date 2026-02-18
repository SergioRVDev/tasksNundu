# API Endpoints Reference

Base URL: `http://localhost:3001`

---

## Tasks

### GET /tasks
Obtiene todas las tareas.

**Response:**
```json
[
  {
    "id": "uuid-string",
    "title": "Implementar login",
    "description": "Crear sistema de autenticación",
    "priority": "High",
    "assignedTo": "dev-id",
    "sprint": "Sprint 1",
    "state": "in-progress",
    "startDate": "2024-02-18",
    "endDate": "2024-03-03",
    "createdAt": "2024-02-18T10:30:00.000Z",
    "updatedAt": "2024-02-19T14:20:00.000Z"
  }
]
```

---

### GET /tasks/:id
Obtiene una tarea específica.

**Parameters:**
- `id` (string): ID de la tarea

**Response:**
```json
{
  "id": "uuid-string",
  "title": "Implementar login",
  "description": "Crear sistema de autenticación",
  "priority": "High",
  "assignedTo": "dev-id",
  "sprint": "Sprint 1",
  "state": "in-progress",
  "startDate": "2024-02-18",
  "endDate": "2024-03-03",
  "createdAt": "2024-02-18T10:30:00.000Z"
}
```

---

### POST /tasks
Crea una nueva tarea.

**Request Body:**
```json
{
  "title": "Nueva tarea",
  "description": "Descripción",
  "priority": "Medium",
  "assignedTo": "dev-id",
  "sprint": "Sprint 1",
  "state": "to-do",
  "startDate": "2024-02-18",
  "endDate": "2024-03-03"
}
```

**Response:** (201 Created)
```json
{
  "id": "uuid-string",
  "title": "Nueva tarea",
  "description": "Descripción",
  "priority": "Medium",
  "assignedTo": "dev-id",
  "sprint": "Sprint 1",
  "state": "to-do",
  "startDate": "2024-02-18",
  "endDate": "2024-03-03",
  "createdAt": "2024-02-18T10:30:00.000Z"
}
```

---

### PUT /tasks/:id
Actualiza una tarea.

**Parameters:**
- `id` (string): ID de la tarea

**Request Body:** (solo los campos a actualizar)
```json
{
  "state": "in-progress",
  "priority": "High"
}
```

**Response:**
```json
{
  "id": "uuid-string",
  "title": "Nueva tarea",
  "description": "Descripción",
  "priority": "High",
  "assignedTo": "dev-id",
  "sprint": "Sprint 1",
  "state": "in-progress",
  "startDate": "2024-02-18",
  "endDate": "2024-03-03",
  "updatedAt": "2024-02-19T14:20:00.000Z"
}
```

---

### DELETE /tasks/:id
Elimina una tarea.

**Parameters:**
- `id` (string): ID de la tarea

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

---

## Developers

### GET /developers
Obtiene todos los developers.

**Response:**
```json
[
  {
    "id": "uuid-string",
    "name": "Juan Ramos",
    "email": "juan@example.com",
    "role": "Full Stack Developer",
    "createdAt": "2024-02-18T10:30:00.000Z"
  }
]
```

---

### GET /developers/:id
Obtiene un developer específico.

**Parameters:**
- `id` (string): ID del developer

**Response:**
```json
{
  "id": "uuid-string",
  "name": "Juan Ramos",
  "email": "juan@example.com",
  "role": "Full Stack Developer",
  "createdAt": "2024-02-18T10:30:00.000Z"
}
```

---

### POST /developers
Crea un nuevo developer.

**Request Body:**
```json
{
  "name": "Juan Ramos",
  "email": "juan@example.com",
  "role": "Full Stack Developer"
}
```

**Response:** (201 Created)
```json
{
  "id": "uuid-string",
  "name": "Juan Ramos",
  "email": "juan@example.com",
  "role": "Full Stack Developer",
  "createdAt": "2024-02-18T10:30:00.000Z"
}
```

---

### PUT /developers/:id
Actualiza un developer.

**Parameters:**
- `id` (string): ID del developer

**Request Body:**
```json
{
  "role": "Senior Full Stack Developer"
}
```

**Response:**
```json
{
  "id": "uuid-string",
  "name": "Juan Ramos",
  "email": "juan@example.com",
  "role": "Senior Full Stack Developer",
  "updatedAt": "2024-02-19T14:20:00.000Z"
}
```

---

### DELETE /developers/:id
Elimina un developer.

**Parameters:**
- `id` (string): ID del developer

**Response:**
```json
{
  "message": "Developer deleted successfully"
}
```

---

## Sprints

### GET /sprints
Obtiene todos los sprints.

**Response:**
```json
[
  {
    "id": "uuid-string",
    "name": "Sprint 1",
    "startDate": "2024-02-18",
    "endDate": "2024-03-03",
    "status": "active",
    "createdAt": "2024-02-18T10:30:00.000Z"
  }
]
```

---

### GET /sprints/:id
Obtiene un sprint específico.

**Parameters:**
- `id` (string): ID del sprint

**Response:**
```json
{
  "id": "uuid-string",
  "name": "Sprint 1",
  "startDate": "2024-02-18",
  "endDate": "2024-03-03",
  "status": "active",
  "createdAt": "2024-02-18T10:30:00.000Z"
}
```

---

### POST /sprints
Crea un nuevo sprint.

**Request Body:**
```json
{
  "name": "Sprint 1",
  "startDate": "2024-02-18",
  "endDate": "2024-03-03",
  "status": "planning"
}
```

**Response:** (201 Created)
```json
{
  "id": "uuid-string",
  "name": "Sprint 1",
  "startDate": "2024-02-18",
  "endDate": "2024-03-03",
  "status": "planning",
  "createdAt": "2024-02-18T10:30:00.000Z"
}
```

---

### PUT /sprints/:id
Actualiza un sprint.

**Parameters:**
- `id` (string): ID del sprint

**Request Body:**
```json
{
  "status": "active"
}
```

**Response:**
```json
{
  "id": "uuid-string",
  "name": "Sprint 1",
  "startDate": "2024-02-18",
  "endDate": "2024-03-03",
  "status": "active",
  "updatedAt": "2024-02-19T14:20:00.000Z"
}
```

---

### DELETE /sprints/:id
Elimina un sprint.

**Parameters:**
- `id` (string): ID del sprint

**Response:**
```json
{
  "message": "Sprint deleted successfully"
}
```

---

## Uso desde el Frontend

Ver `nundu-task/lib/API.md` para documentación de los métodos genéricos.

**Ejemplo básico:**

```typescript
import { apiPost, apiGet, apiDelete, apiPut } from "@/lib/apiMethods";

// Obtener todas las tareas
const response = await apiGet<Task[]>("/tasks");

// Crear tarea
const newTask = await apiPost<Task>("/tasks", {
  title: "Mi tarea",
  sprint: "Sprint 1"
});

// Actualizar tarea
const updated = await apiPut<Task>("/tasks/123", {
  state: "in-progress"
});

// Eliminar tarea
const deleted = await apiDelete("/tasks/123");
```
