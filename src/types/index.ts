export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  modifiedTime: string;
  createdTime: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  iconLink?: string;
  parents?: string[];
  shared?: boolean;
  starred?: boolean;
  owners?: { displayName: string; emailAddress: string }[];
}

export interface User {
  id: string;
  authenticated: boolean;
  token: string;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
}

export interface Folder {
  id: string;
  name: string;
  path: BreadcrumbItem[];
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
}

export interface SearchFilters {
  query: string;
  type: string;
  dateRange: string;
}
