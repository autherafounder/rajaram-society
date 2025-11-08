# Admin System Setup Guide

## Installation

1. Install dependencies:
```bash
npm install
```

## Admin Login Credentials

**Default Credentials:**
- Email: `admin@rajaramsociety.com`
- Password: `admin123`

**⚠️ IMPORTANT:** Change the default password after first login!

## Generating Password Hash

To change the admin password, you need to generate a bcrypt hash:

```bash
node scripts/generate-admin-password.js your-new-password
```

Then update the `password` field in `data/admin.json` with the generated hash.

## Admin Panel Access

1. Navigate to `/admin/login`
2. Enter admin credentials
3. Access the admin dashboard at `/admin`

## Admin Features

- **Dashboard**: Overview with statistics
- **Profile**: Update admin profile information
- **Settings**: Change password and notification preferences
- **Documents**: Upload and manage documents for timeline items

## Document Upload

1. Go to `/admin/documents`
2. Select a timeline item from the dropdown
3. Enter document name
4. Upload file (PDF, DOC, DOCX only, max 10MB)
5. Document will appear in the timeline with upload date

## Timeline Integration

When admin uploads a document:
- It automatically appears in the corresponding timeline item
- Shows upload date formatted as "Uploaded on [Date]"
- Documents are sorted by upload date (newest first)
- Users can download documents from the timeline page

## Environment Variables

For production, set these environment variables:

```env
JWT_SECRET=your-secret-key-change-in-production
```

## File Structure

- `data/admin.json` - Admin credentials (hashed password)
- `data/documents.json` - Document metadata
- `public/uploads/` - Uploaded document files
- Admin pages: `/app/admin/*`
- Admin APIs: `/app/api/admin/*`

## Security Notes

- All admin routes are protected with JWT authentication
- Passwords are hashed using bcrypt
- File uploads are validated (type and size)
- Filenames are sanitized to prevent directory traversal

