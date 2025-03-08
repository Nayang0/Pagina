const axios = require('axios');
const Mod = require('../models/modModel');

async function syncModsFromGitHub(owner, repo) {
  try {
    // Obtener contenido de mods.txt
    const response = await axios.get(
      `https://raw.githubusercontent.com/${owner}/${repo}/main/mods.txt`
    );

    const modsData = response.data.split('\n').filter(line => line.trim());

    for (const line of modsData) {
      const [downloadLink, fileHash] = line.split('|');
      if (downloadLink && fileHash) {
        // Determinar el tipo de archivo
        const fileType = downloadLink.toLowerCase().split('.').pop();
        // Extraer nombre del archivo
        const name = downloadLink.split('/').pop().split('.')[0];

        // Verificar si el mod ya existe
        const existingMod = await Mod.findOne({ fileHash: fileHash.trim() });
        if (!existingMod) {
          await Mod.create({
            name,
            creator: owner,
            fileHash: fileHash.trim(),
            downloadLink: downloadLink.trim(),
            fileType
          });
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error sincronizando mods:', error);
    return false;
  }
}

module.exports = { syncModsFromGitHub };