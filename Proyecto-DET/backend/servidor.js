import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './conexion.js';

const app = express();
app.use(cors());
app.use(express.json());

// Obtener todos los registros
app.get('/seguimiento_tecnico', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.execute('SELECT * FROM seguimiento_tecnico');
    await db.end();
    res.json(rows);
  } catch (error) {
    console.error(" Error en SELECT ALL:", error);
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
});

// Obtener un registro por ID
app.get('/seguimiento_tecnico/:Id_equipo', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.execute(
      'SELECT * FROM seguimiento_tecnico WHERE Id_equipo = ?',
      [req.params.Id_equipo]
    );
    await db.end();
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(" Error en SELECT por ID:", error);
    res.status(500).json({ error: 'Error al obtener registro' });
  }
});

// Crear registro
app.post('/seguimiento_tecnico', async (req, res) => {
  const { Numero_de_serie, Modelo_exacto, Generacion, Observaciones, Diagnostico, Estado, Fecha_diagnostico } = req.body;
  try {
    const db = await connectToDatabase();

    // Verificar si ya existe ese número de serie
    const [existente] = await db.execute(
      'SELECT Id_equipo FROM seguimiento_tecnico WHERE Numero_de_serie = ?',
      [Numero_de_serie]
    );

    if (existente.length > 0) {
      await db.end();
      return res.status(400).json({ error: "El número de serie ya está registrado" });
    }

    const [result] = await db.execute(
      'INSERT INTO seguimiento_tecnico (Numero_de_serie, Modelo_exacto, Generacion, Observaciones, Diagnostico, Estado, Fecha_diagnostico) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [Numero_de_serie, Modelo_exacto, Generacion, Observaciones, Diagnostico, Estado, Fecha_diagnostico]
    );
    await db.end();
    res.json({ Id_equipo: result.insertId });
  } catch (error) {
    console.error(" Error en INSERT:", error);
    res.status(500).json({ error: 'Error al crear el registro' });
  }
});

// Editar registro
app.put('/seguimiento_tecnico/:Id_equipo', async (req, res) => {
  try {
    let {
      Numero_de_serie = "",
      Modelo_exacto = "",
      Generacion = "",
      Observaciones = "",
      Diagnostico = "",
      Estado = "",
      Fecha_diagnostico = null
    } = req.body;

    if (!Fecha_diagnostico || Fecha_diagnostico.trim() === "") {
      Fecha_diagnostico = null;
    }

    const db = await connectToDatabase();
    await db.execute(
      `UPDATE seguimiento_tecnico 
       SET Numero_de_serie=?, Modelo_exacto=?, Generacion=?, Observaciones=?, Diagnostico=?, Estado=?, Fecha_diagnostico=? 
       WHERE Id_equipo=?`,
      [
        Numero_de_serie,
        Modelo_exacto,
        Generacion,
        Observaciones,
        Diagnostico,
        Estado,
        Fecha_diagnostico,
        req.params.Id_equipo
      ]
    );
    await db.end();
    res.json({ message: 'Registro actualizado' });
  } catch (error) {
    console.error(" Error en UPDATE:", error);
    res.status(500).json({ error: 'Error al actualizar el registro' });
  }
});

// Eliminar registro
app.delete('/seguimiento_tecnico/:Id_equipo', async (req, res) => {
  try {
    const db = await connectToDatabase();
    await db.execute(
      'DELETE FROM seguimiento_tecnico WHERE Id_equipo=?',
      [req.params.Id_equipo]
    );
    await db.end();
    res.json({ message: 'Registro eliminado' });
  } catch (error) {
    console.error(" Error en DELETE:", error);
    res.status(500).json({ error: 'Error al eliminar registro' });
  }
});

// Buscar registros
app.get('/seguimiento_tecnico/buscar/:q', async (req, res) => {
  const q = `%${req.params.q}%`;
  try {
    const db = await connectToDatabase();
    const [rows] = await db.execute(
      `SELECT * FROM seguimiento_tecnico WHERE 
        Numero_de_serie LIKE ? OR 
        Fecha_diagnostico LIKE ? OR 
        Generacion LIKE ?`,
      [q, q, q]
    );
    await db.end();
    res.json(rows);
  } catch (error) {
    console.error(" Error en búsqueda:", error);
    res.status(500).json({ error: 'Error en la búsqueda' });
  }
});

app.get('/', (req, res) => {
  res.send('API funcionando');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
});
