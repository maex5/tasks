# Kids Task Tracker

A beautiful and interactive task tracking application for kids, built with React, TypeScript, and Firebase.

## Features

- 🎯 Individual task lists for each child
- 🌈 Personalized color themes with animated gradients
- ✨ Interactive task completion with animations
- 🎉 Celebration effects when all tasks are completed
- 📱 Responsive design with iOS-optimized UI
- 🎮 Interactive 3D emoji that responds to device orientation
- 🔄 Automatic daily task reset
- 🌍 Time-zone aware (Finnish timezone)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_DATABASE_URL=your_database_url
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/          # React components
│   ├── ChildPage/      # Child page component
│   ├── TaskList/       # Task list component
│   └── EmojiProgress/  # Progress indicator component
├── config/             # Configuration files
│   └── tasks.ts        # Task definitions and default state
├── hooks/              # Custom React hooks
│   ├── useFirebaseState.ts
│   ├── useDeviceOrientation.ts
│   └── useTaskReset.ts
├── services/           # External services
│   └── firebase.ts     # Firebase configuration and service
├── types/              # TypeScript type definitions
│   └── index.ts
└── App.tsx             # Main application component
```

## Features Explanation

### Task Management
- Each child has their own set of daily tasks
- Tasks are represented by emojis for easy recognition
- Tasks have a modern glass-morphism design
- Tasks turn green when completed
- Progress is shown with an interactive 3D emoji

### Interactive Elements
- Background gradients animate smoothly
- 3D emoji tilts based on device orientation
- Smooth transitions and animations
- Proper iOS support for transparency and blur effects

### Automatic Reset
- Tasks automatically reset daily
- Reset timing is based on Finnish timezone
- Reset occurs at midnight or after 24 hours

### UI/UX
- Modern glass-morphism design
- Smooth animations and transitions
- Confetti celebration on task completion
- Custom animated gradient backgrounds for each child
- Easy navigation between children
- iOS-optimized interface

## Development

### Building
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## Firebase Structure

The application uses Firebase Realtime Database with the following structure:

```json
{
  "children": {
    "child_id": {
      "id": "string",
      "name": "string",
      "taskSetId": "string",
      "completedTasks": ["task_id"]
    }
  },
  "taskSets": {
    "set_id": {
      "id": "string",
      "name": "string",
      "tasks": {
        "task_id": {
          "id": "string",
          "name": "string",
          "emoji": "string",
          "order": number
        }
      }
    }
  }
}
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT 