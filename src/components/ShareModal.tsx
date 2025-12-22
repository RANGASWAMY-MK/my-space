import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { DriveFile } from '@/types';
import { driveService } from '@/services/driveService';

interface ShareModalProps {
  file: DriveFile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ file, isOpen, onClose }: ShareModalProps) {
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && file) {
      setIsLoading(true);
      driveService.getShareLink(file.id).then((link) => {
        setShareLink(link);
        setIsLoading(false);
      });
    }
    setCopied(false);
  }, [isOpen, file]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!file) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share File" size="md">
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <span className="text-4xl">{driveService.getFileIcon(file.mimeType)}</span>
          <div>
            <p className="font-medium text-gray-900">{file.name}</p>
            <p className="text-sm text-gray-500">{driveService.formatFileSize(file.size)}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Share Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={isLoading ? 'Generating link...' : shareLink}
              readOnly
              className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600"
            />
            <button
              onClick={handleCopy}
              disabled={isLoading}
              className="px-4 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-yellow-800">Sharing Settings</p>
              <p className="text-sm text-yellow-700 mt-1">
                Anyone with this link can view the file. Manage permissions in Google Drive settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
