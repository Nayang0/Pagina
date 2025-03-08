const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');

async function processModFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');

  for (const line of lines) {
    const [name, hash, type] = line.split('|');
    
    const modData = {
      name: name.trim(),
      creator: 'NombreDelCreador', // Esto debería venir de alguna configuración
      description: `Mod ${name.trim()}`,
      fileHash: hash.trim(),
      fileType: type.trim(),
      downloadLink: `https://tu-storage-url.com/${hash.trim()}.${type.trim()}`
    };

    try {
      await axios.post('http://localhost:5000/api/mods', modData);
      console.log(`✅ Mod ${name} procesado correctamente`);
    } catch (error) {
      console.error(`❌ Error al procesar ${name}:`, error.message);
    }
  }
}

// Uso:
processModFile('./mods.txt');