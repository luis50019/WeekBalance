import {
  register,
  getHistory,
  getRecent,
  getByCategory,
} from "../src/balance/api/expenses.service";
import { expenseRepository, ExpenseRecord } from "../src/core/database";
import { useAuthStore } from "../src/auth/store";
import { CreateExpense } from "../src/balance/types/Request/CreateExpense";

jest.mock("../src/core/database", () => ({
  expenseRepository: {
    create: jest.fn(),
    getByAccountId: jest.fn(),
    getRecentByAccountId: jest.fn(),
    getTotalByCategory: jest.fn(),
  },
}));

jest.mock("../src/auth/store", () => ({
  useAuthStore: {
    getState: jest.fn(),
  },
}));

const mockExpenseRepository = expenseRepository as jest.Mocked<typeof expenseRepository>;
const mockGetState = useAuthStore.getState as jest.MockedFunction<typeof useAuthStore.getState>;

describe("expenses.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockAccount = {
    id: "account-123",
    user_id: "user-456",
    balance: 1000,
    created_at: "2024-01-01",
  };

  const mockExpenseRecord: ExpenseRecord = {
    id: "expense-789",
    account_id: "account-123",
    amount: 50.5,
    category: "comida",
    description: "Almuerzo",
    created_at: "2024-01-15",
  };

  describe("register", () => {
    const mockExpense: CreateExpense = {
      account_id: "account-123",
      amount: 50.5,
      description: "Almuerzo",
      category: "comida",
    };

    describe("casos exitosos", () => {
      it("should create an expense correctly", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockExpenseRepository.create.mockResolvedValue(mockExpenseRecord);

        const result = await register(mockExpense);

        expect(mockExpenseRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            account_id: "account-123",
            amount: 50.5,
            category: "comida",
            description: "Almuerzo",
          })
        );
        expect(result).toEqual(mockExpenseRecord);
      });

      it("should use correct category values", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockExpenseRepository.create.mockResolvedValue(mockExpenseRecord);

        const categories = ["comida", "viajes", "compras", "salud", "ocio"];
        for (const category of categories) {
          const expense = { ...mockExpense, category };
          await register(expense);
          expect(mockExpenseRepository.create).toHaveBeenLastCalledWith(
            expect.objectContaining({ category })
          );
        }
      });

      it("should handle expense with all fields", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        const fullExpense: CreateExpense = {
          account_id: "account-123",
          amount: 100,
          description: "Test expense",
          category: "viajes",
          created_at: "2024-01-20",
        };
        mockExpenseRepository.create.mockResolvedValue({
          ...mockExpenseRecord,
          ...fullExpense,
        });

        await register(fullExpense);

        expect(mockExpenseRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            account_id: "account-123",
            amount: 100,
            category: "viajes",
            description: "Test expense",
          })
        );
      });
    });

    describe("casos de error", () => {
      it("should throw error if no active session", async () => {
        mockGetState.mockReturnValue({ account: null });

        await expect(register(mockExpense)).rejects.toThrow("No hay sesión activa");
        expect(mockExpenseRepository.create).not.toHaveBeenCalled();
      });

      it("should throw error when repository fails", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockExpenseRepository.create.mockRejectedValue(new Error("Database error"));

        await expect(register(mockExpense)).rejects.toThrow("Database error");
      });

      it("should throw error when account id is undefined", async () => {
        mockGetState.mockReturnValue({ account: undefined });

        await expect(register(mockExpense)).rejects.toThrow("No hay sesión activa");
      });
    });

    describe("casos limite", () => {
      it("should handle expense with zero amount", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockExpenseRepository.create.mockResolvedValue({
          ...mockExpenseRecord,
          amount: 0,
        });

        const zeroExpense = { ...mockExpense, amount: 0 };
        const result = await register(zeroExpense);

        expect(result.amount).toBe(0);
      });

      it("should handle expense with very large amount", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        const largeAmount = 999999999.99;
        mockExpenseRepository.create.mockResolvedValue({
          ...mockExpenseRecord,
          amount: largeAmount,
        });

        const largeExpense = { ...mockExpense, amount: largeAmount };
        const result = await register(largeExpense);

        expect(result.amount).toBe(largeAmount);
      });

      it("should handle expense with very small amount", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        const smallAmount = 0.01;
        mockExpenseRepository.create.mockResolvedValue({
          ...mockExpenseRecord,
          amount: smallAmount,
        });

        const smallExpense = { ...mockExpense, amount: smallAmount };
        const result = await register(smallExpense);

        expect(result.amount).toBe(smallAmount);
      });

      it("should handle expense without optional description", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockExpenseRepository.create.mockResolvedValue({
          ...mockExpenseRecord,
          description: null,
        });

        const noDescExpense = { ...mockExpense, description: undefined };
        await register(noDescExpense);

        expect(mockExpenseRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            description: undefined,
          })
        );
      });
    });
  });

  describe("getHistory", () => {
    const accountId = "account-123";

    describe("casos exitosos", () => {
      it("should return all expenses for an account", async () => {
        const mockExpenses: ExpenseRecord[] = [
          mockExpenseRecord,
          { ...mockExpenseRecord, id: "expense-2", amount: 30, description: "Cena" },
          { ...mockExpenseRecord, id: "expense-3", amount: 20, description: "Transporte" },
        ];
        mockExpenseRepository.getByAccountId.mockResolvedValue(mockExpenses);

        const result = await getHistory(accountId);

        expect(result).toHaveLength(3);
        expect(mockExpenseRepository.getByAccountId).toHaveBeenCalledWith(accountId);
      });

      it("should return empty array when no expenses exist", async () => {
        mockExpenseRepository.getByAccountId.mockResolvedValue([]);

        const result = await getHistory(accountId);

        expect(result).toEqual([]);
      });
    });

    describe("casos de error", () => {
      it("should throw error when repository fails", async () => {
        mockExpenseRepository.getByAccountId.mockRejectedValue(new Error("Database error"));

        await expect(getHistory(accountId)).rejects.toThrow("Database error");
      });
    });
  });

  describe("getRecent", () => {
    const accountId = "account-123";

    describe("casos exitosos", () => {
      it("should return recent expenses with default limit", async () => {
        const mockExpenses: ExpenseRecord[] = [
          mockExpenseRecord,
          { ...mockExpenseRecord, id: "expense-2" },
        ];
        mockExpenseRepository.getRecentByAccountId.mockResolvedValue(mockExpenses);

        const result = await getRecent(accountId);

        expect(result).toHaveLength(2);
        expect(mockExpenseRepository.getRecentByAccountId).toHaveBeenCalledWith(accountId, 5);
      });

      it("should return recent expenses with custom limit", async () => {
        mockExpenseRepository.getRecentByAccountId.mockResolvedValue([mockExpenseRecord]);

        await getRecent(accountId, 10);

        expect(mockExpenseRepository.getRecentByAccountId).toHaveBeenCalledWith(accountId, 10);
      });

      it("should return empty array when no recent expenses", async () => {
        mockExpenseRepository.getRecentByAccountId.mockResolvedValue([]);

        const result = await getRecent(accountId);

        expect(result).toEqual([]);
      });
    });

    describe("casos de error", () => {
      it("should throw error when repository fails", async () => {
        mockExpenseRepository.getRecentByAccountId.mockRejectedValue(new Error("Database error"));

        await expect(getRecent(accountId)).rejects.toThrow("Database error");
      });
    });

    describe("casos limite", () => {
      it("should handle limit of 1", async () => {
        mockExpenseRepository.getRecentByAccountId.mockResolvedValue([mockExpenseRecord]);

        const result = await getRecent(accountId, 1);

        expect(result).toHaveLength(1);
        expect(mockExpenseRepository.getRecentByAccountId).toHaveBeenCalledWith(accountId, 1);
      });

      it("should handle very large limit", async () => {
        mockExpenseRepository.getRecentByAccountId.mockResolvedValue([mockExpenseRecord]);

        await getRecent(accountId, 1000);

        expect(mockExpenseRepository.getRecentByAccountId).toHaveBeenCalledWith(accountId, 1000);
      });
    });
  });

  describe("getByCategory", () => {
    const accountId = "account-123";

    describe("casos exitosos", () => {
      it("should return expenses grouped by category", async () => {
        const mockCategories = [
          { category: "comida", total: 150 },
          { category: "viajes", total: 80 },
          { category: "compras", total: 200 },
        ];
        mockExpenseRepository.getTotalByCategory.mockResolvedValue(mockCategories);

        const result = await getByCategory(accountId);

        expect(result).toEqual(mockCategories);
        expect(mockExpenseRepository.getTotalByCategory).toHaveBeenCalledWith(accountId);
      });

      it("should return empty array when no expenses by category", async () => {
        mockExpenseRepository.getTotalByCategory.mockResolvedValue([]);

        const result = await getByCategory(accountId);

        expect(result).toEqual([]);
      });
    });

    describe("casos de error", () => {
      it("should throw error when repository fails", async () => {
        mockExpenseRepository.getTotalByCategory.mockRejectedValue(new Error("Database error"));

        await expect(getByCategory(accountId)).rejects.toThrow("Database error");
      });
    });
  });
});
