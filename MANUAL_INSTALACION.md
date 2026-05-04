# Manual de Instalación - WeekBalance

## Introducción
Este manual explica cómo preparar desde cero el entorno de WeekBalance, incluyendo backend (Express + Supabase) y frontend (Expo/React Native). Al finalizar tendrás ambos servicios corriendo localmente y conectados a una base de datos Supabase.

## Requisitos del sistema (hardware y software)
- **Hardware mínimo**
  - CPU de 4 núcleos.
  - 8 GB de RAM (16 GB recomendado si emulás dispositivos).
  - 10 GB de espacio libre en disco.
- **Sistema Operativo**
  - macOS 12+, Windows 10/11 (WSL para backend) o cualquier distro Linux moderna.
- **Software base**
  - Node.js 20.x LTS y npm 10.x.
  - Git 2.40+.
  - Expo Go (en dispositivo físico) o emulador Android/iOS.
  - Supabase CLI (opcional) o acceso a la consola web.

## Dependencias necesarias
- **Backend**
  - `TypeScript`, `ts-node-dev` (incluidos en `package.json`).
  - `@supabase/supabase-js`, `express`, `cors`, `node-cron`.
- **Frontend**
  - Expo SDK 54 (`expo` CLI incluido vía `npx`).
  - Bibliotecas Expo (LinearGradient, Reanimated, SQLite) instaladas automáticamente.
  - `react-native`, `react-navigation`, `zustand`, `react-hook-form`.
- **Herramientas opcionales**
  - `expo-doctor` para verificar configuración móvil.
  - `supabase` CLI para migraciones locales.

## Preparación del entorno
1. Cloná el repositorio:
   ```bash
   git clone <repo_url>
   cd WeekBalance
   ```
2. Verificá tus versiones:
   ```bash
   node -v
   npm -v
   git --version
   ```
   Asegurate de que coincidan con los requisitos.
3. Opcional: Instalá Expo CLI globalmente (`npm install -g expo-cli`) si preferís no usar `npx`.

## Configuración de variables de entorno
### Backend (`BackEnd/.env`)
Creá el archivo `.env` en `BackEnd/` con la siguiente estructura:
```
PORT=3000
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
SUPABASE_ANON_KEY=<anon-key>
JWT_SECRET=<cadena_aleatoria>
```

- `SUPABASE_SERVICE_ROLE_KEY` debe ser la llave de servicio (no compartirla públicamente).
- `SUPABASE_ANON_KEY` se usa para validar tokens entrantes.

### Frontend (`weekbalance/.env`)
Creá un `.env` con:
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

- Ajustá `EXPO_PUBLIC_API_URL` usando tu IP local si probás en dispositivo físico (ej. `http://192.168.0.10:3000/api`).

## Instalación del backend
1. Entrá en el directorio y levantá dependencias:
   ```bash
   cd BackEnd
   npm install
   ```
2. Compilá (opcional, para builds de producción):
   ```bash
   npm run build
   ```
3. Ejecutá en modo desarrollo:
   ```bash
   npm run dev
   ```
   Esto expone la API en `http://localhost:3000/api`.

## Instalación del frontend
1. Entrá en el directorio Expo:
   ```bash
   cd weekbalance
   npm install
   ```
2. Iniciá el servidor Metro:
   ```bash
   npm start
   ```
3. Elegí plataforma:
   - Presioná `a` para emulador Android.
   - `i` para iOS (macOS + Xcode).
   - Escaneá el QR con Expo Go para correr en un dispositivo físico (usar misma red).

## Configuración de la base de datos
1. Creá un proyecto en [Supabase](https://supabase.com/).
2. Desde la sección SQL, ejecutá los scripts necesarios para crear tablas:
   - `profiles`, `accounts`, `income_history`, `expense_history`, `savings_movements` (podés reutilizar los esquemas documentados en `MANUAL_TECNICO.md`).
3. Habilitá autenticación por correo/contraseña en Supabase Auth.
4. Configurá políticas RLS si las tenés definidas; por defecto Supabase aplica seguridad a nivel fila.
5. Copiá las claves (Anon y Service Role) en los `.env` respectivos.

## Ejecución del sistema
1. Asegurate de que el backend esté corriendo (`npm run dev` en `BackEnd`).
2. Iniciá Expo (`npm start` en `weekbalance`).
3. Abrí la app (emulador o físico). Iniciá sesión o registrate.
4. Registrá un ingreso y un gasto de prueba.

## Verificación de la instalación
- Desde la consola del backend deberías ver logs de solicitudes (`POST /api/auth/register`, etc.).
- En la app verificá:
  - El balance se actualiza tras cada movimiento.
  - La sección Ahorros muestra meta inicial vacía.
  - El perfil refleja el nombre que cargaste.
- En Supabase, confirmá que en `income_history` y `expense_history` aparecieron los registros de prueba.

## Solución de problemas comunes
- **Error de conexión (ECONNREFUSED)**: revisá que el backend esté activo y que `EXPO_PUBLIC_API_URL` apunte a la dirección correcta.
- **Token inválido / 401**: asegurate de que las claves Supabase del frontend y backend correspondan al mismo proyecto. Limpia la sesión borrando AsyncStorage (cerrar sesión) y reiniciá.
- **Expo no detecta dispositivos**: comprobá que tu dispositivo o emulador esté en la misma red; reintentá con `adb reverse tcp:3000 tcp:3000` para Android.
- **Reanimated o gradle errors**: ejecutá `npx expo-doctor` y seguilo; reinstalá pods (`npx pod-install`) si usás iOS.
- **Cron jobs no corren**: validá que `startWeeklyBalanceCron()` se invoque (en `BackEnd/src/server.ts`) y que el proceso backend permanezca activo.

## Desinstalación (opcional)
1. Detené procesos (`Ctrl+C` en terminales).
2. Eliminá dependencias:
   ```bash
   rm -rf BackEnd/node_modules weekbalance/node_modules
   ```
3. Borrá archivos `.env` si contienen claves sensibles.
4. Si lo deseás, eliminá el proyecto Supabase desde la consola para liberar recursos.
