import { InMemoryUsersrepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate user use-case', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersrepository()
    const sut = new AuthenticateUseCase(usersRepository)

    const email = 'test@test.com'
    const password = '123456'

    await usersRepository.create({
      name: 'Teste',
      email,
      password_hash: await hash(password, 6),
    })

    const { user } = await sut.execute({
      email,
      password,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be able to authenticate with a wrong email', async () => {
    const usersRepository = new InMemoryUsersrepository()
    const sut = new AuthenticateUseCase(usersRepository)

    const email = 'test@test.com'
    const password = '123456'

    await expect(() => {
      return sut.execute({
        email,
        password,
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be able to authenticate with a wrong password', async () => {
    const usersRepository = new InMemoryUsersrepository()
    const sut = new AuthenticateUseCase(usersRepository)

    const email = 'test@test.com'
    const password = '123456'

    await usersRepository.create({
      name: 'Test',
      email,
      password_hash: await hash(password, 6),
    })

    await expect(() => {
      return sut.execute({
        email,
        password: 'WrongPassword',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
