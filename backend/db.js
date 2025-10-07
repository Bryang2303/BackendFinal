const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error openning DB', err.message);
  } else {
    console.log('Database SQLite connected 🚀');
  }
});

// Crear tabla users si no existe
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  firstname TEXT,
  lastname TEXT,
  password TEXT,
  birthday TEXT
)
`);

module.exports = db;