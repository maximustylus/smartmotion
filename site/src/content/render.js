/*
  Turns stored copy into what goes on screen.

  Copy is kept as plain text with two kinds of marker:
    [[TODO: what the owner must still supply]]   shown as a TODO chip
    {{active}} {{elapsed}} {{commits}} {{prompts}} {{sittings}}
                                                  live figures kept by the
                                                  steward (scripts/steward.mjs)
  and one for outbound links, https only, each listed in references.md:
    [words on screen](https://...)                opens in a new tab
  Keeping the markers in the text, not as markup, means the same strings
  feed the page, Motus's knowledge base and anyone reading the file.
*/
import effort from './effort.json'

const hm = (m) => (m == null ? 'not yet measured' : `${Math.floor(m / 60)} h ${m % 60} min`)
const FIGURES = {
  active: hm(effort.activeMinutes),
  elapsed: hm(effort.elapsedMinutes),
  commits: String(effort.commits ?? 'many'),
  prompts: String(effort.prompts ?? 'many'),
  sittings: String(effort.sittings ?? 'several'),
}

const LINK = /\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g

export const todo = (text) => `<span class="todo">${text}</span>`

export function rich(text) {
  return String(text ?? '')
    .replace(/\[\[TODO:\s*([^\]]*?)\s*\]\]/g, (_, t) => todo(t))
    .replace(/\{\{(active|elapsed|commits|prompts|sittings)\}\}/g, (_, k) => FIGURES[k])
    .replace(LINK, (_, t, u) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`)
}

// The same text with markers flattened, for places that cannot hold markup.
export function plain(text) {
  return String(text ?? '')
    .replace(/\[\[TODO:\s*([^\]]*?)\s*\]\]/g, (_, t) => `(to be confirmed: ${t})`)
    .replace(/\{\{(active|elapsed|commits|prompts|sittings)\}\}/g, (_, k) => FIGURES[k])
    .replace(LINK, (_, t, u) => `${t} (${u})`)
}
