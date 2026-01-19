import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_BASE_URL!;
const supabaseAnonKey = process.env.EXPO_DEV_SERVER_ORIGIN!;

export const supabase = createClient(
  "https://hmigyxeosdnfuxurwjbo.supabase.co",
  "sb_publishable_b4S4cK8sulDuKXL1sohIyg_C_9DoJik"
);
