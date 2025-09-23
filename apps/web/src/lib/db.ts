// import { prisma } from '@insight-up/db'

// export { prisma }

// Placeholder for when workspace is properly configured
interface MockPrisma {
  user: {
    count: () => Promise<number>;
    findMany: () => Promise<Array<{ id: string; name?: string; email: string }>>;
  };
}

export const prisma: MockPrisma = {
  user: {
    count: () => Promise.resolve(0),
    findMany: () => Promise.resolve([])
  }
};