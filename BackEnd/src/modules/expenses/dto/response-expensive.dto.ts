export interface ExpenseResponseDto {
  id: string;
  amount: number;
  category: string;
  descripcion?: string;
  created_at: string;
}
