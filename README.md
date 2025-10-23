# Laurelin Chat Frontend

A modern Angular 20.3.5 frontend application for the Laurelin chat system, featuring Google OAuth authentication, real-time chat functionality, and A/B testing capabilities.

## Features

- **Google OAuth Authentication**: Secure user authentication with Google Sign-In
- **Real-time Chat Interface**: Beautiful chat UI with message history
- **AI Model Integration**: Seamless integration with OpenAI GPT and Google Gemini models
- **A/B Testing Panel**: Built-in A/B testing interface for model comparison
- **Session Management**: Persistent chat sessions with Firestore backend
- **Responsive Design**: Modern, mobile-friendly interface
- **Error Handling**: Comprehensive error handling and user feedback

## Architecture

```
src/
├── app/
│   ├── components/              # UI Components
│   │   ├── laurelin-chat-component/    # Main chat container
│   │   ├── laurelin-chat-pane/         # Chat message display
│   │   ├── chat-submission-box/        # Message input
│   │   ├── chat-submit-button/         # Submit functionality
│   │   ├── laurelin-chat-entry/        # Individual messages
│   │   ├── laurelin-chat-startup/      # Startup animation
│   │   └── ab-testing-panel/           # A/B testing interface
│   ├── services/                # Business Logic
│   │   ├── api.service.ts       # Backend API communication
│   │   └── auth.service.ts      # Authentication management
│   ├── config/                  # Configuration
│   │   └── environment.ts       # Environment settings
│   └── app.ts                   # Main application component
├── index.html                   # Application entry point
└── main.ts                      # Bootstrap file
```

## Prerequisites

- Node.js 18+ and npm
- Angular CLI 20.3.5+
- Google Cloud Project with OAuth credentials
- Running Laurelin Chat Backend (Flask API)

## Setup and Installation

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/laurelin-inc/frontend-laurelin-chat.git
cd frontend-laurelin-chat
npm install
```

### 2. Configure Environment

Update `src/app/config/environment.ts` with your configuration:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api', // Your Flask backend URL
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID', // Your Google OAuth Client ID
  appName: 'Laurelin Chat',
  version: '1.0.0'
};
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:4200` to authorized origins
6. Copy the Client ID to your environment configuration

### 4. Backend Integration

Ensure your Flask backend is running and accessible at the configured `apiUrl`. The backend should have:

- User authentication endpoints
- Chat session management
- AI model integration
- A/B testing infrastructure

## Development

### Start Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload when you make changes.

### Build for Production

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests

```bash
# Unit tests
ng test

# End-to-end tests
ng e2e
```

## API Integration

The frontend communicates with the Flask backend through the `ApiService`:

### Authentication
- `POST /api/auth/login` - Google OAuth login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Chat Management
- `GET /api/chat/sessions` - Get user's chat sessions
- `POST /api/chat/sessions` - Create new chat session
- `POST /api/chat/sessions/{id}/messages` - Send message
- `DELETE /api/chat/sessions/{id}` - Delete session

### A/B Testing
- `GET /api/ab-testing/experiments` - Get experiments
- `POST /api/ab-testing/experiments/{name}/assign` - Assign user to variant
- `POST /api/ab-testing/experiments/{name}/track` - Track events
- `GET /api/ab-testing/experiments/{name}/results` - Get results

## Components Overview

### LaurelinChatComponent
Main container component that orchestrates the entire chat experience:
- Manages authentication state
- Handles chat session creation and management
- Integrates with backend API
- Provides error handling and loading states

### ChatSubmissionBox
Message input component with:
- Real-time text input
- Keyboard shortcuts (Ctrl+Enter to submit)
- Disabled state during API calls
- Auto-clear after submission

### AbTestingPanel
A/B testing interface featuring:
- User variant assignment display
- Experiment results visualization
- Event tracking capabilities
- Model comparison statistics

## Styling and Theming

The application uses a modern, clean design with:
- Responsive layout with sidebar for A/B testing
- Google Material Design inspired components
- Consistent color scheme and typography
- Mobile-friendly responsive design

## Error Handling

Comprehensive error handling includes:
- Network request failures
- Authentication errors
- API response errors
- User-friendly error messages
- Loading states and indicators

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📋 Issue Tracking with Beads

This project uses [Beads](https://github.com/steveyegge/beads) - a dependency-aware issue tracker designed for AI-assisted development workflows.

### Quick Setup

```bash
# Add Beads to your PATH
export PATH="$PATH:/Users/Joe/go/bin"

# Or use the setup script
source ./setup-beads.sh
```

### Current Project Status

- **Total Issues**: 8 (all open)
- **Main Epic**: Angular Frontend - Laurelin Chat Application
- **Ready Work**: 2 issues with no blockers

### Key Features Being Tracked

- Google OAuth authentication
- Real-time chat interface
- AI model integration
- A/B testing panel
- Session management
- Responsive design & styling

### Common Commands

```bash
bd list                    # View all issues
bd ready                   # Show work ready to start (no blockers)
bd create "New feature"    # Create new issue
bd update issue-1 --status in_progress  # Update issue
bd close issue-1 --reason "Completed"   # Close issue
```

### Documentation

- **Full Guide**: See [BEADS_USAGE.md](./BEADS_USAGE.md) for comprehensive documentation
- **Setup Script**: Run `./setup-beads.sh` for quick setup
- **Git Integration**: Issues automatically sync with git via JSONL files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

**Note**: This project uses Beads for issue tracking. Check `bd ready` to see available work and use `bd create` to track new features or bugs.

## Deployment

### Production Build

```bash
ng build --configuration production
```

### Environment Configuration

Update `src/app/config/environment.ts` for production:

```typescript
export const production = {
  production: true,
  apiUrl: 'https://your-backend-url.com/api',
  googleClientId: 'YOUR_PRODUCTION_GOOGLE_CLIENT_ID',
  appName: 'Laurelin Chat',
  version: '1.0.0'
};
```

### Static Hosting

The built application can be deployed to any static hosting service:
- Google Cloud Storage
- AWS S3
- Netlify
- Vercel
- GitHub Pages

## License

This project is part of the Laurelin chat application ecosystem.