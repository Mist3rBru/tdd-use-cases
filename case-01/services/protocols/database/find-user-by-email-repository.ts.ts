import { User } from "../../../domain/models/user-model";

export interface IFindUserByEmailRepository {
  findByEmail (email: string): Promise<User>
}
