import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Link, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '../../ui/Button.tsx';

interface ImageUploaderProps {
  label: string;
  helperText?: string;
  currentImageUrl: string;
  onImageUploaded: (url: string) => void;
  onUploadFile: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
}

const DEFAULT_CDN_FALLBACK = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop';

const QUICK_CDN_PRESETS = [
  {
    name: 'Campus Library CDN',
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop',
  },
  {
    name: 'Advisory Advisory CDN',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Executive Counselor CDN',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
  },
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  helperText,
  currentImageUrl,
  onImageUploaded,
  onUploadFile,
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('url');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid format. Please upload JPEG, PNG, or WebP.');
      return;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File exceeds 5MB size limit.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    const res = await onUploadFile(file);
    setIsUploading(false);

    if (res.success && res.url) {
      onImageUploaded(res.url);
    } else {
      setUploadError(res.error || 'Failed to upload image.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-3 bg-slate-50/70 border border-slate-200 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            {label}
          </label>
          {helperText && <span className="text-[11px] text-slate-500">{helperText}</span>}
        </div>

        {/* Source Mode Toggle */}
        <div className="inline-flex rounded-md p-0.5 bg-slate-200/80 text-[11px] font-medium shrink-0">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              mode === 'url' ? 'bg-white text-sky-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Paste Image URL (CDN)
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              mode === 'upload' ? 'bg-white text-sky-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upload Local Device File
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        
        {/* Live Image Preview Container */}
        <div className="sm:col-span-5 relative rounded-lg border border-slate-200 bg-slate-100 overflow-hidden aspect-[16/10] flex items-center justify-center group shadow-2xs">
          {currentImageUrl ? (
            <>
              <img
                src={currentImageUrl}
                alt="CMS asset preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback to online CDN image if local path or URL fails to load
                  e.currentTarget.src = DEFAULT_CDN_FALLBACK;
                }}
              />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5">
                <span className="text-[9px] text-sky-300 font-bold uppercase tracking-wider">
                  Live Asset Active
                </span>
                <span className="text-[10px] text-white bg-slate-950/80 px-2 py-1 rounded font-mono truncate max-w-full">
                  {currentImageUrl}
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-slate-400">
              <ImageIcon className="w-8 h-8" />
              <span className="text-xs">No media asset assigned</span>
            </div>
          )}
        </div>

        {/* Input Control Area */}
        <div className="sm:col-span-7 space-y-3">
          {mode === 'url' ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-sky-700" />
                <span>Image Web URL (HTTPS CDN Link)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentImageUrl}
                  onChange={(e) => onImageUploaded(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-1541339907198-e08756dedf3f..."
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600 font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Paste any online CDN link (Unsplash, Cloudinary, Imgur, AWS S3, etc.) for instant high-speed global delivery.
              </p>
            </div>
          ) : (
            /* Drag & Drop Upload Zone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[110px]
                ${
                  isDragging
                    ? 'border-sky-500 bg-sky-50/60'
                    : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50'
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
              />

              {isUploading ? (
                <div className="flex flex-col items-center gap-2 text-sky-700">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span className="text-xs font-semibold">Uploading file to server...</span>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5 text-slate-400 mb-1" />
                  <p className="text-xs font-semibold text-slate-700">
                    Click to browse local device file
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    JPEG, PNG, WebP up to 5MB
                  </p>
                </>
              )}
            </div>
          )}

          {/* Quick CDN Presets Bar */}
          <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Quick Presets:
            </span>
            {QUICK_CDN_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => onImageUploaded(preset.url)}
                className="px-2 py-0.5 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 rounded border border-slate-200 text-[10px] font-medium transition-colors cursor-pointer"
                title={preset.url}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

      </div>

      {uploadError && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

    </div>
  );
};

