import { Prisma, User } from '@prisma/client'
import { randomUUID } from 'crypto'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      created_at: new Date(),
      email: data.email,
      name: data.name,
      password_hash: data.password_hash,
    }

    this.users.push(user)

    return user
  }

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email)

    return user || null
  }

  async findById(userId: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === userId)

    return user || null
  }
}
