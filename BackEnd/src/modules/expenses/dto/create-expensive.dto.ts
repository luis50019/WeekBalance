export interface CreateExpenseDto {
  account_id:string;
  monto: number;
  categoria: string;
  descripcion?: string;
}
