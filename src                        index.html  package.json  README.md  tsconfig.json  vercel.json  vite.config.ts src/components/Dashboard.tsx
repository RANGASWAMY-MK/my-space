import { useState, useEffect, useCallback } from 'react';
import { DriveFile, UploadProgress, Folder } from '@/types';
import { driveService } from '@/services/driveService';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { FileGrid } from './FileGrid';
import { FilePreview } from './FilePreview';
import { UploadModal } from './UploadModal';
import { NewFolderModal } from './NewFolderModal';
import { ShareModal } from './ShareModal';
import { Modal } from './Modal';

export function Dashboard() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('my-drive');
  const [currentFolder, setCurrentFolder] = useState<Folder>({
    id: 'root',
    name: 'My Drive',
    path: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal states
  const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [shareFile, setShareFile] = useState<DriveFile | null>(null);
  const [renameFile, setRenameFile] = useState<DriveFile | null>(null);
  const [deleteConfirmFile, setDeleteConfirmFile] = useState<DriveFile | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Storage simulation
  const storageUsed = 3.2 * 1024 * 1024 * 1024; // 3.2 GB
  const storageTotal = 15 * 1024 * 1024 * 1024; // 15 GB

  const loadFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      let loadedFiles: DriveFile[];
      
      if (searchQuery) {
        loadedFiles = await driveService.searchFiles(searchQuery);
      } else if (currentView === 'starred') {
        const allFiles = await driveService.listFiles('root');
        loadedFiles = allFiles.filter(f => f.starred);
      } else if (currentView === 'shared') {
        const allFiles = await driveService.listFiles('root');
        loadedFiles = allFiles.filter(f => f.shared);
      } else if (currentView === 'recent') {
        const allFiles = await driveService.listFiles('root');
        loadedFiles = allFiles.sort((a, b) => 
          new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime()
        ).slice(0, 10);
      } else {
        loadedFiles = await driveService.listFiles(currentFolder.id);
      }
      
      setFiles(loadedFiles);
    } catch (error) {
      console.error('Failed to load files:', error);
      showNotification('Failed to load files', 'error');
    }
    setIsLoading(false);
  }, [currentFolder.id, currentView, searchQuery]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileClick = (file: DriveFile) => {
    if (file.mimeType.includes('folder')) {
      setCurrentFolder({
        id: file.id,
        name: file.name,
        path: [...currentFolder.path, { id: currentFolder.id, name: currentFolder.name }]
      });
    } else {
      setPreviewFile(file);
    }
  };

  const handleFileAction = async (action: string, file: DriveFile) => {
    switch (action) {
      case 'download':
        showNotification(`Downloading ${file.name}...`, 'success');
        break;
      case 'share':
        setShareFile(file);
        break;
      case 'star':
        await driveService.toggleStar(file.id);
        loadFiles();
        showNotification(file.starred ? 'Removed from starred' : 'Added to starred', 'success');
        break;
      case 'rename':
        setRenameFile(file);
        setNewFileName(file.name);
        break;
      case 'delete':
        setDeleteConfirmFile(file);
        break;
    }
  };

  const handleSelectFile = (fileId: string, selected: boolean) => {
    if (selected) {
      setSelectedFiles([...selectedFiles, fileId]);
    } else {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    }
  };

  const handleUpload = async (fileList: FileList) => {
    const newUploads: UploadProgress[] = Array.from(fileList).map(f => ({
      fileName: f.name,
      progress: 0,
      status: 'pending' as const
    }));
    setUploads(prev => [...prev, ...newUploads]);

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const uploadIndex = uploads.length + i;
      
      setUploads(prev => prev.map((u, idx) => 
        idx === uploadIndex ? { ...u, status: 'uploading' } : u
      ));

      try {
        await driveService.uploadFile(file, currentFolder.id, (progress) => {
          setUploads(prev => prev.map((u, idx) =>
            idx === uploadIndex ? { ...u, progress } : u
          ));
        });
        
        setUploads(prev => prev.map((u, idx) =>
          idx === uploadIndex ? { ...u, status: 'complete', progress: 100 } : u
        ));
      } catch {
        setUploads(prev => prev.map((u, idx) =>
          idx === uploadIndex ? { ...u, status: 'error' } : u
        ));
      }
    }

    loadFiles();
    showNotification('Files uploaded successfully', 'success');
  };

  const handleCreateFolder = async (name: string) => {
    await driveService.createFolder(name, currentFolder.id);
    loadFiles();
    showNotification('Folder created successfully', 'success');
  };

  const handleRename = async () => {
    if (renameFile && newFileName.trim()) {
      await driveService.renameFile(renameFile.id, newFileName.trim());
      setRenameFile(null);
      loadFiles();
      showNotification('File renamed successfully', 'success');
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmFile) {
      await driveService.deleteFile(deleteConfirmFile.id);
      setDeleteConfirmFile(null);
      loadFiles();
      showNotification('File deleted successfully', 'success');
    }
  };

  const handleBreadcrumbClick = (folderId: string, index: number) => {
    if (folderId === 'root') {
      setCurrentFolder({ id: 'root', name: 'My Drive', path: [] });
    } else {
      const pathItem = currentFolder.path[index];
      setCurrentFolder({
        id: pathItem.id,
        name: pathItem.name,
        path: currentFolder.path.slice(0, index)
      });
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'starred': return 'Starred';
      case 'shared': return 'Shared with me';
      case 'recent': return 'Recent';
      case 'trash': return 'Trash';
      default: return currentFolder.name;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          if (view === 'my-drive') {
            setCurrentFolder({ id: 'root', name: 'My Drive', path: [] });
          }
        }}
        storageUsed={storageUsed}
        storageTotal={storageTotal}
        onNewFolder={() => setShowNewFolderModal(true)}
        onUpload={() => setShowUploadModal(true)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 lg:p-6">
          {/* Breadcrumb */}
          {currentView === 'my-drive' && currentFolder.path.length > 0 && (
            <nav className="flex items-center gap-2 mb-4 text-sm">
              <button
                onClick={() => handleBreadcrumbClick('root', -1)}
                className="text-blue-600 hover:underline"
              >
                My Drive
              </button>
              {currentFolder.path.map((item, index) => (
                <span key={item.id} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <button
                    onClick={() => handleBreadcrumbClick(item.id, index)}
                    className="text-blue-600 hover:underline"
                  >
                    {item.name}
                  </button>
                </span>
              ))}
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-600">{currentFolder.name}</span>
              </span>
            </nav>
          )}

          {/* Page Title */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{getViewTitle()}</h1>
            {selectedFiles.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{selectedFiles.length} selected</span>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Clear selection
                </button>
              </div>
            )}
          </div>

          {/* File Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500">Loading files...</p>
              </div>
            </div>
          ) : (
            <FileGrid
              files={files}
              viewMode={viewMode}
              onFileClick={handleFileClick}
              onFileAction={handleFileAction}
              selectedFiles={selectedFiles}
              onSelectFile={handleSelectFile}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <FilePreview
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        onDownload={() => {
          showNotification(`Downloading ${previewFile?.name}...`, 'success');
        }}
        onShare={() => {
          setShareFile(previewFile);
          setPreviewFile(null);
        }}
      />

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setUploads([]);
        }}
        onUpload={handleUpload}
        uploads={uploads}
      />

      <NewFolderModal
        isOpen={showNewFolderModal}
        onClose={() => setShowNewFolderModal(false)}
        onCreateFolder={handleCreateFolder}
      />

      <ShareModal
        file={shareFile}
        isOpen={!!shareFile}
        onClose={() => setShareFile(null)}
      />

      {/* Rename Modal */}
      <Modal
        isOpen={!!renameFile}
        onClose={() => setRenameFile(null)}
        title="Rename File"
        size="sm"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex gap-3">
            <button
              onClick={() => setRenameFile(null)}
              className="flex-1 py-2.5 px-4 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleRename}
              className="flex-1 py-2.5 px-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
            >
              Rename
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmFile}
        onClose={() => setDeleteConfirmFile(null)}
        title="Delete File"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{deleteConfirmFile?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteConfirmFile(null)}
              className="flex-1 py-2.5 px-4 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-2.5 px-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-slide-up ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {notification.message}
        </div>
      )}
    </div>
  );
}
