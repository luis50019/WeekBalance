import { ExpensesRepository } from "./expenses.repository";

export class ExpensesService {
  constructor(private readonly repo = new ExpensesRepository()) {}

  createExpense(
    userId: string,
    dto: {
      monto: number;
      categoria: string;
      descripcion?: string;
    },
  ) {
    if (dto.monto <= 0) {
      throw new Error("Monto inválido");
    }

    return this.repo.create({
      user_id: userId,
      ...dto,
    });
  }
}
