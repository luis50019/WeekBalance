# WeekBalance - Agent Guidelines

## Project Overview

WeekBalance is a personal finance management app with:
- **Frontend**: React Native (Expo), TypeScript, Zustand, React Hook Form
- **Backend**: Express.js (TypeScript), Supabase

## Build Commands

### Frontend (weekbalance/)

```bash
# Install dependencies
cd weekbalance && npm install

# Run development server
npm start          # Expo start
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web

# No tests configured
# No linting configured
```

### Backend (BackEnd/)

```bash
# Install dependencies
cd BackEnd && npm install

# Run development server
npm run dev        # ts-node-dev with hot reload

# No tests configured
# No linting configured
```

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** in both projects (`strict: true`)
- Always define explicit types; avoid `any`
- Use interfaces for objects, types for unions/primitives

### Frontend (React Native/Expo)

#### Component Structure
- Use functional components with TypeScript interfaces
- Co-locate styles with components using `*.style.ts` files
- Use `getStyles` pattern for dynamic styles (see `CustomButton.style.ts`)

#### File Organization
```
src/
├── auth/              # Feature: login/register
│   ├── api/           # Service functions
│   ├── screens/       # Screen components
│   ├── hooks/         # Custom hooks (useLogin, useRegister)
│   ├── types/         # TypeScript types
│   └── store.ts       # Zustand store
├── balance/          # Feature: income/expenses
├── shared/            # Reusable components
│   ├── components/
│   │   └── feature/  # Co-located: Component.tsx + Component.style.ts
│   ├── hooks/
│   └── utils/
└── core/              # Infrastructure
    ├── api/           # Axios setup
    ├── config/        # Supabase config
    └── constants/     # Colors, URLs
```

#### Imports
- Use relative paths from current file location
- Order: external libs → shared → core → local
- Example:
  ```typescript
  import { useForm } from "react-hook-form";
  import { Pressable, StyleSheet, Text, View } from "react-native";
  import { useLogin } from "../../hooks/useLogin";
  import { COLORS } from "../../../core/constants/Color";
  ```

#### Zustand Stores
```typescript
// auth/store.ts pattern
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
// hooks/useLogin.ts pattern
export const useLogin = () => {
  const { control, formState, handleSubmit } = useForm<LoginForm>({});
  const onSubmit = async (data: LoginForm) => { /* ... */ };
  return { control, formState, handleSubmit, onSubmit };
};
```

#### Error Handling
- Use try/catch in async functions
- Show user-friendly errors with `Alert.alert()`
- Log errors with `console.log()` for debugging

### Backend (Express)

#### File Organization
```
src/
├── modules/
│   ├── auth/
│   │   ├── dto/           # Data transfer objects
│   │   ├── domain/         # Entities
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.routes.ts
│   ├── expenses/
│   └── incomes/
├── shared/
│   └── types/
├── infrastructure/
│   └── database/
├── config/
│   ├── env.ts
│   └── supabase.client.ts
├── middlewares/
└── app.ts
server.ts
```

#### Class-Based Services
```typescript
// Pattern: Service with injected repository
export class AuthService {
  constructor(private readonly repo = new AuthRepository()) {}

  async createProfile(dto: CreateAuthDto) {
    if (!dto.full_name || !dto.id) {
      throw new Error("Los datos estan incompletos");
    }
    return await this.repo.create(dto.id, dto.full_name);
  }
}
```

#### Routes
- Use Express router pattern
- Validate UUIDs when needed using `uuid` package
- Return meaningful error messages

#### Error Handling
- Throw Error with descriptive messages
- No centralized error handler currently

## Important Notes

- **No test framework** configured in either project
- **No linting** (ESLint) configured
- Backend has **no test scripts** in package.json
- Frontend uses Expo's default TypeScript setup (`expo/tsconfig.base`)
