# Manual Técnico de WeekBalance

## Introducción

WeekBalance es una plataforma de finanzas personales que combina una aplicación móvil desarrollada con React Native y un backend en Express.js para ayudar a los usuarios a registrar movimientos, visualizar tendencias semanales/mensuales y cumplir metas de ahorro. Este manual describe la arquitectura completa, procesos operativos y consideraciones técnicas necesarias para instalar, mantener y extender el sistema.

## Arquitectura del sistema

- **Cliente móvil/web**: Aplicación Expo (React Native) que consume la API vía HTTPS. Implementa navegación stack, formularios controlados y gráficas interactivas.
- **Backend**: API REST en Express.js (TypeScript) con capa de servicios, repositorios y DTOs. Orquesta operaciones de autenticación, ingresos, egresos, ahorros y balance.
- **Servicios gestionados**: Supabase provee autenticación, base de datos Postgres y almacenamiento seguro de sesiones.
- **Cron semanal**: `balance/balance.cron.ts` ejecuta cálculos periódicos de balance usando `node-cron`.
- **Comunicación**: JSON sobre HTTPS; el frontend agrega el token Supabase (`Bearer <jwt>`) en cada request protegida.

## Tecnologías y herramientas

- **Frontend**: Expo 54, React 19, React Navigation, React Hook Form, Zustand, Expo Linear Gradient, Reanimated, Chart Kit y Gifted Charts.
- **Backend**: Express 5, Supabase JS v2, TypeScript 5, ts-node-dev, node-cron, JWT, uuid.
- **Infraestructura**: Configuración central en `BackEnd/src/config`, variables a través de `.env` para llaves Supabase y puertos.
- **Testing**: Jest con `jest-expo` en frontend y pruebas unitarias aisladas con Jest en `BackEnd/src/modules/incomes/incomes.service.test.ts`.
- **Herramientas de desarrollo**: TypeScript estricto, ESLint con normas por defecto de Expo (implícito), scripts npm para builds locales.

## Estructura del proyecto (frontend y backend)

- **Frontend (`weekbalance/`)**
  - `src/app`: pantallas principales, enrutamiento y layout.
  - `src/auth`: hooks, pantallas y servicios para login/registro, incluye `store.ts` con Zustand.
  - `src/balance`: componentes, API y hooks para tendencias y métricas.
  - `src/shared`: componentes reutilizables, utilidades y estilos centralizados.
  - `src/core`: constantes, configuración HTTP (axios) y tipos globales.
  - `src/validations`: esquemas para formularios con Zod (cuando aplique).
- **Backend (`BackEnd/`)**
  - `src/app.ts`: instancia Express, middlewares, montaje de rutas (`/api/auth`, `/api/incomes`, `/api/expenses`, `/api/savings`, `/api/balance`).
  - `src/server.ts`: arranque HTTP y carga de cron jobs.
  - `src/modules`: subdirectorios por dominio (auth, incomes, expenses, savings, balance) con `*.controller.ts`, `*.service.ts`, `*.routes.ts`, DTOs y repositorios.
  - `src/infrastructure`: conexión Postgres vía Supabase, adaptadores y clientes.
  - `src/middlewares`: autenticación (`auth.middleware.ts`) y manejo de CORS/logging.
  - `src/shared`: utilidades transversales (tipos, helpers, respuestas estándar).

## API (comunicación frontend–backend)

- **Autenticación (`/api/auth`)**
  - `POST /login`: recibe `email`, `password`; responde token y datos de sesión.
  - `POST /register`: crea usuario y cuenta base.
  - `POST /profile/`: crea perfil de usuario (requiere token Supabase).
  - `GET /profile/:id`, `PATCH /profile/:id`: lectura y actualización de perfil.
  - `GET /info/:id`: resume información del usuario (perfil + cuenta).
  - `GET /account/:userId`: obtiene cuenta activa asociada.
- **Ingresos (`/api/incomes`)**
  - `POST /add/`: registra ingreso y recalcula metas de ahorro.
  - `GET /history/:accountId`: historial agrupado por fecha con DTO normalizado.
  - `GET /weekly-total/:accountId`: suma semanal para dashboards.
  - `PUT /update/`: actualiza ingreso existente.
  - `GET /:id`: detalle puntual de ingreso.
- **Gastos (`/api/expenses`)**
  - Rutas homólogas a ingresos para alta, historial, totales y edición.
- **Ahorros (`/api/savings`)**
  - Gestión de metas, movimientos y recálculo de objetivos semanales.
- **Balance (`/api/balance`)**
  - `GET /monthly-trend`: calcula tendencia mensual (parámetros `accountId`, `months`).
  - `GET /weekly-trend`: calcula tendencia semanal (parámetros `accountId`, `weeks`).

Todas las rutas protegidas validan el header `Authorization: Bearer <token>` mediante `authMiddleware`, que consulta Supabase Auth.

## Base de datos

- **Proveedor**: Supabase Postgres administrado.
- **Tablas principales**:
  - `profiles (id uuid, full_name, avatar_url, created_at)` enlazada a `auth.users`.
  - `accounts (id uuid, user_id uuid, balance numeric, created_at)`.
  - `income_history`, `expense_history`, `savings_movements` con claves foráneas a `accounts.id`, montos `numeric`, categorías, descripciones y timestamps.
- **Consultas**: Repositorios encapsulan SQL vía Supabase SDK. Se prioriza retornar DTOs tipados para capa de servicios.
- **Migrations**: Administradas desde Supabase Dashboard o CLI (no versionadas en repo actual).

## Seguridad

- **Autenticación**: Supabase Auth emite tokens JWT; middleware valida vigencia y adjunta `req.user`.
- **Autorización**: Servicios operan sobre `accountId` ligado al usuario; se debe validar pertenencia antes de mutar datos (pendiente reforzar en expenses/savings).
- **Transporte**: Requiere HTTPS en despliegues. Expo usa `axios` con baseURL configurable.
- **Protección de secretos**: Variables (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`) se cargan desde `.env` (excluido del repo). Nunca versionar llaves.
- **Validaciones**: DTOs y servicios revisan campos críticos (montos > 0, IDs válidos). Se recomienda añadir Zod/Joi en controllers para endurecer entrada.
- **Cifrado local**: Front utiliza `expo-crypto` y `@react-native-async-storage` para guardar tokens; limpiar sesión en logout.

## Instalación y ejecución

1. **Requisitos**: Node.js 20+, npm 10+, Expo CLI, cuentas Supabase configuradas con proyecto y tablas.
2. **Frontend** (`weekbalance/`)
   - `npm install`
   - Copiar `.env.example` (si existe) a `.env` con `API_URL`, `SUPABASE_ANON_KEY`.
   - `npm start` para abrir Expo Go (web, iOS, Android).
3. **Backend** (`BackEnd/`)
   - `npm install`
   - Definir `.env` con `PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
   - `npm run dev` lanza servidor en caliente (`http://localhost:3000` por defecto).
   - `npm run build` compila a `dist/`; `npm start` ejecuta versión compilada.
4. **Conexión**: Ajustar baseURL en frontend (`src/core/api/client.ts` o archivo equivalente) apuntando al host backend.

## Flujo del sistema

1. Usuario descarga la app y se registra (`/api/auth/register`).
2. Backend crea cuenta base y perfil inicial en Supabase.
3. Tras login, frontend guarda token Supabase y carga datos del perfil (`/api/auth/info/:id`).
4. Usuario registra ingresos y gastos; servicios actualizan `income_history`/`expense_history` y re-calculan balance.
5. Módulo de ahorros ajusta metas semanales al registrar ingresos o movimientos de ahorro.
6. Dashboards consultan endpoints de balance para renderizar gráficos (chart kit) con tendencias semanales/mensuales.
7. Cron semanal ejecuta `processAllUsers` para recalcular balance consolidado y enviar notificaciones (pendiente integrar notificaciones push).

## Pruebas

- **Frontend**: `npm test` (jest-expo) ejecuta suites ubicadas en `__tests__/` o junto a componentes. Se utilizan `@testing-library/react-native` y `jest-native` para assertions accesibles.
- **Backend**: Se utiliza Jest; ejemplo en `src/modules/incomes/incomes.service.test.ts` con mocks de repositorios y servicios. Las rutas aún no tienen pruebas de integración; se recomienda agregar supertest.
- **Cobertura recomendada**: servicios críticos de movimientos financieros y lógica de balance, almacenamiento local (hooks) y flujos de autenticación.

## Mantenimiento

- Centralizar cambios de esquema en Supabase y reflejarlos en DTOs/servicios.
- Revisar dependencias periódicamente (`npm outdated`) y actualizar Expo/React Native siguiendo guías de migración.
- Monitorear cron jobs y logs de Supabase para detectar fallos de sincronización.
- Añadir linters/formatters (ESLint, Prettier) tanto en frontend como backend para mantener consistencia.
- Documentar nuevos endpoints en esta guía y en `docs/` cada vez que se expose funcionalidad.

## Problemas comunes

- **Tokens inválidos**: suele deberse a expiración; refrescar sesión desde Supabase o volver a iniciar sesión.
- **CORS durante desarrollo**: asegurarse de configurar `ALLOWED_ORIGINS` en backend o habilitar `cors()` con `origin: '*'` para entornos locales.
- **Desfase de baseURL**: la app móvil debe apuntar al IP local accesible desde el dispositivo (ej. `http://192.168.x.x:3000`).
- **Montos sin formatear**: validar que formularios envíen números (no strings vacíos) para evitar errores de servicio.
- **Cron sin ejecutar**: verificar que `startWeeklyBalanceCron()` se invoque en `server.ts` y que el proceso permanezca activo.

## Anexos

- `AGENTS.md`: lineamientos para agentes y overview del proyecto.
- `MANUAL_USUARIO.md`: guía funcional para usuarios finales.
- `PATRONES_DISEÑO.md`: patrones arquitectónicos empleados.
- `PRUEBASUNITARIAS.md`: evidencia y resultados de pruebas vigentes.
- Colección Postman/Insomnia sugerida: exportar rutas descritas para acelerar QA manual.
