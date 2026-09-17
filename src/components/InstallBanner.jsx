import { useEffect, useState } from 'react'
import { getDeferredPrompt, onInstallPromptAvailable } from '../lib/installPrompt'
import './InstallBanner.css'

const DISMISS_KEY = 'installBannerDismissedAt'
const RESHOW_AFTER_MS = 7 * 24 * 60 * 60 * 1000

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

function wasRecentlyDismissed() {
  const dismissedAt = localStorage.getItem(DISMISS_KEY)
  if (!dismissedAt) return false
  return Date.now() - Number(dismissedAt) < RESHOW_AFTER_MS
}

// All of this is available synchronously the moment the component mounts
// (no network/timer involved), so it's computed once as lazy initial
// state rather than via an effect — only the *future* beforeinstallprompt
// event genuinely needs one, since that's the only truly async part.
function computeInitialState() {
  if (isStandalone() || wasRecentlyDismissed()) {
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

export default function InstallBanner() {
  const [{ visible, platform, installEvent }, setState] = useState(computeInitialState)

  useEffect(() => {
    // Nothing to wait for if we're already showing (iOS), already
    // dismissed this week, or already standalone.
    if (isStandalone() || wasRecentlyDismissed() || isIos()) return
    return onInstallPromptAvailable((event) => {
      setState({ visible: true, platform: 'android', installEvent: event })
    })
  }, [])

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
    setState((current) => ({ ...current, visible: false }))
  }

  async function handleInstallClick() {
    if (!installEvent) return
    installEvent.prompt()
    await installEvent.userChoice
    // The prompt can only be used once either way — hide the banner
    // rather than leave a now-dead button behind.
    setState((current) => ({ ...current, visible: false }))
  }

  if (!visible) return null

  return (
    <div className="install-banner">
      <button
        type="button"
        className="install-banner-close"
        onClick={handleDismiss}
        aria-label="Dismiss"
      >
        ×
      </button>

      {platform === 'ios' ? (
        <p className="install-banner-text">
          Install this app: tap <strong>Share</strong>, then <strong>More</strong> if
          you don't see it right away, then <strong>Add to Home Screen</strong>.
        </p>
      ) : (
        <>
          <p className="install-banner-text">Install this app for quicker access.</p>
          <button type="button" className="install-banner-cta" onClick={handleInstallClick}>
            Install
          </button>
        </>
      )}
    </div>
  )
}
