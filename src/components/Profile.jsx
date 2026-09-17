import { getInitials } from '../lib/initials'
import './Profile.css'

export default function Profile({ displayName, onSignOut, onClose }) {
  return (
    <div className="profile-screen">
      <div className="profile-header">
        <div>
          <p className="profile-label">Account</p>
          <h1 className="profile-heading gradient-text">Profile</h1>
        </div>
        <button type="button" className="profile-close" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="profile-card">
        <div className="profile-avatar-large">{getInitials(displayName)}</div>
        <p className="profile-display-name">{displayName}</p>
      </div>

      <button type="button" className="profile-signout" onClick={onSignOut}>
        Sign out
      </button>
    </div>
  )
}
