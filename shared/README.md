# WorshipBridge Shared Package

Common code, types, and utilities shared across WorshipBridge components.

## Features

- Common TypeScript interfaces and types
- Shared utility functions
- Application-wide constants
- Type-safe API responses

## Usage

Import from the shared package in any component:

```typescript
import { 
  User, 
  Playlist, 
  Command,
  formatFileSize,
  createApiResponse,
  COMMAND_TYPES,
  ERROR_CODES
} from '@worshipbridge/shared';
```

## Structure

```
shared/
├── src/
│   ├── types/        # TypeScript interfaces and types
│   ├── utils/        # Utility functions
│   ├── constants/    # Application constants
│   └── index.ts      # Main entry point
├── package.json
└── tsconfig.json
```

## Types

Common interfaces and types used across the application:

- `User`: User information
- `Playlist`: Playlist structure
- `Command`: Command processing
- `MediaFile`: Media file metadata
- `BridgeConfig`: Bridge configuration
- `UpdateInfo`: Update information
- `ApiResponse`: Standard API response format

## Utils

Shared utility functions:

- `createApiResponse`: Create standardized API responses
- `formatFileSize`: Format file sizes
- `generateId`: Generate unique IDs
- `retry`: Retry failed operations
- `debounce`: Debounce function calls
- `throttle`: Throttle function calls

## Constants

Application-wide constants:

- API versioning
- File size limits
- Command types
- Error codes
- User roles
- Platform-specific constants

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the package:
   ```bash
   npm run build
   ```

3. Run tests:
   ```bash
   npm run test
   ```

4. Run linting:
   ```bash
   npm run lint
   ```

## Contributing

When adding new shared code:

1. Place types in `src/types/`
2. Add utilities to `src/utils/`
3. Define constants in `src/constants/`
4. Export new items in `src/index.ts`
5. Add tests for new functionality
6. Update this documentation

## Best Practices

- Keep types and interfaces in the shared package
- Use type-safe utilities
- Follow consistent naming conventions
- Document all exported items
- Write tests for shared code
- Keep dependencies minimal 