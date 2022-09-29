export interface ILogin {
  auth (params: ILogin.Params): Promise<ILogin.Result>
}

export namespace ILogin {
  export interface Params {
    email: string
    password: string
  }

  export interface Result {
    user: {
      id: string
      img: string
      name: string
    }
    token: string
  }
}