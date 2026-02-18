# Backend Sanitizer Middleware

Módulo Node.js para validación y sanitización de entrada en los endpoints de la API REST.

## Características

- ✅ Escapa caracteres HTML especiales
- ✅ Valida longitudes máximas
- ✅ Valida emails
- ✅ Valida fechas ISO 8601
- ✅ Previene ataques XSS
- ✅ Middleware reutilizable para Express

## Funciones Disponibles

### `escapeHtml(str: string): string`

Escapa caracteres HTML especiales.

```javascript
const { escapeHtml } = require('./middleware/sanitize');

const unsafe = "<script>alert('XSS')</script>";
const safe = escapeHtml(unsafe);
// safe = "&lt;script&gt;alert(&#x27;XSS&#x27;)&lt;&#x2F;script&gt;"
```

### `sanitizeString(input: unknown, maxLength?: number): string | null`

Valida y sanitiza un string.

```javascript
const { sanitizeString } = require('./middleware/sanitize');

const result = sanitizeString("  Hello World  ", 100);
// result = "Hello World" (trimmed and escaped)

const invalid = sanitizeString("x".repeat(501));
// invalid = null (exceeds maxLength)
```

### `isValidEmail(email: string): boolean`

Valida email usando regex.

```javascript
const { isValidEmail } = require('./middleware/sanitize');

isValidEmail("user@example.com"); // true
isValidEmail("invalid@"); // false
```

### `isValidDate(dateString: string): boolean`

Valida fechas ISO 8601.

```javascript
const { isValidDate } = require('./middleware/sanitize');

isValidDate("2024-02-18"); // true
isValidDate("invalid"); // false
```

### `sanitizeObject(obj: object, schema: object): { success, data?, errors? }`

Valida y sanitiza un objeto completo según un esquema.

**Esquema:**
```javascript
{
  fieldName: { type: 'string'|'email'|'date', maxLength?: number }
}
```

**Ejemplo:**
```javascript
const { sanitizeObject } = require('./middleware/sanitize');

const schema = {
  title: { type: 'string', maxLength: 200 },
  email: { type: 'email' },
  startDate: { type: 'date' }
};

const result = sanitizeObject(req.body, schema);

if (result.success) {
  console.log("Datos válidos:", result.data);
} else {
  console.log("Errores:", result.errors);
}
```

## Middlewares Express

### `sanitizeTaskInput`

Middleware para validar entrada de tareas.

```javascript
const { sanitizeTaskInput } = require('./middleware/sanitize');

app.post('/tasks', sanitizeTaskInput, (req, res) => {
  // req.body ya está sanitizado
});
```

**Campos validados:**
- `title`: string (max 200)
- `description`: string (max 1000)
- `priority`: string (max 20)
- `assignedTo`: string (max 100)
- `sprint`: string (max 100)
- `state`: string (max 50)
- `startDate`: date (ISO 8601)
- `endDate`: date (ISO 8601)

### `sanitizeDeveloperInput`

Middleware para validar entrada de developers.

```javascript
const { sanitizeDeveloperInput } = require('./middleware/sanitize');

app.post('/developers', sanitizeDeveloperInput, (req, res) => {
  // req.body ya está sanitizado
});
```

**Campos validados:**
- `name`: string (max 100)
- `email`: email válido
- `role`: string (max 100)

### `sanitizeSprintInput`

Middleware para validar entrada de sprints.

```javascript
const { sanitizeSprintInput } = require('./middleware/sanitize');

app.post('/sprints', sanitizeSprintInput, (req, res) => {
  // req.body ya está sanitizado
});
```

**Campos validados:**
- `name`: string (max 100)
- `startDate`: date (ISO 8601)
- `endDate`: date (ISO 8601)
- `status`: string (max 50)

## Uso en API

```javascript
const express = require('express');
const { sanitizeTaskInput, sanitizeDeveloperInput, sanitizeSprintInput } = require('./middleware/sanitize');

const app = express();
app.use(express.json());

// Usar middleware en rutas
app.post('/tasks', sanitizeTaskInput, async (req, res) => {
  // req.body está sanitizado y validado
  const { title, description, priority } = req.body;
  // ...
});

app.post('/developers', sanitizeDeveloperInput, async (req, res) => {
  const { name, email, role } = req.body;
  // ...
});

app.post('/sprints', sanitizeSprintInput, async (req, res) => {
  const { name, startDate, endDate, status } = req.body;
  // ...
});

// Rutas PUT también usan los mismos middlewares
app.put('/tasks/:id', sanitizeTaskInput, async (req, res) => {
  // ...
});
```

## Respuesta en Caso de Error

Si la validación falla, el middleware retorna error 400:

```json
{
  "error": "Invalid input",
  "details": {
    "title": "title must be a valid string (max 200 characters)",
    "email": "email must be a valid email"
  }
}
```

## Ataques Prevenidos

### 1. XSS (Cross-Site Scripting)
```javascript
// Entrada maliciosa
const input = "<img src=x onerror='alert(1)'>";

// Sanitizada
const safe = escapeHtml(input);
// "&lt;img src=x onerror=&#x27;alert(1)&#x27;&gt;"
```

### 2. Inyección de HTML
```javascript
// Entrada
const title = "<script>location.href='//evil.com'</script>";

// Sanitizada
escapeHtml(title);
// "&lt;script&gt;location.href=&#x27;&#x2F;&#x2F;evil.com&#x27;&lt;&#x2F;script&gt;"
```

### 3. Validación de Tipo
```javascript
// Rechaza valores no válidos
sanitizeString(12345); // null
sanitizeString({}); // null
sanitizeString(null); // null
```

### 4. Validación de Email
```javascript
isValidEmail("user@<script>alert(1)</script>.com"); // false
```

### 5. Límites de Longitud
```javascript
sanitizeString("x".repeat(1001)); // null (exceeds default max 500)
```

## Checklist de Seguridad Backend

- [ ] Usar middleware en todos los endpoints POST/PUT
- [ ] Revisar esquema de validación para cada recurso
- [ ] Validar longitudes máximas apropiadas
- [ ] Registrar intentos de inyección (logging)
- [ ] Usar tipos/interfaces TypeScript si es posible
- [ ] Validar en frontend Y backend
- [ ] Usar HTTPS en producción
- [ ] Implementar rate limiting
- [ ] Usar tokens de autenticación en endpoints sensibles
