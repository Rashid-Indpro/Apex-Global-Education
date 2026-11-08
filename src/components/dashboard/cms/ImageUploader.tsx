import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle2, AlertCircle, X, RefreshCw } from 'lucide-react';
import { Button } from '../../ui/Button.tsx';

interface ImageUploaderProps {
  label: string;
  helperText?: string;
  currentImageUrl: string;
  onImageUploaded: (url: string) => void;
  onUploadFile: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  helperText,
  currentImageUrl,
  onImageUploaded,
  onUploadFile,
}) => {
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        {helperText && <span className="text-[11px] text-slate-500">{helperText}</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        
        {/* Preview Container */}
        <div className="sm:col-span-5 relative rounded-lg border border-slate-200 bg-slate-100 overflow-hidden aspect-[16/10] flex items-center justify-center group shadow-2xs">
          {currentImageUrl ? (
            <>
              <img
                src={currentImageUrl}
                alt="CMS asset preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
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

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            sm:col-span-7 border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[120px]
            ${
              isDragging
                ? 'border-sky-500 bg-sky-50/60'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/60 hover:bg-slate-50'
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
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="text-xs font-semibold">Uploading to secure storage...</span>
            </div>
          ) : (
            <>
              <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
              <p className="text-xs font-semibold text-slate-700">
                Click to browse or drag & drop media file
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                JPEG, PNG, WebP up to 5MB
              </p>
            </>
          )}
        </div>

      </div>

      {uploadError && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Manual direct URL input fallback */}
      <div className="pt-1 flex items-center gap-2">
        <input
          type="text"
          value={currentImageUrl}
          onChange={(e) => onImageUploaded(e.target.value)}
          placeholder="Or paste an asset URL / path directly..."
          className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600 font-mono"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          Browse Local
        </Button>
      </div>

    </div>
  );
};
