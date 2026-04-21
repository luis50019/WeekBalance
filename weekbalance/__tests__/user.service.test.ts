import {
  getFinancialSummary,
} from "../src/balance/api/user.service";
import {
  incomeRepository,
  expenseRepository,
  IncomeRecord,
  ExpenseRecord,
} from "../src/core/database";
import { useAuthStore } from "../src/auth/store";

jest.mock("../src/core/database", () => ({
  incomeRepository: {
    getByAccountId: jest.fn(),
  },
  expenseRepository: {
    getByAccountId: jest.fn(),
    getTotalByCategory: jest.fn(),
  },
}));

jest.mock("../src/auth/store", () => ({
  useAuthStore: {
    getState: jest.fn(),
  },
}));

const mockIncomeRepository = incomeRepository as jest.Mocked<typeof incomeRepository>;
const mockExpenseRepository = expenseRepository as jest.Mocked<typeof expenseRepository>;
const mockGetState = useAuthStore.getState as jest.MockedFunction<typeof useAuthStore.getState>;

describe("user.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockAccount = {
    id: "account-123",
    user_id: "user-456",
    balance: 1000,
    created_at: "2024-01-01",
  };

  const mockProfile = {
    id: "profile-123",
    user_id: "user-456",
    full_name: "Test User",
    avatar_url: null,
    created_at: "2024-01-01",
  };

  const mockIncomeRecord: IncomeRecord = {
    id: "income-1",
    account_id: "account-123",
    amount: 5000,
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

  describe("getFinancialSummary", () => {
    describe("casos exitosos", () => {
      it("should return complete financial summary", async () => {
        mockGetState.mockReturnValue({ account: mockAccount, profile: mockProfile });
        mockIncomeRepository.getByAccountId.mockResolvedValue([mockIncomeRecord]);
        mockExpenseRepository.getByAccountId.mockResolvedValue([mockExpenseRecord]);
        mockExpenseRepository.getTotalByCategory.mockResolvedValue([
          { category: "comida", total: 1500 },
        ]);

        const result = await getFinancialSummary();

        expect(result).toHaveProperty("balance");
        expect(result).toHaveProperty("totalIncome");
        expect(result).toHaveProperty("totalExpense");
        expect(result).toHaveProperty("recentIncomes");
        expect(result).toHaveProperty("recentExpenses");
        expect(result).toHaveProperty("expensesByCategory");
      });

      it("should calculate correct balance", async () => {
        mockGetState.mockReturnValue({ account: mockAccount, profile: mockProfile });
        mockIncomeRepository.getByAccountId.mockResolvedValue([
          mockIncomeRecord,
          { ...mockIncomeRecord, id: "income-2", amount: 1000 },
        ]);
        mockExpenseRepository.getByAccountId.mockResolvedValue([mockExpenseRecord]);
        mockExpenseRepository.getTotalByCategory.mockResolvedValue([
          { category: "comida", total: 1500 },
        ]);

        const result = await getFinancialSummary();

        expect(result.totalIncome).toBe(6000);
        expect(result.totalExpense).toBe(1500);
        expect(result.balance.balance).toBe(4500);
      });

      it("should return recent incomes (max 5)", async () => {
        mockGetState.mockReturnValue({ account: mockAccount, profile: mockProfile });
        const manyIncomes: IncomeRecord[] = Array.from({ length: 10 }, (_, i) => ({
          ...mockIncomeRecord,
          id: `income-${i}`,
          amount: 100 * (i + 1),
        }));
        mockIncomeRepository.getByAccountId.mockResolvedValue(manyIncomes);
        mockExpenseRepository.getByAccountId.mockResolvedValue([]);
        mockExpenseRepository.getTotalByCategory.mockResolvedValue([]);

        const result = await getFinancialSummary();

        expect(result.recentIncomes).toHaveLength(5);
        expect(result.recentIncomes[0].amount).toBe(100);
      });

      it("should return recent expenses (max 5)", async () => {
        mockGetState.mockReturnValue({ account: mockAccount, profile: mockProfile });
        mockIncomeRepository.getByAccountId.mockResolvedValue([]);
        const manyExpenses: ExpenseRecord[] = Array.from({ length: 10 }, (_, i) => ({
          ...mockExpenseRecord,
          id: `expense-${i}`,
          amount: 50 * (i + 1),
        }));
        mockExpenseRepository.getByAccountId.mockResolvedValue(manyExpenses);
        mockExpenseRepository.getTotalByCategory.mockResolvedValue([]);

        const result = await getFinancialSummary();

        expect(result.recentExpenses).toHaveLength(5);
        expect(result.recentExpenses[0].amount).toBe(50);
      });

      it("should calculate expense percentages by category", async () => {
        mockGetState.mockReturnValue({ account: mockAccount, profile: mockProfile });
        mockIncomeRepository.getByAccountId.mockResolvedValue([]);
        mockExpenseRepository.getByAccountId.mockResolvedValue([
          { ...mockExpenseRecord, amount: 100 },
          { ...mockExpenseRecord, id: "exp-2", amount: 200, category: "viajes" },
          { ...mockExpenseRecord, id: "exp-3", amount: 200, category: "compras" },
        ]);
        mockExpenseRepository.getTotalByCategory.mockResolvedValue([
          { category: "comida", total: 100 },
          { category: "viajes", total: 200 },
          { category: "compras", total: 200 },
        ]);

        const result = await getFinancialSummary();

        expect(result.expensesByCategory).toHaveLength(3);
        expect(result.expensesByCategory[0].percentage).toBe(20);
        expect(result.expensesByCategory[1].percentage).toBe(40);
        expect(result.expensesByCategory[2].percentage).toBe(40);
      });
    });

    describe("casos de error", () => {
      it("should throw error if no active account", async () => {
        mockGetState.mockReturnValue({ account: null, profile: mockProfile });

        await expect(getFinancialSummary()).rejects.toThrow("No hay sesión activa");
      });

      it("should throw error if no active profile", async () => {
        mockGetState.mockReturnValue({ account: mockAccount, profile: null });

        await expect(getFinancialSummary()).rejects.toThrow("No hay sesión activa");
      });

      it("should throw error when income repository fails", async () => {
        mockGetState.mockReturnValue({ account: mockAccount, profile: mockProfile });
        mockIncomeRepository.getByAccountId.mockRejectedValue(new Error("Database error"));

        await expect(getFinancialSummary()).rejects.toThrow("Database error");
      });

      it("should throw error when expense repository fails", async () => {
        mockGetState.mockReturnValue({ account: mockAccount, profile: mockProfile });
        mockIncomeRepository.getByAccountId.mockResolvedValue([]);
        mockExpenseRepository.getByAccountId.mockRejectedValue(new Error("Database error"));

        await expect(getFinancialSummary()).rejects.toThrow("Database error");
      });

      it("should throw error when category aggregation fails", async () => {
        mockGetState.mockReturnValue({ account: mockAccount, profile: mockProfile });
        mockIncomeRepository.getByAccountId.mockResolvedValue([]);
        mockExpenseRepository.getByAccountId.mockResolvedValue([]);
        mockExpenseRepository.getTotalByCategory.mockRejectedValue(new Error("Database error"));

        await expect(getFinancialSummary()).rejects.toThrow("Database error");
      });
    });

    describe("casos limite", () => {
      it("should handle empty income and expense lists", async () => {
        mockGetState.mockReturnValue({ account: mockAccount, profile: mockProfile });
        mockIncomeRepository.getByAccountId.mockResolvedValue([]);
        mockExpenseRepository.getByAccountId.mockResolvedValue([]);
        mockExpenseRepository.getTotalByCategory.mockResolvedValue([]);

        const result = await getFinancialSummary();

        expect(result.totalIncome).toBe(0);
        expect(result.totalExpense).toBe(0);
        expect(result.balance.balance).toBe(0);
        expect(result.recentIncomes).toEqual([]);
        expect(result.recentExpenses).toEqual([]);
        expect(result.expensesByCategory).toEqual([]);
      });

      it("should handle negative balance", async () => {
        mockGetState.mockReturnValue({ account: mockAccount, profile: mockProfile });
        mockIncomeRepository.getByAccountId.mockResolvedValue([mockIncomeRecord]);
        mockExpenseRepository.getByAccountId.mockResolvedValue([
          { ...mockExpenseRecord, amount: 6000 },
        ]);
        mockExpenseRepository.getTotalByCategory.mockResolvedValue([
          { category: "comida", total: 6000 },
        ]);

        const result = await getFinancialSummary();

        expect(result.balance.balance).toBe(-1000);
      });

      it("should handle zero total expenses in percentage calculation", async () => {
        mockGetState.mockReturnValue({ account: mockAccount, profile: mockProfile });
        mockIncomeRepository.getByAccountId.mockResolvedValue([mockIncomeRecord]);
        mockExpenseRepository.getByAccountId.mockResolvedValue([]);
        mockExpenseRepository.getTotalByCategory.mockResolvedValue([]);

        const result = await getFinancialSummary();

        expect(result.expensesByCategory).toEqual([]);
      });

      it("should handle very large amounts", async () => {
        mockGetState.mockReturnValue({ account: mockAccount, profile: mockProfile });
        mockIncomeRepository.getByAccountId.mockResolvedValue([
          { ...mockIncomeRecord, amount: 999999999.99 },
        ]);
        mockExpenseRepository.getByAccountId.mockResolvedValue([
          { ...mockExpenseRecord, amount: 888888888.88 },
        ]);
        mockExpenseRepository.getTotalByCategory.mockResolvedValue([
          { category: "comida", total: 888888888.88 },
        ]);

        const result = await getFinancialSummary();

        expect(result.balance.balance).toBeCloseTo(111111111.11, 2);
      });

      it("should handle very small amounts", async () => {
        mockGetState.mockReturnValue({ account: mockAccount, profile: mockProfile });
        mockIncomeRepository.getByAccountId.mockResolvedValue([
          { ...mockIncomeRecord, amount: 0.01 },
        ]);
        mockExpenseRepository.getByAccountId.mockResolvedValue([
          { ...mockExpenseRecord, amount: 0.01 },
        ]);
        mockExpenseRepository.getTotalByCategory.mockResolvedValue([
          { category: "comida", total: 0.01 },
        ]);

        const result = await getFinancialSummary();

        expect(result.balance.balance).toBe(0);
      });

      it("should handle many categories", async () => {
        mockGetState.mockReturnValue({ account: mockAccount, profile: mockProfile });
        mockIncomeRepository.getByAccountId.mockResolvedValue([]);
        const categories = ["comida", "viajes", "compras", "salud", "ocio", "otros"];
        const manyExpenses: ExpenseRecord[] = categories.map((cat, i) => ({
          ...mockExpenseRecord,
          id: `exp-${i}`,
          category: cat,
          amount: 100,
        }));
        mockExpenseRepository.getByAccountId.mockResolvedValue(manyExpenses);
        const categoryTotals = categories.map((cat) => ({ category: cat, total: 100 }));
        mockExpenseRepository.getTotalByCategory.mockResolvedValue(categoryTotals);

        const result = await getFinancialSummary();

        expect(result.expensesByCategory).toHaveLength(6);
        result.expensesByCategory.forEach((cat) => {
          expect(cat.percentage).toBeCloseTo(16.67, 1);
        });
      });
    });
  });
});
