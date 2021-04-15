import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get balance", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
  });

  it("Should be able to get balance of user", async () => {
    const user = await usersRepository.create({
      email: "teste@email.com",
      name: "teste",
      password: "1234",
    });
    const { id } = user;

    if (!id) {
      throw new GetBalanceError();
    }

    await statementsRepository.create({
      user_id: id,
      description: "Casa",
      amount: 110,
      type: "deposit" as OperationType,
    });

    await statementsRepository.create({
      user_id: id,
      description: "Casa",
      amount: 100,
      type: "withdraw" as OperationType,
    });

    const balance = await getBalanceUseCase.execute({ user_id: id });

    expect(balance).toHaveProperty("balance");
  });

  it("Should not be able to get balance of a non exist user", () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "teste" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
