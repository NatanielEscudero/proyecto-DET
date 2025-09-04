import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './conexion.js';

const app = express();
app.use(cors());
app.use(express.json());

// Obtener todos los registro
app.get('/usuarios', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.execute('SELECT * FROM seguimiento_tecnico');
    await db.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Obtener un usuario por ID
app.get('/usuarios/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.execute('SELECT * FROM seguimiento_tecnico WHERE id = ?', [req.params.id]);
    await db.end();
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Crear usuario
app.post('/usuarios', async (req, res) => {
  const { Nombre, Apellido, Direccion, Dni, Teléfono, "Fecha de nacimiento": FechaNacimiento, Email } = req.body;
  try {
    const db = await connectToDatabase();
    const [result] = await db.execute(
      'INSERT INTO seguimiento_tecnico (Nombre, Apellido, Direccion, Dni, Teléfono, `Fecha de nacimiento`, Email) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [Nombre, Apellido, Direccion, Dni, Teléfono, FechaNacimiento, Email]
    );
    await db.end();
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Editar usuario
app.put('/usuarios/:id', async (req, res) => {
  const { Nombre, Apellido, Direccion, Dni, Teléfono, "Fecha de nacimiento": FechaNacimiento, Email } = req.body;
  try {
    const db = await connectToDatabase();
    await db.execute(
      'UPDATE seguimiento_tecnico SET Nombre=?, Apellido=?, Direccion=?, Dni=?, Teléfono=?, `Fecha de nacimiento`=?, Email=? WHERE id=?',
      [Nombre, Apellido, Direccion, Dni, Teléfono, FechaNacimiento, Email, req.params.id]
    );
    await db.end();
    res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});



// Eliminar usuario
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    await db.execute('DELETE FROM seguimiento_tecnico WHERE id=?', [req.params.id]);
    await db.end();
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// Buscar usuarios por nombre, apellido o email
app.get('/usuarios/buscar/:q', async (req, res) => {
  const q = `%${req.params.q}%`;
  try {
    const db = await connectToDatabase();
    const [rows] = await db.execute(
      `SELECT * FROM seguimiento_tecnico WHERE 
        Nombre LIKE ? OR 
        Apellido LIKE ? OR 
        Email LIKE ?`,
      [q, q, q]
    );
    await db.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en la búsqueda' });
  }
});

app.get('/', (req, res) => {
  res.send('API de usuarios funcionando');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
});