---
title: Manual de Usuario
description: Guía funcional para aprovechar WeekBalance en el día a día.
slug: manual-usuario
sidebar:
  label: Manual de Usuario
  order: 3
---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Almacenamiento de Datos](#almacenamiento-de-datos)
4. [Inicio Rápido](#inicio-rápido)
5. [Navegación](#navegación)
6. [Funcionalidades](#funcionalidades)
   - [Registro e Inicio de Sesión](#registro-e-inicio-de-sesión)
   - [Gestionar Ingresos](#gestionar-ingresos)
   - [Gestionar Gastos](#gestionar-gastos)
   - [Sistema de Ahorro](#sistema-de-ahorro)
   - [Entender tu Balance](#entender-tu-balance)
7. [Limitaciones Actuales](#limitaciones-actuales)
8. [Recomendaciones de Uso](#recomendaciones-de-uso)
9. [Problemas Comunes](#problemas-comunes)
10. [Glosario](#glosario)
11. [Categorías Disponibles](#categorías-disponibles)
12. [Contacto y Soporte](#contacto-y-soporte)

---

## Introducción

**WeekBalance** es una app de finanzas personales que combina una experiencia móvil construida con Expo/React Native y un backend en la nube. Está pensada para que controles tu dinero semana a semana (domingo a sábado) y puedas:

- Registrar **ingresos** y **gastos** con categorías consistentes.
- Definir y seguir **metas de ahorro** semanales conectadas a tus movimientos reales.
- Visualizar tu **balance**, tendencias y gastos recientes en dashboards dinámicos.
- Actualizar tu perfil y consultar tu cuenta financiera centralizada.

Todo se sincroniza automáticamente con los servicios de Supabase, por lo que conservás tus datos aunque cambies de dispositivo.

---

## Requisitos del Sistema

Antes de empezar, asegurate de cumplir con lo siguiente:

### Dispositivo Compatible

- **Android** 8.0 o superior / **iOS** 13.0 o superior.
- Pantalla mínima 360 x 640 px.
- Al menos 150 MB de memoria disponible para la app y caché.

### Conexión a Internet

- Es obligatoria para registrar cuenta, iniciar sesión, sincronizar movimientos y ver reportes.
- Si perdés señal temporalmente vas a seguir viendo los últimos datos cargados, pero no podrás crear ni actualizar información hasta reconectarte.

### Espacio en el Dispositivo

- Instalación ~80 MB (Expo + assets).
- Recomendado disponer de 200 MB libres para descargas de fuentes, caché e imágenes.

---

## Almacenamiento de Datos

### Cómo se Guardan tus Datos

- **Nube (Supabase Postgres)**: Cada transacción, meta y perfil se guarda en la base central. Iniciar sesión desde otro teléfono recupera tu historial inmediatamente.
- **Dispositivo**: Sólo se guarda el token de sesión cifrado (`AsyncStorage`) para mantenerte autenticado. No se almacenan montos ni listas completas en local.

### Consideraciones Importantes

| Situación                | ¿Qué sucede con tus datos?                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| Desinstalar la app       | Al reinstalar e iniciar sesión, se sincronizan nuevamente tus datos desde Supabase.        |
| Cambiar de teléfono      | Basta con instalar WeekBalance e iniciar sesión con tu correo/contraseña originales.       |
| Formatear el dispositivo | Los datos persisten en la nube; solo necesitás recordar tus credenciales.                  |
| Sin conexión             | Podés revisar lo último cargado, pero las operaciones quedan pendientes hasta reconectar. |

### Recomendación

> Mantené tus credenciales seguras: sin contraseña no hay forma automática de acceder a tu información almacenada en la nube.

---

## Inicio Rápido

### 1. Crea tu cuenta

1. Abrí la app.
2. Tocá **"Regístrate"**.
3. Completá nombre, correo y contraseña (mínimo 6 caracteres).
4. Confirmá con **"Crear cuenta"**.

Tu sesión se inicia de forma automática y se genera tu cuenta financiera con saldo inicial 0.

### 2. Agrega tu primer ingreso

1. Desde la barra inferior elegí **Ingresos**.
2. Toca el botón flotante **"Agregar"**.
3. Elegí una categoría (ej. "Trabajo").
4. Escribí la descripción.
5. Ingresá el monto y confirmá con **Guardar**.

### 3. Registra un gasto

1. Cambiá a la pestaña **Gastos**.
2. Pulsá **"Agregar"**.
3. Seleccioná la categoría correspondiente (ej. "Comida").
4. Ingresá descripción y monto.
5. Confirmá con **Guardar**.

En segundos vas a ver cómo cambian tu balance y la meta semanal.

---

## Navegación

La barra inferior fija incluye tres accesos principales:

| Sección      | Icono     | Descripción                                                             |
| ------------ | --------- | ----------------------------------------------------------------------- |
| **Inicio**   | Casa      | Vista general: balance, metas, tendencias y últimos gastos.             |
| **Ingresos** | Billetera | Historial semanal de ingresos, filtros por categoría y botón de alta.   |
| **Gastos**   | Dinero    | Historial semanal de gastos, filtros por categoría y botón de alta.     |

Tocando tu avatar en la cabecera accedés al **Perfil** (datos personales y cerrar sesión). Desde el panel **Inicio** podés:

- Abrir el detalle de metas de ahorro.
- Explorar tendencias diarias/semanales.
- Saltar a los historiales completos mediante botones rápidos.

---

## Funcionalidades

---

### Registro e Inicio de Sesión

#### Crear una cuenta nueva

1. Pulsá **"Regístrate"**.
2. Cargá tu nombre completo, correo y contraseña.
3. Confirmá con **"Crear cuenta"**.

El sistema crea tu perfil, cuenta y sesión en Supabase automáticamente.

#### Iniciar sesión

1. Introducí correo y contraseña.
2. Tocá **"Iniciar sesión"**.
3. Esperá la sincronización inicial (balance y movimientos se cargan desde la nube).

#### Cerrar sesión

1. Desde cualquier pantalla, tocá tu avatar (arriba a la izquierda).
2. Seleccioná **Cerrar sesión** y confirmá.

Esto borra el token local y regresa a la pantalla de autenticación.

---

### Gestionar Ingresos

Los ingresos representan entradas de dinero (sueldos, freelance, regalos, etc.).

#### Ver historial

1. Abrí **Ingresos**.
2. Deslizá para ver grupos semanales (la app agrupa del domingo al sábado).
3. Tocá un registro para abrirlo en modo edición.

#### Filtrar

Utilizá el carrusel de categorías ("Todo", "Trabajo", "Regalo", etc.) para mostrar solo lo relevante. El resumen semanal se recalcula según el filtro activo.

#### Agregar

1. Botón flotante **Agregar**.
2. Seleccioná categoría.
3. Descripción opcional pero recomendable.
4. Monto positivo con dos decimales.
5. Guardá. El backend ajusta tu saldo y las metas automáticamente.

#### Editar un ingreso

1. Desde la lista, tocá el movimiento.
2. Modificá monto, categoría o descripción.
3. Confirmá con **Actualizar ingreso**.

La actualización se envía a la API `/incomes/update/` y se refleja en balance y metas.

---

### Gestionar Gastos

Los gastos abarcan todo egreso (alimentación, transporte, ocio, etc.).

#### Ver historial

1. Abrí **Gastos**.
2. Revisá los bloques semanales con totales y fechas.
3. Cada tarjeta se puede presionar para editar.

#### Filtrar

Usá el slider de categorías ("Todo", "Comida", "Viajes", etc.). Además se muestra el total semanal acumulado en la parte superior.

#### Registrar un gasto

1. Botón flotante **Agregar**.
2. Seleccioná categoría.
3. Ingresá monto y nota.
4. Guardá. Si el monto supera tu saldo disponible, la app te avisa antes de enviar.

#### Editar un gasto

1. Desde el historial, tocá la transacción.
2. Ajustá categoría, descripción o monto.
3. Confirmá con **Actualizar gasto**.

La operación se realiza vía `/expenses/update/`; el saldo y las metas se recalculan al instante.

---

### Sistema de Ahorro

La sección **Ahorros** gestiona metas semanales basadas en tu flujo real.

#### Panel principal

- Meta semanal activa (progreso, monto restante, estado).
- Métricas de la semana: total ahorrado vs meta, progreso porcentual.
- Historial de metas pasadas con estado (“Completada”, “Incompleta”, “Extra”).

#### Crear una meta semanal

1. En **Ahorros**, tocá **Crear meta semanal**.
2. Ingresá el monto objetivo.
3. Guardá. Si ya existe una meta activa para la semana, la app te lo informará.

#### Seguimiento y ajustes

- Si gastás más de lo planificado, el progreso mostrará alerta “Meta incompleta”.
- Podés crear nuevas metas cada semana; las semanas anteriores quedan sólo para consulta.
- No hay eliminación retroactiva de metas ya cerradas.

---

### Entender tu Balance

```
Balance = Ingresos totales - Gastos totales
```

En **Inicio** encontrás:

- **CardCurrentFound**: muestra saldo actual, totales de ingresos/gastos acumulados.
- **Resumen semanal**: ingresos, gastos y ahorro esperado para la semana vigente.
- **Tendencia diaria/semanal**: gráficos de línea con comportamiento por día.
- **Gastos recientes**: últimos movimientos para control rápido.

Desde cada bloque podés navegar a historiales detallados o a la sección de metas.

---

## Limitaciones Actuales

- **Sin eliminación de movimientos**: podés editar ingresos/gastos, pero no borrarlos. Para corregir errores considerá un movimiento compensatorio.
- **Sin recuperación automática de contraseña**: si la olvidás, necesitás contacto con soporte para resetear manualmente (actualmente implica crear una cuenta nueva).
- **Cambios de correo no soportados**: el email queda fijo tras el registro.
- **Metas históricas bloqueadas**: metas de semanas anteriores son de solo lectura (evita inconsistencias con reportes).

---

## Recomendaciones de Uso

### 1. Registrá movimientos al instante

- Cargar ingresos/gastos en el momento evita olvidos y mantiene los cálculos al día.

### 2. Revisá el resumen semanal los domingos

- Ajustá metas o gastos según lo observado en el tablero semanal.

### 3. Usá categorías consistentes

- Mantener la misma categoría simplifica el análisis de la gráfica por rubros.

### 4. Actualizá tu nombre desde Perfil

- Así los reportes y notificaciones muestran información correcta.

### 5. Verificá tu conexión antes de cerrar la app

- Si quedaste sin internet, abrí nuevamente la app al reconectar para sincronizar pendientes.

---

## Problemas Comunes

### No puedo iniciar sesión

**Revisá:**

1. Credenciales exactas (correo sin espacios, contraseña válida).
2. Conexión estable. Si Supabase tarda en responder, la app mostrará “El servidor se está iniciando”. Probá nuevamente luego de unos segundos.
3. Si olvidaste la contraseña, por ahora necesitás registrarte con otro correo.

### No puedo guardar un ingreso/gasto

- Confirmá categoría seleccionada.
- Verificá que el monto sea positivo y numérico (`1500.50`).
- Revisá tu saldo disponible: la app bloquea gastos mayores al balance para evitar números negativos.
- Chequeá tu conexión; sin internet la petición queda en error.

### No encuentro Ahorros

En la pantalla **Inicio**, desplazate hasta la tarjeta “Mis Ahorros” y tocá **Ver detalles** o el botón correspondiente. También podés acceder desde accesos directos en encabezados cuando hay metas activas.

### La app muestra “meta en riesgo”

Significa que tus gastos semanales superan el plan de ahorro. Revisa el histórico y ajustá compras futuras o incrementá ingresos para compensar.

### Los datos no se actualizan

1. Desliza hacia abajo en las listas para refrescar (pull-to-refresh) cuando esté disponible.
2. Cierra sesión y vuelve a iniciar si persiste.
3. Reiniciá el dispositivo. Si el problema continúa, contactá soporte con la hora exacta del fallo.

### Quiero corregir un movimiento erróneo

- Ingresos/Gastos: abrí el registro desde el historial y usá la pantalla de **Editar** para ajustar. No se puede borrar.
- Metas de ahorro: sólo podés crear una nueva para la semana actual; las anteriores quedan bloqueadas.

---

## Glosario

| Término              | Significado                                                      |
| -------------------- | ---------------------------------------------------------------- |
| **Balance**          | Diferencia entre ingresos y gastos acumulados.                   |
| **Ingreso**          | Entrada de dinero (sueldo, freelance, regalos, etc.).            |
| **Gasto**            | Salida de dinero (comida, transporte, ocio, etc.).               |
| **Meta semanal**     | Objetivo de ahorro para la semana en curso.                      |
| **Semana**           | Periodo de domingo a sábado usado para agrupar movimientos.      |
| **Categoría**        | Etiqueta que clasifica movimientos para análisis y filtros.      |
| **Tendencia**        | Gráfico que resume el comportamiento de tus gastos/ingresos.     |
| **Saldo disponible** | Dinero restante en tu cuenta después de los movimientos actuales.|

---

## Categorías Disponibles

### Categorías de Ingresos

- **Trabajo**: Sueldos, honorarios, comisiones.
- **Regalo**: Transferencias de familiares/amigos.
- **Reintegro**: Devoluciones o reembolsos.
- **Otros**: Entradas esporádicas no cubiertas por las anteriores.

### Categorías de Gastos

- **Comida**: Supermercado, restaurantes, snacks.
- **Viajes**: Transporte público, gasolina, movilidad.
- **Compras**: Ropa, tecnología, artículos personales.
- **Salud**: Consultas médicas, farmacia, seguros.
- **Ocio**: Cine, suscripciones, actividades recreativas.

---

## Contacto y Soporte

Ante errores persistentes o solicitudes de nuevas funciones, escribinos al canal oficial del proyecto o por correo al equipo de WeekBalance. Incluí capturas y hora del incidente para acelerar el diagnóstico.

---

_Versión 1.2 - WeekBalance_
_Manual actualizado para la plataforma conectada a Supabase_
