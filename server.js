require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Mod = require('./models/modModel'); // Importar el modelo Mod

const app = express();
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.log("❌ Error al conectar MongoDB:", err));

// Ruta base
app.get('/', (req, res) => {
    res.send("API de Mods funcionando 🚀");
});

// Obtener todos los mods
app.get('/api/mods', async (req, res) => {
    try {
        const mods = await Mod.find();
        res.json(mods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Agregar un nuevo mod
app.post('/api/mods', async (req, res) => {
    const { name, creator, description, downloadLink } = req.body;

    const mod = new Mod({
        name,
        creator,
        description,
        downloadLink
    });

    try {
        await mod.save();
        res.status(201).json(mod);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
