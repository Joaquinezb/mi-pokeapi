import React, { useState, useEffect } from 'react';
import './PokemonFetcher.css';

const cantidadesPreseleccionadas = [4, 6, 8, 10, 12, 16, 22, 28, 34];

const PokemonFetcher = () => {
  const [pokemones, setPokemones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [cantidad, setCantidad] = useState(6); // Nuevo estado para la cantidad

  useEffect(() => {
    const fetchPokemones = async () => {
      try {
        setCargando(true);
        setError(null);
        const fetchedPokemones = [];
        const pokemonIds = new Set();

        // Generar IDs únicos según la cantidad seleccionada
        while (pokemonIds.size < cantidad) {
          const randomId = Math.floor(Math.random() * 898) + 1;
          pokemonIds.add(randomId);
        }

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
  }, [cantidad]); // Ahora depende de la cantidad seleccionada

  if (cargando) {
    return <div className="pokemon-container">Cargando Pokémon...</div>;
  }

  if (error) {
    return <div className="pokemon-container error">Error: {error}</div>;
  }

  return (
    <div className='pokemon-container'>
      <h2>Tus {cantidad} Pokémon Aleatorios</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Filtrar por tipo (ej: fire, water)"
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', minWidth: '180px' }}
        />
        <select
          value={cantidad}
          onChange={e => setCantidad(Number(e.target.value))}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          {cantidadesPreseleccionadas.map(num => (
            <option key={num} value={num}>{num} Pokémon</option>
          ))}
        </select>
      </div>
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