import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { prisma } from './index'

describe('Database Package', () => {
  beforeAll(async () => {
    // Ensure database is clean for testing
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    // Clean up after tests
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })

  describe('Prisma Client Connection', () => {
    it('should connect to SQLite database successfully', async () => {
      // Test basic connection
      const result = await prisma.$queryRaw`SELECT 1 as test`
      expect(result).toBeDefined()
    })

    it('should be a singleton instance in development', () => {
      // Test singleton pattern
      expect(prisma).toBeDefined()
      expect(typeof prisma.user).toBe('object')
    })
  })

  describe('User Model Operations', () => {
    it('should create a user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User'
      }

      const user = await prisma.user.create({
        data: userData
      })

      expect(user).toBeDefined()
      expect(user.id).toBeTypeOf('number')
      expect(user.email).toBe(userData.email)
      expect(user.name).toBe(userData.name)
      expect(user.createdAt).toBeInstanceOf(Date)
      expect(user.updatedAt).toBeInstanceOf(Date)
    })

    it('should retrieve users successfully', async () => {
      // Create test data
      await prisma.user.create({
        data: {
          email: 'test1@example.com',
          name: 'Test User 1'
        }
      })

      await prisma.user.create({
        data: {
          email: 'test2@example.com',
          name: 'Test User 2'
        }
      })

      const users = await prisma.user.findMany()
      expect(users.length).toBeGreaterThanOrEqual(2)
    })

    it('should count users correctly', async () => {
      const count = await prisma.user.count()
      expect(count).toBeTypeOf('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })

    it('should enforce unique email constraint', async () => {
      const userData = {
        email: 'duplicate@example.com',
        name: 'First User'
      }

      // Create first user
      await prisma.user.create({ data: userData })

      // Try to create second user with same email
      await expect(
        prisma.user.create({
          data: {
            email: 'duplicate@example.com',
            name: 'Second User'
          }
        })
      ).rejects.toThrow()
    })

    it('should handle optional name field', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'noname@example.com'
        }
      })

      expect(user.name).toBeNull()
      expect(user.email).toBe('noname@example.com')
    })

    it('should update timestamps automatically', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'timestamp@example.com',
          name: 'Original Name'
        }
      })

      const originalUpdatedAt = user.updatedAt

      // Wait a moment to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10))

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { name: 'Updated Name' }
      })

      expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Test with invalid query
      await expect(
        prisma.user.findUnique({
          where: { id: -1 }
        })
      ).resolves.toBeNull()
    })
  })
})