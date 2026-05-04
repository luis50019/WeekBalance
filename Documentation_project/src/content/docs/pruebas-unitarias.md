---
title: Pruebas Unitarias
description: Estrategia, alcance y ejecución de los tests automatizados de WeekBalance.
slug: pruebas-unitarias
sidebar:
  label: Pruebas Unitarias
  order: 4
---

Documentación técnica del sistema de pruebas unitarias implementado en la aplicación de finanzas personales WeekBalance.

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Alcance de las Pruebas](#2-alcance-de-las-pruebas)
3. [Estructura del Proyecto](#3-estructura-del-proyecto)
4. [Tipo de Pruebas Implementadas](#4-tipo-de-pruebas-implementadas)
5. [Herramientas y Configuración](#5-herramientas-y-configuración)
6. [Flujo de Ejecución de una Prueba](#6-flujo-de-ejecución-de-una-prueba)
7. [Pruebas con Mocks](#7-pruebas-con-mocks)
8. [Tipos de Casos Probados](#8-tipos-de-casos-probados)
9. [Ejemplos de Pruebas](#9-ejemplos-de-pruebas)
10. [Ejecución de Pruebas](#10-ejecución-de-pruebas)
11. [Buenas Prácticas Aplicadas](#11-buenas-prácticas-aplicadas)
12. [Conclusión](#12-conclusión)

---

## Introducción

Las **pruebas unitarias** son pruebas automatizadas que verifican que unidades individuales de código (funciones, métodos, módulos) funcionen correctamente de forma aislada. Cada test valida un comportamiento específico sin depender de sistemas externos.

### Propósito en WeekBalance

En el contexto de una aplicación React Native como WeekBalance, las pruebas unitarias nos permiten:

- **Validar la lógica de negocio**: Verificar que los servicios procesen correctamente ingresos, gastos y ahorros
- **Detectar errores tempranos**: Encontrar bugs antes de que lleguen a producción
- **Garantizar refactorizaciones seguras**: Confirmar que cambios en el código no rompan funcionalidades existentes
- **Documentar el comportamiento esperado**: Los tests actúan como especificación ejecutable del código

### Tecnologías del Proyecto

- **Frontend**: React Native (Expo), TypeScript, Zustand
- **Almacenamiento**: SQLite local (Expo SQLite)
- **Testing**: Jest + jest-expo
- **Servicios**: `./weekbalance/src/balance/api/`

---

## 2. Alcance de las Pruebas

### Qué se prueba

El sistema de pruebas cubre **exclusivamente la capa de servicios** del módulo de balance:

```
weekbalance/src/balance/api/
├── expenses.service.ts    ✓ Probado
├── funds.service.ts       ✓ Probado
├── savings.service.ts     ✓ Probado
├── trend.service.ts       ✓ Probado
└── user.service.ts        ✓ Probado
```

#### Funcionalidades cubiertas por servicio

| Servicio | Funciones Probadas | Descripción |
|----------|-------------------|-------------|
| **expenses** | `register`, `getHistory`, `getRecent`, `getByCategory` | Registro y consulta de gastos |
| **funds** | `register`, `getHistory` | Registro y consulta de ingresos |
| **savings** | `createSavingService`, `createWeeklyGoalService`, `registerSavingService`, `getWeeklyGoalsService`, `getCurrentWeekGoalsService`, `deleteWeeklyGoalService` | Gestión de ahorros y metas semanales |
| **trend** | `getWeeklyTrend` | Análisis de tendencias semanales |
| **user** | `getFinancialSummary` | Resumen financiero del usuario |

### Qué no se prueba

El alcance actual **excluye** las siguientes áreas:

| Área | Razón |
|------|-------|
| **Componentes UI** | Requieren testing de snapshots o integración con Detox/Playwright |
| **Navegación** | Probada manualmente o con testing E2E |
| **Hooks personalizados** | No existen en el scope actual de tests |
| **Integración con Supabase** | Backend externo, requiere testing de integración |
| **AsyncStorage** | Dependencia del auth store, mocked parcialmente |
| **Expo SQLite real** | Usado a través de mocks de repositories |

### Limitaciones conocidas

1. **No hay llamadas HTTP**: El proyecto usa SQLite local, no se prueban requests a APIs
2. **Mocks de repositories**: La base de datos se simula completamente
3. **Sin tests de integración**: No se prueba el flujo completo usuario-servicio-repositorio
4. **Sin tests E2E**: La UI se prueba manualmente

---

## Estructura del proyecto

```
weekbalance/
├── src/
│   ├── auth/
│   │   └── store.ts                    # Zustand store (mockeado)
│   ├── balance/
│   │   ├── api/                        # Servicios bajo prueba
│   │   │   ├── expenses.service.ts
│   │   │   ├── funds.service.ts
│   │   │   ├── savings.service.ts
│   │   │   ├── trend.service.ts
│   │   │   └── user.service.ts
│   │   └── types/
│   │       └── Request/                # DTOs de entrada
│   └── core/
│       └── database/                   # Repositorios (mockeados)
│           ├── index.ts
│           ├── expense.repository.ts
│           ├── income.repository.ts
│           ├── savings.repository.ts
│           └── goals.repository.ts
│
└── __tests__/                         # Pruebas unitarias
    ├── expenses.service.test.ts
    ├── funds.service.test.ts
    ├── savings.service.test.ts
    ├── trend.service.test.ts
    └── user.service.test.ts
```

### Relación servicio-prueba

Cada servicio tiene su archivo de pruebas correspondiente en `__tests__/`:

| Servicio | Archivo de Prueba | Total Tests |
|----------|-------------------|-------------|
| `expenses.service.ts` | `expenses.service.test.ts` | 21 |
| `funds.service.ts` | `funds.service.test.ts` | 22 |
| `savings.service.ts` | `savings.service.test.ts` | 30 |
| `trend.service.ts` | `trend.service.test.ts` | 11 |
| `user.service.ts` | `user.service.test.ts` | 15 |
| **Total** | | **99 tests** |

---

## Tipo de pruebas implementadas

### Definición

Las **pruebas unitarias** son un tipo de testing de software que verifica que cada unidad de código funcione correctamente de manera aislada. Una unidad es la menor parte probable de un programa, típicamente una función o método.

### Características principales

| Característica | Descripción |
|----------------|-------------|
| **Aislamiento** | Cada test es independiente y no depende de otros tests |
| **Automatización** | Se ejecutan sin intervención manual |
| **Rapidez** | Ejecutan en milisegundos |
| **Determinismo** | Mismo resultado cada vez que se ejecutan |
| **Repetibilidad** | Pueden ejecutarse tantas veces como sea necesario |

### Diferencia con otros tipos de pruebas

| Tipo | Alcance | Velocidad | Dependencias |
|------|---------|-----------|--------------|
| **Unitarias** | Una función/módulo | Rápido (ms) | Mocks |
| **Integración** | Múltiples módulos | Medio | Real/Parcial |
| **E2E** | Toda la aplicación | Lento | Real |

### ¿Por qué pruebas unitarias?

- **Costo**: Detectar un bug en unit testing cuesta ~10x menos que en producción
- **Velocidad**: 99 tests ejecutan en ~1 segundo
- **Confianza**: Permiten refactorizar sin miedo
- **Documentación**: Los tests especifican el comportamiento esperado

---

## Herramientas y configuración

### Jest + jest-expo

Jest es el framework de testing elegido por su integración con React Native/Expo:

```json
// package.json
{
  "scripts": {
    "test": "jest"
  },
  "devDependencies": {
    "jest": "^29.x",
    "jest-expo": "^51.x",
    "@types/jest": "^29.x"
  }
}
```

### 5.2 Configuración de Jest

```javascript
// jest.config.js (implícito en expo)
module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  collectCoverageFrom: [
    "src/balance/api/**/*.ts"
  ]
};
```

### 5.3 Configuración de TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "react-native",
    "moduleResolution": "node"
  }
}
```

### 5.4 Módulos Principales de Jest

| Módulo | Uso |
|---------|-----|
| `jest.fn()` | Crear funciones mock |
| `jest.mock()` | Mockear módulos completos |
| `jest.spyOn()` | Espiar métodos existentes |
| `beforeEach()` | Setup antes de cada test |
| `afterEach()` | Cleanup después de cada test |
| `expect()` | Aserciones |

---

## Flujo de ejecución de una prueba

El flujo de ejecución de una prueba unitaria sigue un patrón de **4 pasos** claramente definidos:

### Paso 1: Configuración de Mocks

Se definen los mocks para las dependencias del servicio:

```typescript
// 1. Definir los módulos a mockear
jest.mock("../src/core/database", () => ({
  expenseRepository: {
    create: jest.fn(),
    getByAccountId: jest.fn(),
  },
}));

jest.mock("../src/auth/store", () => ({
  useAuthStore: {
    getState: jest.fn(),
  },
}));

// 2. Crear referencias tipadas a los mocks
const mockExpenseRepository = expenseRepository as jest.Mocked<typeof expenseRepository>;
const mockGetState = useAuthStore.getState as jest.MockedFunction<typeof useAuthStore.getState>;
```

### Paso 2: Definición del Escenario

Se configuran los datos de entrada y el comportamiento esperado del mock:

```typescript
describe("register", () => {
  // 2.1 Definir datos de prueba (fixtures)
  const mockAccount = {
    id: "account-123",
    user_id: "user-456",
    balance: 1000,
    created_at: "2024-01-01",
  };

  const mockExpense: CreateExpense = {
    account_id: "account-123",
    amount: 50.5,
    description: "Almuerzo",
    category: "comida",
  };

  // 2.2 Configurar el estado del mock
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar estado entre tests
  });
});
```

### Paso 3: Ejecución de la Función

Se llama a la función del servicio que se está probando:

```typescript
it("should create an expense correctly", async () => {
  // Configurar mocks con valores de retorno
  mockGetState.mockReturnValue({ account: mockAccount });
  mockExpenseRepository.create.mockResolvedValue({
    id: "expense-789",
    account_id: "account-123",
    amount: 50.5,
    category: "comida",
    description: "Almuerzo",
    created_at: "2024-01-15",
  });

  // Ejecutar la función bajo prueba
  const result = await register(mockExpense);
});
```

### Paso 4: Validación con Expect

Se verifican los resultados usando assertions de Jest:

```typescript
it("should create an expense correctly", async () => {
  // Setup...
  
  // Ejecutar
  const result = await register(mockExpense);

  // Validar: Verificar que el repository fue llamado correctamente
  expect(mockExpenseRepository.create).toHaveBeenCalledWith(
    expect.objectContaining({
      account_id: "account-123",
      amount: 50.5,
      category: "comida",
      description: "Almuerzo",
    })
  );

  // Validar: Verificar el valor retornado
  expect(result).toEqual(mockExpenseRecord);

  // Validar: Verificar que no se llamó a otros métodos
  expect(mockExpenseRepository.getByAccountId).not.toHaveBeenCalled();
});
```

### Diagrama del Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                    EJECUCIÓN DE TEST                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ 1. MOCKS    │───▶│ 2. ESCENARIO│───▶│ 3. EJECUTAR │     │
│  │             │    │             │    │             │     │
│  │ - Repositor │    │ - Datos     │    │ - Llamar    │     │
│  │ - Store     │    │ - Estado    │    │   función   │     │
│  │ -beforeEach │    │ - beforeEach│    │ - await     │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                              │               │
│                                              ▼               │
│                                    ┌─────────────┐          │
│                                    │ 4. VALIDAR  │          │
│                                    │             │          │
│                                    │ - expect()  │          │
│                                    │ - toEqual() │          │
│                                    │ - toThrow() │          │
│                                    └─────────────┘          │
│                                              │               │
│                                              ▼               │
│                                    ┌─────────────┐          │
│                                    │   RESULTADO │          │
│                                    │  ✓ Pass     │          │
│                                    │  ✗ Fail     │          │
│                                    └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

---

## Pruebas con mocks

### ¿Por qué usar mocks?

Los servicios en WeekBalance dependen de dos componentes externos que necesitan ser simulados:

| Dependencia | Tipo | Motivo del Mock |
|-------------|------|----------------|
| **Repositories** | Base de datos SQLite | Aislar lógica de persistencia |
| **Auth Store (Zustand)** | Estado global | Aislar autenticación |

Sin mocks, las pruebas unitarias se convertirían en pruebas de integración, perdiendo velocidad y aislamiento.

### Mock del repositorio de base de datos

```typescript
jest.mock("../src/core/database", () => ({
  expenseRepository: {
    create: jest.fn(),
    getByAccountId: jest.fn(),
    getRecentByAccountId: jest.fn(),
    getTotalByCategory: jest.fn(),
  },
  incomeRepository: {
    create: jest.fn(),
    getByAccountId: jest.fn(),
  },
  savingsRepository: {
    create: jest.fn(),
    getByAccountId: jest.fn(),
  },
  weeklyGoalsRepository: {
    create: jest.fn(),
    getByAccountId: jest.fn(),
    getCurrentWeekGoals: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockExpenseRepository = expenseRepository as jest.Mocked<typeof expenseRepository>;
const mockIncomeRepository = incomeRepository as jest.Mocked<typeof incomeRepository>;
```

### 7.3 Mock del Auth Store

```typescript
jest.mock("../src/auth/store", () => ({
  useAuthStore: {
    getState: jest.fn(),
  },
}));

const mockGetState = useAuthStore.getState as jest.MockedFunction<typeof useAuthStore.getState>;
```

### 7.4 Configuración de Mocks en Tests

```typescript
describe("expenses.service", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia todos los mocks antes de cada test
  });

  const mockAccount = {
    id: "account-123",
    user_id: "user-456",
    balance: 1000,
    created_at: "2024-01-01",
  };

  it("should create an expense correctly", async () => {
    // Configurar el mock del store
    mockGetState.mockReturnValue({ account: mockAccount });
    
    // Configurar el mock del repository (éxito)
    mockExpenseRepository.create.mockResolvedValue(mockExpenseRecord);

    // Ejecutar la función a probar
    const result = await register(mockExpense);

    // Verificar el resultado
    expect(result).toEqual(mockExpenseRecord);
  });
});
```

### 7.5 Simulación de Escenarios de Error

```typescript
it("should throw error when repository fails", async () => {
  mockGetState.mockReturnValue({ account: mockAccount });
  mockExpenseRepository.create.mockRejectedValue(new Error("Database error"));

  await expect(register(mockExpense)).rejects.toThrow("Database error");
});

it("should throw error if no active session", async () => {
  mockGetState.mockReturnValue({ account: null });

  await expect(register(mockExpense)).rejects.toThrow("No hay sesión activa");
  expect(mockExpenseRepository.create).not.toHaveBeenCalled();
});
```

---

## Tipos de casos probados

### Casos exitosos

Verifican que las funciones funcionen correctamente bajo condiciones normales de uso.

```typescript
describe("casos exitosos", () => {
  it("should create an expense correctly", async () => {
    mockGetState.mockReturnValue({ account: mockAccount });
    mockExpenseRepository.create.mockResolvedValue(mockExpenseRecord);

    const result = await register(mockExpense);

    expect(mockExpenseRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        account_id: "account-123",
        amount: 50.5,
        category: "comida",
        description: "Almuerzo",
      })
    );
    expect(result).toEqual(mockExpenseRecord);
  });

  it("should handle all category values", async () => {
    mockGetState.mockReturnValue({ account: mockAccount });
    mockExpenseRepository.create.mockResolvedValue(mockExpenseRecord);

    const categories = ["comida", "viajes", "compras", "salud", "ocio"];
    for (const category of categories) {
      const expense = { ...mockExpense, category };
      await register(expense);
      expect(mockExpenseRepository.create).toHaveBeenLastCalledWith(
        expect.objectContaining({ category })
      );
    }
  });
});
```

### Manejo de errores

Verifican que las funciones lancen errores apropiados cuando algo falla.

```typescript
describe("casos de error", () => {
  it("should throw error if there is no active session", async () => {
    mockGetState.mockReturnValue({ account: null });

    await expect(register(mockExpense)).rejects.toThrow("No hay sesión activa");
    expect(mockExpenseRepository.create).not.toHaveBeenCalled();
  });

  it("should throw error when repository fails", async () => {
    mockGetState.mockReturnValue({ account: mockAccount });
    mockExpenseRepository.create.mockRejectedValue(new Error("Database error"));

    await expect(register(mockExpense)).rejects.toThrow("Database error");
  });

  it("should throw error when account is undefined", async () => {
    mockGetState.mockReturnValue({ account: undefined });

    await expect(register(mockExpense)).rejects.toThrow("No hay sesión activa");
  });
});
```

### Casos límite

Verifican el comportamiento en condiciones extremas o inusuales.

```typescript
describe("casos limite", () => {
  it("should handle expense with zero amount", async () => {
    mockGetState.mockReturnValue({ account: mockAccount });
    mockExpenseRepository.create.mockResolvedValue({
      ...mockExpenseRecord,
      amount: 0,
    });

    const zeroExpense = { ...mockExpense, amount: 0 };
    const result = await register(zeroExpense);

    expect(result.amount).toBe(0);
  });

  it("should handle very large amount", async () => {
    mockGetState.mockReturnValue({ account: mockAccount });
    const largeAmount = 999999999.99;
    mockExpenseRepository.create.mockResolvedValue({
      ...mockExpenseRecord,
      amount: largeAmount,
    });

    const largeExpense = { ...mockExpense, amount: largeAmount };
    const result = await register(largeExpense);

    expect(result.amount).toBe(largeAmount);
  });

  it("should handle very small amount", async () => {
    mockGetState.mockReturnValue({ account: mockAccount });
    const smallAmount = 0.01;
    mockExpenseRepository.create.mockResolvedValue({
      ...mockExpenseRecord,
      amount: smallAmount,
    });

    const smallExpense = { ...mockExpense, amount: smallAmount };
    const result = await register(smallExpense);

    expect(result.amount).toBe(smallAmount);
  });

  it("should return empty array when no expenses exist", async () => {
    mockExpenseRepository.getByAccountId.mockResolvedValue([]);

    const result = await getHistory(accountId);

    expect(result).toEqual([]);
  });

  it("should handle negative balance", async () => {
    mockGetState.mockReturnValue({ account: mockAccount, profile: mockProfile });
    mockIncomeRepository.getByAccountId.mockResolvedValue([mockIncomeRecord]);
    mockExpenseRepository.getByAccountId.mockResolvedValue([
      { ...mockExpenseRecord, amount: 6000 },
    ]);
    mockExpenseRepository.getTotalByCategory.mockResolvedValue([
      { category: "comida", total: 6000 },
    ]);

    const result = await getFinancialSummary();

    expect(result.balance.balance).toBe(-1000);
  });
});
```

---

## Ejemplos de pruebas

### Expenses service

```typescript
import {
  register,
  getHistory,
  getRecent,
  getByCategory,
} from "../src/balance/api/expenses.service";
import { expenseRepository, ExpenseRecord } from "../src/core/database";
import { useAuthStore } from "../src/auth/store";
import { CreateExpense } from "../src/balance/types/Request/CreateExpense";

jest.mock("../src/core/database", () => ({
  expenseRepository: {
    create: jest.fn(),
    getByAccountId: jest.fn(),
    getRecentByAccountId: jest.fn(),
    getTotalByCategory: jest.fn(),
  },
}));

jest.mock("../src/auth/store", () => ({
  useAuthStore: {
    getState: jest.fn(),
  },
}));

describe("expenses.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockAccount = {
    id: "account-123",
    user_id: "user-456",
    balance: 1000,
    created_at: "2024-01-01",
  };

  describe("register", () => {
    const mockExpense: CreateExpense = {
      account_id: "account-123",
      amount: 50.5,
      description: "Almuerzo",
      category: "comida",
    };

    describe("casos exitosos", () => {
      it("should create an expense correctly", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockExpenseRepository.create.mockResolvedValue(mockExpenseRecord);

        const result = await register(mockExpense);

        expect(result).toEqual(mockExpenseRecord);
      });
    });

    describe("casos de error", () => {
      it("should throw error if no active session", async () => {
        mockGetState.mockReturnValue({ account: null });

        await expect(register(mockExpense)).rejects.toThrow("No hay sesión activa");
      });
    });
  });

  describe("getHistory", () => {
    it("should return empty array when no expenses exist", async () => {
      mockExpenseRepository.getByAccountId.mockResolvedValue([]);

      const result = await getHistory("account-123");

      expect(result).toEqual([]);
    });
  });
});
```

### Funds service

```typescript
describe("funds.service", () => {
  describe("register", () => {
    describe("casos exitosos", () => {
      it("should convert amount using parseFloat", async () => {
        mockGetState.mockReturnValue({ account: mockAccount });
        mockIncomeRepository.create.mockResolvedValue(mockIncomeRecord);

        await register({ ...mockFunds, amount: "1234.56" });

        expect(mockIncomeRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: 1234.56,
          })
        );
      });
    });
  });

  describe("getHistory", () => {
    it("should map IncomeRecord to ResponseIncomeDto", async () => {
      const mockIncomeRecords: IncomeRecord[] = [
        {
          id: "income-1",
          account_id: "account-123",
          amount: 5000,
          category: "salary",
          description: "Monthly salary",
          source: "1",
          created_at: "2024-01-15",
        },
      ];
      mockIncomeRepository.getByAccountId.mockResolvedValue(mockIncomeRecords);

      const result = await getHistory("account-123");

      expect(result[0]).toEqual({
        id: "income-1",
        account_id: "account-123",
        amount: 5000,
        category: "salary",
        description: "Monthly salary",
        source: "1",
        created_at: "2024-01-15",
      });
    });
  });
});
```

### Savings service

```typescript
describe("savings.service", () => {
  describe("createWeeklyGoalService", () => {
    it("should create a weekly goal with category 'ahorro'", async () => {
      mockGetState.mockReturnValue({ account: mockAccount });
      mockWeeklyGoalsRepository.create.mockResolvedValue(mockGoalRecord);

      const result = await createWeeklyGoalService(500, "2024-01-14", "2024-01-20");

      expect(mockWeeklyGoalsRepository.create).toHaveBeenCalledWith({
        account_id: "account-123",
        amount: 500,
        category: "ahorro",
        week_start: "2024-01-14",
        week_end: "2024-01-20",
      });
    });
  });

  describe("getCurrentWeekGoalsService", () => {
    it("should calculate correct weekly saving", async () => {
      const today = new Date();
      const todayISO = today.toISOString();

      mockGetState.mockReturnValue({ account: mockAccount });
      mockWeeklyGoalsRepository.getCurrentWeekGoals.mockResolvedValue([]);
      mockIncomeRepository.getByAccountId.mockResolvedValue([
        { ...mockIncomeRecord, created_at: todayISO },
      ]);
      mockExpenseRepository.getByAccountId.mockResolvedValue([
        { ...mockExpenseRecord, created_at: todayISO },
      ]);

      const result = await getCurrentWeekGoalsService();

      expect(result.weekIncomes).toBe(3000);
      expect(result.weekExpenses).toBe(1500);
      expect(result.weeklySaving).toBe(1500);
    });
  });
});
```

### User service

```typescript
describe("user.service", () => {
  describe("getFinancialSummary", () => {
    it("should calculate correct balance", async () => {
      mockGetState.mockReturnValue({ account: mockAccount, profile: mockProfile });
      mockIncomeRepository.getByAccountId.mockResolvedValue([
        mockIncomeRecord,
        { ...mockIncomeRecord, id: "income-2", amount: 1000 },
      ]);
      mockExpenseRepository.getByAccountId.mockResolvedValue([mockExpenseRecord]);
      mockExpenseRepository.getTotalByCategory.mockResolvedValue([
        { category: "comida", total: 1500 },
      ]);

      const result = await getFinancialSummary();

      expect(result.totalIncome).toBe(6000);
      expect(result.totalExpense).toBe(1500);
      expect(result.balance.balance).toBe(4500);
    });
  });
});
```

---

## Ejecución de pruebas

### Comandos disponibles

```bash
# Ejecutar todas las pruebas
npm test

# Modo watch (re-ejecuta al guardar cambios)
npm test -- --watch

# Ejecutar un archivo específico
npm test -- --testPathPattern=expenses.service

# Ejecutar pruebas que coincidan con un nombre
npm test -- --testNamePattern="casos exitosos"

# Ejecutar con cobertura de código
npm test -- --coverage

# Ver ayuda de Jest
npm test -- --help
```

### Ejecutar con cobertura

```bash
npm test -- --coverage
```

Este comando genera un reporte de cobertura que muestra qué porcentaje del código está siendo probado:

```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
expenses.service.ts |   100   |   100    |   100   |   100   |
funds.service.ts    |   100   |   100    |   100   |   100   |
savings.service.ts  |    95   |    90    |   100   |    95   |
trend.service.ts    |   100   |   100    |   100   |   100   |
user.service.ts     |   100   |   100    |   100   |   100   |
--------------------|---------|----------|---------|---------|
```

### Output esperado

```
> jest

PASS __tests__/funds.service.test.ts
PASS __tests__/expenses.service.test.ts
PASS __tests__/savings.service.test.ts
PASS __tests__/trend.service.test.ts
PASS __tests__/user.service.test.ts

Test Suites: 5 passed, 5 total
Tests:       99 passed, 99 total
Snapshots:   0 total
Time:        1.042 s, estimated 2 s
```

### Ejecutar test específico

```bash
# Solo expenses
npm test -- expenses.service

# Solo "casos exitosos"
npm test -- --testNamePattern="casos exitosos"
```

---

## Buenas prácticas aplicadas

### Estructura jerárquica con `describe` e `it`

Organización en niveles claros:

```typescript
describe("expenses.service", () => {           // Nivel 1: Módulo
  describe("register", () => {                 // Nivel 2: Función
    describe("casos exitosos", () => {          // Nivel 3: Categoría
      it("should create an expense", () => {}); // Nivel 4: Test
    });

    describe("casos de error", () => {
      it("should throw error without session", () => {});
    });

    describe("casos limite", () => {
      it("should handle zero amount", () => {});
    });
  });

  describe("getHistory", () => {
    // ...
  });
});
```

### Aislamiento de pruebas

Cada prueba es independiente gracias a `beforeEach`:

```typescript
describe("expenses.service", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia estado entre tests
  });
});
```

### Nomenclatura de mocks explícita

```typescript
const mockExpenseRepository = expenseRepository as jest.Mocked<typeof expenseRepository>;
const mockIncomeRepository = incomeRepository as jest.Mocked<typeof incomeRepository>;
const mockGetState = useAuthStore.getState as jest.MockedFunction<typeof useAuthStore.getState>;
```

### Datos de prueba centralizados

```typescript
const mockAccount = {
  id: "account-123",
  user_id: "user-456",
  balance: 1000,
  created_at: "2024-01-01",
};

const mockExpenseRecord: ExpenseRecord = {
  id: "expense-789",
  account_id: "account-123",
  amount: 50.5,
  category: "comida",
  description: "Almuerzo",
  created_at: "2024-01-15",
};
```

### Descripciones de tests legibles

```typescript
it("should throw error if there is no active session", async () => {
  // ...
});

it("should return empty array when no expenses exist", async () => {
  // ...
});

it("should handle very large amount", async () => {
  // ...
});
```

### Cobertura exhaustiva de casos límite

| Tipo | Valor | Propósito |
|------|-------|-----------|
| **Cero** | `0` | Verificar manejo de valores vacíos |
| **Máximo** | `999999999.99` | Probar límites numéricos |
| **Mínimo** | `0.01` | Probar precisión decimal |
| **Vacío** | `[]`, `null` | Verificar arrays vacíos |
| **Negativo** | `-1000` | Probar balances en rojo |

### Una aserción por concepto

```typescript
// ✓ Bueno: Una expectativa principal
it("should create an expense", async () => {
  const result = await register(expense);
  expect(result.id).toBe("expense-789");
});

// ✗ Evitar: Múltiples conceptos en un test
it("should create and return expense", async () => {
  const result = await register(expense);
  expect(result.id).toBe("expense-789");
  expect(mockRepository.create).toHaveBeenCalled(); // Segundo concepto
  expect(mockGetState).toHaveBeenCalled(); // Tercer concepto
});
```

---

## Conclusión

### Estado Actual

El sistema de pruebas unitarias de WeekBalance proporciona **99 tests** que cubren la lógica de negocio del módulo de balance:

| Servicio | Funciones | Tests | Cobertura |
|----------|-----------|-------|-----------|
| Expenses | 4 | 21 | 100% |
| Funds | 2 | 22 | 100% |
| Savings | 6 | 30 | 95% |
| Trend | 1 | 11 | 100% |
| User | 1 | 15 | 100% |
| **Total** | **14** | **99** | **~99%** |

### Beneficios Obtenidos

#### Inmediatos
- **Detección temprana**: Bugs encontrados durante desarrollo
- **Confianza**: Refactorizaciones seguras
- **Documentación**: Tests como especificación ejecutable

#### A Largo Plazo
- **Mantenibilidad**: Código fácil de modificar
- **Reducción de costos**: ~10x más barato corregir bugs en dev
- **Onboarding**: Nuevos devs entienden el código

### Recomendaciones Futuras

1. **Tests de UI**: Agregar pruebas para componentes con `@testing-library/react-native`
2. **Tests de Integración**: Probar flujo completo con base de datos real
3. **CI/CD**: Integrar tests en pipeline de GitHub Actions
4. **E2E**: Implementar tests end-to-end con Detox/Playwright
5. **AsyncStorage Mock**: Completar mock del auth store para flujo de login/logout

---

## Referencias

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [jest-expo](https://github.com/expo/expo/tree/master/packages/jest-expo)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)

---

*Documento generado para WeekBalance - Aplicación de finanzas personales*
*Última actualización: Abril 2026*
