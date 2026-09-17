// Captured at module scope (not component state) so the event survives
// the Login -> AppShell transition — browsers only fire this once per
// page load, and losing the reference means losing the only chance to
// trigger the real install flow this session.
let deferredPrompt = null
const listeners = new Set()

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  deferredPrompt = event
  listeners.forEach((listener) => listener(event))
})

window.addEventListener('appinstalled', () => {
  deferredPrompt = null
})

export function getDeferredPrompt() {
  return deferredPrompt
}

export function onInstallPromptAvailable(callback) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}
