import { InMemoryUsersrepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUseCase } from './register'

describe('Register Service', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersrepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.Execute({
      email: 'test@test.com',
      name: 'teste',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersrepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const password: string = 'teste123'

    const { user } = await registerUseCase.Execute({
      email: 'test@test.com',
      name: 'teste',
      password,
    })

    const isPasswordCorrectlyHashed = await compare(
      password,
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersrepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'teste@exaample.com'

    await registerUseCase.Execute({
      email,
      name: 'teste',
      password: '123456',
    })

    expect(() => {
      return registerUseCase.Execute({
        email,
        name: 'teste',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
