const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./pets.db'); // Usamos una base de datos SQLite local

app.use(bodyParser.json()); // Para poder manejar los datos JSON

// Crear la tabla si no existe
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS pets (id INTEGER PRIMARY KEY, nom_masc TEXT, edad_masc INTEGER, adoptado BOOLEAN, especie_masc TEXT)");
});
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de mascotas!');
});

// Ruta para obtener todos los animales
app.get('/api/pets', (req, res) => {
    db.all("SELECT * FROM pets", (err, rows) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Ruta para agregar un nuevo animal
app.post('/api/pets', (req, res) => {
    const { name, age, vaccinated } = req.body;
    db.run("INSERT INTO pets (nombre_masc, edad_masc, adoptado, especie_masc) VALUES (?, ?, ?, ?)", [nombre_masc, edad_masc, adoptado, especie_masc], function (err) {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.status(201).send({ id: this.lastID });
        }
    });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('API corriendo en http://localhost:3000');
});