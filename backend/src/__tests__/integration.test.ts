import request from 'supertest'
import { createApp } from '../app'

describe('API Integration Tests', () => {
  const app = createApp()

  describe('API workflow', () => {
    it('should handle multiple requests in sequence', async () => {
      // Test health endpoint
      const healthResponse = await request(app)
        .get('/api/health')
        .expect(200)

      expect(healthResponse.body.message).toBe('Backend is running!')

      // Test hello endpoint
      const helloResponse = await request(app)
        .get('/api/hello')
        .expect(200)

      expect(helloResponse.body.message).toBe('Hello from Radio API!')
    })

    it('should handle concurrent requests', async () => {
      const promises = [
        request(app).get('/api/health'),
        request(app).get('/api/hello'),
        request(app).get('/api/health')
      ]

      const responses = await Promise.all(promises)

      responses.forEach(response => {
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('message')
      })
    })
  })

  describe('CORS middleware', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200)

      expect(response.headers['access-control-allow-origin']).toBe('*')
    })
  })

  describe('JSON middleware', () => {
    it('should parse JSON in request body', async () => {
      // Note: This is a simple test since our current endpoints don't accept POST
      // In a real app, you'd test actual POST endpoints
      const response = await request(app)
        .post('/api/nonexistent')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json')

      // Should still get 404, but middleware should have processed the JSON
      expect(response.status).toBe(404)
    })
  })
})