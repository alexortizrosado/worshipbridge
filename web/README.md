# WorshipBridge Web Dashboard

The web dashboard for managing ProPresenter playlists and media remotely.

## Features

- Modern React-based UI
- Playlist management
- Media upload and management
- Real-time status monitoring
- Secure authentication

## Prerequisites

- Node.js 18+
- npm or yarn

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

The project uses:
- Next.js for the framework
- Tailwind CSS for styling
- React Query for data fetching
- AWS Amplify for authentication
- React Dropzone for file uploads

### Project Structure

```
web/
├── src/
│   ├── pages/          # Next.js pages
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   └── styles/        # Global styles
├── public/            # Static assets
└── package.json
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Features

### Playlist Management

- Create new playlists
- Add slides with templates
- Add media files
- Reorder items
- Save and trigger presentations

### Media Management

- Upload images and videos
- Preview media
- Delete media
- Organize by type

### Authentication

- Secure login with AWS Cognito
- Protected routes
- Token management

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to your hosting provider:
   ```bash
   # Configure your deployment method (e.g., Vercel, Netlify, etc.)
   ```

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_AUTH0_DOMAIN=your-auth0-domain
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-auth0-client-id
NEXT_PUBLIC_API_URL=your-api-url
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 