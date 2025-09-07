const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js'); // ✅ corregido: está en la misma carpeta

const regd_users = express.Router();

let users = [];

// =============================
// Funciones auxiliares
// =============================

// Verificar si un username ya existe
const isValid = (username) => {
  return users.some((user) => user.username === username);
};

// Autenticar usuario
const authenticatedUser = (username, password) => {
  return users.some((user) => user.username === username && user.password === password);
};

// =============================
// Rutas
// =============================

// Task 7: Login de usuario registrado
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Faltan credenciales' });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ username: username }, 'access', { expiresIn: '1h' });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: 'Login exitoso.' });
  } else {
    return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
  }
});

// Task 8: Agregar o modificar reseña de un libro
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: 'Usuario no autenticado' });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Libro no encontrado' });
  }

  if (!review) {
    return res.status(400).json({ message: 'Debe enviar una reseña' });
  }

  // Si no existe reseñas, inicializamos
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Agregar o modificar reseña del usuario
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: 'Reseña agregada/modificada con éxito',
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
