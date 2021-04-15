import { AppError } from '../../../../shared/errors/AppError';
import { ICreateUserDTO } from './ICreateUserDTO';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from './CreateUserUseCase'

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase;

describe("Create a new user", ()=>{

  beforeEach(() => {
    inMemoryUsersRepository =new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)

  })

  it("should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      name: "Name test",
      email: "emailtest@test.com.br",
      password: "123456"
    }

   const createdUser = await createUserUseCase.execute(user)

    expect(createdUser).toHaveProperty("id")
  })

  it("should not be able to create a new user with an existent e-mail", () => {
    expect( async () => {

      await createUserUseCase.execute({
        name: "name test",
        email: "test_1@test.com",
        password: "12345"
      })

      await createUserUseCase.execute({
        name: "name test",
        email: "test_1@test.com",
        password: "12345"
      })

    }).rejects.toBeInstanceOf(AppError)
  })
})
