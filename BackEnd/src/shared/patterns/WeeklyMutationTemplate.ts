import { SavingService } from "../../modules/savings/savings.service";

export interface WeekRange {
  weekStart: string;
  weekEnd: string;
}

export const getCurrentWeekRange = (): WeekRange => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToSunday = dayOfWeek;

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - diffToSunday);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return {
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
  };
};

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
