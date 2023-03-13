import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async Execute({ email, name, password }: RegisterServiceRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.FindByEmail(email)

    if (userWithSameEmail) {
      throw new Error('Email already exist!')
    }

    await this.usersRepository.Create({
      name,
      email,
      password_hash,
    })
  }
}
