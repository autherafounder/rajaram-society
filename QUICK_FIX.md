# Quick Fix for Admin Internal Server Error

## Immediate Steps

1. **Install Missing Dependencies** (CRITICAL):
   ```bash
   npm install bcryptjs jsonwebtoken formidable
   npm install --save-dev @types/bcryptjs @types/jsonwebtoken @types/formidable
   ```

2. **Restart Development Server**:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

3. **Verify Password Hash**:
   The password hash in `data/admin.json` should be a bcrypt hash.
   Default password is: `admin123`
   
   To verify or regenerate:
   ```bash
   node scripts/generate-admin-password.js admin123
   ```

4. **Check Server Console**:
   Look for specific error messages when accessing `/admin` after login.
   Common errors:
   - "Cannot find module 'bcryptjs'" → Packages not installed
   - "Admin configuration not found" → `data/admin.json` missing or invalid
   - "JWT verification error" → Token/cookie issue

## Verification Checklist

- [ ] `npm list bcryptjs` shows version
- [ ] `npm list jsonwebtoken` shows version
- [ ] `data/admin.json` exists and has valid JSON
- [ ] `data/documents.json` exists (can be empty array)
- [ ] `public/uploads/` directory exists
- [ ] Server restarted after installing packages

