import "dotenv/config";

export const env = {
  port: process.env.PORT ?? "3000",

  supabase: {
    url: process.env.SUPABASE_URL!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },
};
