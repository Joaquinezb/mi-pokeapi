import React, { useState, useEffect } from 'react';
import './PokemonFetcher.css'; // Opcional: para estilos básicos

const PokemonFetcher = () => {
  const [pokemones, setPokemones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState(''); // Nuevo estado para el filtro

  useEffect(() => {
    const fetchPokemones = async () => {
      try {
        setCargando(true);
        setError(null);
        const fetchedPokemones = [];
        const pokemonIds = new Set(); // Usar un Set para asegurar IDs únicos

        // Generar 6 IDs de Pokémon únicos aleatorios
        while (pokemonIds.size < 6) {
          const randomId = Math.floor(Math.random() * 898) + 1; // 898 es el número actual de Pokémon en la PokeAPI (puedes ajustarlo)
          pokemonIds.add(randomId);
        }

        // Convertir el Set a un array para iterar
        const idsArray = Array.from(pokemonIds);

        for (const id of idsArray) {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
          if (!response.ok) {
            throw new Error(`Error al cargar el Pokémon con ID ${id}: ${response.statusText}`);
          }
          const data = await response.json();
          fetchedPokemones.push({
            id: data.id,
            nombre: data.name,
            imagen: data.sprites.front_default,
            tipos: data.types.map(typeInfo => typeInfo.type.name),
          });
        }
        setPokemones(fetchedPokemones);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchPokemones();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  if (cargando) {
    return <div className="pokemon-container">Cargando Pokémon...</div>;
  }

  if (error) {
    return <div className="pokemon-container error">Error: {error}</div>;
  }

  return (
    <div className='pokemon-container'>
      <h2>Tus 6 Pokémon Aleatorios</h2>
      <input
        type="text"
        placeholder="Filtrar por tipo (ej: fire, water)"
        value={filtroTipo}
        onChange={e => setFiltroTipo(e.target.value)}
        style={{ marginBottom: '20px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      <div className="pokemon-list"> 
        {pokemones
          .filter(pokemon =>
            filtroTipo === '' ||
            pokemon.tipos.some(tipo =>
              tipo.toLowerCase().includes(filtroTipo.toLowerCase())
            )
          )
          .map(pokemon => (
            <div key={pokemon.id} className="pokemon-card">
              <h3>{pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</h3>
              <img src={pokemon.imagen} alt={pokemon.nombre} />
              <p>
                <strong>Tipos:</strong> {pokemon.tipos.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(', ')}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PokemonFetcher;