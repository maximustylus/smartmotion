import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, increment, onSnapshot } from 'firebase/firestore'

/*
  Room totals in Firestore. One document, totals/room, holding only
  counters: level_1 to level_4, type_1 to type_4, submissions. Clients can
  only increment them; see firestore.rules at the repository root.

  No names, no device identifiers, no free text ever leave the device.
*/

// Public web config. It identifies the project; the rules are the security.
const config = {
  projectId: 'smartmotus',
  appId: '1:95054687332:web:aee881d80fb1d2c5b50371',
  apiKey: 'AIzaSyBvQM341XwKEbBmnX1PUlwF6M_MSn1JK40',
  authDomain: 'smartmotus.firebaseapp.com',
}

export const KEYS = ['level_1', 'level_2', 'level_3', 'level_4', 'type_1', 'type_2', 'type_3', 'type_4', 'submissions']

let db
function ref() {
  db ??= getFirestore(initializeApp(config))
  return doc(db, 'totals', 'room')
}

export function submit(level, type) {
  return setDoc(
    ref(),
    { [`level_${level}`]: increment(1), [`type_${type}`]: increment(1), submissions: increment(1) },
    { merge: true },
  )
}

// Calls back with a counters object on every change. If nothing arrives
// within the grace period, or Firestore refuses, onError fires once.
export function watchTotals(onChange, onError, { grace = 8000 } = {}) {
  let heard = false
  const timer = setTimeout(() => !heard && onError(new Error('No response from the room')), grace)
  const stop = onSnapshot(
    ref(),
    (snap) => {
      heard = true
      clearTimeout(timer)
      const data = snap.exists() ? snap.data() : {}
      onChange(Object.fromEntries(KEYS.map((k) => [k, Number(data[k]) || 0])))
    },
    (err) => {
      clearTimeout(timer)
      onError(err)
    },
  )
  return () => {
    clearTimeout(timer)
    stop()
  }
}
