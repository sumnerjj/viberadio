import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('Failed to fetch from backend:', err))
  }, [])

  return (
    <>
      <div>
        <h1>Radio App</h1>
        <p>Frontend is running!</p>
        <p>Backend status: {message || 'Loading...'}</p>
      </div>
    </>
  )
}

export default App