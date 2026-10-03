// Copy button for a cheatsheet beat. Works without the clipboard API by
// selecting the text so the person can copy it themselves.
export function mountSheet(sceneEl) {
  const box = sceneEl.querySelector('.sheet')
  if (!box) return {}
  const pre = box.querySelector('.sheet__text')
  const status = box.querySelector('.sheet__status')
  box.querySelector('[data-copy]')?.addEventListener('click', async () => {
    const text = pre?.textContent ?? ''
    try {
      await navigator.clipboard.writeText(text)
      status.textContent = 'Copied. Paste it into any assistant.'
    } catch {
      const range = document.createRange()
      range.selectNodeContents(pre)
      const sel = getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
      status.textContent = 'Selected. Press copy on your keyboard.'
    }
    setTimeout(() => (status.textContent = ''), 4000)
  })
  return {}
}
