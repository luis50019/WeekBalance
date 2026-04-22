import { SupabaseDataSource } from "../../infrastructure/database/supabase.datasource";
import { CreateIncomeDto } from "./dto/create-income.dto";
import { UpdateIncomeDto } from "./dto/update-income.dto";
import { ResponseIncomeDto } from "./dto/response-income.dto";

export class IncomeRespository extends SupabaseDataSource {
  async create(data: CreateIncomeDto) {
    const { error } = await this.client.from("income_history").insert(data);
    if (error) {
      throw new Error("Error la informacion no esta completada");
    }
  }

  async findByAccountIncomeHistory(
    account_id: string,
  ): Promise<ResponseIncomeDto[]> {
    if (account_id == "") throw new Error("Error la cuenta no es correcta");
    const { data, error } = await this.client
      .from("income_history")
      .select("*")
      .eq("account_id", account_id)
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error("No se logro obtener el historial");
    }
    return (data ?? []).map((item) => ({
      id: item.id,
      account_id: item.account_id,
      amount: Number(item.amount),
      category: item.category,
      description: item.description ?? undefined,
      source: item.source ?? undefined,
      created_at: item.created_at,
    }));
  }

  async getWeeklyTotal(accountId: string, weekStart: string, weekEnd: string) {
    const { data, error } = await this.client
      .from("income_history")
      .select("amount")
      .eq("account_id", accountId)
      .gte("created_at", weekStart)
      .lte("created_at", weekEnd);

    if (error) {
      throw new Error("Error al obtener ingresos semanales");
    }

    const total = data.reduce((sum, item) => sum + Number(item.amount), 0);
    return total;
  }

  async update(data: UpdateIncomeDto) {
    if (!data.id) {
      throw new Error("El ID del ingreso es requerido");
    }

    const updateData: Partial<CreateIncomeDto> = {};
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.source !== undefined) updateData.source = data.source;

    const { error } = await this.client
      .from("income_history")
      .update(updateData)
      .eq("id", data.id)
      .eq("account_id", data.account_id);

    if (error) {
      throw new Error("Error al actualizar el ingreso");
    }
  }

  async findById(id: string): Promise<ResponseIncomeDto | null> {
    const { data, error } = await this.client
      .from("income_history")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      account_id: data.account_id,
      amount: Number(data.amount),
      category: data.category,
      description: data.description ?? undefined,
      source: data.source ?? undefined,
      created_at: data.created_at,
    };
  }

  async adjustAccountBalance(accountId: string, delta: number): Promise<void> {
    const { data, error } = await this.client
      .from("accounts")
      .select("balance")
      .eq("id", accountId)
      .single();

    if (error || !data) {
      throw new Error("Error al obtener el saldo de la cuenta");
    }

    const currentBalance = Number(data.balance);
    const updatedBalance = Number((currentBalance + delta).toFixed(2));

    const { error: updateError } = await this.client
      .from("accounts")
      .update({ balance: updatedBalance })
      .eq("id", accountId);

    if (updateError) {
      throw new Error("Error al actualizar el saldo de la cuenta");
    }
  }
}
