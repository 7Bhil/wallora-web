import { useState, useEffect } from 'react';

export default function Battle() {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWallpapers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/wallpapers/battle');
      if (res.ok) {
        const data = await res.json();
        setWallpapers(data);
      } else {
        setWallpapers([]); // Pas assez d'images
      }
    } catch (e) { 
      console.error(e); 
    }
    setLoading(false);
  };

  useEffect(() => { fetchWallpapers(); }, []);

  const handleVote = async (winnerId, loserId) => {
    try {
      await fetch('http://localhost:3000/api/wallpapers/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winnerId, loserId })
      });
      fetchWallpapers();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="text-center text-gray-400 mt-10">Chargement de la battle...</div>;

  if (wallpapers.length < 2) return <div className="text-center text-red-400 font-bold mt-10">Il faut au moins 2 images dans la base de données pour jouer ! Allez dans "Upload".</div>;

  return (
    <div className="flex flex-col mt-8">
      <h2 className="text-2xl font-bold text-center mb-6">Votez pour le meilleur !</h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 px-4">
        <div 
          className="cursor-pointer transform hover:scale-105 transition-transform duration-200" 
          onClick={() => handleVote(wallpapers[0]._id, wallpapers[1]._id)}
        >
          <img src={wallpapers[0].url} alt="Wallpaper 1" className="w-full max-w-sm rounded-xl shadow-2xl border-4 border-transparent hover:border-blue-500 object-cover aspect-[9/16]" />
        </div>
        
        <div className="text-4xl font-black text-gray-600 bg-gray-800 p-4 rounded-full shadow-inner">
          VS
        </div>
        
        <div 
          className="cursor-pointer transform hover:scale-105 transition-transform duration-200" 
          onClick={() => handleVote(wallpapers[1]._id, wallpapers[0]._id)}
        >
          <img src={wallpapers[1].url} alt="Wallpaper 2" className="w-full max-w-sm rounded-xl shadow-2xl border-4 border-transparent hover:border-red-500 object-cover aspect-[9/16]" />
        </div>
      </div>
    </div>
  );
}
