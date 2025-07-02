import React, { useState, useEffect } from 'react';
import './PokemonFetcher.css';

// Cantidades preseleccionadas para el selector de cantidad 
const cantidadesPreseleccionadas = [4, 6, 8, 10, 12, 16, 22, 28, 34];

const PokemonFetcher = () => {
  // Estados principales del componente 
  const [pokemones, setPokemones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [cantidad, setCantidad] = useState(6); // Cantidad de Pokémon a mostrar

  // Efecto para obtener los Pokémon cada vez que cambia la cantidad 
  useEffect(() => {
    const fetchPokemones = async () => {
      try {
        setCargando(true);
        setError(null);
        const fetchedPokemones = [];
        const pokemonIds = new Set();

        // Genera IDs únicos aleatorios según la cantidad seleccionada 
        while (pokemonIds.size < cantidad) {
          const randomId = Math.floor(Math.random() * 898) + 1;
          pokemonIds.add(randomId);
        }

        const idsArray = Array.from(pokemonIds);

        // Obtiene los datos de cada Pokémon por su ID 
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
  }, [cantidad]); // El efecto depende de la cantidad seleccionada

  // Renderizado condicional para mostrar carga o error 
  if (cargando) {
    return <div className="pokemon-container">Cargando Pokémon...</div>;
  }

  if (error) {
    return <div className="pokemon-container error">Error: {error}</div>;
  }

  // Render principal del componente 
  return (
    <div className='pokemon-container'>
      <h2>Tus {cantidad} Pokémon Aleatorios</h2>
      {/* Barra de búsqueda y selector de cantidad */}
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
      {/* Lista de Pokémon filtrados por tipo */}
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