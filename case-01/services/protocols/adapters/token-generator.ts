export interface ITokenGenerator {
  generate (data: any): Promise<string>
}