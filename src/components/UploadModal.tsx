import { useState, useRef } from 'react';
import { Modal } from './Modal';
import { UploadProgress } from '@/types';
import { cn } from '@/utils/cn';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: FileList) => Promise<void>;
  uploads: UploadProgress[];
}

export function UploadModal({ isOpen, onClose, onUpload, uploads }: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Files" size="lg">
      <div className="space-y-6">
        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
            isDragging 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors",
              isDragging ? "bg-blue-100" : "bg-gray-100"
            )}>
              <svg 
                className={cn("w-8 h-8", isDragging ? "text-blue-500" : "text-gray-400")} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-1">
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-gray-500">
              or <span className="text-blue-500 font-medium">browse</span> to choose files
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supports all file types up to 100MB
            </p>
          </div>
        </div>

        {/* Upload Progress */}
        {uploads.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Uploads</h3>
            {uploads.map((upload, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                    {upload.fileName}
                  </span>
                  <span className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    upload.status === 'complete' && "bg-green-100 text-green-700",
                    upload.status === 'uploading' && "bg-blue-100 text-blue-700",
                    upload.status === 'error' && "bg-red-100 text-red-700",
                    upload.status === 'pending' && "bg-gray-100 text-gray-600"
                  )}>
                    {upload.status === 'complete' ? 'Done' : 
                     upload.status === 'uploading' ? `${upload.progress}%` :
                     upload.status === 'error' ? 'Failed' : 'Pending'}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      upload.status === 'complete' && "bg-green-500",
                      upload.status === 'uploading' && "bg-blue-500",
                      upload.status === 'error' && "bg-red-500"
                    )}
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
