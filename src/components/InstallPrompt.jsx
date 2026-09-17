import { useEffect, useState } from 'react'
import { getDeferredPrompt, onInstallPromptAvailable } from '../lib/installPrompt'
import './InstallPrompt.css'

const DISMISS_KEY = 'installPromptDismissed'

function isIos() {
  const ua = window.navigator.userAgent
  // iPadOS Safari reports as a Mac in its user agent, but is touch-capable
  // where a real Mac isn't — the standard way to tell them apart.
  const isIpadOsInDesktopMode =
    navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return /iPad|iPhone|iPod/.test(ua) || isIpadOsInDesktopMode
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

// All of this is available synchronously the moment the component mounts
// (no network/timer involved), so it's computed once as lazy initial
// state rather than via an effect — only the *future* beforeinstallprompt
// event genuinely needs one, since that's the only truly async part.
function computeInitialState() {
  if (isStandalone() || localStorage.getItem(DISMISS_KEY) === 'true') {
    return { visible: false, platform: null, installEvent: null }
  }
  if (isIos()) {
    return { visible: true, platform: 'ios', installEvent: null }
  }
  const existing = getDeferredPrompt()
  if (existing) {
    return { visible: true, platform: 'android', installEvent: existing }
  }
  return { visible: false, platform: null, installEvent: null }
}

export default function InstallPrompt() {
  const [{ visible, platform, installEvent }, setState] = useState(computeInitialState)

  useEffect(() => {
    // Nothing to wait for if we're already showing (iOS), already
    // dismissed for good, or already standalone.
    if (isStandalone() || localStorage.getItem(DISMISS_KEY) === 'true' || isIos()) return
    return onInstallPromptAvailable((event) => {
      setState({ visible: true, platform: 'android', installEvent: event })
    })
  }, [])

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, 'true')
    setState((current) => ({ ...current, visible: false }))
  }

  async function handleInstallClick() {
    if (!installEvent) return
    installEvent.prompt()
    await installEvent.userChoice
    // The prompt can only be used once either way — dismiss for good
    // rather than leave a now-dead button behind.
    handleDismiss()
  }

  if (!visible) return null

  return (
    <div className="install-prompt-backdrop">
      <div className="install-prompt-modal">
        <button
          type="button"
          className="install-prompt-close"
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          ×
        </button>

        {platform === 'ios' ? (
          <p className="install-prompt-text">
            Install this app: tap <strong>Share</strong>, then <strong>More</strong> if
            you don't see it right away, then <strong>Add to Home Screen</strong>.
          </p>
        ) : (
          <p className="install-prompt-text">Install this app for quicker access.</p>
        )}

        {platform === 'android' ? (
          <button type="button" className="install-prompt-cta" onClick={handleInstallClick}>
            Install
          </button>
        ) : (
          <button type="button" className="install-prompt-cta" onClick={handleDismiss}>
            Got it
          </button>
        )}
      </div>
    </div>
  )
}
