import {
  getWeeklyTrend,
  WeeklyTrendData,
  DailyTrendData,
} from "../src/balance/api/trend.service";
import { expenseRepository, ExpenseRecord } from "../src/core/database";
import { useAuthStore } from "../src/auth/store";

jest.mock("../src/core/database", () => ({
  expenseRepository: {
    getByAccountId: jest.fn(),
  },
}));

jest.mock("../src/auth/store", () => ({
  useAuthStore: {
    getState: jest.fn(),
  },
}));

const mockExpenseRepository = expenseRepository as jest.Mocked<typeof expenseRepository>;
const mockGetState = useAuthStore.getState as jest.MockedFunction<typeof useAuthStore.getState>;

describe("trend.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockAccount = {
    id: "account-123",
    user_id: "user-456",
    balance: 1000,
    created_at: "2024-01-01",
  };

  describe("getWeeklyTrend", () => {
    describe("casos exitosos", () => {
      it("should return weekly trend data", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockExpenseRepository.getByAccountId.mockResolvedValue([]);

        const result = await getWeeklyTrend();

        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(7);
      });

      it("should include all required fields for each day", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockExpenseRepository.getByAccountId.mockResolvedValue([]);

        const result = await getWeeklyTrend();

        result.forEach((day) => {
          expect(day).toHaveProperty("week");
          expect(day).toHaveProperty("weekNumber");
          expect(day).toHaveProperty("startDate");
          expect(day).toHaveProperty("endDate");
          expect(day).toHaveProperty("dateRangeLabel");
          expect(day).toHaveProperty("isCurrentWeek");
          expect(day).toHaveProperty("income");
          expect(day).toHaveProperty("expenses");
          expect(day).toHaveProperty("balance");
        });
      });

      it("should include day names in order", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockExpenseRepository.getByAccountId.mockResolvedValue([]);

        const result = await getWeeklyTrend();

        const dayNames = result.map((d) => d.week);
        expect(dayNames).toEqual(["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]);
      });
    });

    describe("casos de error", () => {
      it("should throw error if no active session", async () => {
        mockGetState.mockReturnValue({ account: null });

        await expect(getWeeklyTrend()).rejects.toThrow("No hay sesión activa");
        expect(mockExpenseRepository.getByAccountId).not.toHaveBeenCalled();
      });

      it("should throw error when repository fails", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockExpenseRepository.getByAccountId.mockRejectedValue(new Error("Database error"));

        await expect(getWeeklyTrend()).rejects.toThrow("Database error");
      });
    });

    describe("casos limite", () => {
      it("should return all days with zero expenses when no data", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockExpenseRepository.getByAccountId.mockResolvedValue([]);

        const result = await getWeeklyTrend();

        result.forEach((day) => {
          expect(day.expenses).toBe(0);
          expect(day.balance).toBe(0);
        });
      });

      it("should aggregate expenses correctly by day", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });

        const now = new Date();
        const monday = new Date(now);
        const dayOfWeek = now.getDay();
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        monday.setDate(now.getDate() - daysToSubtract);
        monday.setHours(10, 0, 0, 0);

        const mockExpenses: ExpenseRecord[] = [
          {
            id: "exp-1",
            account_id: "account-123",
            amount: 100,
            category: "comida",
            description: "Almuerzo",
            created_at: new Date(monday.getTime()).toISOString(),
          },
          {
            id: "exp-2",
            account_id: "account-123",
            amount: 50,
            category: "comida",
            description: "Desayuno",
            created_at: new Date(monday.getTime() + 3600000).toISOString(),
          },
        ];
        mockExpenseRepository.getByAccountId.mockResolvedValue(mockExpenses);

        const result = await getWeeklyTrend();

        expect(result[0].expenses).toBe(150);
      });

      it("should handle expenses from different days", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });

        const now = new Date();
        const monday = new Date(now);
        const dayOfWeek = now.getDay();
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        monday.setDate(now.getDate() - daysToSubtract);
        monday.setHours(0, 0, 0, 0);

        const mockExpenses: ExpenseRecord[] = [
          {
            id: "exp-1",
            account_id: "account-123",
            amount: 100,
            category: "comida",
            description: "Almuerzo lunes",
            created_at: new Date(monday.getTime()).toISOString(),
          },
          {
            id: "exp-2",
            account_id: "account-123",
            amount: 200,
            category: "viajes",
            description: "Uber martes",
            created_at: new Date(monday.getTime() + 86400000).toISOString(),
          },
        ];
        mockExpenseRepository.getByAccountId.mockResolvedValue(mockExpenses);

        const result = await getWeeklyTrend();

        expect(result[0].expenses).toBe(100);
        expect(result[1].expenses).toBe(200);
      });

      it("should mark current day correctly", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockExpenseRepository.getByAccountId.mockResolvedValue([]);

        const result = await getWeeklyTrend();

        const currentDayIndex = (now.getDay() + 6) % 7;
        expect(result[currentDayIndex].isCurrentWeek).toBe(true);
      });

      it("should handle Sunday correctly (index 6)", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockExpenseRepository.getByAccountId.mockResolvedValue([]);

        const result = await getWeeklyTrend();

        expect(result[6].week).toBe("Dom");
        expect(result[6].weekNumber).toBe(6);
      });
    });
  });
});

const now = new Date();
