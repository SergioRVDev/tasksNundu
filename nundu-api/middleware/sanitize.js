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

    if (fieldConfig.type === 'string') {
      const result = sanitizeString(value, maxLength);
      if (result === null) {
        errors[key] = `${key} must be a valid string (max ${maxLength} characters)`;
      } else {
        sanitized[key] = result;
      }
    } else if (fieldConfig.type === 'email') {
      if (typeof value !== 'string' || !isValidEmail(value)) {
        errors[key] = `${key} must be a valid email`;
      } else {
        sanitized[key] = value.toLowerCase();
      }
    } else if (fieldConfig.type === 'date') {
      if (value !== null && value !== undefined && value !== '') {
        if (!isValidDate(value)) {
          errors[key] = `${key} must be a valid date (ISO 8601)`;
        } else {
          sanitized[key] = value;
        }
      } else {
        sanitized[key] = null;
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
    title: { type: 'string', maxLength: 200 },
    description: { type: 'string', maxLength: 1000 },
    priority: { type: 'string', maxLength: 20 },
    assignedTo: { type: 'string', maxLength: 100 },
    sprint: { type: 'string', maxLength: 100 },
    state: { type: 'string', maxLength: 50 },
    startDate: { type: 'date' },
    endDate: { type: 'date' },
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
    name: { type: 'string', maxLength: 100 },
    email: { type: 'email' },
    role: { type: 'string', maxLength: 100 },
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
    name: { type: 'string', maxLength: 100 },
    startDate: { type: 'date' },
    endDate: { type: 'date' },
    status: { type: 'string', maxLength: 50 },
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
