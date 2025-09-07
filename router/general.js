const express = require('express');
const public_users = express.Router();

// ✅ booksdb.js está en la MISMA carpeta que general.js
const books = require('./booksdb.js');

// (todavía no lo usas, pero se mantiene para tareas posteriores)
let isValid = require('./auth_users.js').isValid;
let users   = require('./auth_users.js').users;

// =============================
// Tarea 1: devolver TODOS los libros
// =============================
public_users.get('/', (req, res) => {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// =============================
// Registrar usuario (placeholder)
// =============================
public_users.post('/register', (req, res) => {
  return res.status(300).json({ message: 'Yet to be implemented' });
});

// =============================
// Tarea 2: Buscar libro por ISBN
// =============================
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "No se encontró un libro con ese ISBN." });
  }
});

// =============================
// Tarea 3: Buscar libro por autor
// =============================
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  let results = [];

  for (let isbn in books) {
    if (books[isbn].author && books[isbn].author.toLowerCase() === author) {
      results.push({ isbn, ...books[isbn] });
    }
  }

  if (results.length > 0) {
    return res.status(200).json(results);
  } else {
    return res.status(404).json({ message: "No se encontraron libros de ese autor." });
  }
});

// =============================
// Tarea 4: Buscar libro por título
// =============================
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  let results = [];

  for (let isbn in books) {
    if (books[isbn].title && books[isbn].title.toLowerCase() === title) {
      results.push({ isbn, ...books[isbn] });
    }
  }

  if (results.length > 0) {
    return res.status(200).json(results);
  } else {
    return res.status(404).json({ message: "No se encontró ningún libro con ese título." });
  }
});

// =============================
// Obtener reseñas por ISBN (placeholder)
// =============================
public_users.get('/review/:isbn', (req, res) => {
  return res.status(300).json({ message: 'Yet to be implemented' });
});

module.exports.general = public_users;
