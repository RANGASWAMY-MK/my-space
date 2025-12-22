# DriveSync - Google Drive File Manager

A production-ready web application for managing Google Drive files with a custom authentication system.

## Features

✅ **Secure Authentication** - Custom login with JWT-based session management
✅ **File Management** - View, upload, download, rename, and delete files
✅ **Folder Navigation** - Browse folder structure with breadcrumb navigation
✅ **Search** - Find files quickly with real-time search
✅ **File Preview** - Preview Google Docs, Sheets, Slides, images, and more
✅ **Sharing** - Generate shareable links for files
✅ **Responsive Design** - Works on desktop, tablet, and mobile devices
✅ **Star Files** - Mark important files for quick access
✅ **Storage Tracking** - Visual storage usage indicator

## Login Credentials

```
User ID: 23022-CM-032
Password: 23438-CM-069
```

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Authentication**: JWT-based session tokens

---

## Production Deployment Guide

### Prerequisites

1. Google Cloud Project with Drive API enabled
2. Service Account with Drive API permissions
3. Google Drive folder shared with Service Account
4. Vercel account (or any hosting platform)

### Step 1: Create Google Cloud Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google Drive API**
4. Go to **IAM & Admin** > **Service Accounts**
5. Create a new service account
6. Download the JSON key file
7. Share your Google Drive folder with the service account email

### Step 2: Prepare Environment Variables

Create these environment variables for production:

```env
# Service Account JSON (entire content as a string)
SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}

# Google Drive folder ID (from folder URL)
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here

# Application credentials
APP_USER_ID=23022-CM-032
APP_PASSWORD=23438-CM-069

# JWT secret for session tokens
JWT_SECRET=your_super_secure_random_string_here
```

### Step 3: Backend API Routes (Required for Production)

For a complete production deployment, you'll need backend API routes. Here's the structure for Next.js API routes or serverless functions:

#### `/api/auth/login.ts`
```typescript
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { userId, password } = req.body;
  
  if (userId === process.env.APP_USER_ID && password === process.env.APP_PASSWORD) {
    const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.json({ success: true, token });
  }
  
  return res.status(401).json({ success: false, error: 'Invalid credentials' });
}
```

#### `/api/drive/files.ts`
```typescript
import { google } from 'googleapis';

export default async function handler(req, res) {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.SERVICE_ACCOUNT_JSON),
    scopes: ['https://www.googleapis.com/auth/drive']
  });

  const drive = google.drive({ version: 'v3', auth });
  
  const response = await drive.files.list({
    q: `'${req.query.folderId || process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents`,
    fields: 'files(id, name, mimeType, size, modifiedTime, thumbnailLink, webViewLink)'
  });

  return res.json(response.data.files);
}
```

#### `/api/drive/upload.ts`
```typescript
import { google } from 'googleapis';
import formidable from 'formidable';

export default async function handler(req, res) {
  // Handle multipart file upload
  // Upload to Google Drive using Service Account
}
```

### Step 4: Vercel Deployment

#### Option A: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add SERVICE_ACCOUNT_JSON
vercel env add GOOGLE_DRIVE_FOLDER_ID
vercel env add APP_USER_ID
vercel env add APP_PASSWORD
vercel env add JWT_SECRET

# Deploy to production
vercel --prod
```

#### Option B: Deploy via GitHub

1. Push code to GitHub repository
2. Connect repository in Vercel dashboard
3. Add environment variables in Project Settings
4. Deploy

### Step 5: vercel.json Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

---

## Project Structure

```
src/
├── App.tsx                 # Main application component
├── main.tsx               # Entry point
├── index.css              # Global styles
├── types/
│   └── index.ts           # TypeScript interfaces
├── context/
│   └── AuthContext.tsx    # Authentication state management
├── services/
│   └── driveService.ts    # Google Drive API service
├── components/
│   ├── Login.tsx          # Login page
│   ├── Dashboard.tsx      # Main dashboard
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── Header.tsx         # Search and user menu
│   ├── FileGrid.tsx       # File listing (grid/list view)
│   ├── FilePreview.tsx    # File preview modal
│   ├── UploadModal.tsx    # File upload interface
│   ├── NewFolderModal.tsx # Create folder modal
│   ├── ShareModal.tsx     # Share link modal
│   └── Modal.tsx          # Reusable modal component
└── utils/
    └── cn.ts              # Class name utility
```

---

## Security Considerations

1. **Never expose Service Account credentials in frontend code**
2. **All Google Drive API calls must go through your backend**
3. **Validate JWT tokens on every API request**
4. **Use HTTPS in production**
5. **Set secure cookie flags for session tokens**
6. **Implement rate limiting on API endpoints**

---

## API Endpoints Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Authenticate user |
| `/api/auth/logout` | POST | End session |
| `/api/drive/files` | GET | List files in folder |
| `/api/drive/files/:id` | GET | Get file details |
| `/api/drive/upload` | POST | Upload file |
| `/api/drive/delete/:id` | DELETE | Delete file |
| `/api/drive/rename/:id` | PATCH | Rename file |
| `/api/drive/share/:id` | POST | Get share link |

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## License

MIT License - Feel free to use and modify for your projects.
