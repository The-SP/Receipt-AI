'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Upload, Loader } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export function FileUpload({ onFileUpload, isLoading }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Create a preview URL for the image
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Pass the file to the parent component
        onFileUpload(file);

        // Clean up the preview URL when it's no longer needed
        return () => URL.revokeObjectURL(objectUrl);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center
          min-h-[200px] cursor-pointer transition-colors
          ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-primary/50'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        {isLoading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm text-gray-500">Processing your bill...</p>
          </div>
        ) : preview ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative h-40 w-full max-w-xs">
              <Image
                src={preview}
                alt="Bill preview"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p className="text-sm text-gray-500">
              Click or drag to upload a different image
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-10 w-10 text-gray-400" />
            <p className="font-medium">
              {isDragActive
                ? 'Drop the image here'
                : 'Drag & drop a bill image, or click to select'}
            </p>
            <p className="text-sm text-gray-500">Supports JPG, JPEG, PNG</p>
            <Button type="button" variant="outline" size="sm" className="mt-2">
              Select Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
