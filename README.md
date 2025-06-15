# WorshipBridge

A comprehensive system for remote ProPresenter control, consisting of three main components:

1. **Bridge (Local)**: An Electron-based tray app with a Node.js bridge server that connects to ProPresenter's WebSocket API
2. **Cloud Backend**: An Express.js server integrated with AWS services
3. **Web Dashboard**: A Next.js application for managing playlists and media

## Project Structure

```
worshipbridge/
├── bridge/           # Electron tray app and bridge server
├── cloud/           # Express.js backend with AWS integration
├── web/             # Next.js web dashboard
└── shared/          # Shared TypeScript types and utilities
```

## Prerequisites

- Node.js 18+
- npm or yarn
- AWS Account
- ProPresenter 7
- macOS (for local bridge)

## Development Setup

1. Install dependencies:
   ```bash
   # Install all dependencies (root and components)
   npm run install:all

   # Or install components individually
   npm run install:bridge
   npm run install:cloud
   npm run install:web
   npm run install:shared
   ```

2. Start development servers:
   ```bash
   # Start all components
   npm run dev

   # Or start components individually
   npm run dev:bridge
   npm run dev:cloud
   npm run dev:web
   ```

## Available Scripts

### Installation
- `npm run install:all` - Install all dependencies (root and components)
- `npm run install:components` - Install all component dependencies
- `npm run install:bridge` - Install bridge dependencies
- `npm run install:cloud` - Install cloud dependencies
- `npm run install:web` - Install web dependencies
- `npm run install:shared` - Install shared package dependencies

### Building
- `npm run build` - Build all components (shared package first)
- `npm run build:components` - Build all main components
- `npm run build:bridge` - Build bridge component
- `npm run build:cloud` - Build cloud component
- `npm run build:web` - Build web component
- `npm run build:shared` - Build shared package

### Development
- `npm run dev` - Start all components in development mode
- `npm run dev:bridge` - Start bridge in development mode
- `npm run dev:cloud` - Start cloud in development mode
- `npm run dev:web` - Start web in development mode

### Testing
- `npm run test` - Run tests for all components
- `npm run test:components` - Run tests for all main components
- `npm run test:bridge` - Run bridge tests
- `npm run test:cloud` - Run cloud tests
- `npm run test:web` - Run web tests
- `npm run test:shared` - Run shared package tests

### Linting
- `npm run lint` - Lint all components
- `npm run lint:components` - Lint all main components
- `npm run lint:bridge` - Lint bridge component
- `npm run lint:cloud` - Lint cloud component
- `npm run lint:web` - Lint web component
- `npm run lint:shared` - Lint shared package

### Cleaning
- `npm run clean` - Clean all components
- `npm run clean:components` - Clean all main components
- `npm run clean:bridge` - Clean bridge component
- `npm run clean:cloud` - Clean cloud component
- `npm run clean:web` - Clean web component
- `npm run clean:shared` - Clean shared package

### Maintenance
- `npm run reset` - Clean all components and node_modules, then reinstall everything

## Shared Package

The `shared` package contains common TypeScript interfaces, utilities, and constants used across all components. It is installed as a local dependency in each component.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Install dependencies using `npm run install:all`
4. Make your changes
5. Run tests using `npm run test`
6. Submit a pull request

## License

MIT 