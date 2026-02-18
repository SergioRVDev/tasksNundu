# API Methods Documentation

Archivo utility: `lib/apiMethods.ts`

## Descripción

Módulo que proporciona métodos genéricos para realizar peticiones HTTP (GET, POST, PUT, DELETE) a la API REST.

## Métodos

### `apiGet<T>(endpoint: string): Promise<ApiResponse<T>>`

Realiza una petición GET al endpoint especificado.

**Parámetros:**
- `endpoint` (string): Ruta del endpoint (ej: `/tasks`, `/developers/123`)

**Retorna:**
```typescript
{
  success: boolean;
  data?: T;
  error?: string;
}
```

**Ejemplo:**
```typescript
import { apiGet } from "@/lib/apiMethods";

const response = await apiGet<Task[]>("/tasks");
if (response.success) {
  console.log(response.data); // Array de tareas
} else {
  console.error(response.error);
}
```

---

### `apiPost<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>>`

Realiza una petición POST al endpoint especificado.

**Parámetros:**
- `endpoint` (string): Ruta del endpoint (ej: `/tasks`)
- `body` (unknown): Objeto a enviar en el body

**Retorna:**
```typescript
{
  success: boolean;
  data?: T;
  error?: string;
}
```

**Ejemplo:**
```typescript
import { apiPost } from "@/lib/apiMethods";

const newTask = {
  title: "Nueva tarea",
  description: "Descripción",
  assignedTo: "dev-id",
  sprint: "Sprint 1"
};

const response = await apiPost<Task>("/tasks", newTask);
if (response.success) {
  console.log("Tarea creada:", response.data);
}
```

---

### `apiPut<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>>`

Realiza una petición PUT al endpoint especificado.

**Parámetros:**
- `endpoint` (string): Ruta del endpoint (ej: `/tasks/123`)
- `body` (unknown): Objeto con los cambios

**Retorna:**
```typescript
{
  success: boolean;
  data?: T;
  error?: string;
}
```

**Ejemplo:**
```typescript
import { apiPut } from "@/lib/apiMethods";

const response = await apiPut<Task>("/tasks/123", {
  state: "in-progress"
});
if (response.success) {
  console.log("Tarea actualizada:", response.data);
}
```

---

### `apiDelete<T>(endpoint: string): Promise<ApiResponse<T>>`

Realiza una petición DELETE al endpoint especificado.

**Parámetros:**
- `endpoint` (string): Ruta del endpoint (ej: `/tasks/123`)

**Retorna:**
```typescript
{
  success: boolean;
  data?: T;
  error?: string;
}
```

**Ejemplo:**
```typescript
import { apiDelete } from "@/lib/apiMethods";

const response = await apiDelete("/tasks/123");
if (response.success) {
  console.log("Tarea eliminada");
}
```

---

## Configuración

La URL base de la API se obtiene de la variable de entorno:

```
NEXT_PUBLIC_API_URL
```

Si no está configurada, utiliza por defecto:
```
http://localhost:3001
```

### En .env.local:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### En Docker:
```env
NEXT_PUBLIC_API_URL=http://api:3001
```

---

## Ejemplo de Uso en Componentes

```typescript
import { apiGet, apiPost, apiDelete } from "@/lib/apiMethods";

export default function MyComponent() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener tareas
  const fetchTasks = async () => {
    setLoading(true);
    const response = await apiGet<Task[]>("/tasks");

    if (response.success) {
      setTasks(response.data || []);
      setError(null);
    } else {
      setError(response.error);
    }

    setLoading(false);
  };

  // Crear tarea
  const createTask = async (task: Task) => {
    const response = await apiPost<Task>("/tasks", task);

    if (response.success) {
      setTasks([...tasks, response.data!]);
    } else {
      setError(response.error);
    }
  };

  // Eliminar tarea
  const deleteTask = async (id: string) => {
    const response = await apiDelete(`/tasks/${id}`);

    if (response.success) {
      setTasks(tasks.filter(t => t.id !== id));
    } else {
      setError(response.error);
    }
  };

  return (
    // Tu componente aquí
  );
}
```

---

## Manejo de Errores

Cada método retorna un objeto con:
- `success`: boolean que indica si la operación fue exitosa
- `data`: Los datos retornados por la API (si éxito)
- `error`: Mensaje de error (si fallo)

Siempre verifica `response.success` antes de usar `response.data`:

```typescript
const response = await apiGet("/tasks");

if (response.success && response.data) {
  // Usar response.data
} else {
  // Manejar error
  console.error(response.error);
}
```
