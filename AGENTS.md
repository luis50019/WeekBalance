# WeekBalance - Agent Guidelines

## Project Overview

WeekBalance is a personal finance management app with:
- **Frontend**: React Native (Expo), TypeScript, Zustand, React Hook Form
- **Backend**: Express.js (TypeScript), Supabase

## Build Commands

### Frontend (weekbalance/)

```bash
cd weekbalance && npm install
npm start          # Expo start
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
```

### Backend (BackEnd/)

```bash
cd BackEnd && npm install
npm run dev        # ts-node-dev with hot reload
```

**No tests or linting configured in either project.**

## Code Style Guidelines

### TypeScript
- **Strict mode enabled** (`strict: true`)
- Always define explicit types; avoid `any`
- Use interfaces for objects, types for unions/primitives

### Frontend (React Native/Expo)

#### Component Structure
- Functional components with TypeScript interfaces
- Co-locate styles using `*.style.ts` files
- Use `getStyles` pattern for dynamic styles

#### File Organization
```
src/
├── auth/              # login/register: api/, screens/, hooks/, types/, store.ts
├── balance/           # income/expenses: api/, screens/, hooks/, types/
├── shared/            # reusable: components/, hooks/, utils/
└── core/              # infrastructure: api/, config/, constants/
```

#### Imports (order: external → shared → core → local)
```typescript
import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { useLogin } from "../../hooks/useLogin";
import { COLORS } from "../../../core/constants/Color";
```

#### Zustand Stores
```typescript
interface AuthState {
  session: Session | null;
  user: User | null;
  setSession: (session: Session, user: User) => void;
  logout: () => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  setSession: (session, user) => set({ session, user }),
  logout: () => set({ session: null, user: null, profile: null })
}));
```

#### React Hook Form
```typescript
export const useLogin = () => {
  const { control, formState, handleSubmit } = useForm<LoginForm>({});
  const onSubmit = async (data: LoginForm) => { /* ... */ };
  return { control, formState, handleSubmit, onSubmit };
};
```

#### Error Handling
- try/catch in async functions
- User-friendly errors with `Alert.alert()`
- Log errors with `console.log()` for debugging

### Backend (Express)

#### File Organization
```
src/
├── modules/
│   ├── auth/          # dto/, domain/, *.controller.ts, *.service.ts, *.routes.ts
│   ├── expenses/
│   ├── incomes/
│   ├── savings/
│   └── balance/       # balance.repository.ts, balance.service.ts, balance.cron.ts
├── infrastructure/database/
├── config/            # env.ts, supabase.client.ts
├── middlewares/
├── app.ts
└── server.ts
```

#### Cron Jobs (node-cron)
```typescript
import cron from "node-cron";
export function startWeeklyBalanceCron(): void {
  cron.schedule("0 0 * * 0", async () => {
    console.log("[Cron] Running weekly balance calculation...");
    try {
      await balanceService.processAllUsers();
      console.log("[Cron] Weekly balance calculation finished successfully");
    } catch (error) {
      console.error("[Cron] Error:", error);
    }
  });
}
```

#### Class-Based Services
```typescript
export class AuthService {
  constructor(private readonly repo = new AuthRepository()) {}
  async createProfile(dto: CreateAuthDto) {
    if (!dto.full_name || !dto.id) throw new Error("Datos incompletos");
    return await this.repo.create(dto.id, dto.full_name);
  }
}
```

#### Routes & Error Handling
- Use Express router pattern
- Validate UUIDs with `uuid` package
- Throw Error with descriptive messages

## Database Schema Reference

### Tables
- `profiles`: id (uuid), full_name, avatar_url, created_at
- `accounts`: id (uuid), user_id (references auth.users), balance, created_at
- `income_history`: account_id references accounts.id
- `expense_history`: account_id references accounts.id
- `savings_movements`: account_id references accounts.id
