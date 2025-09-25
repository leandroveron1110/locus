import React from 'react';

const SearchBusinessMapSkeleton: React.FC = () => {
  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center animate-pulse">
      <p className="text-gray-400">Cargando mapa...</p>
    </div>
  );
};

export default SearchBusinessMapSkeleton;