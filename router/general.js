// router/general.js
const express = require('express');
const public_users = express.Router();

// Base de libros (mismo directorio)
const books = require('./booksdb.js');

// Estos vienen de auth_users.js (el curso ya lo trae)
const { isValid, users } = require('./auth_users.js');

/**
 * TAREA 1: todos los libros
 */
public_users.get('/', (req, res) => {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

/**
 * TAREA 6: registrar un nuevo usuario
 * Body esperado: { "username": "user", "password": "pass" }
 */
public_users.post('/register', (req, res) => {
  const { username, password } = req.body || {};

  // Validaciones básicas
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Si tu curso define isValid como “usuario no existe”, úsalo; si no, verificamos aquí
  const exists = users.some(u => u.username === username);
  if (exists) {
    return res.status(409).json({ message: 'User already exists!' });
  }

  // Registrar
  users.push({ username, password });
  return res
    .status(201)
    .json({ message: 'User successfully registered. Now you can login' });
});

/**
 * TAREA 2: por ISBN
 */
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) return res.status(404).json({ message: 'Book not found' });
  return res.status(200).json(book);
});

/**
 * TAREA 3: por autor
 */
public_users.get('/author/:author', (req, res) => {
  const target = (req.params.author || '').toLowerCase();
  const result = Object.entries(books)
    .filter(([, b]) => (b.author || '').toLowerCase() === target)
    .map(([isbn, b]) => ({ isbn, ...b }));

  return res.status(200).json(result);
});

/**
 * TAREA 4: por título
 */
public_users.get('/title/:title', (req, res) => {
  const target = (req.params.title || '').toLowerCase();
  const result = Object.entries(books)
    .filter(([, b]) => (b.title || '').toLowerCase() === target)
    .map(([isbn, b]) => ({ isbn, ...b }));

  return res.status(200).json(result);
});

/**
 * TAREA 5: reseñas por ISBN
 */
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) return res.status(404).json({ message: 'Book not found' });

  // Aseguramos objeto
  const reviews = book.reviews || {};
  return res.status(200).json(reviews);
});

module.exports.general = public_users;
