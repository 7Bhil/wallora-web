import { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud, X, CheckCircle, AlertCircle, Plus } from 'lucide-react';

const CATEGORIES = ['Abstract', 'Nature', 'City', 'Space', 'Dark', 'Minimal', 'Neon', 'Fantasy'];
const SUGGESTED_TAGS = ['#Neon', '#Vaporwave', '#Dark', '#4K', '#Cyber', '#Space', '#Nature', '#Minimal'];

export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Abstract');
  const [tags, setTags] = useState(['#Neon', '#Vaporwave', '#Dark']);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const { token } = useContext(AuthContext);
  const inputRef = useRef();

  const handleFile = (selected) => {
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setStatus(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const removeTag = (t) => setTags(tags.filter(x => x !== t));
  const addTag = (t) => {
    const tag = t.startsWith('#') ? t : `#${t}`;
    if (tag.length > 1 && !tags.includes(tag)) setTags([...tags, tag]);
    setTagInput('');
  };

  const submitUpload = async (e) => {
    e.preventDefault();
    if (!token) { setStatus('error'); setMessage('You must be logged in.'); return; }
    if (!file) { setStatus('error'); setMessage('Please select an image first.'); return; }

    setUploading(true);
    setProgress(30);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:3000/api/wallpapers/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      setProgress(100);
      if (res.ok) {
        setStatus('success');
        setMessage('Ton chef-d\'œuvre a été publié dans l\'Arène !');
        setFile(null); setPreview(null); setTitle(''); setTags(['#Neon', '#Vaporwave', '#Dark']);
      } else {
        const err = await res.json();
        setStatus('error'); setMessage(err.error || 'Erreur lors de l\'upload.');
      }
    } catch {
      setStatus('error'); setMessage('Erreur réseau. Le serveur est-il démarré ?');
    }
    setUploading(false); setProgress(0);
  };

  return (
    <form onSubmit={submitUpload} className="min-h-full p-6 md:p-10">
      <div className="mb-8 flex items-start justify-between">
        <div>
          {/* Desktop title */}
          <h1 className="hidden md:block text-4xl font-black text-white tracking-tight">
            Upload <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Masterpiece</span>
          </h1>
          {/* Mobile title */}
          <div className="md:hidden">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-1">New Submission</p>
            <h1 className="text-3xl font-black text-white tracking-tight">Share your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Vision</span><span className="text-purple-400">.</span></h1>
          </div>
          <p className="hidden md:block text-gray-500 mt-1 text-sm font-medium">Contribute your digital vision to the global gallery.</p>
        </div>
        {/* Reputation badge (desktop) */}
        <div className="hidden md:flex flex-col items-end gap-1">
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-500">Gallery Reputation</p>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <div className="w-6 h-6 rounded-full bg-purple-500/30 border border-purple-500/50 flex items-center justify-center">
              <span className="text-purple-300 font-black text-[10px]">L</span>
            </div>
            <span className="text-white font-bold text-xs">Lvl 24 · Digital Curator</span>
          </div>
        </div>
      </div>

      {/* Two-column layout on desktop, single column on mobile */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* LEFT: Drop Zone */}
        <div className="flex-1 flex flex-col gap-4">
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative rounded-3xl border-2 transition cursor-pointer overflow-hidden flex items-center justify-center
              ${isDragging ? 'border-purple-400 bg-purple-900/20' : 'border-white/10 hover:border-purple-500/50 bg-white/[0.02]'}
              ${preview ? 'aspect-video' : 'md:aspect-video aspect-square'}`}
          >
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            {preview ? (
              <>
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-white font-bold bg-white/10 backdrop-blur px-4 py-2 rounded-xl border border-white/20 text-sm">Change Image</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
                  <UploadCloud size={28} className="text-purple-400" />
                </div>
                <p className="text-white font-bold text-lg md:text-xl mb-2">
                  <span className="hidden md:inline">Drag &amp; Drop Your Art</span>
                  <span className="md:hidden">Tap to Upload</span>
                </p>
                <p className="text-gray-500 text-xs font-medium">Support high-resolution JPG, PNG, or WebP<br className="hidden md:block" /> Minimum 2560×1440 recommended.</p>
                <button type="button" onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
                  className="hidden md:block mt-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-2.5 px-6 rounded-xl transition text-sm">
                  Select File
                </button>
              </div>
            )}
          </div>

          {/* Upload progress */}
          {file && !status && (
            <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <UploadCloud size={16} className="text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{file.name}</p>
                <p className="text-gray-500 text-xs">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                {uploading && (
                  <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                  </div>
                )}
              </div>
              <button type="button" onClick={() => { setFile(null); setPreview(null); }} className="text-gray-500 hover:text-gray-300 transition">
                <X size={16} />
              </button>
            </div>
          )}

          {/* Status message */}
          {status && (
            <div className={`flex items-center gap-3 p-4 rounded-2xl border text-sm font-bold ${status === 'success' ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' : 'bg-red-900/20 border-red-500/30 text-red-400'}`}>
              {status === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {message}
            </div>
          )}
        </div>

        {/* RIGHT: Metadata */}
        <div className="md:w-[300px] flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-2">Wallpaper Title</label>
            <input
              type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g Electric Dreams"
              className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-2">Category</label>
            <select
              value={category} onChange={e => setCategory(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition text-sm appearance-none cursor-pointer"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-2">Tags (separated by space)</label>
            <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-wrap gap-2 min-h-[80px]">
              {tags.map(t => (
                <span key={t} className="flex items-center gap-1 bg-purple-900/40 text-purple-300 text-xs font-bold px-3 py-1.5 rounded-full border border-purple-500/30">
                  {t}
                  <button type="button" onClick={() => removeTag(t)} className="ml-1 hover:text-white transition"><X size={10} /></button>
                </span>
              ))}
              <input
                className="bg-transparent outline-none text-white text-xs placeholder-gray-700 w-20 flex-1 min-w-[60px]"
                placeholder="Add tag..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); addTag(tagInput.trim()); } }}
              />
            </div>
          </div>

          {/* Agreements (desktop only) */}
          <div className="hidden md:flex flex-col gap-3">
            {['Exclusive to Neon Gallery\nSubmit as a platform exclusive for 2x points.', 'Original Creator Agreement\nI certify that I am the sole owner of this artwork.'].map((text, i) => (
              <label key={i} className="flex gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition ${i === 1 ? 'border-purple-400 bg-purple-400' : 'border-white/20 group-hover:border-purple-400/50'}`}>
                  {i === 1 && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="text-gray-400 text-xs leading-relaxed">{text.split('\n')[0]}<br /><span className="text-gray-600">{text.split('\n')[1]}</span></span>
              </label>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading || !file}
            className={`w-full py-4 rounded-2xl font-bold text-sm transition mt-auto flex items-center justify-center gap-2
              ${uploading || !file ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_4px_20px_rgba(168,85,247,0.35)]'}`}
          >
            {uploading ? 'Publishing...' : (<><span>Publish to Arena</span><span>→</span></>)}
          </button>
          
          {/* Mobile legal note */}
          <p className="md:hidden text-[10px] text-gray-600 text-center leading-relaxed">
            By publishing, you agree that this artwork is your own original creation and follows the Wallora community standards.
          </p>
        </div>
      </div>
    </form>
  );
}
