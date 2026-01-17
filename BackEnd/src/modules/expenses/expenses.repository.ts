import { SupabaseDataSource } from "../../infrastructure/database/supabase.datasource";

export class ExpensesRepository extends SupabaseDataSource {
  async create(data: {
    user_id: string;
    monto: number;
    categoria: string;
    descripcion?: string;
  }) {
    const { error } = await this.client.from("historial_gastos").insert(data);

    if (error) throw new Error(error.message);
  }

  async findByUser(userId: string) {
    const { data, error } = await this.client
      .from("historial_gastos")
      .select("*")
      .eq("user_id", userId)
      .order("fecha", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }
}
