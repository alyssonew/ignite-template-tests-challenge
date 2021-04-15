import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate the user", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it("should be able to authenticate an user",async() =>{
    const user:ICreateUserDTO ={
      email: "user1@teste.com",
      password:"123456",
      name: "Teste"
    };
    await createUserUseCase.execute(user)

    const isAuhtenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(isAuhtenticated).toHaveProperty("token")
  })

  it("should not bt able to authenticate a non existent user", async() => {
    expect(async() =>{

      await authenticateUserUseCase.execute({
        email: "emailnaoexistente@teste.com",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("shoudl not be able to authenticate with an incorrect password", () =>{

    expect( async ()=> {
      const user:ICreateUserDTO={
        email:"wrong@teste.com",
        password: "12345",
        name: "Error test user"
      }

      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "1234567"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)

  })
})
