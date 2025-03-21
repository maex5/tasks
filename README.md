# Tasks App

A simple task tracking app for children, built with React and Firebase.

## Features

- 🌙 Daily task reset at midnight
- 👶 Multiple children support with individual task sets
- 🎨 Personalized background colors for each child
- 🔄 Real-time sync across devices using Firebase
- 🎯 Type-safe state management
- ✨ Animated emoji progress indicators

## Task Sets

Each child has their own personalized task set:

- **Alex**: Daily routine tasks (bed, teeth, homework, dog)
- **Vicka**: Home responsibilities (room, piano, reading, plants, fish)
- **Cecci**: Creative and care tasks (drawing, dancing, cooking, toys, cat)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

Create a `.env` file with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Technical Stack

- React + TypeScript
- Firebase Realtime Database
- Material-UI (MUI)
- Vite
- Framer Motion

## Emoji Progress States

Task completion is shown with different emojis:
- 😭 (0% - Not started)
- 😢 (1-24% - Just starting)
- 😐 (25-49% - Okay)
- 🙂 (50-74% - Good)
- 😃 (75-99% - Very good)
- 🤩 (100% - All done!)

## Project Structure

```
src/
├── components/        # UI components
├── config/           # Task configurations
├── hooks/            # Custom React hooks
├── services/         # Firebase service
├── types/           # TypeScript types
└── App.tsx          # Main app component
```

## Data Structure

The app uses Firebase Realtime Database with the following structure:

```typescript
interface AppState {
  taskSets: {
    [taskSetId: string]: {
      id: string;
      name: string;
      tasks: {
        [taskId: string]: {
          id: string;
          name: string;
          emoji: string;
          order: number;
        };
      };
    };
  };
  children: {
    [childId: string]: {
      id: string;
      name: string;
      taskSetId: string;
      completedTasks: string[];
      backgroundColor: string;
    };
  };
  lastReset: string | null;
}
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 