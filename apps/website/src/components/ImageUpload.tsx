import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File must be under 5MB');
      return;
    }

    setUploading(true);
    setError('');

    const ext = file.name.split('.').pop();
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      setError('Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('portfolio-images').getPublicUrl(path);
    onChange(urlData.publicUrl);
    setUploading(false);
  };

  const handleUrlInput = () => {
    const url = prompt('Enter image URL:', value ?? '');
    if (url !== null) onChange(url || null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      <div className="space-y-2">
        {value && (
          <div className="relative group rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
            <img src={value} alt="Preview" className="w-full h-40 object-cover" />
            <button
              onClick={() => onChange(null)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-accent-500/20 text-accent-400 rounded-lg text-sm hover:bg-accent-500/30 transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
          <button
            type="button"
            onClick={handleUrlInput}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors"
          >
            Enter URL
          </button>
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>
    </div>
  );
}
