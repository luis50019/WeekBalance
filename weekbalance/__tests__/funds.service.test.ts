import {
  register,
  getHistory,
} from "../src/balance/api/funds.service";
import { incomeRepository, IncomeRecord } from "../src/core/database";
import { useAuthStore } from "../src/auth/store";
import { CreateFunds } from "../src/balance/types/Request/CreateFunds";
import { ResponseIncomeDto } from "../src/balance/types/Response/ResponseIncomeDto";

jest.mock("../src/core/database", () => ({
  incomeRepository: {
    create: jest.fn(),
    getByAccountId: jest.fn(),
  },
}));

jest.mock("../src/auth/store", () => ({
  useAuthStore: {
    getState: jest.fn(),
  },
}));

const mockIncomeRepository = incomeRepository as jest.Mocked<typeof incomeRepository>;
const mockGetState = useAuthStore.getState as jest.MockedFunction<typeof useAuthStore.getState>;

describe("funds.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockAccount = {
    id: "account-123",
    user_id: "user-456",
    balance: 1000,
    created_at: "2024-01-01",
  };

  const mockIncomeRecord: IncomeRecord = {
    id: "income-789",
    account_id: "account-123",
    amount: 5000.5,
    category: "salary",
    description: "Monthly salary",
    source: "1",
    created_at: "2024-01-15",
  };

  describe("register", () => {
    const mockFunds: CreateFunds = {
      account_id: "account-123",
      source: 1,
      category: "salary",
      description: "Monthly salary",
      amount: "5000.50",
    };

    describe("casos exitosos", () => {
      it("should create an income correctly", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockIncomeRepository.create.mockResolvedValue(mockIncomeRecord);

        const result = await register(mockFunds);

        expect(mockIncomeRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            account_id: "account-123",
            amount: 5000.5,
            category: "salary",
            description: "Monthly salary",
            source: "1",
          })
        );
        expect(result).toEqual(mockIncomeRecord);
      });

      it("should convert amount using parseFloat", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockIncomeRepository.create.mockResolvedValue(mockIncomeRecord);

        await register({ ...mockFunds, amount: "1234.56" });

        expect(mockIncomeRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: 1234.56,
          })
        );
      });

      it("should include account_id from auth store", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockIncomeRepository.create.mockResolvedValue(mockIncomeRecord);

        await register(mockFunds);

        expect(mockIncomeRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            account_id: "account-123",
          })
        );
      });

      it("should convert source number to string", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockIncomeRepository.create.mockResolvedValue(mockIncomeRecord);

        await register({ ...mockFunds, source: 2 });

        expect(mockIncomeRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            source: "2",
          })
        );
      });

      it("should handle undefined source", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockIncomeRepository.create.mockResolvedValue(mockIncomeRecord);

        const fundsNoSource = { ...mockFunds, source: undefined };
        await register(fundsNoSource);

        expect(mockIncomeRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            source: undefined,
          })
        );
      });

      it("should handle all category values", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockIncomeRepository.create.mockResolvedValue(mockIncomeRecord);

        const categories = [
          { category: "trabajo", source: 1 },
          { category: "regalo", source: 2 },
          { category: "reintegro", source: 3 },
          { category: "otros", source: 4 },
        ];

        for (const cat of categories) {
          await register({ ...mockFunds, ...cat });
          expect(mockIncomeRepository.create).toHaveBeenLastCalledWith(
            expect.objectContaining({ category: cat.category })
          );
        }
      });
    });

    describe("casos de error", () => {
      it("should throw error if there is no active account", async () => {
        mockGetState.mockReturnValue({ account: null });

        await expect(register(mockFunds)).rejects.toThrow("No hay sesión activa");
        expect(mockIncomeRepository.create).not.toHaveBeenCalled();
      });

      it("should throw error when account is undefined", async () => {
        mockGetState.mockReturnValue({ account: undefined });

        await expect(register(mockFunds)).rejects.toThrow("No hay sesión activa");
      });

      it("should throw error when repository fails", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockIncomeRepository.create.mockRejectedValue(new Error("Database error"));

        await expect(register(mockFunds)).rejects.toThrow("Database error");
      });
    });

    describe("casos limite", () => {
      it("should handle amount with many decimal places", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockIncomeRepository.create.mockResolvedValue(mockIncomeRecord);

        await register({ ...mockFunds, amount: "123.456789" });

        expect(mockIncomeRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: 123.456789,
          })
        );
      });

      it("should handle large amount", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockIncomeRepository.create.mockResolvedValue({
          ...mockIncomeRecord,
          amount: 999999999.99,
        });

        await register({ ...mockFunds, amount: "999999999.99" });

        expect(mockIncomeRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: 999999999.99,
          })
        );
      });

      it("should handle small amount", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockIncomeRepository.create.mockResolvedValue({
          ...mockIncomeRecord,
          amount: 0.01,
        });

        await register({ ...mockFunds, amount: "0.01" });

        expect(mockIncomeRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: 0.01,
          })
        );
      });

      it("should handle amount with commas (parseFloat behavior)", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockIncomeRepository.create.mockResolvedValue(mockIncomeRecord);

        await register({ ...mockFunds, amount: "1000,50" });

        expect(mockIncomeRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: 1000,
          })
        );
      });

      it("should handle empty string amount", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockIncomeRepository.create.mockResolvedValue({
          ...mockIncomeRecord,
          amount: NaN,
        });

        await register({ ...mockFunds, amount: "" });

        expect(mockIncomeRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: NaN,
          })
        );
      });
    });
  });

  describe("getHistory", () => {
    const accountId = "account-123";

    describe("casos exitosos", () => {
      it("should return mapped data correctly from IncomeRecord to ResponseIncomeDto", async () => {
        const mockIncomeRecords: IncomeRecord[] = [
          {
            id: "income-1",
            account_id: "account-123",
            amount: 5000,
            category: "salary",
            description: "Monthly salary",
            source: "1",
            created_at: "2024-01-15",
          },
          {
            id: "income-2",
            account_id: "account-123",
            amount: 200,
            category: "freelance",
            description: "Freelance work",
            source: "2",
            created_at: "2024-01-10",
          },
        ];
        mockIncomeRepository.getByAccountId.mockResolvedValue(mockIncomeRecords);

        const result: ResponseIncomeDto[] = await getHistory(accountId);

        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({
          id: "income-1",
          account_id: "account-123",
          amount: 5000,
          category: "salary",
          description: "Monthly salary",
          source: "1",
          created_at: "2024-01-15",
        });
        expect(result[1]).toEqual({
          id: "income-2",
          account_id: "account-123",
          amount: 200,
          category: "freelance",
          description: "Freelance work",
          source: "2",
          created_at: "2024-01-10",
        });
      });

      it("should call getByAccountId with correct accountId", async () => {
        mockIncomeRepository.getByAccountId.mockResolvedValue([]);

        await getHistory(accountId);

        expect(mockIncomeRepository.getByAccountId).toHaveBeenCalledWith(accountId);
      });

      it("should handle records with null description", async () => {
        const mockIncomeWithNull: IncomeRecord[] = [
          { ...mockIncomeRecord, description: null },
        ];
        mockIncomeRepository.getByAccountId.mockResolvedValue(mockIncomeWithNull);

        const result = await getHistory(accountId);

        expect(result[0].description).toBeNull();
      });

      it("should handle records with undefined source", async () => {
        const mockIncomeNoSource: IncomeRecord[] = [
          { ...mockIncomeRecord, source: null },
        ];
        mockIncomeRepository.getByAccountId.mockResolvedValue(mockIncomeNoSource);

        const result = await getHistory(accountId);

        expect(result[0].source).toBeNull();
      });
    });

    describe("casos de error", () => {
      it("should throw error when repository fails", async () => {
        mockIncomeRepository.getByAccountId.mockRejectedValue(new Error("Database error"));

        await expect(getHistory(accountId)).rejects.toThrow("Database error");
      });
    });

    describe("casos limite", () => {
      it("should return empty array when no incomes exist", async () => {
        mockIncomeRepository.getByAccountId.mockResolvedValue([]);

        const result = await getHistory(accountId);

        expect(result).toEqual([]);
      });

      it("should handle large number of records", async () => {
        const manyIncomes: IncomeRecord[] = Array.from({ length: 100 }, (_, i) => ({
          ...mockIncomeRecord,
          id: `income-${i}`,
          amount: 100 * i,
        }));
        mockIncomeRepository.getByAccountId.mockResolvedValue(manyIncomes);

        const result = await getHistory(accountId);

        expect(result).toHaveLength(100);
      });
    });
  });
});
