# ✈️ SKYBOOK — Simulador de Vuelos

Entrega final JS — Curso de JavaScript

---

## Descripción

Simulador de reservas de vuelos domésticos e internacionales con interfaz visual completa. El usuario puede elegir origen, destino, fechas, cantidad de pasajeros y tipo de viaje. Las reservas se guardan en el navegador y persisten entre sesiones.

---

## Estructura de archivos

```
Entrega final (Simulador de vuelos)/
├── css/
│   └── estilos.css
├── js/
│   └── simulador.js
└── index.html
```

---

## ¿Cómo usarlo?

1. Cloná o descargá el repositorio
2. Abrí `index.html` en el navegador (recomendado: Live Server en VS Code)
3. Hacé clic en "Iniciar simulación" para comenzar

---

## Flujo del simulador

```
Pantalla de inicio
└── Iniciar simulación
    ├── Completar formulario
    │   ├── Nombre del pasajero
    │   ├── Tipo de viaje (ida y vuelta / solo ida)
    │   ├── Cantidad de pasajeros (1-9)
    │   ├── Origen y destino (aeropuertos reales)
    │   └── Fechas (calendario interactivo)
    ├── Buscar vuelo → muestra tarjeta con info
    ├── Confirmar reserva → se guarda en localStorage
    └── Panel de reservas
        ├── Ver todas las reservas guardadas
        ├── Eliminar reserva individual
        └── Borrar todas las reservas
```

---

## Aeropuertos disponibles

| Código | Aeropuerto |
|--------|-----------|
| EZE | Buenos Aires — Ezeiza |
| AEP | Buenos Aires — Aeroparque |
| COR | Córdoba — Ambrosio Taravella |
| MDZ | Mendoza — El Plumerillo |
| BRC | Bariloche — Teniente Candelaria |
| ROS | Rosario — Islas Malvinas |
| SLA | Salta — Martín Miguel de Güemes |
| GRU | São Paulo — Guarulhos |
| SCL | Santiago de Chile — Arturo Merino |
| MIA | Miami — Miami Intl. |
| MAD | Madrid — Adolfo Suárez Barajas |

---

## Conceptos de JS aplicados

### Primera pre-entrega
- Variables y constantes (`let`, `const`)
- Arrays y array de objetos
- Funciones con parámetros
- Ciclos `while` y `for`
- Condicionales `if / else if / else`
- Métodos de string: `.toLowerCase()`, `.trim()`
- Entrada y salida con `prompt()` y `alert()`

### Segunda pre-entrega
- Manipulación del DOM (`getElementById`, `innerHTML`, `classList`)
- Eventos con `addEventListener`
- Validación de formularios desde JS
- `localStorage`: `setItem`, `getItem`, `removeItem`
- Serialización con `JSON.stringify` y `JSON.parse`
- Renderizado dinámico con `createElement`
- Método `.find()` en arrays de objetos
- Temporizadores con `setTimeout` y `clearTimeout`
- Confirmaciones nativas con `confirm()`

### Entrega final
- Calendario interactivo generado dinámicamente
- Parámetros con valores por defecto en funciones
- `e.stopPropagation()` para control de propagación de eventos
- Transiciones CSS controladas desde JS (`transitionend`)
- Códigos IATA y aeropuertos reales
- Pantalla de inicio con animación de salida
