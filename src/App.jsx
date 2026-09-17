import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import Login from './components/Login'
import AppShell from './components/AppShell'

function App() {
  const [session, setSession] = useState(undefined) // undefined = still checking

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    // Never render truly empty here — see the comment on the static
    // placeholder in index.html for why (iOS standalone zoom bug).
    return <div style={{ height: '100%', width: '100%', background: '#ffffff' }} />
  }

  return session ? <AppShell session={session} /> : <Login />
}

export default App
