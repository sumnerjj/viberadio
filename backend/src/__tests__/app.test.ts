import request from 'supertest'
import { createApp } from '../app'

describe('Radio API', () => {
  const app = createApp()

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200)

      expect(response.body).toEqual({
        message: 'Backend is running!'
      })
    })

    it('should return JSON content type', async () => {
      await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/)
    })
  })

  describe('GET /api/hello', () => {
    it('should return hello message', async () => {
      const response = await request(app)
        .get('/api/hello')
        .expect(200)

      expect(response.body).toEqual({
        message: 'Hello from Radio API!'
      })
    })
  })

  describe('404 handling', () => {
    it('should return 404 for unknown routes', async () => {
      await request(app)
        .get('/api/nonexistent')
        .expect(404)
    })
  })
})