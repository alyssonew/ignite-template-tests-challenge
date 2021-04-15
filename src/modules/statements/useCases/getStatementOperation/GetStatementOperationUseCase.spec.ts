import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase

describe("Get statement operation",() => {

  beforeEach(() => {
    statementsRepository= new InMemoryStatementsRepository();
    usersRepository= new InMemoryUsersRepository();
    getStatementOperationUseCase= new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    )
  })

  it("shoudl be able to get a statement operation", async () =>{
    const user = await usersRepository.create({
      email: "test@test.com",
      name: "test",
      password: "1234"
    })

    if(!user.id){
      throw new GetStatementOperationError.UserNotFound()
    }

    const statement = await statementsRepository.create({
      user_id: user.id,
      description: "Teste",
      amount: 200,
      type: "deposit" as OperationType,
    })

    if(!statement.id){
      throw new GetStatementOperationError.StatementNotFound()
    }

    const statementOperation = await getStatementOperationUseCase.execute(
      {
        user_id: user.id,
        statement_id: statement.id
      }
    )

     expect(statementOperation).toHaveProperty("id")

  })

  it ("should not be able to get a statement operation if the user is wrong", () => {
    expect(async() => {
      const user = await usersRepository.create({
        email: "teste@teste.com",
        name: "test",
        password: "2345",
      })

      if (!user.id){
        throw new GetStatementOperationError.UserNotFound()
      }

      const statement = await statementsRepository.create({
        user_id: user.id,
        description: "Teste",
        amount: 200,
        type: "deposit" as OperationType,
      })

      if(!statement.id){
        throw new GetStatementOperationError.StatementNotFound()
      }

      await getStatementOperationUseCase.execute({
          user_id: "wrong_id",
          statement_id: statement.id
        })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
