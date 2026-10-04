#!/usr/bin/env node
/*
  The steward. It keeps an honest count of the effort that went into this
  project and writes it to site/src/content/effort.json, which the About
  section on the contact page reads.

  Two sources, both local, both read-only:
    1. git history: the first and last commit, and the commit count.
    2. the assistant's session logs for this repository, if they are on
       this machine: every logged event has a timestamp.

  Active time is the sum of the gaps between consecutive logged events,
  leaving out any gap longer than IDLE_MIN minutes, which is counted as a
  break. Nothing else is read from the logs: no message text is stored,
  only counts and durations.

  If the logs are not on this machine (a fresh clone, a build server), the
  figures that came from them are kept as last measured, and only the git
  figures are refreshed. Run it by hand with `node scripts/steward.mjs`;
  it also runs before every site build.
*/
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const IDLE_MIN = 10
const SITTING_GAP_MIN = 60
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'site/src/content/effort.json')
const prev = existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : {}

// ---------- git ----------
const git = (args) => execSync(`git ${args}`, { cwd: root, encoding: 'utf8' }).trim()
let commits = prev.commits ?? 0, firstCommit = prev.firstCommit ?? null, lastCommit = prev.lastCommit ?? null
try {
  const dates = git('log --format=%aI').split('\n').filter(Boolean)
  commits = dates.length
  lastCommit = dates[0]
  firstCommit = dates[dates.length - 1]
} catch {
  console.warn('[steward] git history not available; keeping the last measured figures')
}

// ---------- session logs ----------
const logDir = join(homedir(), '.claude/projects', root.replace(/[^a-zA-Z0-9]/g, '-'))
let active = prev.activeMinutes ?? null, prompts = prev.prompts ?? null, sittings = prev.sittings ?? null
let firstEvent = prev.firstEvent ?? null, lastEvent = prev.lastEvent ?? null, days = prev.days ?? []
let measured = false
if (existsSync(logDir)) {
  const stamps = []
  let asked = 0
  for (const f of readdirSync(logDir).filter((n) => n.endsWith('.jsonl'))) {
    for (const line of readFileSync(join(logDir, f), 'utf8').split('\n')) {
      if (!line) continue
      let o
      try { o = JSON.parse(line) } catch { continue }
      if (!o.timestamp) continue
      stamps.push(Date.parse(o.timestamp))
      // A prompt is a message the owner typed: plain text, not a tool
      // result, not a system or command record.
      const c = o.message?.content
      if (o.type === 'user' && !o.isSidechain && !o.isMeta && typeof c === 'string' && !c.trimStart().startsWith('<')) asked++
    }
  }
  if (stamps.length > 1) {
    stamps.sort((a, b) => a - b)
    let ms = 0, sits = 1
    const perDay = new Map()
    for (let i = 1; i < stamps.length; i++) {
      const gap = stamps[i] - stamps[i - 1]
      if (gap > SITTING_GAP_MIN * 60000) sits++
      if (gap > IDLE_MIN * 60000) continue
      ms += gap
      // Days are counted in Singapore time, where the work was done.
      const day = new Date(stamps[i] + 8 * 3600000).toISOString().slice(0, 10)
      perDay.set(day, (perDay.get(day) ?? 0) + gap)
    }
    active = Math.round(ms / 60000)
    prompts = asked
    sittings = sits
    firstEvent = new Date(stamps[0]).toISOString()
    lastEvent = new Date(stamps[stamps.length - 1]).toISOString()
    days = [...perDay].sort().map(([day, v]) => ({ day, minutes: Math.round(v / 60000) }))
    measured = true
  }
}
if (!measured) console.warn('[steward] session logs not found on this machine; keeping the last measured active time')

const start = firstEvent && firstCommit ? new Date(Math.min(Date.parse(firstEvent), Date.parse(firstCommit))).toISOString() : firstEvent ?? firstCommit
const end = lastEvent && lastCommit ? new Date(Math.max(Date.parse(lastEvent), Date.parse(lastCommit))).toISOString() : lastEvent ?? lastCommit
const effort = {
  activeMinutes: active,
  elapsedMinutes: start && end ? Math.round((Date.parse(end) - Date.parse(start)) / 60000) : null,
  start,
  end,
  sittings,
  prompts,
  commits,
  days,
  firstCommit,
  lastCommit,
  firstEvent,
  lastEvent,
  idleMinutes: IDLE_MIN,
  measuredAt: measured ? new Date().toISOString() : prev.measuredAt ?? null,
}
writeFileSync(out, JSON.stringify(effort, null, 2) + '\n')
const hm = (m) => (m == null ? 'unknown' : `${Math.floor(m / 60)} h ${m % 60} min`)
console.log(`[steward] active ${hm(effort.activeMinutes)} over ${hm(effort.elapsedMinutes)} elapsed, ${effort.sittings} sittings, ${effort.prompts} prompts, ${effort.commits} commits`)
