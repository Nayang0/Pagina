import axios from 'axios';
import Link from 'next/link';

export default function Home({ mods }) {
  return (
    <div>
      <h1>Bienvenido a la Base de Datos de Mods</h1>
      <div>
        {mods.map((mod) => (
          <div key={mod._id} style={{ marginBottom: '20px' }}>
            <h2>{mod.name}</h2>
            <p>{mod.description}</p>
            <Link href={`/mod/${mod._id}`}>
              <a>Ver detalles</a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const res = await axios.get('http://localhost:5000/api/mods');
    const mods = res.data;
    return {
      props: { mods },
    };
  } catch (error) {
    console.error(error);
    return {
      props: { mods: [] },
    };
  }
}
