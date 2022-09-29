import { ILogin } from '../../domain/usecases/login'
import { IHashComparator } from '../protocols/adapters/hash-comparator'
import { ITokenGenerator } from '../protocols/adapters/token-generator'
import { IFindUserByEmailRepository } from '../protocols/database/find-user-by-email-repository.ts'

export class PassportLogin implements ILogin {
  constructor(
    private readonly findUserByEmailRepository: IFindUserByEmailRepository,
    private readonly hashComparator: IHashComparator,
    private readonly tokenGenerator: ITokenGenerator
  ) {}

  async auth(params: ILogin.Params): Promise<ILogin.Result> {
    const { email, password } = params
    const user = await this.findUserByEmailRepository.findByEmail(email)
    const isValid =
      user && (await this.hashComparator.compare(password, user.password))
    if (!isValid) return null
    const token = await this.tokenGenerator.generate(user.id)
    return {
      token,
      user: {
        id: user.id,
        img: user.img,
        name: user.name,
      },
    }
  }
}
