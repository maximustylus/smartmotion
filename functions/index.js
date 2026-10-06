import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { motus as handler } from './motus.js'

// Set the key once with: firebase functions:secrets:set GEMINI_API_KEY
const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY')

export const motus = onRequest(
  { region: 'asia-southeast1', secrets: [GEMINI_API_KEY], timeoutSeconds: 120, memory: '512MiB', maxInstances: 5 },
  (req, res) => {
    process.env.GEMINI_API_KEY ??= GEMINI_API_KEY.value()
    return handler(req, res)
  },
)
