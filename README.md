# Kids Tasks App

A playful task tracking app for kids, built with React, TypeScript, and PWA technologies.

## Features

- 🎨 Playful and colorful design
- 👶 Multiple child profiles
- 📱 Mobile-first PWA
- 🔄 Offline support
- 🌙 Automatic daily reset
- 🎯 Task completion tracking
- 😊 Emoji progress indicators

## Emoji States

The app uses different emojis to show progress:
- 😭 (0% - no tasks completed)
- 😢 (1-24% - just started)
- 😐 (25-49% - getting there)
- 🙂 (50-74% - doing well)
- 😃 (75-99% - almost done)
- 🤩 (100% - all tasks completed!)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5175 in your browser

## Building for Production

```bash
npm run build
```

## Customizing Tasks

To customize tasks for each child, edit the `defaultState` in `src/App.tsx`. The tasks are defined in the following format:

```typescript
tasks: {
  task_id: { 
    id: 'task_id', 
    name: 'Task Name', 
    emoji: '🎯' 
  },
  // ... more tasks
}
```

## Data Storage

The app uses localStorage to persist task completion state. To sync data across devices, you'll need to implement a backend service. Here are some options:

1. Firebase Realtime Database
2. Supabase
3. Custom backend with MongoDB/PostgreSQL

Would you like me to help you implement one of these solutions for cross-device sync?

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── TaskButton.tsx # Task toggle button with animation
│   ├── EmojiProgress.tsx # Emoji progress display
│   └── ChildPage.tsx  # Individual child's task page
├── types/             # TypeScript type definitions
│   └── index.ts      # Shared types
├── App.tsx           # Main application component
├── main.tsx          # Application entry point
└── index.css         # Global styles
```

## Data Structure

The app uses a JSON-based storage structure:

```json
{
  "tasks": {
    "make_bed": { "id": "make_bed", "name": "Make Bed", "emoji": "🛏️" },
    "take_dog_out": { "id": "take_dog_out", "name": "Take Dog Out", "emoji": "🐶" },
    "brush_teeth": { "id": "brush_teeth", "name": "Brush Teeth", "emoji": "🦷" },
    "do_homework": { "id": "do_homework", "name": "Do Homework", "emoji": "📚" }
  },
  "children": {
    "alex": { "id": "alex", "name": "Alex", "completedTasks": [] },
    "cecci": { "id": "cecci", "name": "Cecci", "completedTasks": [] },
    "vicka": { "id": "vicka", "name": "Vicka", "completedTasks": [] }
  }
}
```

## Emoji Progression

| Completed Tasks | Emoji |
|---------------|------|
| 0% | 😭 (Crying) |
| 25% | 😢 (Sad) |
| 50% | 😐 (Neutral) |
| 75% | 🙂 (Happy) |
| 100% | 😃 (Very Happy) |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 