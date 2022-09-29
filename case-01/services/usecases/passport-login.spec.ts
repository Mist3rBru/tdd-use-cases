import { User } from '../../domain/models/user-model'
import { IHashComparator } from '../protocols/adapters/hash-comparator'
import { ITokenGenerator } from '../protocols/adapters/token-generator'
import { IFindUserByEmailRepository } from '../protocols/database/find-user-by-email-repository.ts'
import { PassportLogin } from './passport-login'

class FindUserByEmailRepositorySpy implements IFindUserByEmailRepository {
  calledTimes = 0
  email: string
  user = {
    id: 'any-id',
    img: 'any-img',
    name: 'any-name',
    password: 'any-password',
  }

  async findByEmail(email: string): Promise<User> {
    this.email = email
    this.calledTimes++
    return this.user
  }
}

class HashComparatorSpy implements IHashComparator {
  calledTimes = 0
  data: string
  hash: string
  isValid = true

  async compare(data: string, hash: string): Promise<boolean> {
    this.data = data
    this.hash = hash
    this.calledTimes++
    return this.isValid
  }
}

class TokenGeneratorSpy implements ITokenGenerator {
  data: any
  calledTimes = 0
  token = 'any-token'

  async generate(data: any): Promise<string> {
    this.data = data
    this.calledTimes++
    return this.token
  }
}

describe('PassportLogin', () => {
  const params = {
    email: 'any@email.com',
    password: 'any-password',
  }

  it('should call FindUserByEmailRepository with email', async () => {
    const tokenGenerator = new TokenGeneratorSpy()
    const hashComparator = new HashComparatorSpy()
    const findUserByEmail = new FindUserByEmailRepositorySpy()
    const sut = new PassportLogin(
      findUserByEmail,
      hashComparator,
      tokenGenerator
    )

    await sut.auth(params)

    expect(findUserByEmail.calledTimes).toBe(1)
    expect(findUserByEmail.email).toBe(params.email)
  })

  it('should call PasswordHashComparator with correct values', async () => {
    const tokenGenerator = new TokenGeneratorSpy()
    const hashComparator = new HashComparatorSpy()
    const findUserByEmail = new FindUserByEmailRepositorySpy()
    const sut = new PassportLogin(
      findUserByEmail,
      hashComparator,
      tokenGenerator
    )

    await sut.auth(params)

    expect(hashComparator.calledTimes).toBe(1)
    expect(hashComparator.data).toBe(params.password)
    expect(hashComparator.hash).toBe(findUserByEmail.user.password)
  })

  it('should return null if no user is found', async () => {
    const tokenGenerator = new TokenGeneratorSpy()
    const hashComparator = new HashComparatorSpy()
    const findUserByEmail = new FindUserByEmailRepositorySpy()
    const sut = new PassportLogin(
      findUserByEmail,
      hashComparator,
      tokenGenerator
    )

    findUserByEmail.user = null
    const token = await sut.auth(params)

    expect(token).toBeNull()
  })

  it('should return null if password is invalid', async () => {
    const tokenGenerator = new TokenGeneratorSpy()
    const hashComparator = new HashComparatorSpy()
    const findUserByEmail = new FindUserByEmailRepositorySpy()
    const sut = new PassportLogin(
      findUserByEmail,
      hashComparator,
      tokenGenerator
    )

    hashComparator.isValid = false
    const token = await sut.auth(params)

    expect(token).toBeNull()
  })

  it('should call Encrypter with correct value', async () => {
    const tokenGenerator = new TokenGeneratorSpy()
    const hashComparator = new HashComparatorSpy()
    const findUserByEmail = new FindUserByEmailRepositorySpy()
    const sut = new PassportLogin(
      findUserByEmail,
      hashComparator,
      tokenGenerator
    )

    await sut.auth(params)

    expect(tokenGenerator.calledTimes).toBe(1)
    expect(tokenGenerator.data).toBe(findUserByEmail.user.id)
  })

  it('should return token and access list on success', async () => {
    const tokenGenerator = new TokenGeneratorSpy()
    const hashComparator = new HashComparatorSpy()
    const findUserByEmail = new FindUserByEmailRepositorySpy()
    const sut = new PassportLogin(
      findUserByEmail,
      hashComparator,
      tokenGenerator
    )

    const authModel = await sut.auth(params)

    expect(authModel).toEqual({
      token: tokenGenerator.token,
      user: {
        id: findUserByEmail.user.id,
        img: findUserByEmail.user.img,
        name: findUserByEmail.user.name,
      },
    })
  })

  it('should throw if any dependency throws', async () => {
    const tokenGenerator = new TokenGeneratorSpy()
    const hashComparator = new HashComparatorSpy()
    const findUserByEmail = new FindUserByEmailRepositorySpy()

    const suts = [].concat(
      new PassportLogin(
        {
          findByEmail() {
            throw new Error()
          },
        },
        hashComparator,
        tokenGenerator
      ),
      new PassportLogin(
        findUserByEmail,
        {
          compare() {
            throw new Error()
          },
        },
        tokenGenerator
      ),
      new PassportLogin(findUserByEmail, hashComparator, {
        generate() {
          throw new Error()
        },
      })
    )

    for (const sut of suts) {
      const promise = sut.auth(params)
      await expect(promise).rejects.toThrow()
    }
  })
})
