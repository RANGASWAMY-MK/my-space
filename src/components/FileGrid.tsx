import { DriveFile } from '@/types';
import { driveService } from '@/services/driveService';
import { cn } from '@/utils/cn';

interface FileGridProps {
  files: DriveFile[];
  viewMode: 'grid' | 'list';
  onFileClick: (file: DriveFile) => void;
  onFileAction: (action: string, file: DriveFile) => void;
  selectedFiles: string[];
  onSelectFile: (fileId: string, selected: boolean) => void;
}

export function FileGrid({ files, viewMode, onFileClick, onFileAction, selectedFiles, onSelectFile }: FileGridProps) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
        </svg>
        <p className="text-lg font-medium">No files found</p>
        <p className="text-sm">Upload files or create a folder to get started</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  onChange={(e) => {
                    files.forEach(f => onSelectFile(f.id, e.target.checked));
                  }}
                />
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Size</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Modified</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {files.map((file) => (
              <tr
                key={file.id}
                className={cn(
                  "hover:bg-gray-50 cursor-pointer transition-colors",
                  selectedFiles.includes(file.id) && "bg-blue-50"
                )}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      onSelectFile(file.id, e.target.checked);
                    }}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-4 py-3" onClick={() => onFileClick(file)}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{driveService.getFileIcon(file.mimeType)}</span>
                    <div>
                      <p className="font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                      {file.shared && (
                        <span className="text-xs text-blue-600 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          Shared
                        </span>
                      )}
                    </div>
                    {file.starred && <span className="text-yellow-500">⭐</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                  {driveService.formatFileSize(file.size)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">
                  {driveService.formatDate(file.modifiedTime)}
                </td>
                <td className="px-4 py-3">
                  <FileActions file={file} onAction={onFileAction} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {files.map((file) => (
        <div
          key={file.id}
          className={cn(
            "group relative bg-white rounded-xl border border-gray-200 p-4 cursor-pointer",
            "hover:border-blue-300 hover:shadow-md transition-all duration-200",
            selectedFiles.includes(file.id) && "border-blue-500 bg-blue-50"
          )}
          onClick={() => onFileClick(file)}
        >
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <input
              type="checkbox"
              checked={selectedFiles.includes(file.id)}
              onChange={(e) => {
                e.stopPropagation();
                onSelectFile(file.id, e.target.checked);
              }}
              className="rounded border-gray-300"
            />
          </div>
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <FileActions file={file} onAction={onFileAction} />
          </div>

          <div className="flex flex-col items-center text-center pt-4">
            <span className="text-4xl mb-3">{driveService.getFileIcon(file.mimeType)}</span>
            <p className="font-medium text-gray-900 text-sm truncate w-full" title={file.name}>
              {file.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {driveService.formatDate(file.modifiedTime)}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {file.starred && <span className="text-yellow-500 text-sm">⭐</span>}
              {file.shared && (
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FileActions({ file, onAction }: { file: DriveFile; onAction: (action: string, file: DriveFile) => void }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            {!file.mimeType.includes('folder') && (
              <button
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                onClick={(e) => { e.stopPropagation(); onAction('download', file); setShowMenu(false); }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            )}
            <button
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              onClick={(e) => { e.stopPropagation(); onAction('share', file); setShowMenu(false); }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Get Link
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              onClick={(e) => { e.stopPropagation(); onAction('star', file); setShowMenu(false); }}
            >
              <span className="text-sm">{file.starred ? '⭐' : '☆'}</span>
              {file.starred ? 'Unstar' : 'Star'}
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              onClick={(e) => { e.stopPropagation(); onAction('rename', file); setShowMenu(false); }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Rename
            </button>
            <hr className="my-1 border-gray-100" />
            <button
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              onClick={(e) => { e.stopPropagation(); onAction('delete', file); setShowMenu(false); }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

import { useState } from 'react';
