const express = require('express');
const Database = require('better-sqlite3'); // Reemplazamos sqlite3 con better-sqlite3
const bodyParser = require('body-parser');

const app = express();
const db = new Database('./pets.db', { verbose: console.log }); // Usamos better-sqlite3 para crear la conexión a la base de datos

app.use(bodyParser.json()); // Para poder manejar los datos JSON

// Crear la tabla si no existe
db.prepare(`
    CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY,
        nom_masc TEXT,
        edad_masc INTEGER,
        adoptado BOOLEAN,
        especie_masc TEXT
    )
`).run(); // La creación de la tabla ahora es síncrona

app.get('/', (req, res) => {
    res.send('Bienvenido a la API de mascotas!');
});

// Ruta para obtener todos los animales
app.get('/api/pets', (req, res) => {
    try {
        const rows = db.prepare("SELECT * FROM pets").all(); // Método síncrono para obtener todos los registros
        res.json(rows);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Ruta para agregar un nuevo animal
app.post('/api/pets', (req, res) => {
    const { nom_masc, edad_masc, adoptado, especie_masc } = req.body;
    
    try {
        const stmt = db.prepare("INSERT INTO pets (nom_masc, edad_masc, adoptado, especie_masc) VALUES (?, ?, ?, ?)");
        const result = stmt.run(nom_masc, edad_masc, adoptado, especie_masc); // Método síncrono para insertar un nuevo registro
        res.status(201).send({ id: result.lastInsertRowid });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('API corriendo en http://localhost:3000');
});
