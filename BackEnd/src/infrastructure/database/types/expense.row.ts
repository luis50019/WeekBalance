export interface ExpenseRow {
  id: string;
  user_id: string;
  monto: number;
  categoria: string;
  descripcion: string | null;
  fecha: string;
}
