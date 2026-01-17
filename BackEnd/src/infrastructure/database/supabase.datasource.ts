import { getSupabaseClient } from "../../config/supabase.client";

export class SupabaseDataSource {
  protected readonly client = getSupabaseClient();
}
