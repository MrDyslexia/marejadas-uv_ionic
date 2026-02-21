# Marejadas UV — Aplicación Móvil

Aplicación móvil desarrollada en **Ionic + React (TypeScript)** con **Capacitor** para Android. Entrega pronósticos de oleaje costero y oceánico para Chile, desarrollada por el equipo de investigación oceánica de la **Universidad de Valparaíso**.

> Sitio web de referencia: [marejadas.uv.cl](https://marejadas.uv.cl/)

---

## Tabla de Contenidos

1. [Stack tecnológico](#stack-tecnológico)
2. [Estructura del proyecto](#estructura-del-proyecto)
3. [Arquitectura de la app](#arquitectura-de-la-app)
4. [Pantallas y navegación](#pantallas-y-navegación)
5. [Fuente de datos](#fuente-de-datos)
6. [Modo inmersivo (Android)](#modo-inmersivo-android)
7. [Variables de entorno](#variables-de-entorno)
8. [Cómo correr el proyecto](#cómo-correr-el-proyecto)
9. [Build y despliegue en Android](#build-y-despliegue-en-android)
10. [Cómo actualizar los datos](#cómo-actualizar-los-datos)
11. [Consideraciones y trabajo pendiente](#consideraciones-y-trabajo-pendiente)

---

## Stack tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| React | 18 | UI framework |
| TypeScript | 4 | Tipado estático |
| Ionic React | 7 | Componentes UI mobile |
| Capacitor | 7 | Bridge nativo Android/iOS |
| React Router DOM | 5 | Navegación entre vistas |
| MapLibre GL | 5 | Mapas interactivos (sin API key) |
| Leaflet | 1.9 | Mapas alternativos |
| Lucide React | — | Iconografía |

El proyecto **no usa un backend propio**. Todo el contenido de imágenes y GIFs proviene del servidor `marejadas.uv.cl`.

---

## Estructura del proyecto

```
marejadas-uv_ionic/
├── src/
│   ├── App.tsx                   # Raíz de la app, router y tab bar
│   ├── pages/                    # Una carpeta por vista principal
│   │   ├── Home.tsx              # Pantalla de inicio
│   │   ├── PronosticoCostero.tsx # Lista de pronósticos costeros
│   │   ├── PronosticoCosteroMap.tsx  # Mapa interactivo costero
│   │   ├── PronosticoOseanico.tsx    # Lista de regiones oceánicas
│   │   ├── PronosticoOseanicoMap.tsx # Mapa interactivo oceánico
│   │   ├── CategoriesView.tsx    # Hub de categorías educativas
│   │   ├── PdModal.tsx           # Detalle de un pronóstico costero
│   │   └── LoginScreen.tsx       # Pantalla de login (sin implementar)
│   ├── components/
│   │   ├── po/                   # Componentes del Pronóstico Oceánico
│   │   │   ├── AnimatedMap.tsx   # Mapa animado (61 frames del Pacífico)
│   │   │   ├── RegionList.tsx    # Lista de regiones con búsqueda
│   │   │   ├── RegionDetailModal.tsx # Modal con detalle de una región
│   │   │   └── Map.tsx           # Mapa base (Leaflet)
│   │   ├── categorias/
│   │   │   ├── FolletosScreen.tsx # Visor de folletos educativos
│   │   │   ├── VideosScreen.tsx   # Galería de GIFs animados
│   │   │   └── TideBackground.tsx # SVG decorativo de fondo
│   │   └── ui/
│   │       ├── FeatureCard.tsx    # Card reutilizable para el Home
│   │       └── ImageViewer.tsx    # Visor de imágenes con zoom/pinch
│   ├── data/
│   │   └── data.json             # Fuente de datos local (ver sección)
│   ├── types/
│   │   └── type.tsx              # Todos los tipos TypeScript del proyecto
│   └── theme/
│       └── variables.css         # Variables de color e ionic tokens
├── android/                      # Proyecto Android nativo (Capacitor)
│   └── app/src/main/java/com/lowframes/app/
│       └── MainActivity.java     # Punto de entrada nativo (modo inmersivo aquí)
├── public/                       # Assets estáticos
├── capacitor.config.ts           # Configuración de Capacitor y plugins
├── .env                          # API Keys (no subir a git)
└── package.json
```

---

## Arquitectura de la app

La aplicación no tiene backend propio. El flujo de datos es el siguiente:

```
data.json  ──→  Componentes React  ──→  URLs de imágenes
                                         │
                                         ↓
                               marejadas.uv.cl/images/SAM/...
                               (servidor externo de la UV)
```

Todas las imágenes, GIFs y frames animados se cargan en tiempo real desde el servidor de la UV. Si el servidor cae o cambia su estructura de URLs, la app dejará de mostrar contenido.

**`data.json`** tiene tres secciones principales:

- **`pc`** — Pronósticos Costeros (11 zonas de Chile)
- **`po`** — Pronósticos Oceánicos (20 regiones)
- **`categorias`** — Contenido educativo (folletos y videos)

---

## Pantallas y navegación

La app usa un **Tab Bar inferior** con 4 pestañas principales. Existen además rutas que no muestran el tab bar (se renderizan fuera del `IonTabs`).

### Tab Bar principal

```
/home                →  Home.tsx
/categorias          →  CategoriesView.tsx
/pronostico-oceanico →  PronosticoOseanico.tsx
/pronostico-costero  →  PronosticoCostero.tsx
```

### Rutas sin Tab Bar

```
/pdmodal                  →  PdModal.tsx        (detalle de pronóstico costero)
/pronostico-costero-map   →  PronosticoCosteroMap.tsx
/pronostico-oceanico-map  →  PronosticoOseanicoMap.tsx
```

> **Importante:** Las rutas sin tab bar están declaradas fuera del componente `<IonTabs>` en `App.tsx`. Si agregas nuevas rutas que no deben mostrar el tab bar, sigue el mismo patrón.

### Flujo de navegación completo

```
Home
 ├── → PronosticoCostero (tab)
 │        ├── → PdModal (detalle con sectores e imágenes)
 │        └── → PronosticoCosteroMap (mapa MapLibre con markers)
 ├── → PronosticoOseanico (tab)
 │        ├── RegionDetailModal (modal inline con datos y gráficos)
 │        └── → PronosticoOseanicoMap
 └── → CategoriesView (tab)
          ├── FolletosScreen (visor de imágenes por categoría)
          └── VideosScreen (galería de GIFs animados)
```

### Descripción de cada pantalla

**Home** — Pantalla de bienvenida. Muestra tres `FeatureCard` que redirigen a cada sección principal, más links a redes sociales, web y contacto de la UV. Existe código comentado de un banner de login que fue descartado.

**PronosticoCostero** — Lista las 11 zonas costeras. Cada zona muestra nombre, número de sectores y cuántos tienen coordenadas georreferenciadas. Al tocar una zona se navega a `PdModal`.

**PdModal** — Vista de detalle de una zona costera. Recibe los datos mediante `history.push({ state: { pronosticoData } })`. Muestra imágenes de pronóstico por sector (categoría, altura, periodo, dirección, marea) usando el componente `ImageViewer`.

**PronosticoCosteroMap** — Mapa interactivo con **MapLibre GL** usando tiles de OpenStreetMap (sin API key). Coloca markers en las coordenadas de cada sector. Al tocar un marker, muestra un panel inferior con el pronóstico de ese sector.

**PronosticoOseanico** — Lista las 20 regiones oceánicas con buscador. Incluye el componente `AnimatedMap` (mapa animado de 61 frames del Pacífico). Al tocar una región se abre `RegionDetailModal`.

**RegionDetailModal** — Modal inline que muestra los datos de pronóstico de una región oceánica (categoría, altura, periodo, dirección, espectro).

**CategoriesView** — Hub que permite navegar a `FolletosScreen` o `VideosScreen`. Usa un estado interno (`currentView`) para mostrar las sub-vistas sin cambiar de ruta.

**FolletosScreen** — Muestra folletos educativos. Cada folleto tiene múltiples imágenes navegables con paginación horizontal. Los datos vienen de `data.categorias.folletos`.

**VideosScreen** — Galería de GIFs animados con nombre y descripción. Los datos vienen de `data.categorias.videos`.

---

## Fuente de datos

### Estructura de `data.json`

#### Pronóstico Costero (`data.pc`)

```json
{
  "id": "cl03iq",
  "nombre": "PRONÓSTICOS BAHÍA DE IQUIQUE",
  "mapa_pronostico": "https://marejadas.uv.cl/images/SAM/dominios/CL03IQG.gif",
  "mosaico_pronostico": "https://marejadas.uv.cl/images/SAM/mosaicos/CL03IQMO.png",
  "markers": [],
  "sectores": [
    {
      "id": "CL03IQN01",
      "nombre": "Playa Colorado",
      "coordenadas": { "lat": -20.2167, "lng": -70.15 },
      "datos": {
        "categoria": "https://marejadas.uv.cl/.../CL03IQN01C.png",
        "altura":    "https://marejadas.uv.cl/.../CL03IQN01H.png",
        "periodo":   "https://marejadas.uv.cl/.../CL03IQN01T.png",
        "direccion": "https://marejadas.uv.cl/.../CL03IQN01D.png",
        "marea":     "https://marejadas.uv.cl/.../CL03IQM.png"
      }
    }
  ]
}
```

Cada campo de `datos` es una URL a una imagen PNG que el servidor de la UV actualiza automáticamente. La app solo la muestra.

#### Pronóstico Oceánico (`data.po`)

```json
{
  "id": "CL01",
  "nombre": "Arica",
  "lat": -19,
  "lon": -75,
  "datosPronostico": {
    "categoria": "https://marejadas.uv.cl/.../CL01C.png",
    "altura":    "https://marejadas.uv.cl/.../CL01H.png",
    "periodo":   "https://marejadas.uv.cl/.../CL01T.png",
    "direccion": "https://marejadas.uv.cl/.../CL01D.png",
    "espectro":  "https://marejadas.uv.cl/.../NID_045.gif"
  }
}
```

#### Categorías (`data.categorias`)

```json
{
  "folletos": [
    {
      "id": "1",
      "nombre": "Categorías de marejadas",
      "imagenes": [
        { "id": "general", "url": "...", "descripcion": "..." }
      ]
    }
  ],
  "videos": [
    {
      "id": "1",
      "nombre": "Oleaje Normal",
      "url": "https://marejadas.uv.cl/.../N V2.gif",
      "descripcion": "...",
      "limitante": "..."
    }
  ]
}
```

### Mapa animado oceánico

El componente `AnimatedMap` carga **61 frames** desde:
```
https://marejadas.uv.cl/images/SAM/pacifico/Campo{N}.png
```
donde `N` va de 1 a 61. Hace un preload de todos los frames al iniciar y los reproduce en loop como animación.

---

## Modo inmersivo (Android)

La app oculta la barra de estado y la barra de navegación de Android al iniciarse. Las barras reaparecen temporalmente al hacer swipe desde el borde de la pantalla y se vuelven a ocultar solas.

Esto está implementado **de forma nativa en Java**, sin plugins adicionales, en:

```
android/app/src/main/java/com/lowframes/app/MainActivity.java
```

```java
private void enableImmersiveMode() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        // Android 11+ (API 30+)
        WindowInsetsController controller = getWindow().getInsetsController();
        if (controller != null) {
            controller.hide(
                WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars()
            );
            controller.setSystemBarsBehavior(
                WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            );
        }
    } else {
        // Android 10 y anteriores
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_FULLSCREEN
        );
    }
}
```

El método `onWindowFocusChanged` vuelve a activar el modo inmersivo cuando la app recupera el foco (por ejemplo, al cerrar un diálogo del sistema).

El `capacitor.config.ts` complementa esto con:
```ts
StatusBar: {
  overlaysWebView: true,
  backgroundColor: "#00000000",
}
```

Y en `src/theme/variables.css` se aplican los safe area insets para que el contenido no quede tapado bajo las barras:
```css
ion-content {
  --padding-top: env(safe-area-inset-top);
  --padding-bottom: env(safe-area-inset-bottom);
}
ion-tab-bar {
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

## Variables de entorno

El proyecto usa un archivo `.env` en la raíz. Actualmente **no requiere ninguna API key** ya que todos los mapas usan MapLibre GL con tiles públicos de OpenStreetMap/CARTO.

```
# .env — actualmente sin variables requeridas
# Los mapas usan MapLibre GL (sin API key)
```

Si en el futuro se necesita integrar algún servicio externo, agregar las variables aquí y acceder a ellas vía `process.env.NOMBRE_VARIABLE`.

> ⚠️ **Nunca subas el `.env` al repositorio.** Está en `.gitignore`.

---

## Cómo correr el proyecto

### Requisitos previos

- Node.js 18+
- npm o bun
- Android Studio (para correr en dispositivo/emulador)
- Java 17+

### Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Correr en el navegador (desarrollo web)
npm start
```

### Correr en Android

```bash
# 1. Compilar la app web
npm run build

# 2. Sincronizar con el proyecto Android
npx cap sync android

# 3. Opción A: Abrir Android Studio
npx cap open android

# Opción B: Correr directamente con live reload
npm run android
```

El script `android` en `package.json` es: `ionic cap run android -l --host=0.0.0.0`

---

## Build y despliegue en Android

```bash
# Build completo
npm run build

# Sincronizar cambios web → Android
npm run sync
# (equivale a: ionic cap sync android)
```

Para generar un APK o AAB firmado, usa Android Studio:
`Build → Generate Signed Bundle / APK`

El `webDir` de Capacitor apunta a `build/`, que es el output de `react-scripts build`.

---

## Cómo actualizar los datos

### Agregar una nueva zona costera

1. Abrir `src/data/data.json`
2. Agregar un nuevo objeto al array `pc` siguiendo la estructura existente
3. Las URLs de imágenes deben existir en el servidor `marejadas.uv.cl`

### Agregar una nueva región oceánica

1. Agregar un objeto al array `po` con `id`, `nombre`, `lat`, `lon` y `datosPronostico`
2. Las coordenadas `lat`/`lon` determinan dónde se ubica el punto en el mapa

### Agregar folletos o videos

1. Agregar entradas al array `data.categorias.folletos` o `data.categorias.videos`
2. Los videos son GIFs, no reproductores de video real

### Si el servidor cambia estructura de URLs

Las URLs siguen patrones consistentes:
```
/images/SAM/categorias/{ID}C.png   → categoría
/images/SAM/alturas/{ID}H.png      → altura
/images/SAM/periodos/{ID}T.png     → periodo
/images/SAM/direcciones/{ID}D.png  → dirección
/images/SAM/mareas/{ID}M.png       → marea
```
Si la UV cambia la estructura, hay que actualizar el `data.json` y posiblemente los componentes que construyen las URLs dinámicamente (como `AnimatedMap`).

---

## Consideraciones y trabajo pendiente

### Login / Autenticación
`LoginScreen.tsx` existe pero **no está conectado a ninguna ruta activa**. El banner de login en `Home.tsx` también está comentado. Está preparado como estructura pero sin implementar. Si se retoma, hay que agregar la ruta `/login` en `App.tsx` y un sistema de autenticación real.

### Funcionalidades marcadas "en desarrollo"
En `Home.tsx`, el handler `handleInfoItemPress` dispara un `IonAlert` que dice "Esta característica estará disponible próximamente." Cualquier funcionalidad que use ese handler está pendiente.

### Coordenadas faltantes en pronóstico costero
Algunos sectores tienen `coordenadas: null` en el JSON. En `PronosticoCostero.tsx` el conteo muestra "Próx." cuando no hay coordenadas. Hay que georreferenciarlos y agregarlos al `data.json`.

### Markers del pronóstico costero
El campo `markers` en cada entrada de `pc` está vacío (`[]`) en todos los registros. `PronosticoCosteroMap.tsx` los usa para pintar puntos adicionales en el mapa. Completar estos datos mejoraría la experiencia del mapa costero.

### Mapa oceánico
`PronosticoOseanicoMap.tsx` existe pero la pantalla `PronosticoOseanico.tsx` tiene su propio mapa integrado (`AnimatedMap`). Revisar si la ruta `/pronostico-oceanico-map` está siendo usada o si es redundante.

### Dependencia del servidor externo
Toda la información visual (imágenes y GIFs) vive en `marejadas.uv.cl`. La app no funciona offline y no tiene caché de imágenes. Si se quiere soporte offline, se debería implementar un Service Worker con estrategia de caché para las imágenes más consultadas.

### iOS
El proyecto no tiene carpeta `ios/`. Capacitor soporta iOS, pero habría que inicializarlo con `npx cap add ios` y adaptar el modo inmersivo al equivalente en iOS (`UIStatusBarStyle`, `prefersHomeIndicatorAutoHidden`, etc.).