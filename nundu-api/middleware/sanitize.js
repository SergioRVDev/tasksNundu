const fs = require('fs');

/**
 * Escapa caracteres HTML especiales
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';

  const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return str.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char]);
}

/**
 * Sanitiza un string
 */
function sanitizeString(input, maxLength = 500) {
  if (typeof input !== 'string') {
    return null;
  }

  const sanitized = input.trim();

  if (sanitized.length === 0 || sanitized.length > maxLength) {
    return null;
  }

  return escapeHtml(sanitized);
}

/**
 * Valida email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Valida fecha ISO 8601
 */
function isValidDate(dateString) {
  if (typeof dateString !== 'string') {
    return false;
  }

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Sanitiza objeto de entrada
 */
function sanitizeObject(obj, schema) {
  const sanitized = {};
  const errors = {};

  for (const [key, fieldConfig] of Object.entries(schema)) {
    const value = obj[key];
    const maxLength = fieldConfig.maxLength || 500;
    const isRequired = fieldConfig.required !== false; // default is required
    const isEmpty = value === null || value === undefined || value === '';

    // Si el campo está vacío y no es requerido, permitir null
    if (isEmpty && !isRequired) {
      sanitized[key] = null;
      continue;
    }

    if (fieldConfig.type === 'string') {
      const result = sanitizeString(value, maxLength);
      if (result === null) {
        if (isRequired) {
          errors[key] = `${key} must be a valid string (max ${maxLength} characters)`;
        } else {
          sanitized[key] = null;
        }
      } else {
        sanitized[key] = result;
      }
    } else if (fieldConfig.type === 'email') {
      if (typeof value !== 'string' || !isValidEmail(value)) {
        if (isRequired) {
          errors[key] = `${key} must be a valid email`;
        } else {
          sanitized[key] = null;
        }
      } else {
        sanitized[key] = value.toLowerCase();
      }
    } else if (fieldConfig.type === 'date') {
      if (isEmpty) {
        sanitized[key] = null;
      } else if (!isValidDate(value)) {
        if (isRequired) {
          errors[key] = `${key} must be a valid date (ISO 8601)`;
        } else {
          sanitized[key] = null;
        }
      } else {
        sanitized[key] = value;
      }
    }
  }

  return {
    success: Object.keys(errors).length === 0,
    data: Object.keys(errors).length === 0 ? sanitized : undefined,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
}

/**
 * Middleware para sanitizar y validar request body
 */
function sanitizeTaskInput(req, res, next) {
  if (!req.body) {
    return next();
  }

  const schema = {
    title: { type: 'string', maxLength: 200, required: true },
    description: { type: 'string', maxLength: 1000, required: false },
    priority: { type: 'string', maxLength: 20, required: false },
    assignedTo: { type: 'string', maxLength: 100, required: false },
    sprint: { type: 'string', maxLength: 100, required: false },
    state: { type: 'string', maxLength: 50, required: false },
    startDate: { type: 'date', required: false },
    endDate: { type: 'date', required: false },
  };

  const result = sanitizeObject(req.body, schema);

  if (!result.success) {
    return res.status(400).json({ error: 'Invalid input', details: result.errors });
  }

  // Reemplazar body con datos sanitizados
  req.body = result.data;
  next();
}

/**
 * Middleware para sanitizar entrada de developers
 */
function sanitizeDeveloperInput(req, res, next) {
  if (!req.body) {
    return next();
  }

  const schema = {
    name: { type: 'string', maxLength: 100, required: true },
    email: { type: 'email', required: true },
    role: { type: 'string', maxLength: 100, required: false },
  };

  const result = sanitizeObject(req.body, schema);

  if (!result.success) {
    return res.status(400).json({ error: 'Invalid input', details: result.errors });
  }

  req.body = result.data;
  next();
}

/**
 * Middleware para sanitizar entrada de sprints
 */
function sanitizeSprintInput(req, res, next) {
  if (!req.body) {
    return next();
  }

  const schema = {
    name: { type: 'string', maxLength: 100, required: true },
    startDate: { type: 'date', required: false },
    endDate: { type: 'date', required: false },
    status: { type: 'string', maxLength: 50, required: false },
  };

  const result = sanitizeObject(req.body, schema);

  if (!result.success) {
    return res.status(400).json({ error: 'Invalid input', details: result.errors });
  }

  req.body = result.data;
  next();
}

module.exports = {
  escapeHtml,
  sanitizeString,
  isValidEmail,
  isValidDate,
  sanitizeObject,
  sanitizeTaskInput,
  sanitizeDeveloperInput,
  sanitizeSprintInput,
};
