# Frontend - Interfaz de Usuario

Aplicación web moderna para la gestión de tareas con vistas Kanban y tabla.

## Descripción

Interfaz de usuario que proporciona:
- Vista Kanban con columnas arrastrables
- Vista de tabla para listados
- Operaciones CRUD para tareas
- Gestión de desarrolladores y sprints
- Validación de entrada
- 45 tests unitarios (100% pasando)
- Docker con recarga automática

## Inicio Rápido

### Con Docker

```bash
docker-compose -f docker-compose.dev.yml up --build
# Frontend disponible en: http://localhost:3000
# API disponible en: http://localhost:3001
```

### Sin Docker

```bash
npm install
npm run dev
# Requiere API ejecutándose en http://localhost:3001
```

## Estructura

```
nundu-task/
├── app/
│   ├── page.tsx        # Página principal
│   └── layout.tsx      # Layout raíz
├── components/
│   ├── FiltersSection.tsx    # Filtros y botones
│   ├── KanbanSection.tsx     # Vista Kanban
│   ├── TableSection.tsx      # Vista tabla
│   ├── NewTaskModal.tsx      # Crear tarea
│   ├── EditTaskModal.tsx     # Editar tarea
│   ├── NewDeveloperModal.tsx # Crear developer
│   └── NewSprintModal.tsx    # Crear sprint
├── lib/
│   ├── apiMethods.ts   # Métodos API
│   └── sanitizer.ts    # Validación
├── __tests__/
│   ├── components/
│   └── lib/
└── jest.config.js
```

## Características

### Vista Kanban
- Columnas arrastrables (Por hacer, En progreso, Por validar, Hecho)
- Edición rápida con modal
- Eliminar tareas
- Mostrar desarrollador asignado
- Indicador de prioridad

### Vista Tabla
- Listado completo de tareas
- Botones de editar/eliminar
- Formato compacto
- Soporte de filtros

### Gestión de Tareas
- Crear tareas
- Editar tareas
- Eliminar tareas
- Asignar desarrolladores
- Organizar en sprints
- Establecer prioridad
- Seguimiento de estado
- Fechas de inicio y cierre

### Gestión de Equipo
- Crear desarrolladores
- Información (nombre, email, rol)
- Asignar a tareas

### Sprints
- Crear sprints
- Tracking de estado
- Agrupar tareas

## Tests

### Ejecutar Tests

```bash
npm test              # Una vez
npm run test:watch    # Modo observación
```

### Cobertura

**45 tests (100% pasando):**

**Componentes (24 tests):**
- FiltersSection (8)
  - Toggle de vista
  - Apertura de modales
  - Estados de botones

- NewTaskModal (8)
  - Renderizado
  - Carga de datos
  - Envío de formulario
  - Manejo de errores

- EditTaskModal (8)
  - Población de datos
  - Actualizaciones
  - Eliminación
  - Cancelación

**Utilidades (20 tests):**
- Sanitizador (20)
  - Escape HTML
  - Validación strings
  - Validación email
  - Validación fechas
  - Validación objetos

## Integración con API

### Configuración

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Métodos de API

```typescript
// Funciones genéricas
apiGet<T>(endpoint)
apiPost<T>(endpoint, data)
apiPut<T>(endpoint, data)
apiDelete(endpoint)

// Retornan: { success: boolean, data?: T, error?: string }
```

### Ejemplo de Uso

```typescript
// Obtener tareas
const response = await apiGet<Task[]>('/tasks');
if (response.success) {
  setTasks(response.data);
}

// Crear tarea
await apiPost('/tasks', taskData);

// Actualizar
await apiPut(`/tasks/${id}`, data);

// Eliminar
await apiDelete(`/tasks/${id}`);
```

## Validación y Seguridad

### Características
- Prevención de XSS mediante escape HTML
- Validación de tipos
- Límites de longitud
- Validación de email
- Validación de fechas
- Validación de URLs

### Campos Sanitizados
- Título tarea: máximo 200 caracteres
- Descripción: máximo 1000 caracteres
- Nombre: máximo 100 caracteres
- Email: formato RFC

### Validación por Capas
1. **Cliente**: Feedback inmediato
2. **Servidor**: Seguridad

## Arquitectura de Componentes

### Página Principal (page.tsx)
- Carga tareas
- Gestiona estado de filtros
- Cambia entre vistas
- Proporciona función de actualización

### FiltersSection
- Toggle de vista
- Botones de acción
- Gestión de modales
- Estados de botones

### KanbanSection
- 4 columnas de tareas
- Drag and drop
- Resolución de nombres
- Acciones editar/eliminar
- Actualización de estado

### TableSection
- Listado en tabla
- Resolución de nombres
- Botones acción
- Layout responsivo

### Modales
- NewTaskModal: Crear tareas
- EditTaskModal: Editar/eliminar
- NewDeveloperModal: Crear developers
- NewSprintModal: Crear sprints

## Decisiones de Diseño

### Componentes Reutilizables
- Modales genéricos para CRUD
- Funciones de API genéricas
- Separación de responsabilidades
- Fácil de extender

### Validación en Capas
- Cliente: Experiencia del usuario
- Servidor: Seguridad
- Defensa en profundidad

### Integración con API
- Funciones genéricas
- Type-safe con TypeScript
- Manejo consistente de errores
- Fácil de extender

## Flujo de Desarrollo

1. Crear componente
2. Agregar tests
3. Ejecutar `npm test`
4. Probar en navegador
5. Commit cuando todo funciona

## Soporte de Navegadores

- Chrome/Edge (últimas versiones)
- Firefox (últimas versiones)
- Safari (últimas versiones)
- Navegadores móviles

## Dependencias

**Runtime:**
- next - Framework
- react - UI
- lucide-react - Iconos
- tailwindcss - Estilos

**Development:**
- jest - Testing
- @testing-library/react - Tests React
- @testing-library/user-event - Interacciones
- typescript - Tipado

## Solución de Problemas

### No Conecta con API
1. Verificar API en http://localhost:3001
2. Verificar .env.local con URL correcta
3. Verificar CORS habilitado en API

### Recarga Automática No Funciona
```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up --build
```

### Tests Fallando
```bash
npm test -- --clearCache
npm test -- NombreComponente
npm run test:watch
```

### Puerto en Uso
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Build para Producción

```bash
npm run build
npm start
```

## Variables de Entorno

```bash
# Requerido
NEXT_PUBLIC_API_URL=http://localhost:3001

# Opcional
NODE_ENV=development
```

## Mejoras Futuras

- Búsqueda avanzada
- Historial de cambios
- Comentarios en tareas
- Adjuntos de archivos
- Actualizaciones en tiempo real
- Autenticación de usuario
- Plantillas de tareas
- Notificaciones por email

## Licencia

Proyecto educativo.
