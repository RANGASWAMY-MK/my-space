import { DriveFile } from '@/types';

// Simulated Google Drive files for demo purposes
// In production, this would make actual API calls to your backend
const mockFiles: DriveFile[] = [
  {
    id: '1',
    name: 'Project Documents',
    mimeType: 'application/vnd.google-apps.folder',
    modifiedTime: new Date().toISOString(),
    createdTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    parents: ['root'],
    shared: false,
    starred: true
  },
  {
    id: '2',
    name: 'Q4 Financial Report.xlsx',
    mimeType: 'application/vnd.google-apps.spreadsheet',
    size: 245760,
    modifiedTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    webViewLink: 'https://docs.google.com/spreadsheets',
    parents: ['root'],
    shared: true,
    starred: false,
    owners: [{ displayName: 'John Doe', emailAddress: 'john@example.com' }]
  },
  {
    id: '3',
    name: 'Meeting Notes.docx',
    mimeType: 'application/vnd.google-apps.document',
    size: 52480,
    modifiedTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    webViewLink: 'https://docs.google.com/document',
    parents: ['root'],
    shared: false,
    starred: true
  },
  {
    id: '4',
    name: 'Presentation 2024.pptx',
    mimeType: 'application/vnd.google-apps.presentation',
    size: 1048576,
    modifiedTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdTime: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    webViewLink: 'https://docs.google.com/presentation',
    parents: ['root'],
    shared: true,
    starred: false
  },
  {
    id: '5',
    name: 'Company Logo.png',
    mimeType: 'image/png',
    size: 524288,
    modifiedTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdTime: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    thumbnailLink: 'https://via.placeholder.com/150',
    webContentLink: '#',
    parents: ['root'],
    shared: false,
    starred: false
  },
  {
    id: '6',
    name: 'Budget Template.xlsx',
    mimeType: 'application/vnd.google-apps.spreadsheet',
    size: 102400,
    modifiedTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdTime: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    webViewLink: 'https://docs.google.com/spreadsheets',
    parents: ['1'],
    shared: false,
    starred: false
  },
  {
    id: '7',
    name: 'Team Photo.jpg',
    mimeType: 'image/jpeg',
    size: 2097152,
    modifiedTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    createdTime: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    thumbnailLink: 'https://via.placeholder.com/150',
    webContentLink: '#',
    parents: ['1'],
    shared: true,
    starred: true
  },
  {
    id: '8',
    name: 'Contract Draft.pdf',
    mimeType: 'application/pdf',
    size: 358400,
    modifiedTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    createdTime: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    webContentLink: '#',
    parents: ['root'],
    shared: false,
    starred: false
  },
  {
    id: '9',
    name: 'Archives',
    mimeType: 'application/vnd.google-apps.folder',
    modifiedTime: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    createdTime: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    parents: ['root'],
    shared: false,
    starred: false
  },
  {
    id: '10',
    name: 'Training Video.mp4',
    mimeType: 'video/mp4',
    size: 52428800,
    modifiedTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    webContentLink: '#',
    parents: ['root'],
    shared: true,
    starred: false
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const driveService = {
  async listFiles(folderId: string = 'root'): Promise<DriveFile[]> {
    await delay(500);
    return mockFiles.filter(f => f.parents?.includes(folderId));
  },

  async searchFiles(query: string): Promise<DriveFile[]> {
    await delay(300);
    const lowerQuery = query.toLowerCase();
    return mockFiles.filter(f => 
      f.name.toLowerCase().includes(lowerQuery)
    );
  },

  async getFile(fileId: string): Promise<DriveFile | undefined> {
    await delay(200);
    return mockFiles.find(f => f.id === fileId);
  },

  async uploadFile(file: File, folderId: string, onProgress: (progress: number) => void): Promise<DriveFile> {
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await delay(100);
      onProgress(i);
    }
    
    const newFile: DriveFile = {
      id: Date.now().toString(),
      name: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      modifiedTime: new Date().toISOString(),
      createdTime: new Date().toISOString(),
      parents: [folderId],
      shared: false,
      starred: false
    };
    
    mockFiles.push(newFile);
    return newFile;
  },

  async deleteFile(fileId: string): Promise<boolean> {
    await delay(300);
    const index = mockFiles.findIndex(f => f.id === fileId);
    if (index > -1) {
      mockFiles.splice(index, 1);
      return true;
    }
    return false;
  },

  async toggleStar(fileId: string): Promise<boolean> {
    await delay(200);
    const file = mockFiles.find(f => f.id === fileId);
    if (file) {
      file.starred = !file.starred;
      return true;
    }
    return false;
  },

  async createFolder(name: string, parentId: string = 'root'): Promise<DriveFile> {
    await delay(300);
    const newFolder: DriveFile = {
      id: Date.now().toString(),
      name,
      mimeType: 'application/vnd.google-apps.folder',
      modifiedTime: new Date().toISOString(),
      createdTime: new Date().toISOString(),
      parents: [parentId],
      shared: false,
      starred: false
    };
    mockFiles.push(newFolder);
    return newFolder;
  },

  async renameFile(fileId: string, newName: string): Promise<boolean> {
    await delay(200);
    const file = mockFiles.find(f => f.id === fileId);
    if (file) {
      file.name = newName;
      return true;
    }
    return false;
  },

  async getShareLink(fileId: string): Promise<string> {
    await delay(200);
    return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  },

  getFileIcon(mimeType: string): string {
    if (mimeType.includes('folder')) return '📁';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
    if (mimeType.includes('document') || mimeType.includes('word')) return '📄';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📽️';
    if (mimeType.includes('pdf')) return '📕';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('video')) return '🎬';
    if (mimeType.includes('audio')) return '🎵';
    if (mimeType.includes('zip') || mimeType.includes('archive')) return '🗜️';
    return '📎';
  },

  formatFileSize(bytes?: number): string {
    if (!bytes) return '-';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;
    let size = bytes;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  },

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};
