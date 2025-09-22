import { prisma } from '@/lib/db'
import { User } from '@insight-up/db'

export default async function TestDbPage() {
  try {
    const userCount = await prisma.user.count()

    const users = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })

    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            ✅ Database Connected Successfully!
          </h2>
          <p className="text-green-700">
            Prisma Client is working correctly with SQLite database.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Database Statistics</h3>
            <p className="text-gray-600">
              Total users in database: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{userCount}</span>
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Recent Users</h3>
            {users.length > 0 ? (
              <ul className="space-y-2">
                {users.map((user: User) => (
                  <li key={user.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{user.name || 'No name'}</span>
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No users found. Database is empty but working!</p>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            ❌ Database Connection Failed
          </h2>
          <p className="text-red-700 mb-3">
            There was an error connecting to the database:
          </p>
          <pre className="bg-red-100 p-3 rounded text-sm overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    )
  }
}