import { IncomesService } from "./incomes.service";
import { CreateIncomeDto } from "./dto/create-income.dto";
import { ResponseIncomeDto } from "./dto/response-income.dto";

jest.mock("./incomer.repository", () => ({
  IncomeRespository: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
    findByAccountIncomeHistory: jest.fn(),
  })),
}));

jest.mock("../savings/savings.service", () => ({
  SavingService: jest.fn().mockImplementation(() => ({
    recalculateWeeklyGoal: jest.fn(),
  })),
}));

import { IncomeRespository } from "./incomer.repository";
import { SavingService } from "../savings/savings.service";

describe("IncomesService", () => {
  let service: IncomesService;
  let mockRepo: jest.Mocked<IncomeRespository>;
  let mockSavingService: jest.Mocked<SavingService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepo = new IncomeRespository() as jest.Mocked<IncomeRespository>;
    mockSavingService = new SavingService() as jest.Mocked<SavingService>;
    service = new IncomesService(mockRepo, mockSavingService);
  });

  describe("CreateIncome", () => {
    const validIncomeData: CreateIncomeDto = {
      account_id: "acc-123",
      description: "Salary",
      category: "work",
      amount: 5000,
      source: "Employer",
    };

    it("should create income successfully when valid data is provided", async () => {
      mockRepo.create.mockResolvedValue(undefined);
      mockSavingService.recalculateWeeklyGoal.mockResolvedValue(undefined);

      await service.CreateIncome(validIncomeData);

      expect(mockRepo.create).toHaveBeenCalledWith(validIncomeData);
      expect(mockSavingService.recalculateWeeklyGoal).toHaveBeenCalledWith(
        validIncomeData.account_id,
        expect.any(String),
        expect.any(String)
      );
    });

    it("should throw error when amount is zero or negative", async () => {
      const invalidData: CreateIncomeDto = { ...validIncomeData, amount: 0 };

      await expect(service.CreateIncome(invalidData)).rejects.toThrow(
        "El monto no es correcto"
      );
      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it("should throw error when amount is negative", async () => {
      const invalidData: CreateIncomeDto = { ...validIncomeData, amount: -100 };

      await expect(service.CreateIncome(invalidData)).rejects.toThrow(
        "El monto no es correcto"
      );
      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it("should apply parseFloat to amount before creating", async () => {
      const dataWithStringAmount: CreateIncomeDto = {
        ...validIncomeData,
        amount: parseFloat("1500.50"),
      };

      mockRepo.create.mockResolvedValue(undefined);
      mockSavingService.recalculateWeeklyGoal.mockResolvedValue(undefined);

      await service.CreateIncome(dataWithStringAmount);

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ amount: 1500.5 })
      );
    });

    it("should throw error when amount is not a valid number", async () => {
      const invalidData: CreateIncomeDto = {
        ...validIncomeData,
        amount: NaN,
      };

      await expect(service.CreateIncome(invalidData)).rejects.toThrow();
    });
  });

  describe("getIncomeHistory", () => {
    const mockHistoryData: ResponseIncomeDto[] = [
      {
        amount: 5000,
        source: "Employer",
        account_id: "acc-123",
        created_at: "2024-01-01T00:00:00.000Z",
      },
      {
        amount: 1000,
        source: "Freelance",
        account_id: "acc-123",
        created_at: "2024-01-02T00:00:00.000Z",
      },
    ];

    it("should return income history when account_id is provided", async () => {
      mockRepo.findByAccountIncomeHistory.mockResolvedValue(mockHistoryData);

      const result = await service.getIncomeHistory("acc-123");

      expect(mockRepo.findByAccountIncomeHistory).toHaveBeenCalledWith("acc-123");
      expect(result).toEqual(mockHistoryData);
    });

    it("should throw error when account_id is empty", async () => {
      await expect(service.getIncomeHistory("")).rejects.toThrow(
        "El id de cuenta no es correcto"
      );
      expect(mockRepo.findByAccountIncomeHistory).not.toHaveBeenCalled();
    });

    it("should throw error when account_id is null or undefined", async () => {
      await expect(service.getIncomeHistory(null as unknown as string)).rejects.toThrow(
        "El id de cuenta no es correcto"
      );
      await expect(service.getIncomeHistory(undefined as unknown as string)).rejects.toThrow(
        "El id de cuenta no es correcto"
      );
    });

    it("should transform data correctly to ResponseIncomeDto", async () => {
      mockRepo.findByAccountIncomeHistory.mockResolvedValue(mockHistoryData);

      const result = await service.getIncomeHistory("acc-123");

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("amount");
      expect(result[0]).toHaveProperty("source");
      expect(result[0]).toHaveProperty("account_id");
      expect(result[0]).toHaveProperty("created_at");
    });

    it("should return empty array when no income history exists", async () => {
      mockRepo.findByAccountIncomeHistory.mockResolvedValue([]);

      const result = await service.getIncomeHistory("acc-123");

      expect(result).toEqual([]);
      expect(mockRepo.findByAccountIncomeHistory).toHaveBeenCalledWith("acc-123");
    });
  });
});
