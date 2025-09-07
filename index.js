const express = require('express');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes     = require('./router/general.js').general;

const app = express();
app.use(express.json());

// sesión (la usaremos más adelante)
app.use('/customer', session({
  secret: 'fingerprint_customer',
  resave: true,
  saveUninitialized: true
}));

// middleware de auth (se implementará después)
app.use('/customer/auth/*', (req, res, next) => next());

// 🔹 RUTAS PÚBLICAS (Tarea 1 vive aquí)
app.use('/', genl_routes);

// Rutas de cliente (para tareas futuras)
app.use('/customer', customer_routes);

// IMPORTANTE: 0.0.0.0 para que el proxy del lab lo vea
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server is running on ${PORT}`));
