const express = require('express');
const public_users = express.Router();

// Base de datos local de libros (mismo directorio)
const books = require('./booksdb.js');

// (se usarán más adelante)
let isValid = require('./auth_users.js').isValid;
let users   = require('./auth_users.js').users;

/**
 * Tarea 1: Listar todos los libros
 * GET /
 */
public_users.get('/', (req, res) => {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

/**
 * Tarea 2: Libro por ISBN
 * GET /isbn/:isbn
 */
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `No existe libro con ISBN ${isbn}` });
  }
  return res.status(200).json({
    author: book.author,
    title : book.title,
    reviews: book.reviews
  });
});

/**
 * Tarea 3: Libros por autor
 * GET /author/:author
 */
public_users.get('/author/:author', (req, res) => {
  const authorQ = req.params.author.trim().toLowerCase();
  const result = Object.entries(books)
    .filter(([_, b]) => (b.author || '').toLowerCase() === authorQ)
    .map(([isbn, b]) => ({ isbn, author: b.author, title: b.title, reviews: b.reviews }));
  return res.status(200).json(result);
});

/**
 * Tarea 4: Libros por título
 * GET /title/:title
 */
public_users.get('/title/:title', (req, res) => {
  const titleQ = req.params.title.trim().toLowerCase();
  const result = Object.entries(books)
    .filter(([_, b]) => (b.title || '').toLowerCase() === titleQ)
    .map(([isbn, b]) => ({ isbn, author: b.author, title: b.title, reviews: b.reviews }));
  return res.status(200).json(result);
});

/**
 * Tarea 5: Reseñas por ISBN
 * GET /review/:isbn
 * Devuelve directamente el objeto de reseñas del libro.
 */
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `No existe libro con ISBN ${isbn}` });
  }
  // Si no hay reseñas, devolvemos un objeto vacío ({}), que es lo que espera el lab.
  return res.status(200).json(book.reviews || {});
});

/* Placeholder (se implementará después) */
public_users.post('/register', (req, res) => {
  return res.status(300).json({ message: 'Yet to be implemented' });
});

module.exports.general = public_users;
