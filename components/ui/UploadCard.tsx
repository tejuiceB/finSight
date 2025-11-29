'use client';

import { useState, useCallback } from 'react';
import type { ParsedFile } from '@/lib/types';
import { parseFile } from '@/lib/parsers';

interface UploadCardProps {
  onFilesUploaded: (files: ParsedFile[]) => void;
  onError: (error: string) => void;
}

export default function UploadCard({ onFilesUploaded, onError }: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = async (fileList: FileList) => {
    setIsProcessing(true);
    const parsedFiles: ParsedFile[] = [];
    const fileNames: string[] = [];

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const ext = file.name.split('.').pop()?.toLowerCase();

        // Validate file type
        if (!['pdf', 'csv', 'xlsx', 'xls', 'txt'].includes(ext || '')) {
          onError(`Unsupported file type: ${file.name}`);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          onError(`File too large (max 10MB): ${file.name}`);
          continue;
        }

        try {
          const parsed = await parseFile(file);
          parsedFiles.push(parsed);
          fileNames.push(file.name);
        } catch (error) {
          onError(`Failed to parse ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      if (parsedFiles.length > 0) {
        setUploadedFiles([...uploadedFiles, ...fileNames]);
        onFilesUploaded(parsedFiles);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        await processFiles(files);
      }
    },
    [uploadedFiles]
  );

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFiles(files);
    }
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
            : 'border-gray-300 dark:border-gray-700 hover:border-blue-400'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-4">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          {isProcessing ? 'Processing files...' : 'Upload Your Financial Documents'}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Drag & drop files here, or click to browse
        </p>

        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.csv,.xlsx,.xls,.txt"
          multiple
          onChange={handleFileInput}
          disabled={isProcessing}
        />
        
        <label
          htmlFor="file-upload"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Select Files
        </label>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Supported: PDF, CSV, Excel (.xlsx/.xls), TXT • Max size: 10MB per file
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          🔒 Files processed securely in your browser. Complete privacy guaranteed.
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Uploaded Files ({uploadedFiles.length}):
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((name, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded"
              >
                <svg
                  className="h-4 w-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="truncate">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
