import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showProfileUseCase: ShowUserProfileUseCase

describe("Show user", () =>  {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository)
    showProfileUseCase = new ShowUserProfileUseCase(usersRepository)
  })

  it("should be able to find an user by ID", async() => {
    const createdUser = await createUserUseCase.execute({
      email: "emailteste@test.com",
      name: "teste",
      password: "12345"
    })

    const { id } = createdUser;

    if (!id){
      throw new ShowUserProfileError()
    }

    const result = await showProfileUseCase.execute(id)

    expect(result).toHaveProperty("name")
  })
})
