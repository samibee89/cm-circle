import { useState } from 'react'
import './ZoomTip.css'

const DISMISS_KEY = 'zoomTipDismissed'

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

// Synchronous and available immediately on mount, so this is computed
// once as lazy initial state rather than via an effect.
function computeInitialVisible() {
  if (!isStandalone()) return false
  return localStorage.getItem(DISMISS_KEY) !== 'true'
}

export default function ZoomTip() {
  const [visible, setVisible] = useState(computeInitialVisible)

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="zoom-tip">
      <p className="zoom-tip-text">
        Looking too zoomed in? Pinch with two fingers to zoom out slightly — it'll stay
        that way after.
      </p>
      <button type="button" className="zoom-tip-dismiss" onClick={handleDismiss}>
        Got it
      </button>
    </div>
  )
}
