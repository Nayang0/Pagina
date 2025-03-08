import axios from 'axios';
import { useRouter } from 'next/router';

export default function ModDetails({ mod }) {
  const router = useRouter();
  
  if (!mod) {
    return <div>Mod no encontrado</div>;
  }

  return (
    <div>
      <h1>{mod.name}</h1>
      <p>{mod.description}</p>
      <a href={mod.downloadLink} target="_blank" rel="noopener noreferrer">
        Descargar Mod
      </a>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const res = await axios.get(`http://localhost:5000/api/mods/${params.id}`);
    const mod = res.data;
    return {
      props: { mod },
    };
  } catch (error) {
    console.error(error);
    return {
      props: { mod: null },
    };
  }
}
