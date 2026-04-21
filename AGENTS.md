# WeekBalance - Agent Guidelines

This file provides guidelines for AI agents operating in this repository.

## Project Overview

WeekBalance is a personal finance management app with:
- **Frontend**: React Native (Expo), TypeScript, Zustand, React Hook Form
- **Backend**: Express.js (TypeScript), Supabase

## Build Commands

### Frontend (weekbalance/)

```bash
cd weekbalance
npm install                    # Install dependencies
npm start                     # Expo start (local dev server)
npm run android               # Run on Android device/emulator
npm run ios                   # Run on iOS simulator
npm run web                   # Run on web

# Testing
npm test                      # Run all tests
npm test -- --watch           # Run tests in watch mode
npm test -- --testPathPattern=<pattern>  # Run specific test file
npm test -- --testNamePattern=<name>     # Run tests matching name
```

### Backend (BackEnd/)

```bash
cd BackEnd
npm install                   # Install dependencies
npm run dev                   # ts-node-dev with hot reload
npm run build                 # Compile TypeScript to dist/
npm run start                 # Run compiled server from dist/
npm test                      # Currently echoes "Error: no test specified"
```

**Note**: Backend has no test framework configured. Frontend has jest-expo but no test files yet.

## Code Style Guidelines

### TypeScript
- **Strict mode enabled** (`strict: true` in both projects)
- Always define explicit types; avoid `any`
- Use interfaces for object shapes, types for unions/primitives
- Enable `noUncheckedIndexedAccess` if needed

### Frontend (React Native/Expo)

#### Component Structure
- Functional components with TypeScript interfaces for props
- Co-locate styles using `*.style.ts` files
- Use `getStyles` pattern for dynamic styles (see existing patterns)

#### File Organization
```
weekbalance/src/
├── auth/              # login/register: api/, screens/, hooks/, types/, store.ts
├── balance/           # income/expenses: api/, screens/, hooks/, types/
├── shared/            # reusable: components/, hooks/, utils/
└── core/              # infrastructure: api/, config/, constants/
```

#### Imports Order
```typescript
// 1. External libraries
import { useForm } from "react-hook-form";
// 2. React Native
import { Pressable, Text, View } from "react-native";
// 3. Shared (relative paths)
import { useLogin } from "../../hooks/useLogin";
// 4. Core (relative paths)
import { COLORS } from "../../../core/constants/Color";
```

#### Naming Conventions
- Components: PascalCase (`LoginScreen`, `BalanceCard`)
- Hooks: camelCase with `use` prefix (`useLogin`, `useBalance`)
- Types/Interfaces: PascalCase (`LoginForm`, `User`)
- Files: kebab-case (`login-screen.tsx`, `use-login.ts`)

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
  logout: () => set({ session: null, user: null })
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
- Use try/catch in all async functions
- Show user-friendly errors with `Alert.alert()` or toast
- Log errors with `console.log()` for debugging (no structured logger)
- Never expose sensitive data in error messages

### Backend (Express.js)

#### File Organization
```
BackEnd/src/
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

#### Class-Based Services Pattern
```typescript
export class AuthService {
  constructor(private readonly repo = new AuthRepository()) {}

  async createProfile(dto: CreateAuthDto): Promise<Profile> {
    if (!dto.full_name || !dto.id) {
      throw new Error("Datos incompletos");
    }
    return await this.repo.create(dto.id, dto.full_name);
  }
}
```

#### Cron Jobs (node-cron)
```typescript
import cron from "node-cron";

export function startWeeklyBalanceCron(): void {
  cron.schedule("0 0 * * 0", async () => {
    console.log("[Cron] Running weekly balance calculation...");
    try {
      await balanceService.processAllUsers();
      console.log("[Cron] Weekly balance calculation finished");
    } catch (error) {
      console.error("[Cron] Error:", error);
    }
  });
}
```

#### Routes & Error Handling
- Use Express Router pattern (`Router()`)
- Validate UUIDs with `uuid` package
- Throw Errors with descriptive Spanish messages
- No centralized error middleware yet

### Database Schema (Supabase)

| Table | Columns |
|-------|---------|
| `profiles` | id (uuid), full_name, avatar_url, created_at |
| `accounts` | id (uuid), user_id (FK auth.users), balance, created_at |
| `income_history` | account_id (FK accounts.id), ... |
| `expense_history` | account_id (FK accounts.id), ... |
| `savings_movements` | account_id (FK accounts.id), ... |

## Testing Guidelines

### Frontend Testing
- Tests go in `__tests__/` or alongside with `*.test.ts` suffix
- Use `@testing-library/react-native` and `jest-expo`
- Mock Expo modules as needed

### Adding Tests to Backend
- Recommended: Install Jest (`npm i -D jest ts-jest @types/jest`)
- Create `jest.config.js` with ts-jest preset
- Write unit tests for services and integration tests for routes
