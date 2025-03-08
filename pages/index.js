import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';

export default function Home({ mods }) {
  const [selectedCreator, setSelectedCreator] = useState('');
  const [creatorMods, setCreatorMods] = useState([]);

  // Agrupar mods por creador
  const modsByCreator = mods.reduce((acc, mod) => {
    if (!acc[mod.creator]) {
      acc[mod.creator] = [];
    }
    acc[mod.creator].push(mod);
    return acc;
  }, {});

  // Cargar mods cuando se selecciona un creador
  useEffect(() => {
    if (selectedCreator) {
      setCreatorMods(modsByCreator[selectedCreator] || []);
    }
  }, [selectedCreator]);

  const handleDownload = async (mod) => {
    try {
      // Verificar si es un mod con pak y sig
      if (mod.pak_url && mod.sig_url) {
        // Descargar .pak
        const pakResponse = await fetch(mod.pak_url);
        const pakBlob = await pakResponse.blob();
        const pakUrl = window.URL.createObjectURL(pakBlob);
        const pakA = document.createElement('a');
        pakA.href = pakUrl;
        pakA.download = `${mod.name}.pak`;
        document.body.appendChild(pakA);
        pakA.click();
        document.body.removeChild(pakA);

        // Descargar .sig
        const sigResponse = await fetch(mod.sig_url);
        const sigBlob = await sigResponse.blob();
        const sigUrl = window.URL.createObjectURL(sigBlob);
        const sigA = document.createElement('a');
        sigA.href = sigUrl;
        sigA.download = `${mod.name}.sig`;
        document.body.appendChild(sigA);
        sigA.click();
        document.body.removeChild(sigA);
      } else {
        // Descargar mod normal
        const response = await fetch(mod.downloadLink);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${mod.name}.${mod.fileType}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error al descargar:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Base de Datos de Mods</h1>
      
      <select 
        value={selectedCreator} 
        onChange={(e) => setSelectedCreator(e.target.value)}
        className={styles.creatorSelect}
      >
        <option value="">Selecciona un creador</option>
        {Object.keys(modsByCreator).map(creator => (
          <option key={creator} value={creator}>
            {creator}
          </option>
        ))}
      </select>

      {selectedCreator && (
        <div className={styles.modsList}>
          <h2>Mods de {selectedCreator}</h2>
          {creatorMods.map((mod) => (
            <div key={mod._id || mod.name} className={styles.modCard}>
              <h3>{mod.name}</h3>
              <p>{mod.description}</p>
              <p>Tipo: {mod.fileType || 'PAK+SIG'}</p>
              <button 
                onClick={() => handleDownload(mod)}
                className={styles.downloadButton}
              >
                Descargar e Instalar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const res = await axios.get('https://pagina-mu-pearl.vercel.app/api/mods');
    return {
      props: { mods: res.data },
    };
  } catch (error) {
    console.error(error);
    return {
      props: { mods: [] },
    };
  }
}
