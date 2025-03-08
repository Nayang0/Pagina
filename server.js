require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Mod = require('./models/modModel'); // Importar el modelo Mod
const { syncWithGitHub, syncModsFromGitHub } = require('./utils/githubSync');

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

// Agregar un nuevo mod desde GitHub
app.post('/api/mods/github', async (req, res) => {
  const { fileUrl, fileHash } = req.body;
  
  // Extraer información del archivo
  const fileType = fileUrl.split('.').pop();
  const name = fileUrl.split('/').pop().split('.')[0];
  
  const mod = new Mod({
    name,
    creator: req.body.creator || 'Unknown',
    fileHash,
    fileType,
    downloadLink: fileUrl
  });

  try {
    await mod.save();
    res.status(201).json(mod);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener mods por creador
app.get('/api/mods/creator/:creator', async (req, res) => {
  try {
    const mods = await Mod.find({ creator: req.params.creator });
    res.json(mods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint para sincronizar mods desde GitHub
app.post('/api/sync/github', async (req, res) => {
  const { owner, repo } = req.body;
  
  if (!owner || !repo) {
    return res.status(400).json({ 
      message: 'Se requieren owner y repo' 
    });
  }

  try {
    await syncModsFromGitHub(owner, repo);
    res.json({ message: 'Sincronización completada' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error en la sincronización',
      error: error.message 
    });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
