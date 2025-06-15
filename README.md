# WorshipBridge

A secure system for remotely controlling ProPresenter 7 via a web dashboard.

## Project Structure

WorshipBridge is organized as a monorepo with the following components:

```
worshipbridge/
├── bridge/           # Local bridge application (Electron)
├── cloud/           # Cloud backend (Express.js)
├── web/             # Web dashboard (Next.js)
└── shared/          # Shared code and types
```

### Components

- **Bridge**: Electron-based tray application that connects to ProPresenter
- **Cloud**: Express.js backend with AWS integration
- **Web**: Next.js web dashboard for remote control
- **Shared**: Common code, types, and utilities

## Prerequisites

- Node.js 18+
- AWS Account
- ProPresenter 7
- macOS or Windows development environment

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/worshipbridge.git
   cd worshipbridge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Bridge
   cp bridge/.env.example bridge/.env
   
   # Cloud
   cp cloud/.env.example cloud/.env
   
   # Web
   cp web/.env.example web/.env
   ```

4. Start development servers:
   ```bash
   # Start all components
   npm run dev
   
   # Or start individual components
   npm run dev --workspace=bridge
   npm run dev --workspace=cloud
   npm run dev --workspace=web
   ```

## Building

Build all components:
```bash
npm run build
```

Or build individual components:
```bash
npm run build --workspace=bridge
npm run build --workspace=cloud
npm run build --workspace=web
```

## Testing

Run tests for all components:
```bash
npm run test
```

Or test individual components:
```bash
npm run test --workspace=bridge
npm run test --workspace=cloud
npm run test --workspace=web
```

## Shared Package

The `shared` package contains common code used across all components:

- **Types**: Common TypeScript interfaces and types
- **Utils**: Shared utility functions
- **Constants**: Application-wide constants

To use the shared package in a component:

```typescript
import { User, Playlist, formatFileSize } from '@worshipbridge/shared';
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Install dependencies: `npm install`
4. Make your changes
5. Run tests: `npm run test`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 