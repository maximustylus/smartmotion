import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { motus as handler } from './motus.js'

// Set the key once with: firebase functions:secrets:set ANTHROPIC_API_KEY
const ANTHROPIC_API_KEY = defineSecret('ANTHROPIC_API_KEY')

export const motus = onRequest(
  { region: 'asia-southeast1', secrets: [ANTHROPIC_API_KEY], timeoutSeconds: 120, memory: '512MiB', maxInstances: 5 },
  (req, res) => {
    process.env.ANTHROPIC_API_KEY ??= ANTHROPIC_API_KEY.value()
    return handler(req, res)
  },
)
