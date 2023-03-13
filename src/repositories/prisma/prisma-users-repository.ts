import { prisma } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async FindByEmail(email: string): Promise<User | null> {
    const user = prisma.user.findUnique({
      where: {
        email,
      },
    })
    return user
  }

  async Create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
