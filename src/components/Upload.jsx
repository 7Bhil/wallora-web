import { useState } from 'react';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const submitUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Veuillez sélectionner une image.');

    setUploading(true);
    setMessage('');
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:3000/api/wallpapers/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setMessage('Succès ! Le fond d\'écran a été ajouté.');
        setFile(null);
      } else {
        const errorData = await res.json();
        setMessage('Erreur: ' + (errorData.error || 'Impossible d\'uploader'));
      }
    } catch (e) {
      setMessage('Erreur serveur critique (Cloudinary est-il bien configuré dans le serveur ?)');
    }
    
    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Ajouter un nouveau Fond d'Écran</h2>
      
      <form onSubmit={submitUpload} className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 w-full max-w-md flex flex-col items-center">
        <label className="w-full h-32 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 hover:border-blue-500 transition">
          <span className="text-gray-400 font-medium">
            {file ? file.name : 'Cliquez pour choisir une image'}
          </span>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => setFile(e.target.files[0])} 
          />
        </label>

        <button 
          type="submit" 
          disabled={uploading}
          className={`mt-6 w-full py-3 rounded-lg font-bold text-white transition ${uploading ? 'bg-blue-800 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}
        >
          {uploading ? 'Upload en cours...' : 'Envoyer 🚀'}
        </button>

        {message && <p className="mt-4 text-center font-medium text-blue-300">{message}</p>}
      </form>
    </div>
  );
}
