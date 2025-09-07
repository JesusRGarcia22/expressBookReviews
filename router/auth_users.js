const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js'); // está en la MISMA carpeta

const regd_users = express.Router();

let users = [];

// =============================
// Helpers
// =============================
const isValid = (username) => users.some(u => u.username === username);

const authenticatedUser = (username, password) =>
  users.some(u => u.username === username && u.password === password);

// =============================
// Rutas
// =============================

// Tarea 7: Login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: 'Faltan credenciales' });

  if (!authenticatedUser(username, password))
    return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });

  const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });
  req.session.authorization = { accessToken, username };
  return res.status(200).json({ message: 'Login exitoso.' });
});

// Tarea 8: Agregar o modificar reseña
regd_users.put('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!username) return res.status(403).json({ message: 'Usuario no autenticado' });
  if (!books[isbn]) return res.status(404).json({ message: 'Libro no encontrado' });
  if (!review) return res.status(400).json({ message: 'Debe enviar una reseña' });

  if (!books[isbn].reviews) books[isbn].reviews = {};
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: 'Reseña agregada/modificada con éxito',
    reviews: books[isbn].reviews
  });
});

// Tarea 9: Eliminar reseña propia
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const username = req.session.authorization?.username;

  if (!username) return res.status(403).json({ message: 'Usuario no autenticado' });
  if (!books[isbn]) return res.status(404).json({ message: 'Libro no encontrado' });

  const reviews = books[isbn].reviews || {};

  if (!reviews[username]) {
    return res.status(404).json({ message: 'No existe reseña del usuario para este libro' });
  }

  delete reviews[username];
  books[isbn].reviews = reviews;

  return res.status(200).json({
    message: 'Reseña eliminada con éxito',
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
