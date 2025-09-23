import { useState, useEffect } from 'react'
import './App.css'
import { RadioTuner } from './components/RadioTuner'

function App() {
  const [message, setMessage] = useState<string>('')
  const [frequency, setFrequency] = useState<number>(800)

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('Failed to fetch from backend:', err))
  }, [])

  const handleFrequencyChange = (newFrequency: number) => {
    setFrequency(newFrequency)
    console.log(`Tuned to ${newFrequency} AM`)
  }

  return (
    <>
      <div>
        <h1>Radio App</h1>
        <p>Frontend is running!</p>
        <p>Backend status: {message || 'Loading...'}</p>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <RadioTuner
            frequency={frequency}
            onFrequencyChange={handleFrequencyChange}
          />
        </div>
      </div>
    </>
  )
}

export default App