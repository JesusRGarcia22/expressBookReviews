const express = require('express');
const public_users = express.Router();

// ✅ Como booksdb.js está en la MISMA carpeta que general.js
const books = require('./booksdb.js');

// (todavía no lo usas, pero se mantiene para cuando toque)
let isValid = require('./auth_users.js').isValid;
let users   = require('./auth_users.js').users;

// =============================
// Tarea 1: devolver TODOS los libros
// =============================
public_users.get('/', (req, res) => {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// =============================
// Tarea 2: buscar libro por ISBN
// =============================
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;    // extraer el ISBN de la URL
  const book = books[isbn];       // buscar en el objeto books

  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }

  return res.status(200).send(JSON.stringify(book, null, 4));
});

// =============================
// Placeholders para tareas siguientes
// =============================

// Registrar usuario (a implementar después)
public_users.post('/register', (req, res) => {
  return res.status(300).json({ message: 'Yet to be implemented' });
});

// Buscar libro por autor
public_users.get('/author/:author', (req, res) => {
  return res.status(300).json({ message: 'Yet to be implemented' });
});

// Buscar libro por título
public_users.get('/title/:title', (req, res) => {
  return res.status(300).json({ message: 'Yet to be implemented' });
});

// Obtener reseñas por ISBN
public_users.get('/review/:isbn', (req, res) => {
  return res.status(300).json({ message: 'Yet to be implemented' });
});

module.exports.general = public_users;
