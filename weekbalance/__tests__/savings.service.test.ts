import {
  getSavingHistoryService,
  createSavingService,
  createWeeklyGoalService,
  registerSavingService,
  getWeeklyGoalsService,
  getCurrentWeekGoalsService,
  deleteWeeklyGoalService,
} from "../src/balance/api/savings.service";
import {
  savingsRepository,
  weeklyGoalsRepository,
  incomeRepository,
  expenseRepository,
  SavingsRecord,
  WeeklyGoalRecord,
  IncomeRecord,
  ExpenseRecord,
} from "../src/core/database";
import { useAuthStore } from "../src/auth/store";

jest.mock("../src/core/database", () => ({
  savingsRepository: {
    create: jest.fn(),
    getByAccountId: jest.fn(),
  },
  weeklyGoalsRepository: {
    create: jest.fn(),
    getByAccountId: jest.fn(),
    getCurrentWeekGoals: jest.fn(),
    delete: jest.fn(),
  },
  incomeRepository: {
    getByAccountId: jest.fn(),
  },
  expenseRepository: {
    getByAccountId: jest.fn(),
  },
}));

jest.mock("../src/auth/store", () => ({
  useAuthStore: {
    getState: jest.fn(),
  },
}));

const mockSavingsRepository = savingsRepository as jest.Mocked<typeof savingsRepository>;
const mockWeeklyGoalsRepository = weeklyGoalsRepository as jest.Mocked<typeof weeklyGoalsRepository>;
const mockIncomeRepository = incomeRepository as jest.Mocked<typeof incomeRepository>;
const mockExpenseRepository = expenseRepository as jest.Mocked<typeof expenseRepository>;
const mockGetState = useAuthStore.getState as jest.MockedFunction<typeof useAuthStore.getState>;

describe("savings.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockAccount = {
    id: "account-123",
    user_id: "user-456",
    balance: 1000,
    created_at: "2024-01-01",
  };

  const mockSavingsRecord: SavingsRecord = {
    id: "savings-789",
    account_id: "account-123",
    amount: 200,
    description: "Ahorro semanal",
    created_at: "2024-01-15",
  };

  const mockGoalRecord: WeeklyGoalRecord = {
    id: "goal-123",
    account_id: "account-123",
    amount: 500,
    category: "ahorro",
    week_start: "2024-01-14",
    week_end: "2024-01-20",
    created_at: "2024-01-14",
  };

  const mockIncomeRecord: IncomeRecord = {
    id: "income-1",
    account_id: "account-123",
    amount: 3000,
    category: "trabajo",
    description: "Sueldo",
    source: "1",
    created_at: "2024-01-15",
  };

  const mockExpenseRecord: ExpenseRecord = {
    id: "expense-1",
    account_id: "account-123",
    amount: 1500,
    category: "comida",
    description: "Alimentos",
    created_at: "2024-01-15",
  };

  describe("getSavingHistoryService", () => {
    const accountId = "account-123";

    describe("casos exitosos", () => {
      it("should return all savings for an account", async () => {
        const mockSavings: SavingsRecord[] = [
          mockSavingsRecord,
          { ...mockSavingsRecord, id: "savings-2", amount: 100 },
        ];
        mockSavingsRepository.getByAccountId.mockResolvedValue(mockSavings);

        const result = await getSavingHistoryService(accountId);

        expect(result).toHaveLength(2);
        expect(mockSavingsRepository.getByAccountId).toHaveBeenCalledWith(accountId);
      });

      it("should return empty array when no savings exist", async () => {
        mockSavingsRepository.getByAccountId.mockResolvedValue([]);

        const result = await getSavingHistoryService(accountId);

        expect(result).toEqual([]);
      });
    });

    describe("casos de error", () => {
      it("should throw error when repository fails", async () => {
        mockSavingsRepository.getByAccountId.mockRejectedValue(new Error("Database error"));

        await expect(getSavingHistoryService(accountId)).rejects.toThrow("Database error");
      });
    });
  });

  describe("createSavingService", () => {
    describe("casos exitosos", () => {
      it("should create a saving correctly", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockSavingsRepository.create.mockResolvedValue(mockSavingsRecord);

        const result = await createSavingService(200, "Ahorro semanal");

        expect(mockSavingsRepository.create).toHaveBeenCalledWith({
          account_id: "account-123",
          amount: 200,
          description: "Ahorro semanal",
        });
        expect(result).toEqual(mockSavingsRecord);
      });

      it("should handle saving with amount 0", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockSavingsRepository.create.mockResolvedValue({
          ...mockSavingsRecord,
          amount: 0,
        });

        const result = await createSavingService(0, "Sin ahorro");

        expect(result.amount).toBe(0);
      });
    });

    describe("casos de error", () => {
      it("should throw error if no active session", async () => {
        mockGetState.mockReturnValue({ account: null });

        await expect(createSavingService(200, "Ahorro")).rejects.toThrow("No hay sesión activa");
        expect(mockSavingsRepository.create).not.toHaveBeenCalled();
      });

      it("should throw error when repository fails", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockSavingsRepository.create.mockRejectedValue(new Error("Database error"));

        await expect(createSavingService(200, "Ahorro")).rejects.toThrow("Database error");
      });
    });
  });

  describe("createWeeklyGoalService", () => {
    describe("casos exitosos", () => {
      it("should create a weekly goal correctly", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockWeeklyGoalsRepository.create.mockResolvedValue(mockGoalRecord);

        const result = await createWeeklyGoalService(500, "2024-01-14", "2024-01-20");

        expect(mockWeeklyGoalsRepository.create).toHaveBeenCalledWith({
          account_id: "account-123",
          amount: 500,
          category: "ahorro",
          week_start: "2024-01-14",
          week_end: "2024-01-20",
        });
        expect(result).toEqual(mockGoalRecord);
      });

      it("should set category to 'ahorro'", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockWeeklyGoalsRepository.create.mockResolvedValue(mockGoalRecord);

        await createWeeklyGoalService(100, "2024-01-21", "2024-01-27");

        expect(mockWeeklyGoalsRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({ category: "ahorro" })
        );
      });
    });

    describe("casos de error", () => {
      it("should throw error if no active session", async () => {
        mockGetState.mockReturnValue({ account: null });

        await expect(createWeeklyGoalService(500, "2024-01-14", "2024-01-20"))
          .rejects.toThrow("No hay sesión activa");
      });

      it("should throw error when repository fails", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockWeeklyGoalsRepository.create.mockRejectedValue(new Error("Database error"));

        await expect(createWeeklyGoalService(500, "2024-01-14", "2024-01-20"))
          .rejects.toThrow("Database error");
      });
    });
  });

  describe("registerSavingService", () => {
    describe("casos exitosos", () => {
      it("should create a saving with description", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockSavingsRepository.create.mockResolvedValue(mockSavingsRecord);

        const result = await registerSavingService(200, "Mi ahorro");

        expect(mockSavingsRepository.create).toHaveBeenCalledWith({
          account_id: "account-123",
          amount: 200,
          description: "Mi ahorro",
        });
        expect(result).toEqual(mockSavingsRecord);
      });

      it("should create a saving without description", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockSavingsRepository.create.mockResolvedValue({
          ...mockSavingsRecord,
          description: null,
        });

        const result = await registerSavingService(100);

        expect(mockSavingsRepository.create).toHaveBeenCalledWith({
          account_id: "account-123",
          amount: 100,
          description: undefined,
        });
      });
    });

    describe("casos de error", () => {
      it("should throw error if no active session", async () => {
        mockGetState.mockReturnValue({ account: null });

        await expect(registerSavingService(200)).rejects.toThrow("No hay sesión activa");
      });
    });
  });

  describe("getWeeklyGoalsService", () => {
    const accountId = "account-123";

    describe("casos exitosos", () => {
      it("should return all weekly goals for an account", async () => {
        const mockGoals: WeeklyGoalRecord[] = [mockGoalRecord];
        mockWeeklyGoalsRepository.getByAccountId.mockResolvedValue(mockGoals);

        const result = await getWeeklyGoalsService(accountId);

        expect(result).toHaveLength(1);
        expect(mockWeeklyGoalsRepository.getByAccountId).toHaveBeenCalledWith(accountId);
      });

      it("should return empty array when no goals exist", async () => {
        mockWeeklyGoalsRepository.getByAccountId.mockResolvedValue([]);

        const result = await getWeeklyGoalsService(accountId);

        expect(result).toEqual([]);
      });
    });

    describe("casos de error", () => {
      it("should throw error when repository fails", async () => {
        mockWeeklyGoalsRepository.getByAccountId.mockRejectedValue(new Error("Database error"));

        await expect(getWeeklyGoalsService(accountId)).rejects.toThrow("Database error");
      });
    });
  });

  describe("deleteWeeklyGoalService", () => {
    const goalId = "goal-123";

    describe("casos exitosos", () => {
      it("should delete a weekly goal", async () => {
        mockWeeklyGoalsRepository.delete.mockResolvedValue(undefined);

        await deleteWeeklyGoalService(goalId);

        expect(mockWeeklyGoalsRepository.delete).toHaveBeenCalledWith(goalId);
      });
    });

    describe("casos de error", () => {
      it("should throw error when repository fails", async () => {
        mockWeeklyGoalsRepository.delete.mockRejectedValue(new Error("Database error"));

        await expect(deleteWeeklyGoalService(goalId)).rejects.toThrow("Database error");
      });
    });
  });

  describe("helper functions - tested through exported functions", () => {
    it("should calculate week dates correctly in getCurrentWeekGoalsService", async () => {
      mockGetState.mockReturnValue({ account: mockAccount });
      mockWeeklyGoalsRepository.getCurrentWeekGoals.mockResolvedValue([]);
      mockIncomeRepository.getByAccountId.mockResolvedValue([]);
      mockExpenseRepository.getByAccountId.mockResolvedValue([]);

      const result = await getCurrentWeekGoalsService();

      expect(result.weekStart).toBeDefined();
      expect(result.weekEnd).toBeDefined();
      expect(result.weekStart < result.weekEnd).toBe(true);
    });
  });

  describe("getCurrentWeekGoalsService", () => {
    describe("casos exitosos", () => {
      it("should return weekly goals with progress", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockWeeklyGoalsRepository.getCurrentWeekGoals.mockResolvedValue([mockGoalRecord]);
        mockIncomeRepository.getByAccountId.mockResolvedValue([]);
        mockExpenseRepository.getByAccountId.mockResolvedValue([]);

        const result = await getCurrentWeekGoalsService();

        expect(result).toHaveProperty("weekStart");
        expect(result).toHaveProperty("weekEnd");
        expect(result).toHaveProperty("weekIncomes");
        expect(result).toHaveProperty("weekExpenses");
        expect(result).toHaveProperty("weeklySaving");
        expect(result).toHaveProperty("goals");
        expect(Array.isArray(result.goals)).toBe(true);
      });

      it("should calculate correct weekly saving when data is in current week", async () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diffToSunday = dayOfWeek;
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - diffToSunday);
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const todayISO = today.toISOString();

        mockGetState.mockReturnValue({ account: mockAccount });
        mockWeeklyGoalsRepository.getCurrentWeekGoals.mockResolvedValue([]);
        mockIncomeRepository.getByAccountId.mockResolvedValue([
          { ...mockIncomeRecord, created_at: todayISO },
        ]);
        mockExpenseRepository.getByAccountId.mockResolvedValue([
          { ...mockExpenseRecord, created_at: todayISO },
        ]);

        const result = await getCurrentWeekGoalsService();

        expect(result.weekIncomes).toBe(3000);
        expect(result.weekExpenses).toBe(1500);
        expect(result.weeklySaving).toBe(1500);
      });
    });

    describe("casos de error", () => {
      it("should throw error if no active session", async () => {
        mockGetState.mockReturnValue({ account: null });

        await expect(getCurrentWeekGoalsService()).rejects.toThrow("No hay sesión activa");
      });

      it("should throw error when weekly goals repository fails", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockWeeklyGoalsRepository.getCurrentWeekGoals.mockRejectedValue(new Error("Database error"));

        await expect(getCurrentWeekGoalsService()).rejects.toThrow("Database error");
      });

      it("should throw error when income repository fails", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockWeeklyGoalsRepository.getCurrentWeekGoals.mockResolvedValue([]);
        mockIncomeRepository.getByAccountId.mockRejectedValue(new Error("Database error"));

        await expect(getCurrentWeekGoalsService()).rejects.toThrow("Database error");
      });

      it("should throw error when expense repository fails", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockWeeklyGoalsRepository.getCurrentWeekGoals.mockResolvedValue([]);
        mockIncomeRepository.getByAccountId.mockResolvedValue([]);
        mockExpenseRepository.getByAccountId.mockRejectedValue(new Error("Database error"));

        await expect(getCurrentWeekGoalsService()).rejects.toThrow("Database error");
      });
    });

    describe("casos limite", () => {
      it("should handle no incomes and no expenses", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockWeeklyGoalsRepository.getCurrentWeekGoals.mockResolvedValue([]);
        mockIncomeRepository.getByAccountId.mockResolvedValue([]);
        mockExpenseRepository.getByAccountId.mockResolvedValue([]);

        const result = await getCurrentWeekGoalsService();

        expect(result.weekIncomes).toBe(0);
        expect(result.weekExpenses).toBe(0);
        expect(result.weeklySaving).toBe(0);
      });

      it("should handle negative weekly saving", async () => {
        const today = new Date();
        const todayISO = today.toISOString();

        mockGetState.mockReturnValue({ account: mockAccount });
        mockWeeklyGoalsRepository.getCurrentWeekGoals.mockResolvedValue([]);
        mockIncomeRepository.getByAccountId.mockResolvedValue([
          { ...mockIncomeRecord, amount: 100, created_at: todayISO },
        ]);
        mockExpenseRepository.getByAccountId.mockResolvedValue([
          { ...mockExpenseRecord, amount: 500, created_at: todayISO },
        ]);

        const result = await getCurrentWeekGoalsService();

        expect(result.weeklySaving).toBe(0);
      });

      it("should calculate correct progress percentage when in current week", async () => {
        const today = new Date();
        const todayISO = today.toISOString();

        mockGetState.mockReturnValue({ account: mockAccount });
        mockWeeklyGoalsRepository.getCurrentWeekGoals.mockResolvedValue([
          { ...mockGoalRecord, amount: 1000 },
        ]);
        mockIncomeRepository.getByAccountId.mockResolvedValue([
          { ...mockIncomeRecord, amount: 2000, created_at: todayISO },
        ]);
        mockExpenseRepository.getByAccountId.mockResolvedValue([
          { ...mockExpenseRecord, amount: 1000, created_at: todayISO },
        ]);

        const result = await getCurrentWeekGoalsService();

        expect(result.goals[0].progress).toBe(100);
        expect(result.goals[0].remaining).toBe(0);
      });

      it("should cap progress at 100% when exceeding goal", async () => {
        const today = new Date();
        const todayISO = today.toISOString();

        mockGetState.mockReturnValue({ account: mockAccount });
        mockWeeklyGoalsRepository.getCurrentWeekGoals.mockResolvedValue([
          { ...mockGoalRecord, amount: 500 },
        ]);
        mockIncomeRepository.getByAccountId.mockResolvedValue([
          { ...mockIncomeRecord, amount: 3000, created_at: todayISO },
        ]);
        mockExpenseRepository.getByAccountId.mockResolvedValue([
          { ...mockExpenseRecord, amount: 1000, created_at: todayISO },
        ]);

        const result = await getCurrentWeekGoalsService();

        expect(result.goals[0].progress).toBe(100);
      });
    });
  });
});
