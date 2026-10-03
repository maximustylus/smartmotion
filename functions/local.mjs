// Local dev server for Motus: node local.mjs, with ANTHROPIC_API_KEY in the
// environment. The site's dev server proxies /api/motus here.
import { createServer } from 'node:http'
import { motus } from './motus.js'

const port = +(process.env.PORT || 8787)
createServer((req, res) => {
  res.status = (code) => ((res.statusCode = code), res)
  res.json = (obj) => (res.setHeader('Content-Type', 'application/json'), res.end(JSON.stringify(obj)))
  let data = ''
  req.on('data', (c) => (data += c))
  req.on('end', () => {
    req.body = data
    motus(req, res)
  })
}).listen(port, () => console.log(`Motus local brain on http://localhost:${port}`))
