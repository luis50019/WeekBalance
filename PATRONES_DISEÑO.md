# Patrones de Diseno

## Frontend - Strategy

**Archivos tocados**
- `weekbalance/src/core/patterns/expenses/ExpenseTransformationStrategy.ts`
- `weekbalance/src/core/patterns/expenses/CategoryExpenseStrategy.ts`
- `weekbalance/src/core/patterns/expenses/DailyExpenseStrategy.ts`
- `weekbalance/src/core/patterns/expenses/ExpenseTransformationContext.ts`
- `weekbalance/src/core/patterns/expenses/types.ts`
- `weekbalance/src/core/context/BalanceProvider.tsx`

**Codigo nuevo clave**

```ts
// weekbalance/src/core/patterns/expenses/ExpenseTransformationStrategy.ts
export interface ExpenseTransformationStrategy<TResult> {
  transform(): TResult[];
}

// weekbalance/src/core/patterns/expenses/CategoryExpenseStrategy.ts
export class CategoryExpenseStrategy implements ExpenseTransformationStrategy<CategoryExpenseAnalysis> {
  constructor(
    private readonly categories: ExpenseByCategoryWeekly[],
    private readonly colorMap: Record<string, string>,
  ) {}

  transform(): CategoryExpenseAnalysis[] {
    return this.categories.map((category) => ({
      value: category.percentage,
      color: this.colorMap[category.category] || "#888888",
      text: category.category,
    }));
  }
}

// weekbalance/src/core/context/BalanceProvider.tsx (fragmento)
const categoryContext = new ExpenseTransformationContext<CategoryExpenseAnalysis>(
  new CategoryExpenseStrategy(weeklyData.expensesByCategory || [], COLORSGRAPIC),
);
const expenseAnalysis = categoryContext.execute();

const dailyContext = new ExpenseTransformationContext<DailyExpenseAnalysis>(
  new DailyExpenseStrategy(weeklyData.expensesByDay || []),
);
const dailyExpenseAnalysis = dailyContext.execute();
```

**Para que sirve el patron**
- Strategy permite encapsular distintas transformaciones de los datos semanales; `BalanceProvider` solo conoce al contexto y puede intercambiar estrategias sin tocar el componente. Esto sigue exactamente el patron Strategy de Refactoring Guru.

## Backend - Template Method

**Archivos tocados**
- `BackEnd/src/shared/patterns/WeeklyMutationTemplate.ts`
- `BackEnd/src/modules/expenses/patterns/CreateExpenseWorkflow.ts`
- `BackEnd/src/modules/incomes/patterns/CreateIncomeWorkflow.ts`
- `BackEnd/src/modules/expenses/expense.service.ts`
- `BackEnd/src/modules/incomes/incomes.service.ts`

**Codigo nuevo clave**

```ts
// BackEnd/src/shared/patterns/WeeklyMutationTemplate.ts
export abstract class WeeklyMutationTemplate<TPayload> {
  protected constructor(private readonly savingService: SavingService) {}

  async execute(payload: TPayload): Promise<void> {
    this.validate(payload);
    await this.persist(payload);
    const accountId = this.extractAccountId(payload);
    const { weekStart, weekEnd } = getCurrentWeekRange();
    await this.afterPersist(accountId, weekStart, weekEnd);
  }

  protected abstract validate(payload: TPayload): void;
  protected abstract persist(payload: TPayload): Promise<void>;
  protected abstract extractAccountId(payload: TPayload): string;

  protected async afterPersist(accountId: string, weekStart: string, weekEnd: string): Promise<void> {
    await this.savingService.recalculateWeeklyGoal(accountId, weekStart, weekEnd);
  }
}

// BackEnd/src/modules/expenses/patterns/CreateExpenseWorkflow.ts
export class CreateExpenseWorkflow extends WeeklyMutationTemplate<CreateExpenseDto> {
  constructor(
    private readonly repo: ExpensesRepository,
    savingService: SavingService,
  ) {
    super(savingService);
  }

  protected validate(payload: CreateExpenseDto): void {
    if (payload.amount <= 0) {
      throw new Error("Monto invalido");
    }
  }

  protected async persist(payload: CreateExpenseDto): Promise<void> {
    await this.repo.create({ ...payload });
  }

  protected extractAccountId(payload: CreateExpenseDto): string {
    return payload.account_id;
  }
}

// BackEnd/src/modules/expenses/expense.service.ts (fragmento)
constructor(
  private readonly repo = new ExpensesRepository(),
  private readonly savingService = new SavingService(),
  private readonly createWorkflow = new CreateExpenseWorkflow(repo, savingService),
) {}

async createExpense(dto: CreateExpenseDto) {
  await this.createWorkflow.execute(dto);
}
```

**Para que sirve el patron**
- Template Method define el esqueleto comun para mutaciones semanales (validar, persistir, recalcular ahorro) y delega pasos especificos en clases concretas. Las clases de ingresos y gastos solo completan los huecos, siguiendo el Template Method que explica Refactoring Guru.
