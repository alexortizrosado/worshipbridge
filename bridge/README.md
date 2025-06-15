# WorshipBridge Bridge

The local bridge application for WorshipBridge, providing a secure connection between ProPresenter and the cloud backend.

## Features

- Electron-based tray application
- Secure WebSocket connection to ProPresenter
- Auto-updates
- Settings management
- System tray integration

## Development

### Prerequisites

- Node.js 18+
- macOS or Windows development environment
- Code signing certificates (for production builds)

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```env
   # Development
   NODE_ENV=development
   
   # Code Signing (Production)
   MACOS_CERTIFICATE_ID=your-certificate-id
   WINDOWS_CERTIFICATE_FILE=path/to/certificate.pfx
   WINDOWS_CERTIFICATE_PASSWORD=your-certificate-password
   
   # Update Server
   UPDATE_SERVER_URL=https://your-update-server.com
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=worshipbridge-updates
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Building

### Development Build

```bash
# Build for current platform
npm run build

# Build for macOS
npm run build:mac

# Build for Windows
npm run build:win
```

### Production Build

1. Ensure you have the necessary code signing certificates:
   - macOS: Developer ID Application certificate
   - Windows: Code signing certificate (.pfx file)

2. Set up environment variables for code signing:
   ```bash
   # macOS
   export MACOS_CERTIFICATE_ID="Developer ID Application: Your Name (TEAM_ID)"
   
   # Windows
   export WINDOWS_CERTIFICATE_FILE="/path/to/certificate.pfx"
   export WINDOWS_CERTIFICATE_PASSWORD="your-password"
   ```

3. Build and upload:
   ```bash
   npm run build:upload
   ```

This will:
- Build the application
- Sign the binaries
- Upload to the update server
- Update version information

## Distribution

### macOS

1. Build the application:
   ```bash
   npm run build:mac
   ```

2. The following files will be created in the `release` directory:
   - `WorshipBridge Bridge-1.0.0.dmg` - Installer
   - `WorshipBridge Bridge-1.0.0-mac.zip` - Archive

3. Notarize the application (required for macOS):
   ```bash
   xcrun notarytool submit "release/WorshipBridge Bridge-1.0.0.dmg" \
     --apple-id "your@email.com" \
     --password "app-specific-password" \
     --team-id "TEAM_ID"
   ```

### Windows

1. Build the application:
   ```bash
   npm run build:win
   ```

2. The following files will be created in the `release` directory:
   - `WorshipBridge Bridge Setup 1.0.0.exe` - Installer

## Auto-Updates

The application supports automatic updates through the cloud backend. Updates are distributed through S3 and served via the cloud API.

### Update Process

1. Build and upload a new version:
   ```bash
   npm run build:upload
   ```

2. The script will:
   - Build the application
   - Sign the binaries
   - Upload to S3
   - Update version information

3. Users will be notified of updates through the application

### Update Server Structure

```
updates/
├── darwin/
│   ├── latest.json
│   ├── WorshipBridge Bridge-1.0.0.dmg
│   └── WorshipBridge Bridge-1.0.0-mac.zip
└── win32/
    ├── latest.json
    └── WorshipBridge Bridge Setup 1.0.0.exe
```

## Security

- All binaries are code signed
- Updates are verified using SHA512 checksums
- Communication is encrypted
- Settings are stored securely

## Troubleshooting

### Common Issues

1. **Code Signing Errors**
   - Verify certificate validity
   - Check certificate permissions
   - Ensure environment variables are set correctly

2. **Build Errors**
   - Clear the `release` directory
   - Ensure all dependencies are installed
   - Check TypeScript compilation

3. **Update Issues**
   - Verify S3 bucket permissions
   - Check update server configuration
   - Verify version information format

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 