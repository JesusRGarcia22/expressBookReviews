// router/auth_users.js
const express = require('express');
const jwt = require('jsonwebtoken');

const regd_users = express.Router();

// Memoria simple de usuarios registrados (la usa /register y /login)
let users = [];

/**
 * Verifica si el username NO está vacío y es de tipo string
 * (la exportamos porque la usa general.js en /register)
 */
const isValid = (username) => {
  return typeof username === 'string' && username.trim().length > 0;
};

/**
 * Comprueba si existe un usuario registrado con ese username y password
 */
const authenticatedUser = (username, password) => {
  return users.some(u => u.username === username && u.password === password);
};

/**
 * =========  TAREA 7: LOGIN  =========
 * Endpoint: POST /customer/login
 * - Valida que vengan username y password
 * - Comprueba credenciales contra `users`
 * - Si es válido, genera un JWT y lo guarda en la sesión:
 *     req.session.authorization = { accessToken, username }
 * - Responde 200 en caso de éxito
 */
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!isValid(username) || !isValid(password)) {
    return res.status(400).json({ message: 'Username y password son requeridos.' });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Credenciales inválidas.' });
  }

  // Genera un token con validez de 1 hora (ajústalo si el lab pide 60s)
  const accessToken = jwt.sign({ username }, 'access', { expiresIn: 60 * 60 });

  // Guarda el token y el username en la sesión (express-session ya está montado en /customer)
  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: 'Login exitoso.' });
});

// Exportamos router + utilidades
module.exports.authenticated = regd_users;
module.exports.users = users;
module.exports.isValid = isValid;
