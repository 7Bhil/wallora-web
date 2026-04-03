import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState('');
  const { token } = useContext(AuthContext);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setStatus(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (!dropped) return;
    setFile(dropped);
    setPreview(URL.createObjectURL(dropped));
    setStatus(null);
  };

  const submitUpload = async (e) => {
    e.preventDefault();
    if (!token) { setStatus('error'); setMessage('You must be logged in to upload.'); return; }
    if (!file) { setStatus('error'); setMessage('Please select an image first.'); return; }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:3000/api/wallpapers/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setStatus('success');
        setMessage('Wallpaper successfully published to the Arena!');
        setFile(null);
        setPreview(null);
      } else {
        const err = await res.json();
        setStatus('error');
        setMessage(err.error || 'Upload failed.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Is the server running?');
    }
    setUploading(false);
  };

  return (
    <div className="p-8 md:p-12 max-w-3xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-white tracking-tight mb-1">Submit a Wallpaper</h2>
        <p className="text-gray-500 font-medium text-sm">High-quality entries are rewarded by the community.</p>
      </div>

      <form onSubmit={submitUpload} className="space-y-6">
        {/* Drop Zone */}
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          className="relative rounded-3xl border-2 border-dashed border-white/10 hover:border-purple-500/50 transition bg-white/[0.02] overflow-hidden cursor-pointer group"
        >
          <label className="block cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            {preview ? (
              <div className="relative aspect-video">
                <img src={preview} alt="preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-white font-bold bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">Change Image</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                <UploadCloud size={52} className="text-gray-600 mb-4 group-hover:text-purple-400 transition" />
                <p className="text-gray-400 font-semibold text-base">Drag & drop or click to select</p>
                <p className="text-gray-600 text-xs mt-2 font-medium">PNG, JPG, WEBP — Up to 10MB</p>
              </div>
            )}
          </label>
        </div>

        {/* Status */}
        {status && (
          <div className={`flex items-center gap-3 p-4 rounded-2xl border text-sm font-bold ${status === 'success' ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' : 'bg-red-900/20 border-red-500/30 text-red-400'}`}>
            {status === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={uploading || !file}
          className={`w-full py-4 rounded-2xl font-bold text-base transition shadow-lg ${uploading || !file ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_4px_20px_rgba(168,85,247,0.35)]'}`}
        >
          {uploading ? 'Publishing...' : 'Publish to Arena 🚀'}
        </button>
      </form>
    </div>
  );
}
