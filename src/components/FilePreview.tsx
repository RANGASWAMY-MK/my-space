import { DriveFile } from '@/types';
import { driveService } from '@/services/driveService';
import { Modal } from './Modal';

interface FilePreviewProps {
  file: DriveFile | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  onShare: () => void;
}

export function FilePreview({ file, isOpen, onClose, onDownload, onShare }: FilePreviewProps) {
  if (!file) return null;

  const isGoogleDoc = file.mimeType.includes('google-apps');
  const isImage = file.mimeType.includes('image');
  const isVideo = file.mimeType.includes('video');
  const isPDF = file.mimeType.includes('pdf');

  const getPreviewContent = () => {
    if (isImage) {
      return (
        <div className="bg-gray-100 rounded-xl p-8 flex items-center justify-center">
          <div className="text-center">
            <span className="text-8xl mb-4 block">🖼️</span>
            <p className="text-gray-600">Image Preview</p>
            <p className="text-sm text-gray-400 mt-2">{file.name}</p>
          </div>
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="bg-gray-900 rounded-xl p-8 flex items-center justify-center aspect-video">
          <div className="text-center text-white">
            <span className="text-8xl mb-4 block">🎬</span>
            <p>Video Preview</p>
            <p className="text-sm text-gray-400 mt-2">{file.name}</p>
          </div>
        </div>
      );
    }

    if (isGoogleDoc) {
      const docType = file.mimeType.includes('spreadsheet') 
        ? { icon: '📊', name: 'Google Sheets', color: 'bg-green-100 text-green-700' }
        : file.mimeType.includes('presentation')
        ? { icon: '📽️', name: 'Google Slides', color: 'bg-yellow-100 text-yellow-700' }
        : { icon: '📄', name: 'Google Docs', color: 'bg-blue-100 text-blue-700' };

      return (
        <div className="space-y-4">
          <div className={`${docType.color} rounded-xl p-8 text-center`}>
            <span className="text-8xl mb-4 block">{docType.icon}</span>
            <p className="font-medium text-lg">{docType.name}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-3">
              This file can be opened directly in Google {docType.name.replace('Google ', '')}
            </p>
            <button
              onClick={() => window.open(file.webViewLink, '_blank')}
              className="w-full py-2.5 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open in {docType.name}
            </button>
          </div>
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className="bg-red-50 rounded-xl p-8 text-center">
          <span className="text-8xl mb-4 block">📕</span>
          <p className="font-medium text-lg text-red-700">PDF Document</p>
          <p className="text-sm text-red-600 mt-2">{file.name}</p>
        </div>
      );
    }

    return (
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <span className="text-8xl mb-4 block">{driveService.getFileIcon(file.mimeType)}</span>
        <p className="text-gray-600">File Preview</p>
        <p className="text-sm text-gray-400 mt-2">{file.name}</p>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="File Preview" size="lg">
      <div className="space-y-6">
        {getPreviewContent()}

        {/* File Details */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Name</span>
            <span className="text-gray-900 font-medium">{file.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Size</span>
            <span className="text-gray-900">{driveService.formatFileSize(file.size)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Modified</span>
            <span className="text-gray-900">{driveService.formatDate(file.modifiedTime)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Created</span>
            <span className="text-gray-900">{driveService.formatDate(file.createdTime)}</span>
          </div>
          {file.owners?.[0] && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Owner</span>
              <span className="text-gray-900">{file.owners[0].displayName}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {!file.mimeType.includes('folder') && (
            <button
              onClick={onDownload}
              className="flex-1 py-2.5 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          )}
          <button
            onClick={onShare}
            className="flex-1 py-2.5 px-4 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </Modal>
  );
}
