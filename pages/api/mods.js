export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Aquí puedes agregar lógica para obtener mods de MongoDB
      const mods = [
        {
          name: "TheIsle-Zzz_Yutty",
          creator: "Yutty",
          description: "Mod oficial para servidores modificados",
          pak_url: "https://drive.google.com/uc?export=download&id=1o4p0B4NFdRUReQh5Z4wYPx457SJne_oE",
          sig_url: "https://drive.google.com/uc?export=download&id=1wbeqgcmNn7gIR8BCRiBbz62rV1Typjbq",
          fileHash: "123456789"
        }
        // Los mods sincronizados se agregarán aquí automáticamente
      ];
      res.status(200).json(mods);
    } catch (error) {
      res.status(500).json({ error: 'Error obteniendo mods' });
    }
  }
}