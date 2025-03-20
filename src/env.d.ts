/// <reference types="vite/client" />

/**
 * Type definitions for Vite environment variables.
 * These variables should be defined in the .env file.
 */
interface ImportMetaEnv {
  /** Firebase API Key */
  readonly VITE_FIREBASE_API_KEY: string
  /** Firebase Auth Domain */
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  /** Firebase Realtime Database URL */
  readonly VITE_FIREBASE_DATABASE_URL: string
  /** Firebase Project ID */
  readonly VITE_FIREBASE_PROJECT_ID: string
  /** Firebase Storage Bucket */
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  /** Firebase Messaging Sender ID */
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  /** Firebase App ID */
  readonly VITE_FIREBASE_APP_ID: string
  /** Firebase Measurement ID (optional) */
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string
}

/**
 * Vite's ImportMeta interface extension
 */
interface ImportMeta {
  readonly env: ImportMetaEnv
} 