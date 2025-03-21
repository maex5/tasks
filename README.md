# Kids Task Tracker

A beautiful and interactive task tracking application for kids, built with React, TypeScript, and Firebase.

## Features

- 🎯 Individual task lists for each child
- 🌈 Custom gradient backgrounds for each child
- ✨ Interactive task completion with animations
- 🎉 Celebration effects when all tasks are completed
- 🔄 Automatic daily task reset
- 📱 Responsive design for all devices
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
│   └── tasks.ts        # Task definitions and gradients
├── hooks/              # Custom React hooks
│   ├── useFirebaseState.ts
│   └── useTaskReset.ts
├── services/           # External services
│   └── firebase.ts     # Firebase configuration
└── App.tsx             # Main application component
```

## Features Explanation

### Task Management
- Each child has their own set of daily tasks
- Tasks are represented by emojis for easy recognition
- Tasks turn pastel green when completed
- Progress is shown with animated emoji indicators (😭 → 😢 → 😐 → 🙂 → 😃 → 🤩)

### Visual Design
- Custom gradient backgrounds for each child:
  - Alex: Orange and Blue gradients
  - Cecci: Pink and Purple gradients
  - Vicka: Red and Yellow gradients
- Clean, minimalist interface with pure CSS (no UI framework)
- Smooth animations using Framer Motion

### Automatic Reset
- Tasks automatically reset daily
- Reset timing is based on Finnish timezone
- Reset occurs at midnight or after 24 hours

## Development

### Building
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Deployment

The application is automatically deployed to GitHub Pages using GitHub Actions. The deployment workflow:

1. Triggers on push to the main branch
2. Builds the application with the correct base path (/tasks/)
3. Deploys to GitHub Pages

To deploy manually:
```bash
npm run build
```
Then commit and push to the main branch. The GitHub Actions workflow will handle the deployment.

The application will be available at: `https://[your-username].github.io/tasks/`

## Firebase Structure

The application uses Firebase Realtime Database with the following structure:

```json
{
  "state": {
    "children": {
      "alex": {
        "id": "alex",
        "name": "Alex",
        "completedTasks": ["task1", "task2"]
      },
      "cecci": { ... },
      "vicka": { ... }
    },
    "taskSets": {
      "alex_tasks": {
        "tasks": {
          "task1": { "id": "task1", "name": "Task 1", "emoji": "🎮", "order": 1 },
          "task2": { "id": "task2", "name": "Task 2", "emoji": "📚", "order": 2 }
        }
      },
      "cecci_tasks": { ... },
      "vicka_tasks": { ... }
    },
    "lastReset": "ISO timestamp"
  }
}
```

## License

MIT 