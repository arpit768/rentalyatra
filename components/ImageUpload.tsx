import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, FileText, Check } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
  label?: string;
  existingImages?: string[];
  onRemoveExisting?: (url: string) => void;
}

export default function ImageUpload({
  onUpload,
  maxFiles = 5,
  accept = 'image/*',
  label = 'Upload Images',
  existingImages = [],
  onRemoveExisting,
}: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const validFiles = fileArray.filter((file) => {
      // Validate file type
      if (accept === 'image/*' && !file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Max size is 5MB`);
        return false;
      }
      return true;
    });

    if (files.length + validFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files`);
      return;
    }

    // Create previews
    const newPreviews: string[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPreviews.push(e.target.result as string);
          if (newPreviews.length === validFiles.length) {
            setPreviews((prev) => [...prev, ...newPreviews]);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    onUpload(updatedFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    onUpload(newFiles);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-blue-600 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          {accept.includes('image') ? (
            <ImageIcon className="w-12 h-12 text-gray-400" />
          ) : (
            <FileText className="w-12 h-12 text-gray-400" />
          )}
          <div>
            <p className="text-lg font-semibold text-gray-700">{label}</p>
            <p className="text-sm text-gray-500">
              Drag and drop or click to browse
            </p>
          </div>
          <div className="text-xs text-gray-500">
            Max {maxFiles} files • Max 5MB each • {accept}
          </div>
        </div>
      </div>

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {existingImages.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Existing ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                {onRemoveExisting && (
                  <button
                    onClick={() => onRemoveExisting(url)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full">
                  <Check className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview New Uploads */}
      {previews.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            New Uploads ({previews.length}/{maxFiles})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-blue-200"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  {(files[index].size / 1024).toFixed(0)} KB
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Compact Single Image Upload
export function SingleImageUpload({
  onUpload,
  existingImage,
  label = 'Upload Image',
}: {
  onUpload: (file: File | null) => void;
  existingImage?: string;
  label?: string;
}) {
  const [preview, setPreview] = useState<string | null>(existingImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    onUpload(file);
  };

  const removeImage = () => {
    setPreview(null);
    onUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {preview ? (
        <div className="relative group w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-gray-50 transition-all"
        >
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">Click to upload</p>
          <p className="text-xs text-gray-500 mt-1">Max 5MB</p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
