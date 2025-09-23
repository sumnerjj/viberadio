import express from 'express'
import cors from 'cors'

// Simple request logging middleware
const requestLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const timestamp = new Date().toISOString()
  const method = req.method
  const url = req.url
  const userAgent = req.get('User-Agent') || 'Unknown'

  console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`)

  // Log response when it finishes
  const originalSend = res.send
  res.send = function(body) {
    console.log(`[${timestamp}] ${method} ${url} - ${res.statusCode} - ${JSON.stringify(body).length} bytes`)
    return originalSend.call(this, body)
  }

  next()
}

export function createApp() {
  const app = express()

  // Middleware
  app.use(requestLogger)
  app.use(cors())
  app.use(express.json())

  // Routes
  app.get('/api/health', (_req, res) => {
    res.json({ message: 'Backend is running!' })
  })

  app.get('/api/hello', (_req, res) => {
    res.json({ message: 'Hello from Radio API!' })
  })

  return app
}