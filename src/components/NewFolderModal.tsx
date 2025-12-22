import { useState } from 'react';
import { Modal } from './Modal';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (name: string) => Promise<void>;
}

export function NewFolderModal({ isOpen, onClose, onCreateFolder }: NewFolderModalProps) {
  const [folderName, setFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    setIsCreating(true);
    await onCreateFolder(folderName.trim());
    setFolderName('');
    setIsCreating(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Folder" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Folder Name
          </label>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!folderName.trim() || isCreating}
            className="flex-1 py-2.5 px-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
