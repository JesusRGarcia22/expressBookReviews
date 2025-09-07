// router/general.js
const express = require('express');
const public_users = express.Router();
const axios = require('axios');

// Base de libros (mismo directorio)
const books = require('./booksdb.js');

// Estos vienen de auth_users.js (el curso ya lo trae)
const { isValid, users } = require('./auth_users.js');

/**
 * ==============================
 * TAREA 1: todos los libros
 * ==============================
 */
public_users.get('/', (req, res) => {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

/**
 * ==============================
 * TAREA 6: registrar un nuevo usuario
 * Body esperado: { "username": "user", "password": "pass" }
 * ==============================
 */
public_users.post('/register', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const exists = users.some(u => u.username === username);
  if (exists) {
    return res.status(409).json({ message: 'User already exists!' });
  }

  users.push({ username, password });
  return res
    .status(201)
    .json({ message: 'User successfully registered. Now you can login' });
});

/**
 * ==============================
 * TAREA 2: por ISBN
 * ==============================
 */
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) return res.status(404).json({ message: 'Book not found' });
  return res.status(200).json(book);
});

/**
 * ==============================
 * TAREA 3: por autor
 * ==============================
 */
public_users.get('/author/:author', (req, res) => {
  const target = (req.params.author || '').toLowerCase();
  const result = Object.entries(books)
    .filter(([, b]) => (b.author || '').toLowerCase() === target)
    .map(([isbn, b]) => ({ isbn, ...b }));

  return res.status(200).json(result);
});

/**
 * ==============================
 * TAREA 4: por título
 * ==============================
 */
public_users.get('/title/:title', (req, res) => {
  const target = (req.params.title || '').toLowerCase();
  const result = Object.entries(books)
    .filter(([, b]) => (b.title || '').toLowerCase() === target)
    .map(([isbn, b]) => ({ isbn, ...b }));

  return res.status(200).json(result);
});

/**
 * ==============================
 * TAREA 5: reseñas por ISBN
 * ==============================
 */
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) return res.status(404).json({ message: 'Book not found' });

  const reviews = book.reviews || {};
  return res.status(200).json(reviews);
});

/**
 * ==============================
 * TAREA 10: lista de libros con async/await + Axios
 * ==============================
 */
public_users.get('/async/books', async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const { data } = await axios.get(`${baseUrl}/`);
    return res.status(200).json(data);
  } catch (err) {
    return res
      .status(err.response?.status || 500)
      .json({ message: 'Unexpected error' });
  }
});

/**
 * ==============================
 * TAREA 11: obtener libro por ISBN con async/await + Axios
 * ==============================
 */
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const url = `${baseUrl}/isbn/${encodeURIComponent(isbn)}`;
    const { data } = await axios.get(url);
    return res.status(200).json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.message ||
      (status === 404 ? 'Book not found' : 'Unexpected error');
    return res.status(status).json({ message });
  }
});

module.exports.general = public_users;
