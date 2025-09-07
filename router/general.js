// router/general.js
const express = require('express');
const public_users = express.Router();

// booksdb.js está en la MISMA carpeta que este archivo
const books = require('./booksdb.js');

// (se usará en tareas posteriores)
let isValid = require('./auth_users.js').isValid;
let users   = require('./auth_users.js').users;

/**
 * Tarea 1: listar TODOS los libros
 */
public_users.get('/', (req, res) => {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

/**
 * Tarea 2: detalles por ISBN
 * Ej: /isbn/1
 */
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found for given ISBN' });
  }
  return res.status(200).send(JSON.stringify(book, null, 4));
});

/**
 * Tarea 3: buscar libros por AUTOR (pueden ser varios)
 * Ej: /author/Chinua Achebe
 * Coincidencia case-insensitive.
 */
public_users.get('/author/:author', (req, res) => {
  const authorParam = (req.params.author || '').trim().toLowerCase();

  // Recorremos las claves (ISBNs) del objeto books
  const matches = Object.keys(books).reduce((acc, isbn) => {
    const b = books[isbn];
    if (b.author && b.author.toLowerCase() === authorParam) {
      // Incluimos el ISBN para referencia
      acc.push({ isbn, ...b });
    }
    return acc;
  }, []);

  if (matches.length === 0) {
    return res.status(404).json({ message: 'No books found for given author' });
  }
  return res.status(200).send(JSON.stringify(matches, null, 4));
});

// Placeholders para tareas siguientes
public_users.post('/register', (req, res) => {
  return res.status(300).json({ message: 'Yet to be implemented' });
});

public_users.get('/title/:title', (req, res) => {
  return res.status(300).json({ message: 'Yet to be implemented' });
});

public_users.get('/review/:isbn', (req, res) => {
  return res.status(300).json({ message: 'Yet to be implemented' });
});

module.exports.general = public_users;
