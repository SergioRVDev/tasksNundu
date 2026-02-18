# Input Sanitizer Documentation

Módulo para validación y sanitización de entrada de usuarios, previniendo ataques XSS, inyección SQL y otras vulnerabilidades.

## Funciones

### `escapeHtml(str: string): string`

Escapa caracteres HTML especiales para prevenir XSS.

**Ejemplo:**
```typescript
import { escapeHtml } from "@/lib/sanitizer";

escapeHtml("<script>alert('XSS')</script>");
// Retorna: "&lt;script&gt;alert(&#x27;XSS&#x27;)&lt;&#x2F;script&gt;"
```

---

### `sanitizeString(input: unknown, maxLength?: number): string | null`

Valida y sanitiza un string de entrada.

**Parámetros:**
- `input` - Valor a sanitizar
- `maxLength` - Longitud máxima permitida (default: 500)

**Retorna:**
- `string` - String sanitizado
- `null` - Si es inválido

**Ejemplo:**
```typescript
import { sanitizeString } from "@/lib/sanitizer";

const title = sanitizeString(userInput, 100);

if (title) {
  console.log("Título válido:", title);
} else {
  console.log("Título inválido");
}
```

---

### `isValidEmail(email: string): boolean`

Valida un email.

**Ejemplo:**
```typescript
import { isValidEmail } from "@/lib/sanitizer";

isValidEmail("user@example.com"); // true
isValidEmail("invalid@.com"); // false
```

---

### `isValidUrl(url: string): boolean`

Valida una URL.

**Ejemplo:**
```typescript
import { isValidUrl } from "@/lib/sanitizer";

isValidUrl("https://example.com"); // true
isValidUrl("not a url"); // false
```

---

### `sanitizeObject(obj, schema): { success, data, errors }`

Sanitiza un objeto completo (típicamente desde un formulario) según un esquema.

**Parámetros:**
- `obj` - Objeto a sanitizar
- `schema` - Esquema de validación

**Retorna:**
```typescript
{
  success: boolean;
  data?: Record<string, string>; // Si éxito
  errors?: Record<string, string>; // Si hay errores
}
```

**Ejemplo:**
```typescript
import { sanitizeObject } from "@/lib/sanitizer";

const result = sanitizeObject(formData, {
  title: { type: 'string', maxLength: 100 },
  email: { type: 'email' },
  website: { type: 'url' }
});

if (result.success) {
  console.log("Datos sanitizados:", result.data);
} else {
  console.log("Errores de validación:", result.errors);
}
```

---

### `isValidNumber(value: unknown, min?, max?): boolean`

Valida un número con límites opcionales.

**Ejemplo:**
```typescript
import { isValidNumber } from "@/lib/sanitizer";

isValidNumber(5, 1, 10); // true
isValidNumber(15, 1, 10); // false
isValidNumber("5"); // false
```

---

### `isValidDate(dateString: string): boolean`

Valida una fecha ISO 8601.

**Ejemplo:**
```typescript
import { isValidDate } from "@/lib/sanitizer";

isValidDate("2024-02-18"); // true
isValidDate("invalid-date"); // false
```

---

### `sanitizeFilename(filename: string): string`

Sanitiza un nombre de archivo (previene path traversal).

**Ejemplo:**
```typescript
import { sanitizeFilename } from "@/lib/sanitizer";

sanitizeFilename("../../../etc/passwd"); // Returns: "etcpasswd"
sanitizeFilename("my-file.txt"); // Returns: "my-file.txt"
```

---

### `isValidUUID(uuid: string): boolean`

Valida un UUID v4.

**Ejemplo:**
```typescript
import { isValidUUID } from "@/lib/sanitizer";

isValidUUID("550e8400-e29b-41d4-a716-446655440000"); // true
isValidUUID("not-a-uuid"); // false
```

---

### `escapeSqlString(str: string): string`

⚠️ **DEPRECADO** - No uses esto para SQL real. Siempre usa prepared statements.

---

## Caso de Uso: Formulario de Nueva Tarea

Aplicar sanitización en `NewTaskModal.tsx`:

```typescript
import { sanitizeObject, sanitizeString } from "@/lib/sanitizer";

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validar y sanitizar entrada
  const validationResult = sanitizeObject(
    {
      title,
      description,
      priority,
    },
    {
      title: { type: 'string', maxLength: 200 },
      description: { type: 'string', maxLength: 1000 },
      priority: { type: 'string', maxLength: 20 },
    }
  );

  if (!validationResult.success) {
    setError(Object.values(validationResult.errors!).join(', '));
    return;
  }

  const sanitizedData = validationResult.data!;

  const newTask = {
    title: sanitizedData.title,
    description: sanitizedData.description,
    priority: sanitizedData.priority || "Medium",
    assignedTo: assignedTo || "unassigned",
    sprint,
    state: "to-do",
    startDate: startDate || null,
    endDate: endDate || null,
  };

  const response = await apiPost<unknown>("/tasks", newTask);
  // ...
};
```

---

## Mejores Prácticas

### 1. **Siempre validar en el frontend Y backend**
```typescript
// Frontend
const sanitized = sanitizeString(userInput);

// Backend (API)
export async function getTasks(req: express.Request, res: express.Response) {
  // Validar también en el backend!
  const id = sanitizeString(req.query.id as string);
  // ...
}
```

### 2. **Usar sanitizeObject para formularios completos**
```typescript
const result = sanitizeObject(formData, schema);
if (result.success) {
  // Usar result.data
} else {
  // Mostrar result.errors al usuario
}
```

### 3. **Escapar HTML en outputs**
```typescript
// Si muestras contenido del usuario:
<div>{escapeHtml(userContent)}</div>
```

### 4. **Validar tipos correctos**
```typescript
// ❌ Incorrecto
const email = sanitizeString(userEmail);

// ✅ Correcto
if (isValidEmail(userEmail)) {
  // Es válido
}
```

### 5. **Para SQL, usar prepared statements (Node.js)**
```typescript
// ❌ NUNCA hacer esto
const query = `SELECT * FROM users WHERE id = '${escapeSqlString(id)}'`;

// ✅ Usar parameterized queries
const query = 'SELECT * FROM users WHERE id = ?';
db.execute(query, [id]);
```

---

## Ataques Prevenidos

### XSS (Cross-Site Scripting)
```typescript
// Entrada maliciosa
const userInput = "<img src=x onerror='alert(1)'>";

// Sanitizado
escapeHtml(userInput);
// Resultado: "&lt;img src=x onerror=&#x27;alert(1)&#x27;&gt;"
```

### Path Traversal
```typescript
const filename = "../../../etc/passwd";
sanitizeFilename(filename);
// Resultado: "etcpasswd"
```

### Inyección SQL
```typescript
// Usar siempre prepared statements
const query = 'INSERT INTO users (email) VALUES (?)';
db.execute(query, [email]);
```

### Validación de Tipo
```typescript
// Asegurar que recibimos el tipo esperado
if (!isValidEmail(input)) {
  throw new Error('Email inválido');
}
```

---

## Checklist de Seguridad

- [ ] Validar entrada en el formulario (frontend)
- [ ] Sanitizar en el componente antes de enviar
- [ ] Validar nuevamente en el backend (API)
- [ ] Escapar HTML en outputs
- [ ] Usar types/interfaces para datos
- [ ] Validar longitudes máximas
- [ ] Usar HTTPS en producción
- [ ] Implementar CSRF tokens (si necesario)
- [ ] Validar autorización en backend
